import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { subscriptionService } from '@/api/subscription/subscriptionService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { CreateSubscriptionSchema, SubscriptionPayload, SubscriptionSchema } from '@/api/subscription/subscriptionModel';

export const subscriptionRegistry = new OpenAPIRegistry();

// Register the Subscription schema
subscriptionRegistry.register('Subscription', SubscriptionSchema);

export const subscriptionRouter: Router = (() => {
  const router = express.Router();

  // Get all subscriptions (corrected the comment)
  subscriptionRegistry.registerPath({
    method: 'get',
    path: '/subscription',
    tags: ['Subscription'],
    responses: createApiResponse(z.array(SubscriptionSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await subscriptionService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  // Create a Subscription
  subscriptionRegistry.registerPath({
    method: 'post',
    path: '/subscription/create',
    tags: ['Subscription'],
    request: { body: { content: { 'application/json': { schema: CreateSubscriptionSchema.shape.body } } } },
    responses: createApiResponse(SubscriptionSchema, 'Subscription created successfully', StatusCodes.CREATED),
  });

  // POST /subscription/create endpoint
  router.post('/create', validateRequest(CreateSubscriptionSchema), async (req: Request, res: Response) => {
    const newSubscription = req.body as SubscriptionPayload;
    const serviceResponse = await subscriptionService.createSubscription(newSubscription);

    handleServiceResponse(serviceResponse, res);
  });


  return router;
})();
