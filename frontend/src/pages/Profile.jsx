import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, UserPlus, UserMinus, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import PostCard from '../components/Posts/PostCard';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [profileData, postsData] = await Promise.all([
        api.getUser(username),
        api.getUserPosts(username),
      ]);
      setProfile(profileData);
      setPosts(postsData.posts);
    } catch {
      toast.error('User not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (profile.isFollowing) {
        const result = await api.unfollowUser(username);
        setProfile((p) => ({ ...p, isFollowing: false, _count: result._count }));
        toast.success(`Unfollowed @${username}`);
      } else {
        const result = await api.followUser(username);
        setProfile((p) => ({ ...p, isFollowing: true, _count: result._count }));
        toast.success(`Following @${username}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)));
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="card p-6 animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full skeleton" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-40 skeleton" />
              <div className="h-4 w-24 skeleton" />
            </div>
          </div>
          <div className="h-4 w-full skeleton mb-2" />
          <div className="h-4 w-3/4 skeleton" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <img
            src={profile.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${profile.username}`}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover shrink-0 ring-2 ring-surface-200 dark:ring-surface-700"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-surface-900 dark:text-white truncate">{profile.name}</h1>
                <p className="text-surface-500 text-sm">@{profile.username}</p>
              </div>
              {profile.isOwnProfile ? (
                <Link to="/settings/profile" className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 shrink-0">
                  <Settings size={14} />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`text-sm px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shrink-0 ${
                    profile.isFollowing
                      ? 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 border border-surface-200 dark:border-surface-700'
                      : 'bg-pulse-600 text-white hover:bg-pulse-700'
                  }`}
                >
                  {followLoading ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : profile.isFollowing ? (
                    <><UserMinus size={14} /><span className="hidden sm:inline">Following</span></>
                  ) : (
                    <><UserPlus size={14} /><span className="hidden sm:inline">Follow</span></>
                  )}
                </button>
              )}
            </div>
            {profile.bio && <p className="mt-3 text-surface-600 dark:text-surface-300 text-sm leading-relaxed">{profile.bio}</p>}
            <div className="flex items-center gap-5 mt-4">
              <div><span className="font-bold text-surface-900 dark:text-white">{posts.length}</span><span className="text-surface-500 text-sm ml-1">posts</span></div>
              <div><span className="font-bold text-surface-900 dark:text-white">{profile._count?.followers || 0}</span><span className="text-surface-500 text-sm ml-1">followers</span></div>
              <div><span className="font-bold text-surface-900 dark:text-white">{profile._count?.following || 0}</span><span className="text-surface-500 text-sm ml-1">following</span></div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-surface-400 text-xs">
              <Calendar size={13} />
              <span>Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="w-14 h-14 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-2xl">📝</span></div>
            <h3 className="font-semibold text-surface-900 dark:text-white mb-1">No posts yet</h3>
            <p className="text-sm text-surface-500">{profile.isOwnProfile ? 'Share your first post with the community!' : `@${username} hasn't posted yet.`}</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} onPostDelete={handlePostDelete} />
          ))
        )}
      </div>
    </div>
  );
}
