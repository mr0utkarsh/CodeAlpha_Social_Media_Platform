import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', bio: '', avatar: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'At least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errs.username = 'Only letters, numbers, and underscores';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const updated = await api.updateUser(form);
      updateUser(updated);
      toast.success('Profile updated!');
      navigate(`/profile/${form.username}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">Edit Profile</h1>

        <div className="card p-6 space-y-6">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={form.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${form.username}`}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-surface-200 dark:ring-surface-700"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-pulse-600 rounded-full flex items-center justify-center border-2 border-white dark:border-surface-900">
                <Camera size={14} className="text-white" />
              </div>
            </div>
            <div>
              <p className="font-medium text-surface-900 dark:text-white text-sm">Profile Photo</p>
              <p className="text-xs text-surface-500 mt-0.5">Enter an image URL below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`input ${errors.name ? 'border-red-400' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">@</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={`input pl-8 ${errors.username ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                maxLength={200}
                className="input resize-none"
                placeholder="Tell people about yourself..."
              />
              <p className="text-xs text-surface-400 mt-1 text-right">{form.bio.length}/200</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Avatar URL</label>
              <input
                type="url"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                className="input"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-surface-400 mt-1">Leave empty for default avatar</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
