import mongoose, { Schema, Document } from 'mongoose';

export interface ICommentDoc extends Document {
  post: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const CommentSchema = new Schema<ICommentDoc>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICommentDoc>('Comment', CommentSchema);
