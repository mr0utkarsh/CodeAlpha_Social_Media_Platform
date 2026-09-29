import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Moon, Sun, LogOut, Shield, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/landing');
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Account section */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-100 dark:border-surface-800/50">
            <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider">Account</h2>
          </div>

          <div className="divide-y divide-surface-100 dark:divide-surface-800/50">
            {/* Profile */}
            <Link
              to="/settings/profile"
              className="flex items-center gap-3 px-5 py-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-pulse-50 dark:bg-pulse-900/20 flex items-center justify-center">
                <User size={17} className="text-pulse-600 dark:text-pulse-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-surface-900 dark:text-white">Edit Profile</p>
                <p className="text-xs text-surface-500">Update your name, username, bio, and avatar</p>
              </div>
            </Link>

            {/* Current user info */}
            <div className="flex items-center gap-3 px-5 py-4">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${user?.username}`}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-surface-500">@{user?.username} · {user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-100 dark:border-surface-800/50">
            <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider">Appearance</h2>
          </div>

          <div className="divide-y divide-surface-100 dark:divide-surface-800/50">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  {theme === 'dark' ? <Moon size={17} className="text-amber-600 dark:text-amber-400" /> : <Sun size={17} className="text-amber-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">Dark Mode</p>
                  <p className="text-xs text-surface-500">{theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  theme === 'dark' ? 'bg-pulse-600' : 'bg-surface-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    theme === 'dark' ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                  style={{ transform: theme === 'dark' ? 'translateX(26px)' : 'translateX(2px)' }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-100 dark:border-surface-800/50">
            <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider">About</h2>
          </div>

          <div className="divide-y divide-surface-100 dark:divide-surface-800/50">
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <Info size={17} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">PULSE v1.0</p>
                <p className="text-xs text-surface-500">Share what moves you.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                <Shield size={17} className="text-surface-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">CodeAlpha Internship</p>
                <p className="text-xs text-surface-500">Full Stack Development — Task 2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="card w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
            <LogOut size={17} className="text-red-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-red-500">Log Out</p>
            <p className="text-xs text-surface-500">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
}
