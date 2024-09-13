import { StatusCodes } from 'http-status-codes';
import { userRepository } from './userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { LoginPayloadBody, User, UserPayload, UserWithTokens, Tokens, ResetPasswordPayloadBody, ResetNewPasswordPayloadBody } from './userModel';

export const userService = {
  findAll: async (): Promise<ServiceResponse<User[] | null>> => {
    try {
      const users = await userRepository.findAllAsync();
      if (!users) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Users found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User[]>(ResponseStatus.Success, 'Users found', users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findById: async (id: User['_id']): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createUser: async (newUser: UserPayload): Promise<ServiceResponse<UserWithTokens | null>> => {
    try {
      const user = await userRepository.createUserAsync(newUser);
      return new ServiceResponse<UserWithTokens>(
        ResponseStatus.Success,
        'User created successfully',
        user,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  loginUser: async (loginPayload: LoginPayloadBody): Promise<ServiceResponse<Tokens | null>> => {
    try {
      const user = await userRepository.loginUserAsync(loginPayload);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid email or password', null, StatusCodes.UNAUTHORIZED);
      }
      return new ServiceResponse<Tokens>(
        ResponseStatus.Success,
        'User logged in successfully',
        user,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error logging in user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  resetUserPassword: async (resetPayload: ResetPasswordPayloadBody): Promise<ServiceResponse<string | null>> => {
    try {
      const result = await userRepository.resetUserAsync(resetPayload);
      if (!result) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<string>(
        ResponseStatus.Success,
        'Password reset email sent',
        result,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error sending password reset email: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  setNewUserPassword: async (newPasswordPayload: ResetNewPasswordPayloadBody): Promise<ServiceResponse<string | null>> => {
    try {
      const result = await userRepository.setNewUserPassAsync(newPasswordPayload);
      if (!result) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid or expired token', null, StatusCodes.BAD_REQUEST);
      }
      return new ServiceResponse<string>(
        ResponseStatus.Success,
        'Password updated successfully',
        result,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating password: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
