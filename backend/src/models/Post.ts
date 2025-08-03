import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  title: string;
  description: string;
  createdAt: Date;
  tags: string[];
  comments: IComment[];
}

const CommentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
  comments: [CommentSchema]
});

export default mongoose.model<IPost>('Post', PostSchema);
