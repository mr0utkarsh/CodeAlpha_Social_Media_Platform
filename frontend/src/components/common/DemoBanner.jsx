import { motion } from 'framer-motion';
import { Info, ExternalLink } from 'lucide-react';

export default function DemoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 p-4 mb-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
          <Info size={16} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
            🎨 Demo Mode — UI Preview
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            Ye GitHub Pages deployment hai — yahan sirf UI dikhaya gaya hai. Full working app (login, posts, likes, comments) ke liye backend chahiye.
          </p>
          <a
            href="https://github.com/mr0utkarsh/CodeAlpha_Social_Media_Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline"
          >
            <ExternalLink size={12} />
            GitHub repo — setup instructions yahan hain
          </a>
        </div>
      </div>
    </motion.div>
  );
}
