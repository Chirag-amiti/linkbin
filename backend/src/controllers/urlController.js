import mongoose from 'mongoose';

import { ShortUrl } from '../models/ShortUrl.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateCode } from '../utils/generateCode.js';
import { isReservedAlias } from '../utils/reservedAliases.js';
import { deleteCachedUrl, getCachedUrl, setCachedUrl } from '../services/urlCacheService.js';
import { getUrlAnalytics, recordUrlClick } from '../services/urlAnalyticsService.js';
import { env } from '../config/env.js';

const buildShortUrl = (shortCode) => `${env.baseUrl}/${shortCode}`;
const buildExpiredUrl = (type) => `${env.clientUrl}/expired?type=${type}`;

const getExpiryDate = ({ expiresAt, expiresInHours }) => {
  if (expiresAt) return expiresAt;
  if (!expiresInHours) return null;
  return new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
};

const ensureObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid id');
  }
};

const findAvailableCode = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shortCode = generateCode();
    const exists = await ShortUrl.exists({ shortCode });
    if (!exists && !isReservedAlias(shortCode)) return shortCode;
  }

  throw new ApiError(500, 'Could not generate a unique short code');
};

export const createShortUrl = asyncHandler(async (req, res) => {
  const { originalUrl, customAlias, title, expiresAt, expiresInHours } = req.validated.body;
  const requestedAlias = customAlias || null;

  if (requestedAlias && isReservedAlias(requestedAlias)) {
    throw new ApiError(400, 'This alias is reserved');
  }

  const shortCode = requestedAlias || (await findAvailableCode());
  const duplicate = await ShortUrl.exists({ shortCode });

  if (duplicate) {
    throw new ApiError(409, 'Short code or alias already exists');
  }

  const shortUrl = await ShortUrl.create({
    owner: req.user._id,
    originalUrl,
    shortCode,
    title: title || '',
    isCustomAlias: Boolean(requestedAlias),
    expiresAt: getExpiryDate({ expiresAt, expiresInHours }),
  });

  res.status(201).json({
    success: true,
    message: 'Short URL created',
    data: {
      shortUrl,
      shortLink: buildShortUrl(shortUrl.shortCode),
    },
  });
});

export const listMyShortUrls = asyncHandler(async (req, res) => {
  const shortUrls = await ShortUrl.find({
    owner: req.user._id,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { shortUrls },
  });
});

export const getMyShortUrl = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id);

  const shortUrl = await ShortUrl.findOne({
    _id: req.params.id,
    owner: req.user._id,
    isDeleted: false,
  });

  if (!shortUrl) {
    throw new ApiError(404, 'Short URL not found');
  }

  res.json({
    success: true,
    data: {
      shortUrl,
      shortLink: buildShortUrl(shortUrl.shortCode),
    },
  });
});

export const updateMyShortUrl = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id);

  const shortUrl = await ShortUrl.findOneAndUpdate(
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

  if (!shortUrl) {
    throw new ApiError(404, 'Short URL not found');
  }

  await deleteCachedUrl(shortUrl.shortCode);

  res.json({
    success: true,
    message: 'Short URL updated',
    data: { shortUrl },
  });
});

export const deleteMyShortUrl = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id);

  const shortUrl = await ShortUrl.findOneAndUpdate(
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

  if (!shortUrl) {
    throw new ApiError(404, 'Short URL not found');
  }

  await deleteCachedUrl(shortUrl.shortCode);

  res.json({
    success: true,
    message: 'Short URL deleted',
  });
});

export const redirectShortUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;

  if (isReservedAlias(shortCode)) {
    throw new ApiError(404, 'Short URL not found');
  }

  const cachedUrl = await getCachedUrl(shortCode);

  if (cachedUrl) {
    if (cachedUrl.expiresAt && new Date(cachedUrl.expiresAt) <= new Date()) {
      await deleteCachedUrl(shortCode);
      return res.redirect(302, buildExpiredUrl('url'));
    }

    await recordUrlClick({
      shortUrlId: cachedUrl.id,
      ownerId: cachedUrl.owner,
      req,
    });

    return res.redirect(302, cachedUrl.originalUrl);
  }

  const shortUrl = await ShortUrl.findOne({
    shortCode,
    isActive: true,
    isDeleted: false,
  });

  if (!shortUrl) {
    throw new ApiError(404, 'Short URL not found');
  }

  if (shortUrl.expiresAt && shortUrl.expiresAt <= new Date()) {
    return res.redirect(302, buildExpiredUrl('url'));
  }

  await setCachedUrl(shortUrl);
  await recordUrlClick({
    shortUrlId: shortUrl._id,
    ownerId: shortUrl.owner,
    req,
  });

  return res.redirect(302, shortUrl.originalUrl);
});

export const getMyUrlAnalytics = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id);

  const shortUrl = await ShortUrl.findOne({
    _id: req.params.id,
    owner: req.user._id,
    isDeleted: false,
  });

  if (!shortUrl) {
    throw new ApiError(404, 'Short URL not found');
  }

  const analytics = await getUrlAnalytics(shortUrl._id);

  res.json({
    success: true,
    data: {
      shortUrl,
      analytics,
    },
  });
});
