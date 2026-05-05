import express from 'express';

import {
  createShortUrl,
  deleteMyShortUrl,
  getMyShortUrl,
  getMyUrlAnalytics,
  listMyShortUrls,
  updateMyShortUrl,
} from '../controllers/urlController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createUrlSchema, updateUrlSchema, urlIdParamSchema } from '../validators/urlValidator.js';

const router = express.Router();

router.use(protect);

router.route('/').get(listMyShortUrls).post(validateRequest(createUrlSchema), createShortUrl);

router.get('/:id/analytics', validateRequest(urlIdParamSchema), getMyUrlAnalytics);

router
  .route('/:id')
  .get(validateRequest(urlIdParamSchema), getMyShortUrl)
  .patch(validateRequest(updateUrlSchema), updateMyShortUrl)
  .delete(validateRequest(urlIdParamSchema), deleteMyShortUrl);

export default router;
