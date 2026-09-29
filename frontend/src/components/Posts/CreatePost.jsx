import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/api';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const toast = useToast();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const maxLength = 2000;
  const charCount = content.length;
  const isOverLimit = charCount > maxLength;
  const canPost = content.trim().length > 0 && !isOverLimit && !loading;

  const handleSubmit = async () => {
    if (!canPost) return;
    setLoading(true);
    try {
      const post = await api.createPost({ content: content.trim(), image: image.trim() || null });
      toast.success('Post published!');
      setContent('');
      setImage('');
      setShowImageInput(false);
      onPostCreated?.(post);
    } catch (err) {
      toast.error(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canPost) {
      handleSubmit();
    }
  };

  return (
    <div className={`card transition-all duration-200 ${focused ? 'ring-2 ring-pulse-500/20 border-pulse-300 dark:border-pulse-700' : ''}`}>
      <div className="p-4">
        <div className="flex gap-3">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.0/persona/svg?seed=${user?.username}`}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover shrink-0 mt-1"
          />
          <div className="flex-1 min-w-0">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?"
              rows={focused || content ? 3 : 2}
              className="w-full resize-none border-none outline-none bg-transparent text-surface-900 dark:text-surface-100 placeholder-surface-400 text-[15px] leading-relaxed"
              maxLength={maxLength + 100}
            />

            {showImageInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2"
              >
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Paste image URL..."
                  className="input text-sm py-2"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-surface-100 dark:border-surface-800/50">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowImageInput(!showImageInput)}
            className={`p-2 rounded-lg transition-colors ${
              showImageInput ? 'bg-pulse-50 dark:bg-pulse-900/30 text-pulse-600' : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400'
            }`}
            title="Add image"
          >
            <ImagePlus size={18} />
          </button>
          {charCount > 0 && (
            <span className={`text-xs ml-2 ${isOverLimit ? 'text-red-500' : charCount > maxLength * 0.9 ? 'text-amber-500' : 'text-surface-400'}`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!canPost}
          className="btn-primary text-sm px-5 py-2 flex items-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send size={14} />
              <span>Post</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
