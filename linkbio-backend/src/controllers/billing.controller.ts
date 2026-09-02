import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

export const getPlans = (_req: AuthRequest, res: Response) => {
  res.json([
    { id: 'free', name: 'Free', price: 0, features: ['Up to 5 links', 'Basic analytics'] },
    { id: 'pro', name: 'Pro', price: 9, features: ['Unlimited links', 'Advanced analytics', 'Custom themes', 'No branding'] },
  ]);
};

export const createCheckout = (req: AuthRequest, res: Response) => {
  res.json({ message: 'Checkout integration placeholder' });
};
