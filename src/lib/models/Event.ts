import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  imageUrl?: string;
  ticketPrice: number;
  capacity: number;
  requireApproval: boolean;
  isPublished: boolean;
  creatorId: Schema.Types.ObjectId;
  club: string;
  approvals?: Schema.Types.ObjectId[];
  participants?: Schema.Types.ObjectId[];
}

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    club: {
      type: String,
      enum: ['IEEE', 'ACM', 'AWS', 'GDG', 'STIC', ''],
      required: [true, 'Club is required']
    },
    imageUrl: {
      type: String
    },
    ticketPrice: {
      type: Number,
      default: 0
    },
    capacity: {
      type: Number,
      required: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
      validate: {
        validator: function(v: any) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: (props: any) => `${props.value} is not a valid ObjectId!`
      }
    },
    approvals: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Prevent model overwrite error in development due to hot reloading
const Event = (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>('Event', eventSchema);

export default Event; 