import mongoose from 'mongoose';

const pasteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: 'Untitled paste',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 60,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 200000,
    },
    language: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 40,
      default: 'text',
    },
    visibility: {
      type: String,
      enum: ['public', 'unlisted', 'private'],
      default: 'unlisted',
      index: true,
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
    totalViews: {
      type: Number,
      default: 0,
    },
    uniqueViews: {
      type: Number,
      default: 0,
    },
    lastViewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

pasteSchema.index({ owner: 1, createdAt: -1 });
pasteSchema.index({ slug: 1, isActive: 1, isDeleted: 1 });

pasteSchema.virtual('isExpired').get(function isExpired() {
  return Boolean(this.expiresAt && this.expiresAt <= new Date());
});

export const Paste = mongoose.model('Paste', pasteSchema);
