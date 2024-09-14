import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { subscriptionService } from '@/api/subscription/subscriptionService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { CreateSubscriptionSchema, GetSubscriptionIdSchema, SubscriptionPayload, SubscriptionSchema } from '@/api/subscription/subscriptionModel';

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

  // GET /subscription/:id
  subscriptionRegistry.registerPath({
    method: 'get',
    path: '/subscription/{id}',
    tags: ['Subscription'],
    request: { params: GetSubscriptionIdSchema.shape.params },
    responses: createApiResponse(SubscriptionSchema, 'Subscription found successfully', StatusCodes.OK),
  });

  router.get('/:id', validateRequest(GetSubscriptionIdSchema), async (req: Request, res: Response) => {
    const _id = req.params.id as string;
    const serviceResponse = await subscriptionService.findById(_id);
    handleServiceResponse(serviceResponse, res);
  });

  // PATCH /subscription/:id
  subscriptionRegistry.registerPath({
    method: 'patch',
    path: '/subscription/{id}',
    tags: ['Subscription'],
    request: { params: GetSubscriptionIdSchema.shape.params, body: { content: { 'application/json': { schema: CreateSubscriptionSchema.shape.body } } } },
    responses: createApiResponse(SubscriptionSchema, 'Subscription updated successfully', StatusCodes.OK),
  });

  router.patch('/:id', validateRequest(GetSubscriptionIdSchema), async (req: Request, res: Response) => {
    const _id = req.params.id as string;
    const subscriptionPayload = req.body as SubscriptionPayload;
    const serviceResponse = await subscriptionService.updateSubscription(_id, subscriptionPayload);
    handleServiceResponse(serviceResponse, res);
  });


  return router;
})();
