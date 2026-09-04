import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Click from "../models/Click";
import Link from "../models/Link";

export const getLinks = async (req: AuthRequest, res: Response) => {
  try {
    const links = await Link.find({ userId: req.user!.userId }).sort({
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
};

export const createLink = async (req: AuthRequest, res: Response) => {
  try {
    const { title, url, isActive } = req.body;

    const lastLink = await Link.findOne({ userId: req.user!.userId }).sort({
      order: -1,
    });
    const order = lastLink ? lastLink.order + 1 : 0;

    const link = new Link({
      userId: req.user!.userId,
      title,
      url,
      isActive: isActive ?? true,
      order,
    });

    await link.save();
    res.status(201).json(link);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error creating link",
        error: (error as Error).message,
      });
  }
};

export const updateLink = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, url, isActive } = req.body;

    const link = await Link.findOne({ _id: id, userId: req.user!.userId });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (title !== undefined) link.title = title;
    if (url !== undefined) link.url = url;
    if (isActive !== undefined) link.isActive = isActive;

    await link.save();
    res.json(link);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating link",
        error: (error as Error).message,
      });
  }
};

export const deleteLink = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const link = await Link.findOneAndDelete({
      _id: id,
      userId: req.user!.userId,
    });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json({ message: "Link deleted" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting link",
        error: (error as Error).message,
      });
  }
};

export const reorderLinks = async (req: AuthRequest, res: Response) => {
  try {
    const { links } = req.body;

    for (const item of links) {
      await Link.findOneAndUpdate(
        { _id: item.id, userId: req.user!.userId },
        { order: item.order },
      );
    }

    const updatedLinks = await Link.find({ userId: req.user!.userId }).sort({
      order: 1,
    });
    res.json(updatedLinks);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error reordering links",
        error: (error as Error).message,
      });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const links = await Link.find({ userId });
    const linkIds = links.map((l) => l._id);

    const since = new Date();
    since.setDate(since.getDate() - 13);
    since.setHours(0, 0, 0, 0);

    const dailyRaw = await Click.aggregate([
      { $match: { linkId: { $in: linkIds }, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);
    const dailyMap = new Map(dailyRaw.map((d) => [d._id, d.count]));

    const dailyClicks: { date: string; count: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dailyClicks.push({ date: key, count: dailyMap.get(key) || 0 });
    }

    const totalClicks = links.reduce((sum, l) => sum + l.clickCount, 0);
    const topLinks = [...links]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5)
      .map((l) => ({ title: l.title, clicks: l.clickCount }));

    res.json({ totalClicks, dailyClicks, topLinks });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching analytics",
        error: (error as Error).message,
      });
  }
};
