import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/search?q=query
router.get('/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) {
      return res.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { username: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
      },
      take: 20,
    });

    // Add follow status
    const usersWithFollow = await Promise.all(
      users.map(async (user) => {
        const isFollowing = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: req.user.id,
              followingId: user.id,
            },
          },
        });
        const followerCount = await prisma.follow.count({
          where: { followingId: user.id },
        });
        const followingCount = await prisma.follow.count({
          where: { followerId: user.id },
        });
        return {
          ...user,
          isFollowing: !!isFollowing,
          _count: { followers: followerCount, following: followingCount },
        };
      })
    );

    res.json(usersWithFollow);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed.' });
  }
});

// GET /api/users/suggested
router.get('/suggested', authenticate, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: req.user.id },
        followers: {
          none: { followerId: req.user.id },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
      },
      take: 10,
    });

    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const followerCount = await prisma.follow.count({
          where: { followingId: user.id },
        });
        return {
          ...user,
          isFollowing: false,
          _count: { followers: followerCount, following: 0 },
        };
      })
    );

    res.json(usersWithCounts);
  } catch (error) {
    console.error('Suggested users error:', error);
    res.status(500).json({ error: 'Failed to fetch suggested users.' });
  }
});

// GET /api/users/:username
router.get('/:username', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username.toLowerCase() },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const followerCount = await prisma.follow.count({
      where: { followingId: user.id },
    });
    const followingCount = await prisma.follow.count({
      where: { followerId: user.id },
    });

    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId: user.id,
        },
      },
    });

    const isOwnProfile = user.id === req.user.id;

    res.json({
      ...user,
      isFollowing: !!isFollowing,
      isOwnProfile,
      _count: { followers: followerCount, following: followingCount },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

// PUT /api/users/me
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, username, bio, avatar } = req.body;

    if (username && username !== req.user.username) {
      if (username.trim().length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters.' });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores.' });
      }
      const existing = await prisma.user.findUnique({ where: { username: username.toLowerCase() } });
      if (existing && existing.id !== req.user.id) {
        return res.status(409).json({ error: 'Username already taken.' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(username && { username: username.toLowerCase().trim() }),
        ...(bio !== undefined && { bio: bio.trim() || null }),
        ...(avatar !== undefined && { avatar: avatar || null }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// POST /api/users/:username/follow
router.post('/:username/follow', authenticate, async (req, res) => {
  try {
    const targetUser = await prisma.user.findUnique({
      where: { username: req.params.username.toLowerCase() },
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (targetUser.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot follow yourself.' });
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId: targetUser.id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already following this user.' });
    }

    await prisma.follow.create({
      data: {
        followerId: req.user.id,
        followingId: targetUser.id,
      },
    });

    // Create notification
    if (targetUser.id !== req.user.id) {
      await prisma.notification.create({
        data: {
          userId: targetUser.id,
          actorId: req.user.id,
          type: 'FOLLOW',
        },
      });
    }

    const followerCount = await prisma.follow.count({
      where: { followingId: targetUser.id },
    });
    const followingCount = await prisma.follow.count({
      where: { followerId: targetUser.id },
    });

    res.json({
      isFollowing: true,
      _count: { followers: followerCount, following: followingCount },
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Failed to follow user.' });
  }
});

// DELETE /api/users/:username/follow
router.delete('/:username/follow', authenticate, async (req, res) => {
  try {
    const targetUser = await prisma.user.findUnique({
      where: { username: req.params.username.toLowerCase() },
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId: targetUser.id,
        },
      },
    });

    if (!existing) {
      return res.status(400).json({ error: 'Not following this user.' });
    }

    await prisma.follow.delete({
      where: { id: existing.id },
    });

    const followerCount = await prisma.follow.count({
      where: { followingId: targetUser.id },
    });
    const followingCount = await prisma.follow.count({
      where: { followerId: targetUser.id },
    });

    res.json({
      isFollowing: false,
      _count: { followers: followerCount, following: followingCount },
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ error: 'Failed to unfollow user.' });
  }
});

export default router;
