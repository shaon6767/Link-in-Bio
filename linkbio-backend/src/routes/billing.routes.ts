import { Router } from 'express';
import { getPlans, createCheckout } from '../controllers/billing.controller';
import { authenticate } from '../middleware/auth.middleware';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(apiLimiter);
router.use(authenticate);

router.get('/plans', getPlans);
router.post('/checkout', createCheckout);

export default router;
