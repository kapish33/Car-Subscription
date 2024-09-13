import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { env } from '../utils/envConfig';
import { generateTokens } from '../utils/tokenUtils';
import { User } from '@/api/user/userModel';

export const requestCookieValidation = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ valid: false, message: 'No tokens provided' });
  }

  try {
    const { user } = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { user: User };
    req.user = user; // This Will Enshure To Pass The User That can be got Further 
    return next();
  } catch (err) {
    if (!refreshToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ valid: false, message: 'Invalid access token and no refresh token provided' });
    }

    try {
      const { user } = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { user: User };
      const { accessToken, refreshToken: rft } = generateTokens(user);
      console.log("refetch Token",accessToken,rft)

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.cookie('refreshToken', rft, {
        httpOnly: true,
        sameSite: 'strict',
      });

        req.user = user;
      return next();
    } catch (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ valid: false, message: 'Invalid refresh token' });
    }
  }
};