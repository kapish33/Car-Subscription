import mongoose, { CallbackError, Document, Schema } from 'mongoose';
import { User } from './userModel';
import bcrypt from 'bcryptjs';

const userType  = ['subscriber', 'admin', 'normal'];

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    resetToken: { type: String, required: false },
    resetTokenExpiry: { type: Number, required: false },
    userType: { 
      type: String, 
      enum: userType, // Enum for user roles
      default: 'normal' // Default value
    }
  },
  {
    versionKey: false,
    timestamp: true,
  }
);

// Hash password before saving
UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as CallbackError);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<User>('User', UserSchema);
