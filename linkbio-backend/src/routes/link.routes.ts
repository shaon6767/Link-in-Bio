import { Router } from "express";
import {
  createLink,
  deleteLink,
  getAnalytics,
  getLinks,
  reorderLinks,
  updateLink,
} from "../controllers/link.controller";
import { authenticate } from "../middleware/auth.middleware";
import { apiLimiter } from "../middleware/rateLimiter";

const router = Router();

router.use(apiLimiter);
router.use(authenticate);

router.get("/", getLinks);
router.post("/", createLink);
router.patch("/reorder", reorderLinks);
router.get("/analytics", getAnalytics);
router.patch("/:id", updateLink);
router.delete("/:id", deleteLink);

export default router;
