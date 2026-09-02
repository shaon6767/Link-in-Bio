import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import linkRoutes from './routes/link.routes';
import profileRoutes from './routes/profile.routes';
import billingRoutes from './routes/billing.routes';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth.middleware';
import Link from './models/Link';
import User from './models/User';
import { redirectLimiter } from './middleware/rateLimiter';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get('/api/profile/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() }).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: (error as Error).message });
  }
});

app.get('/r/:linkId', redirectLimiter, async (req: Request, res: Response) => {
  try {
    const { linkId } = req.params;
    const link = await Link.findById(linkId);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    link.clickCount += 1;
    await link.save();

    return res.redirect(link.url);
  } catch (error) {
    res.status(500).json({ message: 'Error redirecting', error: (error as Error).message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/billing', billingRoutes);

app.use(errorHandler);

export default app;
