import { z } from 'zod';

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9-]{3,60}$/, 'Slug must be 3-60 characters and use only lowercase letters, numbers, and hyphens');

export const createPasteSchema = z.object({
  body: z
    .object({
      title: z.string().trim().max(120).optional().or(z.literal('')),
      slug: slugSchema.optional().or(z.literal('')),
      content: z.string().min(1).max(200000),
      language: z.string().trim().toLowerCase().max(40).optional().or(z.literal('')),
      visibility: z.enum(['public', 'unlisted', 'private']).default('unlisted'),
      expiresAt: z.coerce.date().optional(),
      expiresInHours: z.coerce.number().int().positive().max(24 * 365).optional(),
    })
    .refine((body) => !(body.expiresAt && body.expiresInHours), {
      message: 'Use either expiresAt or expiresInHours, not both',
      path: ['expiresAt'],
    }),
});

export const updatePasteSchema = z.object({
  body: z.object({
    title: z.string().trim().max(120).optional(),
    content: z.string().min(1).max(200000).optional(),
    language: z.string().trim().toLowerCase().max(40).optional(),
    visibility: z.enum(['public', 'unlisted', 'private']).optional(),
    expiresAt: z.coerce.date().nullable().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const pasteIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
