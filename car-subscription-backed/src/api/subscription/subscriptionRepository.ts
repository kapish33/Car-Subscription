import { Subscription, SubscriptionPayload } from './subscriptionModel';
import { SubscriptionModel } from './subscriptionSchema';

export const subscriptionRepository = {
  findAllAsync: async (): Promise<Subscription[]> => {
    return SubscriptionModel.find().populate('user', 'firstName lastName email').exec();
    //.select('-password -__v').exec();
  },
  createSubscriptionAsync: async (subscription: Subscription): Promise<Subscription> => {
    return SubscriptionModel.create(subscription);
  },

  // GET /subscription/:id
  findByIdAsync: async (id: string): Promise<Subscription | null> => {
    return SubscriptionModel.findById(id).populate('user', 'firstName lastName email').exec();
  },

  // PATCH /subscription/:id
  updateSubscriptionAsync: async (id: string, subscriptionPayload: SubscriptionPayload): Promise<Subscription | null> => {
    return SubscriptionModel.findByIdAndUpdate(id, subscriptionPayload, { new: true }).exec();
  },
};
