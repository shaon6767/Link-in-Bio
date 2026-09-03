import { Router } from "express";
import {
    changePassword,
    login,
    logout,
    refresh,
    signup,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.patch("/password", authenticate, changePassword);

export default router;
