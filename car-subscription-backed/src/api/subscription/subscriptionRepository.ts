import { Subscription } from './subscriptionModel';
import { SubscriptionModel } from './subscriptionSchema';

export const subscriptionRepository = {
  findAllAsync: async (): Promise<Subscription[]> => {
    return SubscriptionModel.find().exec();
    //.select('-password -__v').exec();
  },
  createSubscriptionAsync: async (subscription: Subscription): Promise<Subscription> => {
    return SubscriptionModel.create(subscription);
  },
};
