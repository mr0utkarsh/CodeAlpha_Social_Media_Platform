import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, TrendingUp, UserPlus } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { demoData } from '../utils/demoData';
import PostCard from '../components/Posts/PostCard';
import DemoBanner from '../components/common/DemoBanner';

export default function Explore() {
  const toast = useToast();
  const { isDemo } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isDemo) {
      const sorted = [...demoData.posts].sort((a, b) => b._count.likes - a._count.likes);
      setTrendingPosts(sorted);
      setSuggestedUsers(demoData.users.slice(1, 7));
      setLoading(false);
      return;
    }
    loadExploreData();
  }, [isDemo]);

  const loadExploreData = async () => {
    try {
      setLoading(true);
      const [trending, suggested] = await Promise.all([
        api.getTrendingPosts(),
        api.getSuggestedUsers(),
      ]);
      setTrendingPosts(trending.posts);
      setSuggestedUsers(suggested);
    } catch {
      toast.error('Failed to load explore data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    if (isDemo) {
      const results = demoData.users.filter(
        u => u.name.toLowerCase().includes(query.toLowerCase()) ||
             u.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.map(u => ({ ...u, isFollowing: false })));
      return;
    }
    setSearching(true);
    try {
      const results = await api.searchUsers(query);
      setSearchResults(results);
    } catch {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const isSearchingActive = searchQuery.trim().length > 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {isDemo && <DemoBanner />}

      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Explore</h1>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users..."
            className="input pl-11"
          />
        </div>
      </div>

      {/* Search results */}
      {isSearchingActive && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider">Search Results</h2>
          {searching ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-4 animate-pulse flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 skeleton" />
                    <div className="h-3 w-20 skeleton" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-surface-500 text-sm">No users found for "{searchQuery}"</p>
            </div>
          ) : (
            searchResults.map((u) => (
              <div key={u.id} className="card p-4 flex items-center gap-3">
                <Link to={`/profile/${u.username}`} className="shrink-0">
                  <img
                    src={u.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${u.username}`}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>
                <Link to={`/profile/${u.username}`} className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">{u.name}</p>
                  <p className="text-xs text-surface-500 truncate">@{u.username}</p>
                </Link>
                <span className="text-xs text-surface-400 px-3 py-1.5">
                  {u._count?.followers || 0} followers
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Default explore content */}
      {!isSearchingActive && (
        <>
          {/* Suggested users */}
          <div>
            <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-3">People to Follow</h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="card p-4 animate-pulse flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full skeleton" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 skeleton" />
                      <div className="h-3 w-16 skeleton" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedUsers.slice(0, 6).map((u) => (
                  <div key={u.id} className="card p-4 flex items-center gap-3">
                    <Link to={`/profile/${u.username}`} className="shrink-0">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${u.username}`}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </Link>
                    <Link to={`/profile/${u.username}`} className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-xs text-surface-500 truncate">@{u.username}</p>
                    </Link>
                    <span className="text-xs text-pulse-600 dark:text-pulse-400 font-medium px-2 py-1">
                      {u._count?.followers || 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending posts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-pulse-600" />
              <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider">Trending Posts</h2>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="card p-5 animate-pulse space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full skeleton" />
                      <div className="h-4 w-32 skeleton" />
                    </div>
                    <div className="h-4 w-full skeleton" />
                    <div className="h-4 w-3/4 skeleton" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {trendingPosts.slice(0, 8).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
