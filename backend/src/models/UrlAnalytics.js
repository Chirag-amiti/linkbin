import mongoose from 'mongoose';

const urlAnalyticsSchema = new mongoose.Schema(
  {
    shortUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShortUrl',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    visitorHash: {
      type: String,
      required: true,
      index: true,
    },
    ipHash: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: '',
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    device: {
      type: String,
      default: 'desktop',
    },
    referrer: {
      type: String,
      default: 'direct',
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    city: {
      type: String,
      default: 'Unknown',
    },
    clickedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

urlAnalyticsSchema.index({ shortUrl: 1, clickedAt: -1 });
urlAnalyticsSchema.index({ shortUrl: 1, visitorHash: 1 });

export const UrlAnalytics = mongoose.model('UrlAnalytics', urlAnalyticsSchema);
