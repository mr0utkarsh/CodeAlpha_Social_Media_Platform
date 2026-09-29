import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, UserPlus, UserMinus, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { demoData } from '../utils/demoData';
import PostCard from '../components/Posts/PostCard';
import DemoBanner from '../components/common/DemoBanner';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser, isDemo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      const found = demoData.users.find(u => u.username === username);
      if (found) {
        const isOwn = found.id === demoData.currentUser.id;
        setProfile({ ...found, isOwnProfile: isOwn, isFollowing: false });
        setPosts(demoData.posts.filter(p => p.authorId === found.id));
      } else if (currentUser?.username === username) {
        setProfile({ ...demoData.currentUser, isOwnProfile: true, isFollowing: false });
        setPosts(demoData.posts.filter(p => p.authorId === demoData.currentUser.id));
      } else {
        setProfile(null);
      }
      setLoading(false);
      return;
    }
    loadProfile();
  }, [username, isDemo]);

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

  if (loading) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        {isDemo && <DemoBanner />}
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

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto">
        {isDemo && <DemoBanner />}
        <div className="card p-8 text-center">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-2">User not found</h3>
          <p className="text-sm text-surface-500">The user @{username} doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {isDemo && <DemoBanner />}

      {/* Profile card */}
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
                <Link
                  to={isDemo ? '#' : '/settings/profile'}
                  className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 shrink-0"
                  onClick={isDemo ? (e) => { e.preventDefault(); toast.info('Run locally to edit profile'); } : undefined}
                >
                  <Settings size={14} />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
              ) : (
                <button
                  className="btn-primary text-sm px-4 py-2 flex items-center gap-2 shrink-0"
                  onClick={() => isDemo ? toast.info('Follow requires backend') : null}
                >
                  <UserPlus size={14} />
                  <span className="hidden sm:inline">Follow</span>
                </button>
              )}
            </div>

            {profile.bio && (
              <p className="mt-3 text-surface-600 dark:text-surface-300 text-sm leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex items-center gap-5 mt-4">
              <div>
                <span className="font-bold text-surface-900 dark:text-white">{posts.length}</span>
                <span className="text-surface-500 text-sm ml-1">posts</span>
              </div>
              <div>
                <span className="font-bold text-surface-900 dark:text-white">{profile._count?.followers || 0}</span>
                <span className="text-surface-500 text-sm ml-1">followers</span>
              </div>
              <div>
                <span className="font-bold text-surface-900 dark:text-white">{profile._count?.following || 0}</span>
                <span className="text-surface-500 text-sm ml-1">following</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-surface-400 text-xs">
              <Calendar size={13} />
              <span>Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="w-14 h-14 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold text-surface-900 dark:text-white mb-1">No posts yet</h3>
            <p className="text-sm text-surface-500">
              {profile.isOwnProfile ? 'Share your first post with the community!' : `@${username} hasn't posted yet.`}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostUpdate={(updated) => setPosts(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p))}
              onPostDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
            />
          ))
        )}
      </div>
    </div>
  );
}
