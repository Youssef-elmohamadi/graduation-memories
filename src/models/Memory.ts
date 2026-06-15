import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMemory extends Document {
  text: string;
  sender: string;
  createdAt: Date;
}

const MemorySchema = new Schema<IMemory>({
  text: {
    type: String,
    required: [true, 'Please provide a message text.'],
  },
  sender: {
    type: String,
    default: 'مجهول',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// To prevent compiled model overwrites in Next.js development mode hot reload
const Memory: Model<IMemory> = mongoose.models.Memory || mongoose.model<IMemory>('Memory', MemorySchema);

export default Memory;
