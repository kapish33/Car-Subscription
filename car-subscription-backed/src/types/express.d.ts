// types/express.d.ts
import { User } from '@/api/user/userModel';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
