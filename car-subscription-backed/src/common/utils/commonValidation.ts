import { z } from 'zod';

export const commonValidations = {
  id: z.string().refine((data) => typeof data === 'string', {
    message: 'ID must be a string value',
  }),
  // ... other common validations
};
