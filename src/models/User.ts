import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  verification_token: string | null;
  token_expiration: Date | null;
  posts: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  is_verified: { type: Boolean, default: false },
  verification_token: { type: String, default: null },
  token_expiration: { type: Date, default: null },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
