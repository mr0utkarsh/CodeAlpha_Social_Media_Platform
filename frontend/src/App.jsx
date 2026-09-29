import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import AppLayout from './components/Layout/AppLayout';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-pulse-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-pulse-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? <Navigate to="/" /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/landing" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><AppLayout><Home /></AppLayout></ProtectedRoute>} />
      <Route path="/post/:id" element={<ProtectedRoute><AppLayout><PostDetail /></AppLayout></ProtectedRoute>} />
      <Route path="/profile/:username" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
      <Route path="/settings/profile" element={<ProtectedRoute><AppLayout><EditProfile /></AppLayout></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><AppLayout><Explore /></AppLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><AppLayout><Notifications /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
