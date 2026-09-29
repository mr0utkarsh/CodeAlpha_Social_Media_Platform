import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PostCard from '../components/Posts/PostCard';
import CreatePost from '../components/Posts/CreatePost';

function PostSkeleton() {
  return (
    <div className="card p-5 space-y-4">
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
      <div className="flex gap-4 pt-2">
        <div className="h-8 w-16 skeleton" />
        <div className="h-8 w-16 skeleton" />
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getFeed();
      setPosts(data.posts);
      setError(null);
    } catch (err) {
      setError('Failed to load feed. Pull to refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)));
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="lg:hidden w-8 h-8 bg-gradient-to-br from-pulse-500 to-pulse-700 rounded-lg flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Home</h1>
      </div>

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-surface-500 mb-4">{error}</p>
          <button onClick={loadFeed} className="btn-primary text-sm">Try again</button>
        </div>
      ) : posts.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-surface-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white mb-2">Your feed is empty</h3>
          <p className="text-sm text-surface-500">Create your first post or explore to find people to follow.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
