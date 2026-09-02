import mongoose, { Document, Schema } from 'mongoose';

export interface IClick extends Document {
  linkId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  ip?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
}

const ClickSchema = new Schema<IClick>(
  {
    linkId: {
      type: Schema.Types.ObjectId,
      ref: 'Link',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ip: { type: String },
    userAgent: { type: String },
    country: { type: String },
    city: { type: String },
    device: { type: String },
    browser: { type: String },
    os: { type: String },
  },
  { timestamps: true }
);

ClickSchema.index({ linkId: 1, createdAt: -1 });

export default mongoose.model<IClick>('Click', ClickSchema);
