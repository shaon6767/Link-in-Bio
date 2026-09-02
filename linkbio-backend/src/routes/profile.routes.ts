import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(apiLimiter);
router.use(authenticate);

router.get('/', getProfile);
router.get('/me', getProfile);
router.patch('/', updateProfile);

export default router;
