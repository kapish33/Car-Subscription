import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { generateTokens } from '@/common/utils/tokenUtils';

import {
  LoginPayloadBody,
  ResetNewPasswordPayloadBody,
  ResetPasswordPayloadBody,
  Tokens,
  User,
  UserPayload,
  UserWithTokens,
} from './userModel';
import { UserModel } from './userSchema';
import { Resend } from 'resend';
import { sendEmail } from '@/common/utils/emailService';
const resend = new Resend('re_7RaazBDP_9iZhzCtXmhNVCQKasUN5CW1C');

export const userRepository = {
  findAllAsync: async (): Promise<User[]> => {
    return UserModel.find().select('-password -__v').exec();
  },

  findByIdAsync: async (id: User['_id']): Promise<User | null> => {
    return UserModel.findById(id).select('-password -__v').exec();
  },

  createUserAsync: async (newUser: UserPayload): Promise<UserWithTokens> => {
    // Hash the user's password before saving
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;

    const user = new UserModel(newUser);
    await user.save();

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Remove sensitive fields and convert to plain JavaScript object
    const userObject = user.toObject();
    userObject.password = '';
    delete userObject.__v;

    // Return the created user (without sensitive fields) and the generated tokens
    return {
      user: userObject as User,
      accessToken,
      refreshToken,
    };
  },

  loginUserAsync: async (credentials: LoginPayloadBody): Promise<Tokens | null> => {
    const { email, password } = credentials;

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      // User with the provided email does not exist
      return null;
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Passwords do not match
      return null;
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Return the generated tokens
    return { accessToken, refreshToken };
  },

  resetUserAsync: async (resetUserPayload: ResetPasswordPayloadBody): Promise<string | null> => {
    const { email } = resetUserPayload;

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      // User with the provided email does not exist
      return null;
    }

    // Generate a reset token and set an expiration time (e.g., 15 minutes)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    // Save the reset token and expiry time to the user's record
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send the reset password email
    const emailResult = await sendEmail({
      from: '"Your Company" <onboarding@resend.dev>', // Replace with your sender address
      to: [email], // Replace with your
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Use the following token to reset your password:</p><p><strong>${resetToken}</strong></p><p>This token is valid for 15 minutes.</p>`,
    });
    console.log("resetToken",resetToken)

    if (emailResult.success) {
      return 'Password reset email sent';
    } else {
      return 'Error sending password reset email';
    }
  },

  setNewUserPassAsync: async (resetUserPayload: ResetNewPasswordPayloadBody): Promise<string | null> => {
    const { token, newPassword } = resetUserPayload;

    // Find the user by Token
    const user = await UserModel.findOne({ resetToken: token });

    if (!user) {
      // User with the provided email does not exist
      return null;
    }

    // Check if the token has expired
    if (user.resetTokenExpiry && user.resetTokenExpiry < Date.now()) {
      return null;
    }

    user.password = newPassword; // Make sure to hash the password before saving
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return "Password Updated successfully"
  },
};
