import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import {
  CreateUserSchema,
  GetUserSchema,
  LoginPayload,
  LoginPayloadBody,
  ResetNewPasswordPayload,
  ResetNewPasswordPayloadBody,
  ResetPasswordPayload,
  ResetPasswordPayloadBody,
  ResponseString,
  TokensSchema,
  UserPayload,
  UserSchema,
  UserWithTokensSchema,
} from '@/api/user/userModel';
import { userService } from '@/api/user/userService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { requestCookieValidation } from '@/common/middleware/requestCookieValidation';
import { setCookie } from '@/common/utils/cookieUtils';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();

  // Get all users
  userRegistry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['User'],
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  // Get user by ID
  userRegistry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get('/:id', validateRequest(GetUserSchema), async (req: Request, res: Response) => {
    const _id = req.params.id as string;
    const serviceResponse = await userService.findById(_id);
    handleServiceResponse(serviceResponse, res);
  });

  // Create a new user
  userRegistry.registerPath({
    method: 'post',
    path: '/users/create',
    tags: ['User'],
    request: { body: { content: { 'application/json': { schema: CreateUserSchema.shape.body } } } },
    responses: createApiResponse(UserWithTokensSchema, 'User created successfully', StatusCodes.CREATED),
  });

  router.post('/create', validateRequest(CreateUserSchema), async (req: Request, res: Response) => {
    const newUser = req.body as UserPayload;
    const serviceResponse = await userService.createUser(newUser);

    if (serviceResponse.success) {
      setCookie(res, 'accessToken', serviceResponse.responseObject?.accessToken);
      setCookie(res, 'refreshToken', serviceResponse.responseObject?.refreshToken);
    }
    
    handleServiceResponse(serviceResponse, res);
  });

  // Login user
  userRegistry.registerPath({
    method: 'post',
    path: '/users/login',
    tags: ['User'],
    request: { body: { content: { 'application/json': { schema: LoginPayload.shape.body } } } },
    responses: createApiResponse(TokensSchema, 'User logged in successfully', StatusCodes.OK),
  });

  router.post('/users/login', validateRequest(LoginPayload), async (req: Request, res: Response) => {
    const loginUser = req.body as LoginPayloadBody;
    const serviceResponse = await userService.loginUser(loginUser);

    if (serviceResponse.success) {
      setCookie(res, 'accessToken', serviceResponse.responseObject?.accessToken);
      setCookie(res, 'refreshToken', serviceResponse.responseObject?.refreshToken);
    }

    handleServiceResponse(serviceResponse, res);
  });

  // Reset user password
  userRegistry.registerPath({
    method: 'patch',
    path: '/users/reset/password',
    tags: ['User'],
    request: { body: { content: { 'application/json': { schema: ResetPasswordPayload.shape.body } } } },
    responses: createApiResponse(ResponseString, 'Password reset email sent', StatusCodes.OK),
  });

  router.patch('/reset/password', validateRequest(ResetPasswordPayload), async (req: Request, res: Response) => {
    const resetPasswordData = req.body as ResetPasswordPayloadBody;
    const serviceResponse = await userService.resetUserPassword(resetPasswordData);
    handleServiceResponse(serviceResponse, res);
  });

  // Verify reset token and set new password
  userRegistry.registerPath({
    method: 'patch',
    path: '/users/verify-reset-token',
    tags: ['User'],
    request: { body: { content: { 'application/json': { schema: ResetNewPasswordPayload.shape.body } } } },
    responses: createApiResponse(ResponseString, 'Password Updated successfully', StatusCodes.OK),
  });

  router.patch('/verify-reset-token', validateRequest(ResetNewPasswordPayload), async (req: Request, res: Response) => {
    const verifyResetData = req.body as ResetNewPasswordPayloadBody;
    const serviceResponse = await userService.setNewUserPassword(verifyResetData);
    handleServiceResponse(serviceResponse, res);
  });

  // Validate cookie endpoint
  router.get('/validate/cookies', requestCookieValidation, async (_req: Request, res: Response) => {
    res.send({
      success: true,
    });
  });

  return router;
})();
