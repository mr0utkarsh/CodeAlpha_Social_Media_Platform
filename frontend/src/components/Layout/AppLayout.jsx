import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Compass, Bell, User, Settings, LogOut, Menu, X,
  Heart, Zap, Moon, Sun, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const isActive = (path) => location.pathname === path;

  const ProfileNavItem = () => (
    <Link
      to={`/profile/${user?.username}`}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        location.pathname.includes('/profile/') && location.pathname.includes(user?.username)
          ? 'bg-pulse-50 dark:bg-pulse-900/20 text-pulse-700 dark:text-pulse-400'
          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
      }`}
    >
      <User size={20} />
      <span className="font-medium text-sm">Profile</span>
    </Link>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 fixed h-full border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 px-4 py-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 px-3 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-pulse-500 to-pulse-700 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">PULSE</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-pulse-50 dark:bg-pulse-900/20 text-pulse-700 dark:text-pulse-400 font-semibold'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
              {item.label === 'Notifications' && (
                <span className="ml-auto w-2 h-2 bg-pulse-500 rounded-full" />
              )}
            </Link>
          ))}
          <ProfileNavItem />
        </nav>

        {/* Bottom section */}
        <div className="space-y-2 pt-4 border-t border-surface-200 dark:border-surface-800">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all w-full"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all w-full"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Log out</span>
          </button>

          {/* User info */}
          {user && (
            <Link to={`/profile/${user.username}`} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
              <img
                src={user.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${user.username}`}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-surface-500 truncate">@{user.username}</p>
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pulse-500 to-pulse-700 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-lg font-bold text-surface-900 dark:text-white">PULSE</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} className="text-surface-600 dark:text-surface-400" /> : <Moon size={18} className="text-surface-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} className="text-surface-600 dark:text-surface-400" /> : <Menu size={20} className="text-surface-600 dark:text-surface-400" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-14 left-0 right-0 bg-white dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 px-4 py-4 shadow-lg"
          >
            {user && (
              <Link
                to={`/profile/${user.username}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-surface-50 dark:bg-surface-900"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${user.username}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm text-surface-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-surface-500">@{user.username}</p>
                </div>
              </Link>
            )}
            <button
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-t border-surface-200 dark:border-surface-800">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'text-pulse-600 dark:text-pulse-400'
                  : 'text-surface-400 dark:text-surface-500'
              }`}
            >
              <item.icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
          <Link
            to={`/profile/${user?.username}`}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
              location.pathname.includes('/profile/')
                ? 'text-pulse-600 dark:text-pulse-400'
                : 'text-surface-400 dark:text-surface-500'
            }`}
          >
            <User size={22} />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
