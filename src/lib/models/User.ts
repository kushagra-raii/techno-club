import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'user' | 'member' | 'admin' | 'superadmin';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: UserRole;
  emailVerified?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'member', 'admin', 'superadmin'],
      default: 'user',
    },
    emailVerified: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite error in development due to hot reloading
const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User; 