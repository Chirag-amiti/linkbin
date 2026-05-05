import mongoose from 'mongoose';

const pasteAnalyticsSchema = new mongoose.Schema(
  {
    paste: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Paste',
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
    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

pasteAnalyticsSchema.index({ paste: 1, viewedAt: -1 });
pasteAnalyticsSchema.index({ paste: 1, visitorHash: 1 });

export const PasteAnalytics = mongoose.model('PasteAnalytics', pasteAnalyticsSchema);
