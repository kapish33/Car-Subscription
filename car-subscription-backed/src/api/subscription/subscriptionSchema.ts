import mongoose, { Schema } from 'mongoose';
import { Subscription } from './subscriptionModel';

// Define the Subscription Schema
const subscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    carType: {
      type: String,
      enum: ['Hatchback', 'Sedan', 'CSUV', 'SUV'],
      required: true,
    },
    planType: {
      type: String,
      enum: ['Daily', 'Alternate'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    schedule: [
      {
        date: {
          type: Date,
          required: true,
        },
        serviceType: {
          type: String,
          enum: ['Interior', 'Exterior', 'Complete'],
          required: true,
        },
        timeSlot: {
          type: String,
          enum: ['6-8 AM', '8-10 AM', '10-12 AM'],
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Cancelled'],
      default: 'Active',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false,
  }
);

export const SubscriptionModel = mongoose.model<Subscription>('Subscription', subscriptionSchema);
