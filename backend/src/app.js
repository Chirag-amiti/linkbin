import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import pasteRoutes from './routes/pasteRoutes.js';
import urlRoutes from './routes/urlRoutes.js';


import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { redirectShortUrl } from './controllers/urlController.js';
import { viewPasteBySlug } from './controllers/pasteController.js';
import { optionalAuth } from './middleware/optionalAuthMiddleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'LinkBin API is running',
    environment: env.nodeEnv,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/pastes', pasteRoutes);
app.use('/api/urls', urlRoutes);

app.get('/p/:slug', optionalAuth, viewPasteBySlug);
app.get('/:shortCode', redirectShortUrl);

app.use(notFound);
app.use(errorHandler);

export default app;
