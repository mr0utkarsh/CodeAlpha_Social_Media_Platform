import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { demoData } from '../utils/demoData';
import DemoBanner from '../components/common/DemoBanner';

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PostDetail() {
  const { id } = useParams();
  const { user, isDemo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      const found = demoData.posts.find(p => p.id === id);
      if (found) {
        setPost(found);
        setComments([
          { id: 'c1', content: 'This really resonates with me!', author: demoData.users[2], authorId: demoData.users[2].id, createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 'c2', content: 'Great perspective, thanks for sharing.', author: demoData.users[4], authorId: demoData.users[4].id, createdAt: new Date(Date.now() - 1800000).toISOString() },
        ]);
      }
      setLoading(false);
      return;
    }
    loadPost();
  }, [id, isDemo]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        api.getPost(id),
        api.getComments(id),
      ]);
      setPost(postData);
      setComments(commentsData.comments);
    } catch {
      toast.error('Post not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto">
        {isDemo && <DemoBanner />}
        <div className="card p-5 space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 skeleton" />
              <div className="h-3 w-20 skeleton" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-3/4 skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto">
        {isDemo && <DemoBanner />}
        <div className="card p-8 text-center">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-2">Post not found</h3>
          <button onClick={() => navigate('/')} className="btn-primary text-sm mt-4">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {isDemo && <DemoBanner />}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors mb-2"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="card">
        <div className="p-5">
          <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-3 mb-4">
            <img
              src={post.author?.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${post.author?.username}`}
              alt={post.author?.name}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-surface-900 dark:text-white">{post.author?.name}</p>
              <p className="text-sm text-surface-500">@{post.author?.username} · {timeAgo(post.createdAt)}</p>
            </div>
          </Link>

          <p className="text-surface-700 dark:text-surface-200 text-[15px] leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>

          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full rounded-xl object-cover max-h-[500px] bg-surface-100 dark:bg-surface-800 mb-4"
            />
          )}

          <div className="flex items-center gap-4 pt-3 border-t border-surface-100 dark:border-surface-800/50">
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-all ${
                post.isLiked ? 'text-red-500' : 'text-surface-500'
              }`}
              onClick={() => isDemo ? null : null}
            >
              <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
              <span className="text-sm font-medium">{post._count?.likes || 0}</span>
            </button>
            <div className="flex items-center gap-2 text-surface-500">
              <span className="text-sm">{comments.length} comments</span>
            </div>
          </div>
        </div>

        {/* Comment input */}
        <form
          onSubmit={(e) => { e.preventDefault(); if (isDemo) toast.info('Comments require backend'); }}
          className="px-5 py-3 border-t border-surface-100 dark:border-surface-800/50 flex gap-3"
        >
          <img
            src={user?.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${user?.username}`}
            alt=""
            className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isDemo ? 'Comments available in local setup...' : 'Write a comment...'}
              className="flex-1 bg-surface-50 dark:bg-surface-800 rounded-xl px-4 py-2 text-sm border border-surface-200 dark:border-surface-700 outline-none focus:ring-2 focus:ring-pulse-500/30 focus:border-pulse-500 transition-all"
            />
            <button type="submit" className="btn-primary px-3 py-2">
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Comments */}
      <div className="space-y-2">
        {comments.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-surface-400 text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4"
            >
              <div className="flex gap-3">
                <Link to={`/profile/${comment.author?.username}`}>
                  <img
                    src={comment.author?.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${comment.author?.username}`}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/profile/${comment.author?.username}`} className="font-semibold text-sm text-surface-900 dark:text-white hover:underline truncate">
                      {comment.author?.name}
                    </Link>
                    <span className="text-xs text-surface-400 shrink-0">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
