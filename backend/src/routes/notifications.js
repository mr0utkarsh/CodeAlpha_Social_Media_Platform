import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, read: false },
    });

    // Get post content for notifications that reference posts
    const postIds = [...new Set(notifications.map((n) => n.postId).filter(Boolean))];
    const posts = postIds.length
      ? await prisma.post.findMany({
          where: { id: { in: postIds } },
          select: { id: true, content: true },
        })
      : [];

    const postMap = Object.fromEntries(posts.map((p) => [p.id, p]));

    const enriched = notifications.map((n) => ({
      ...n,
      post: n.postId ? postMap[n.postId] || null : null,
    }));

    res.json({ notifications: enriched, unreadCount });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ error: 'Failed to load notifications.' });
  }
});

// PUT /api/notifications/read-all (must be before /:id/read)
router.put('/read-all', authenticate, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });

    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read.' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });

    res.json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read.' });
  }
});

export default router;
