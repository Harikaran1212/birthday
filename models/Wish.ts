import mongoose, { Schema, Document } from 'mongoose';

export interface IWish extends Document {
  name: string;
  message: string;
  type: 'text' | 'video' | 'voice';
  videoUrl?: string;
  createdAt: Date;
}

const WishSchema = new Schema<IWish>({
  name: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  type: { type: String, enum: ['text', 'video', 'voice'], default: 'text' },
  videoUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const Wish = mongoose.models.Wish || mongoose.model<IWish>('Wish', WishSchema);
export default Wish;
