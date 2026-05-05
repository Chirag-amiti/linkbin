import { z } from 'zod';

const aliasSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9-]{3,40}$/, 'Alias must be 3-40 characters and use only lowercase letters, numbers, and hyphens');

export const createUrlSchema = z.object({
  body: z
    .object({
      originalUrl: z.string().trim().url().max(2048),
      customAlias: aliasSchema.optional().or(z.literal('')),
      title: z.string().trim().max(120).optional().or(z.literal('')),
      expiresAt: z.coerce.date().optional(),
      expiresInHours: z.coerce.number().int().positive().max(24 * 365).optional(),
    })
    .refine((body) => !(body.expiresAt && body.expiresInHours), {
      message: 'Use either expiresAt or expiresInHours, not both',
      path: ['expiresAt'],
    }),
});

export const updateUrlSchema = z.object({
  body: z.object({
    title: z.string().trim().max(120).optional(),
    expiresAt: z.coerce.date().nullable().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const urlIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
