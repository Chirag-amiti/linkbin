import express from 'express';

import {
  createPaste,
  deleteMyPaste,
  getMyPaste,
  getMyPasteAnalytics,
  listMyPastes,
  updateMyPaste,
} from '../controllers/pasteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createPasteSchema, pasteIdParamSchema, updatePasteSchema } from '../validators/pasteValidator.js';

const router = express.Router();

router.use(protect);

router.route('/').get(listMyPastes).post(validateRequest(createPasteSchema), createPaste);

router.get('/:id/analytics', validateRequest(pasteIdParamSchema), getMyPasteAnalytics);

router
  .route('/:id')
  .get(validateRequest(pasteIdParamSchema), getMyPaste)
  .patch(validateRequest(updatePasteSchema), updateMyPaste)
  .delete(validateRequest(pasteIdParamSchema), deleteMyPaste);

export default router;
