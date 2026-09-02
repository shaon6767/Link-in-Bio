import { Router } from 'express';
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
} from '../controllers/link.controller';
import { authenticate } from '../middleware/auth.middleware';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(apiLimiter);
router.use(authenticate);

router.get('/', getLinks);
router.post('/', createLink);
router.patch('/:id', updateLink);
router.delete('/:id', deleteLink);
router.patch('/reorder', reorderLinks);

export default router;
