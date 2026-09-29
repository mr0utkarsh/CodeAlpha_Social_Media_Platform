import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, UserPlus, Bell, CheckCheck } from 'lucide-react';
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

function NotificationIcon({ type }) {
  switch (type) {
    case 'LIKE':
      return (
        <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <Heart size={16} className="text-red-500" fill="currentColor" />
        </div>
      );
    case 'COMMENT':
      return (
        <div className="w-9 h-9 rounded-full bg-pulse-50 dark:bg-pulse-900/20 flex items-center justify-center">
          <MessageCircle size={16} className="text-pulse-600 dark:text-pulse-400" />
        </div>
      );
    case 'FOLLOW':
      return (
        <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <UserPlus size={16} className="text-emerald-600 dark:text-emerald-400" />
        </div>
      );
    default:
      return <Bell size={16} />;
  }
}

function notificationText(notification) {
  switch (notification.type) {
    case 'LIKE':
      return 'liked your post';
    case 'COMMENT':
      return 'commented on your post';
    case 'FOLLOW':
      return 'started following you';
    default:
      return 'interacted with you';
  }
}

export default function Notifications() {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // Silent fail for single notification
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Notifications</h1>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card p-4 animate-pulse flex items-center gap-3">
              <div className="w-9 h-9 rounded-full skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 skeleton" />
                <div className="h-3 w-24 skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-sm text-pulse-600 dark:text-pulse-400 hover:underline font-medium"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={28} className="text-surface-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white mb-2">No notifications yet</h3>
          <p className="text-sm text-surface-500">When someone interacts with you, you'll see it here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`card p-4 flex items-center gap-3 transition-all cursor-pointer ${
                !notification.read ? 'bg-pulse-50/50 dark:bg-pulse-900/10 border-pulse-200 dark:border-pulse-800' : ''
              }`}
              onClick={() => !notification.read && handleMarkRead(notification.id)}
            >
              <NotificationIcon type={notification.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-surface-700 dark:text-surface-200">
                  <Link
                    to={`/profile/${notification.actor?.username}`}
                    className="font-semibold hover:underline"
                  >
                    {notification.actor?.name}
                  </Link>
                  {' '}{notificationText(notification)}
                  {notification.post && (
                    <span className="text-surface-400 ml-1 truncate inline-block max-w-[200px] align-bottom">
                      "{notification.post.content.slice(0, 40)}..."
                    </span>
                  )}
                </p>
                <p className="text-xs text-surface-400 mt-0.5">{timeAgo(notification.createdAt)}</p>
              </div>
              {!notification.read && (
                <div className="w-2.5 h-2.5 bg-pulse-500 rounded-full shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
