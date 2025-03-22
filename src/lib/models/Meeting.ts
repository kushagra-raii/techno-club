import mongoose, { Schema, Document, Model } from 'mongoose';
import { ClubType } from './User';

export interface IMeeting extends Document {
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  meetLink?: string;
  club: ClubType;
  creatorId: mongoose.Types.ObjectId;
  invitees: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    meetLink: {
      type: String,
    },
    club: {
      type: String,
      enum: ['IEEE', 'ACM', 'AWS', 'GDG', 'STIC', ''],
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invitees: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true }
);

// Prevent model overwrite error in development due to hot reloading
const Meeting = (mongoose.models.Meeting as Model<IMeeting>) || mongoose.model<IMeeting>('Meeting', MeetingSchema);

export default Meeting; 