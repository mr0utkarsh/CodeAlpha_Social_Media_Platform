import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/api';

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PostCard({ post, onPostUpdate, onPostDelete, showFull = false }) {
  const { user } = useAuth();
  const toast = useToast();
  const [liked, setLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post._count?.likes || 0);
  const [comments, setComments] = useState(post._count?.comments || 0);
  const [animatingLike, setAnimatingLike] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isOwner = user?.id === post.authorId;

  const handleLike = async () => {
    try {
      if (liked) {
        setLiked(false);
        setLikes((l) => l - 1);
        await api.unlikePost(post.id);
      } else {
        setLiked(true);
        setLikes((l) => l + 1);
        setAnimatingLike(true);
        setTimeout(() => setAnimatingLike(false), 300);
        await api.likePost(post.id);
      }
      onPostUpdate?.({ ...post, isLiked: !liked, _count: { ...post._count, likes: liked ? likes - 1 : likes + 1 } });
    } catch {
      setLiked(!liked);
      setLikes(liked ? likes + 1 : likes - 1);
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.deletePost(post.id);
      toast.success('Post deleted');
      onPostDelete?.(post.id);
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
    setShowMenu(false);
  };

  const contentLength = post.content?.length || 0;
  const shouldTruncate = contentLength > 200 && !showFull && !expanded;
  const displayContent = shouldTruncate ? post.content.slice(0, 200) + '...' : post.content;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-3 min-w-0">
          <img
            src={post.author?.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${post.author?.username}`}
            alt={post.author?.name}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-surface-900 dark:text-white truncate hover:underline">
              {post.author?.name}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-500 truncate">@{post.author?.username}</span>
              <span className="text-xs text-surface-300 dark:text-surface-600">·</span>
              <span className="text-xs text-surface-400 shrink-0">{timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </Link>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-10 z-20 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-lg py-1 w-40"
                >
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={15} />
                    Delete post
                  </button>
                </motion.div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        <p className="text-surface-700 dark:text-surface-200 text-[15px] leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(true)}
            className="text-pulse-600 dark:text-pulse-400 text-sm mt-1 hover:underline"
          >
            Show more
          </button>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-5 pb-3">
          <img
            src={post.image}
            alt="Post attachment"
            className="w-full rounded-xl object-cover max-h-96 bg-surface-100 dark:bg-surface-800"
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center px-3 py-2 border-t border-surface-100 dark:border-surface-800/50">
        <Link
          to={`/post/${post.id}`}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-500"
        >
          <MessageCircle size={18} />
          <span className="text-xs font-medium">{comments}</span>
        </Link>

        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-all ${
            liked ? 'text-red-500' : 'text-surface-500'
          }`}
        >
          <motion.div animate={animatingLike ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </motion.div>
          <span className="text-xs font-medium">{likes}</span>
        </button>

        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.origin + '/post/' + post.id);
            toast.info('Link copied to clipboard');
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-500"
        >
          <Share2 size={18} />
        </button>
      </div>
    </motion.article>
  );
}
