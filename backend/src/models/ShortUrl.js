import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    isCustomAlias: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    uniqueClicks: {
      type: Number,
      default: 0,
    },
    lastClickedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

shortUrlSchema.index({ owner: 1, createdAt: -1 });
shortUrlSchema.index({ shortCode: 1, isActive: 1, isDeleted: 1 });

shortUrlSchema.virtual('isExpired').get(function isExpired() {
  return Boolean(this.expiresAt && this.expiresAt <= new Date());
});

export const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);
