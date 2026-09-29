import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Heart, MessageCircle, Users, Compass, Shield } from 'lucide-react';

const features = [
  { icon: Heart, title: 'Share Moments', desc: 'Post your thoughts, stories, and creative work with your community.' },
  { icon: MessageCircle, title: 'Engage & Discuss', desc: 'Comment, like, and have meaningful conversations that matter.' },
  { icon: Users, title: 'Build Your Network', desc: 'Follow creators, connect with like-minded people, grow your circle.' },
  { icon: Compass, title: 'Discover New Voices', desc: 'Explore trending content and find creators who inspire you.' },
  { icon: Shield, title: 'Your Privacy Matters', desc: 'Full control over your data and who sees your content.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Built for speed with a clean, modern interface that stays out of your way.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 to-white dark:from-surface-950 dark:to-surface-900">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-surface-950/70 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-800/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-pulse-500 to-pulse-700 rounded-xl flex items-center justify-center shadow-lg shadow-pulse-500/20">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">PULSE</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Log in</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pulse-50 dark:bg-pulse-900/30 text-pulse-700 dark:text-pulse-300 text-sm font-medium mb-6">
              <Zap size={14} />
              <span>The social platform for creators</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-[1.1] mb-6">
              Share what<br />
              <span className="bg-gradient-to-r from-pulse-600 to-purple-600 bg-clip-text text-transparent">moves you.</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join a community of thinkers, creators, and dreamers. Share your stories, discover new perspectives, and connect with people who inspire you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-3.5">
                Create your account
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preview mockup */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="card overflow-hidden shadow-2xl shadow-pulse-500/5 border-surface-200 dark:border-surface-700"
          >
            <div className="bg-surface-100 dark:bg-surface-900 p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mock posts */}
                {[
                  { name: 'Aria Chen', handle: 'aria_creates', content: 'Just shipped a new feature using React Server Components. The DX improvement is incredible.', likes: 24, comments: 8 },
                  { name: 'Marcus Webb', handle: 'marcusw', content: 'Hot take: The best code is the code you don\'t write. Every line is a liability.', likes: 42, comments: 15 },
                  { name: 'Luna Patel', handle: 'luna.codes', content: 'Accessibility isn\'t a feature — it\'s a requirement. Just published a guide on building inclusive interfaces.', likes: 38, comments: 12 },
                ].map((post, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-white dark:bg-surface-800 rounded-xl p-5 border border-surface-200 dark:border-surface-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pulse-400 to-purple-500" />
                      <div>
                        <p className="text-sm font-semibold text-surface-900 dark:text-white">{post.name}</p>
                        <p className="text-xs text-surface-500">@{post.handle}</p>
                      </div>
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-300 mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-surface-400 text-xs">
                      <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={14} /> {post.comments}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Everything you need to connect
            </h2>
            <p className="text-surface-500 dark:text-surface-400 text-lg max-w-2xl mx-auto">
              Built with care for the best social experience possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-pulse-50 dark:bg-pulse-900/30 flex items-center justify-center mb-4">
                  <feature.icon size={22} className="text-pulse-600 dark:text-pulse-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Ready to find your pulse?
            </h2>
            <p className="text-surface-500 dark:text-surface-400 text-lg mb-8">
              Join thousands of creators sharing what moves them.
            </p>
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 inline-block">
              Get started — it's free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-800 px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-pulse-500 to-pulse-700 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-surface-900 dark:text-white">PULSE</span>
          </div>
          <p className="text-sm text-surface-500">© 2026 PULSE. Share what moves you.</p>
        </div>
      </footer>
    </div>
  );
}
