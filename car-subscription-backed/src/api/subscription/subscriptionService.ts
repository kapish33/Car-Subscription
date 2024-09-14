import { StatusCodes } from 'http-status-codes';
import { subscriptionRepository } from './subscriptionRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { Subscription, SubscriptionPayload } from './subscriptionModel';

export const subscriptionService = {
  findAll: async (): Promise<ServiceResponse<Subscription[] | null>> => {
    try {
      const subscription = await subscriptionRepository.findAllAsync();
      if (!subscription) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Subscriptions found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Subscription[]>(ResponseStatus.Success, 'Subscriptions found', subscription, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  createSubscription: async (newSubscription: SubscriptionPayload): Promise<ServiceResponse<Subscription | null>> => {
    try {
      const subscription = await subscriptionRepository.createSubscriptionAsync(newSubscription);
      return new ServiceResponse<Subscription>(
        ResponseStatus.Success,
        'Subscription created successfully',
        subscription,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error While Creating a Subscription: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // GET /subscription/:id
  findById: async (id: string): Promise<ServiceResponse<Subscription | null>> => {
    try {
      const subscription = await subscriptionRepository.findByIdAsync(id);
      if (!subscription) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Subscription not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<Subscription>(ResponseStatus.Success, 'Subscription found', subscription, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding subscription: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // PATCH /subscription/:id
  updateSubscription: async (id: string, subscriptionPayload: SubscriptionPayload): Promise<ServiceResponse<Subscription | null>> => {
    try {
      const subscription = await subscriptionRepository.updateSubscriptionAsync(id, subscriptionPayload);
      if (!subscription) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Subscription not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<Subscription>(ResponseStatus.Success, 'Subscription updated', subscription, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating subscription: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};
