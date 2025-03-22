import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'verified';

export interface ITask extends Document {
  title: string;
  description: string;
  credits: number;
  status: TaskStatus;
  createdBy: mongoose.Types.ObjectId | IUser | string;
  assignedTo: mongoose.Types.ObjectId | IUser | string;
  dueDate?: Date;
  completedAt?: Date;
  verifiedAt?: Date;
  club?: string;
  priority: 'low' | 'medium' | 'high';
  isGlobal: boolean; // If true, this task can be assigned to any member regardless of club
  isVerified?: boolean;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'verified'],
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assignee ID is required'],
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
    },
    club: {
      type: String,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    isGlobal: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// Add a pre-save hook to validate createdBy
TaskSchema.pre('save', function(next) {
  if (!this.createdBy) {
    return next(new Error('Task creator (createdBy) is required'));
  }
  next();
});

// Prevent model overwrite error in development due to hot reloading
const Task = (mongoose.models.Task as Model<ITask>) || mongoose.model<ITask>('Task', TaskSchema);

export default Task;