import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);
// Define time slot enum
const TimeSlot = z.enum(['6-8 AM', '8-10 AM', '10-12 AM']);

const CarType = z.enum(['Hatchback', 'Sedan', 'CSUV', 'SUV']);
const PlanType = z.enum(['Daily', 'Alternate']);
const ServiceType = z.enum(['Interior', 'Exterior',"Complete"]);
const StatusType = z.enum(['Active', 'Paused', 'Cancelled']);

/**
 * Schema for Subscription model
 */
export const SubscriptionSchema = z.object({
  user: z.string().uuid({ message: 'User ID must be a valid UUID' }), // Assuming user ID is a UUID
  carType: CarType,
  planType: PlanType,
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
  schedule: z.array(
    z.object({
      date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
      serviceType: ServiceType,
      timeSlot: TimeSlot, // Time slot for the service
    })
  ),
  status: StatusType.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;


/**
 * Schema for POST /subscriptions/create endpoint input validation
 */
export const CreateSubscriptionSchema = z.object({
  body: z.object({
    user: z.string(), // User ID
    carType: CarType, // Type of car
    planType: PlanType, // Type of subscription plan
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }), // Start date
    schedule: z.array(
      z.object({
        date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }), // Service date
        serviceType: ServiceType, // Type of service
        timeSlot: TimeSlot, // Time slot for the service
      })
    ).min(1, { message: 'Schedule must have at least one entry' }), // Schedule array with at least one service entry
  }),
});

/**
 * Type for Subscription payload in POST /subscriptions/create endpoint
 */
export type SubscriptionPayload = z.infer<typeof CreateSubscriptionSchema>['body'];