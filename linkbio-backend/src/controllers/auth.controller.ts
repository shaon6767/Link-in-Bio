import { Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import { generateTokens } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 15 * 60 * 1000,
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const RESERVED_USERNAMES = [
  'dashboard',
  'login',
  'signup',
  'api',
  'settings',
  'admin',
  'r',
];

const validateUsername = (username: string): string | null => {
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return 'Username is reserved';
  }
  return null;
};

export const signup = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password, name } = req.body;

    const usernameError = validateUsername(username);
    if (usernameError) {
      return res.status(400).json({ message: usernameError });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, passwordHash: password, name });
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    res.cookie('accessToken', accessToken, cookieOptions);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error: (error as Error).message });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    res.cookie('accessToken', accessToken, cookieOptions);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
  }
};

export const refresh = async (req: AuthRequest, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = require('jsonwebtoken').verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };

    const { accessToken } = generateTokens(decoded.userId);

    res.cookie('accessToken', accessToken, cookieOptions);

    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = (req: AuthRequest, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};
