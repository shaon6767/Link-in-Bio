import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { errorHandler } from "./middleware/errorHandler";
import { redirectLimiter } from "./middleware/rateLimiter";
import Click from "./models/Click";
import Link from "./models/Link";
import User from "./models/User";
import authRoutes from "./routes/auth.routes";
import billingRoutes from "./routes/billing.routes";
import linkRoutes from "./routes/link.routes";
import profileRoutes from "./routes/profile.routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get("/r/:linkId", redirectLimiter, async (req: Request, res: Response) => {
  try {
    const { linkId } = req.params;
    const link = await Link.findById(linkId);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    link.clickCount += 1;
    await link.save();

    // Fire-and-forget: log the click without delaying the redirect
    Click.create({
      linkId: link._id,
      userId: link.userId,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    }).catch((err) => console.error("Click log failed:", err));

    return res.redirect(link.url);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error redirecting", error: (error as Error).message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/billing", billingRoutes);

app.get("/api/profile/:username/links", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }
    const links = await Link.find({ userId: user._id, isActive: true }).sort({
      order: 1,
      createdAt: 1,
    });
    res.json(links);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching links",
        error: (error as Error).message,
      });
  }
});

app.get("/api/profile/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    // Explicit whitelist — never leak email or other private fields on this public route
    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("username name bio avatarUrl theme");
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching profile",
        error: (error as Error).message,
      });
  }
});

app.use(errorHandler);

export default app;
