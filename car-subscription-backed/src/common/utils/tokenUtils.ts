import { User } from '@/api/user/userModel';
import jwt from 'jsonwebtoken';
import { env } from './envConfig';

/**
 * Generates JWT access and refresh tokens for a user
 * @param user - The user object
 * @returns An object containing the accessToken and refreshToken
 */
export const generateTokens = (user: User): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign({ user }, env.JWT_SECRET, { expiresIn: env.JWT_TOKEN_Expiry });
  const refreshToken = jwt.sign({ user }, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_Expiry });

  return { accessToken, refreshToken };
};
