import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { Document } from 'mongoose';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

/**
 * Schema for User model using Zod
 */
export const UserSchema = z.object({
  _id: z.string().uuid(),
  firstName: z.string(),
  email: z.string().email(),
  lastName: z.string(),
  age: z.number(),
  password: z.string(),
  resetToken: z.string().optional(),
  resetTokenExpiry: z.number().optional(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
});

/**
 * Schema for JWT tokens using Zod
 */
export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type Tokens = z.infer<typeof TokensSchema>;

/**
 * Schema for User model with JWT tokens using Zod
 */
export const UserWithTokensSchema = z.object({
  user: UserSchema,
  ...TokensSchema.shape,
});

export type UserWithTokens = z.infer<typeof UserWithTokensSchema>;

/**
 * Type for User, extending Zod schema with Mongoose Document properties
 */
export type User = z.infer<typeof UserSchema> & Document;

/**
 * Schema for GET users/:id endpoint input validation
 */
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

/**
 * Type for User payload in POST /users/create endpoint
 */
export type UserPayload = z.infer<typeof CreateUserSchema>['body'];

/**
 * Schema for POST /users/create endpoint input validation
 */
export const CreateUserSchema = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number(),
    password: z.string(),
    email: z.string().email(),
  }),
});

/**
 * Type for Login payload
 */
export type LoginPayloadBody = z.infer<typeof LoginPayload>['body'];

/**
 * Schema for Login payload input validation
 */
export const LoginPayload = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});


/**
 * Type for Reset payload
 */
export type ResetPasswordPayloadBody = z.infer<typeof ResetPasswordPayload>['body'];

/**
 * Schema for Login payload input validation
 */

export const ResetPasswordPayload = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});


/**
 * Type for ResetNewPasswordPayloadBody
 */
export type ResetNewPasswordPayloadBody = z.infer<typeof ResetNewPasswordPayload>['body'];

/**
 * Schema for ResetNewPasswordPayload input validation
 */

export const ResetNewPasswordPayload = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string(),
  }),
});


export const ResponseString = z.object({
  responseObject: z.string(),
});
