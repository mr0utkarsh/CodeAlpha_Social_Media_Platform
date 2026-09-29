import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

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
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => { loadPost(); }, [id]);

  const loadPost = async () => {
    try { setLoading(true); const [postData, commentsData] = await Promise.all([api.getPost(id), api.getComments(id)]); setPost(postData); setComments(commentsData.comments); }
    catch { toast.error('Post not found'); navigate('/'); } finally { setLoading(false); }
  };

  const handleLike = async () => {
    try { if (post.isLiked) { await api.unlikePost(id); setPost(p => ({ ...p, isLiked: false, _count: { ...p._count, likes: p._count.likes - 1 } })); } else { await api.likePost(id); setPost(p => ({ ...p, isLiked: true, _count: { ...p._count, likes: p._count.likes + 1 } })); } }
    catch { toast.error('Failed to update like'); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault(); if (!commentText.trim()) return;
    setSubmittingComment(true);
    try { const comment = await api.addComment(id, commentText.trim()); setComments(prev => [...prev, comment]); setPost(p => ({ ...p, _count: { ...p._count, comments: p._count.comments + 1 } })); setCommentText(''); toast.success('Comment added'); }
    catch (err) { toast.error(err.message || 'Failed'); } finally { setSubmittingComment(false); }
  };

  const handleDeleteComment = async (commentId) => {
    try { await api.deleteComment(commentId); setComments(prev => prev.filter(c => c.id !== commentId)); setPost(p => ({ ...p, _count: { ...p._count, comments: p._count.comments - 1 } })); toast.success('Comment deleted'); }
    catch { toast.error('Failed to delete comment'); }
  };

  if (loading) return <div className="max-w-xl mx-auto"><div className="card p-5 space-y-4 animate-pulse"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full skeleton" /><div className="space-y-2 flex-1"><div className="h-4 w-32 skeleton" /><div className="h-3 w-20 skeleton" /></div></div><div className="space-y-2"><div className="h-4 w-full skeleton" /><div className="h-4 w-3/4 skeleton" /></div></div></div>;
  if (!post) return null;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors mb-2"><ArrowLeft size={18} /><span className="text-sm font-medium">Back</span></button>
      <div className="card">
        <div className="p-5">
          <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-3 mb-4">
            <img src={post.author?.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${post.author?.username}`} alt={post.author?.name} className="w-11 h-11 rounded-full object-cover" />
            <div><p className="font-semibold text-surface-900 dark:text-white">{post.author?.name}</p><p className="text-sm text-surface-500">@{post.author?.username} · {timeAgo(post.createdAt)}</p></div>
          </Link>
          <p className="text-surface-700 dark:text-surface-200 text-[15px] leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>
          {post.image && <img src={post.image} alt="Post" className="w-full rounded-xl object-cover max-h-[500px] bg-surface-100 dark:bg-surface-800 mb-4" />}
          <div className="flex items-center gap-4 pt-3 border-t border-surface-100 dark:border-surface-800/50">
            <button onClick={handleLike} className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-all ${post.isLiked ? 'text-red-500' : 'text-surface-500'}`}><Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} /><span className="text-sm font-medium">{post._count?.likes || 0}</span></button>
            <span className="text-sm text-surface-500">{comments.length} comments</span>
          </div>
        </div>
        <form onSubmit={handleAddComment} className="px-5 py-3 border-t border-surface-100 dark:border-surface-800/50 flex gap-3">
          <img src={user?.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${user?.username}`} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" />
          <div className="flex-1 flex gap-2">
            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="flex-1 bg-surface-50 dark:bg-surface-800 rounded-xl px-4 py-2 text-sm border border-surface-200 dark:border-surface-700 outline-none focus:ring-2 focus:ring-pulse-500/30 focus:border-pulse-500 transition-all" />
            <button type="submit" disabled={!commentText.trim() || submittingComment} className="btn-primary px-3 py-2 disabled:opacity-50"><Send size={16} /></button>
          </div>
        </form>
      </div>
      <div className="space-y-2">
        {comments.length === 0 ? <div className="card p-6 text-center"><p className="text-surface-400 text-sm">No comments yet. Be the first!</p></div>
        : comments.map(comment => (
          <motion.div key={comment.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
            <div className="flex gap-3">
              <Link to={`/profile/${comment.author?.username}`}><img src={comment.author?.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${comment.author?.username}`} alt="" className="w-8 h-8 rounded-full object-cover" /></Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1"><Link to={`/profile/${comment.author?.username}`} className="font-semibold text-sm text-surface-900 dark:text-white hover:underline truncate">{comment.author?.name}</Link><span className="text-xs text-surface-400 shrink-0">{timeAgo(comment.createdAt)}</span></div>
                <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">{comment.content}</p>
              </div>
              {comment.authorId === user?.id && <button onClick={() => handleDeleteComment(comment.id)} className="text-surface-400 hover:text-red-500 transition-colors p-1 shrink-0" title="Delete comment"><Trash2 size={14} /></button>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
