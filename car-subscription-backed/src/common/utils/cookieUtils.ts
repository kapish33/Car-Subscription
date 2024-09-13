// src/utils/cookieUtils.ts

import { Response } from 'express';

interface CookieOptions {
  name: string;
  value?: string;
  options?: {
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    // Add more cookie options as needed (e.g., secure, domain, path, expires)
  };
}

export const setCookie = (res: Response, name: string, value?: string, options?: CookieOptions['options']): void => {
  res.cookie(name, value || '', {
    httpOnly: options?.httpOnly || true,
    sameSite: options?.sameSite || 'strict',
    // Add more cookie options as needed
  });
};
