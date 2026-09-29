import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/posts/:postId/comments
router.get('/:postId/comments', authenticate, async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: req.params.postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to load comments.' });
  }
});

// POST /api/posts/:postId/comments
router.post('/:postId/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required.' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'Comment cannot exceed 1000 characters.' });
    }

    const post = await prisma.post.findUnique({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: req.params.postId,
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
      },
    });

    // Create notification if not commenting on own post
    if (post.authorId !== req.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          actorId: req.user.id,
          type: 'COMMENT',
          postId: req.params.postId,
        },
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to add comment.' });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.id },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Cannot delete someone else\'s comment.' });
    }

    await prisma.comment.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment.' });
  }
});

export default router;
