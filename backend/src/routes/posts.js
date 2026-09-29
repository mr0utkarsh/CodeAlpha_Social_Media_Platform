import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper: build post response with counts and status
const buildPost = (post, userId) => {
  return {
    ...post,
    author: post.author,
    _count: {
      likes: post.likes?.length || 0,
      comments: post.comments?.length || 0,
    },
    isLiked: userId ? (post.likes || []).some((l) => l.userId === userId) : false,
  };
};

// GET /api/posts/feed
router.get('/feed', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          select: { id: true },
        },
      },
    });

    const formatted = posts.map((post) => buildPost(post, req.user.id));

    res.json({
      posts: formatted,
      page,
      limit,
    });
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ error: 'Failed to load feed.' });
  }
});

// GET /api/posts/trending
router.get('/trending', authenticate, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          select: { id: true },
        },
      },
    });

    // Sort by likes count
    const formatted = posts.map((post) => buildPost(post, req.user.id));
    formatted.sort((a, b) => b._count.likes - a._count.likes);

    res.json({ posts: formatted.slice(0, 10) });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Failed to load trending posts.' });
  }
});

// GET /api/posts/user/:username
router.get('/user/:username', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username.toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          select: { id: true },
        },
      },
    });

    const formatted = posts.map((post) => buildPost(post, req.user.id));
    res.json({ posts: formatted });
  } catch (error) {
    console.error('User posts error:', error);
    res.status(500).json({ error: 'Failed to load user posts.' });
  }
});

// GET /api/posts/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          select: { id: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.json(buildPost(post, req.user.id));
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to load post.' });
  }
});

// POST /api/posts
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required.' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ error: 'Post content cannot exceed 2000 characters.' });
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        image: image?.trim() || null,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          select: { id: true },
        },
      },
    });

    res.status(201).json(buildPost(post, req.user.id));
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Cannot delete someone else\'s post.' });
    }

    await prisma.post.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post.' });
  }
});

// POST /api/posts/:id/like
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: { author: true },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const existing = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: req.params.id,
          userId: req.user.id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already liked.' });
    }

    await prisma.like.create({
      data: {
        postId: req.params.id,
        userId: req.user.id,
      },
    });

    // Create notification if not liking own post
    if (post.authorId !== req.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          actorId: req.user.id,
          type: 'LIKE',
          postId: req.params.id,
        },
      });
    }

    const likeCount = await prisma.like.count({ where: { postId: req.params.id } });

    res.json({ liked: true, likes: likeCount });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ error: 'Failed to like post.' });
  }
});

// DELETE /api/posts/:id/like
router.delete('/:id/like', authenticate, async (req, res) => {
  try {
    const existing = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: req.params.id,
          userId: req.user.id,
        },
      },
    });

    if (!existing) {
      return res.status(400).json({ error: 'Not liked yet.' });
    }

    await prisma.like.delete({
      where: { id: existing.id },
    });

    const likeCount = await prisma.like.count({ where: { postId: req.params.id } });

    res.json({ liked: false, likes: likeCount });
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({ error: 'Failed to unlike post.' });
  }
});

export default router;
