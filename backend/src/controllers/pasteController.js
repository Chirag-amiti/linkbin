import mongoose from 'mongoose';

import { Paste } from '../models/Paste.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateCode } from '../utils/generateCode.js';
import { isReservedAlias } from '../utils/reservedAliases.js';
import { getPasteAnalytics, recordPasteView } from '../services/pasteAnalyticsService.js';
import { env } from '../config/env.js';

const buildPasteLink = (slug) => `${env.baseUrl}/p/${slug}`;
const buildExpiredUrl = () => `${env.clientUrl}/expired?type=paste`;

const ensureObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid id');
  }
};

const getExpiryDate = ({ expiresAt, expiresInHours }) => {
  if (expiresAt) return expiresAt;
  if (!expiresInHours) return null;
  return new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
};

const findAvailableSlug = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = generateCode().toLowerCase();
    const exists = await Paste.exists({ slug });
    if (!exists && !isReservedAlias(slug)) return slug;
  }

  throw new ApiError(500, 'Could not generate a unique paste slug');
};

const assertPasteAccess = (paste, user) => {
  if (paste.visibility !== 'private') return;

  if (!user || paste.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, 'This paste is private');
  }
};

export const createPaste = asyncHandler(async (req, res) => {
  const { title, slug, content, language, visibility, expiresAt, expiresInHours } = req.validated.body;
  const requestedSlug = slug || null;

  if (requestedSlug && isReservedAlias(requestedSlug)) {
    throw new ApiError(400, 'This paste slug is reserved');
  }

  const pasteSlug = requestedSlug || (await findAvailableSlug());
  const duplicate = await Paste.exists({ slug: pasteSlug });

  if (duplicate) {
    throw new ApiError(409, 'Paste slug already exists');
  }

  const paste = await Paste.create({
    owner: req.user._id,
    title: title || 'Untitled paste',
    slug: pasteSlug,
    content,
    language: language || 'text',
    visibility,
    expiresAt: getExpiryDate({ expiresAt, expiresInHours }),
  });

  res.status(201).json({
    success: true,
    message: 'Paste created',
    data: {
      paste,
      pasteLink: buildPasteLink(paste.slug),
    },
  });
});

export const listMyPastes = asyncHandler(async (req, res) => {
  const pastes = await Paste.find({
    owner: req.user._id,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { pastes },
  });
});

export const getMyPaste = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id);

  const paste = await Paste.findOne({
    _id: req.params.id,
    owner: req.user._id,
    isDeleted: false,
  });

  if (!paste) {
    throw new ApiError(404, 'Paste not found');
  }

  res.json({
    success: true,
    data: {
      paste,
      pasteLink: buildPasteLink(paste.slug),
    },
  });
});

export const updateMyPaste = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id);

  const paste = await Paste.findOneAndUpdate(
    {
      _id: req.params.id,
      owner: req.user._id,
      isDeleted: false,
    },
    {
      $set: req.validated.body,
    },
    { new: true }
  );

  if (!paste) {
    throw new ApiError(404, 'Paste not found');
  }

  res.json({
    success: true,
    message: 'Paste updated',
    data: { paste },
  });
});

export const deleteMyPaste = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id);

  const paste = await Paste.findOneAndUpdate(
    {
      _id: req.params.id,
      owner: req.user._id,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
        isActive: false,
      },
    },
    { new: true }
  );

  if (!paste) {
    throw new ApiError(404, 'Paste not found');
  }

  res.json({
    success: true,
    message: 'Paste deleted',
  });
});

export const viewPasteBySlug = asyncHandler(async (req, res) => {
  const paste = await Paste.findOne({
    slug: req.params.slug,
    isActive: true,
    isDeleted: false,
  });

  if (!paste) {
    throw new ApiError(404, 'Paste not found');
  }

  if (paste.expiresAt && paste.expiresAt <= new Date()) {
    return res.redirect(302, buildExpiredUrl());
  }

  assertPasteAccess(paste, req.user);

  await recordPasteView({
    pasteId: paste._id,
    ownerId: paste.owner,
    req,
  });

  res.json({
    success: true,
    data: { paste },
  });
});

export const getMyPasteAnalytics = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id);

  const paste = await Paste.findOne({
    _id: req.params.id,
    owner: req.user._id,
    isDeleted: false,
  });

  if (!paste) {
    throw new ApiError(404, 'Paste not found');
  }

  const analytics = await getPasteAnalytics(paste._id);

  res.json({
    success: true,
    data: {
      paste,
      analytics,
    },
  });
});
