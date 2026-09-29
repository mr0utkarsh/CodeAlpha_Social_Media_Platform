const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('pulse_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('pulse_token', token);
    } else {
      localStorage.removeItem('pulse_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('pulse_token');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || 'Request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  // Auth
  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Users
  getUser(username) {
    return this.request(`/users/${username}`);
  }

  updateUser(data) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  searchUsers(query) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  getSuggestedUsers() {
    return this.request('/users/suggested');
  }

  followUser(username) {
    return this.request(`/users/${username}/follow`, { method: 'POST' });
  }

  unfollowUser(username) {
    return this.request(`/users/${username}/follow`, { method: 'DELETE' });
  }

  // Posts
  getFeed(page = 1) {
    return this.request(`/posts/feed?page=${page}`);
  }

  getTrendingPosts() {
    return this.request('/posts/trending');
  }

  getUserPosts(username) {
    return this.request(`/posts/user/${username}`);
  }

  getPost(id) {
    return this.request(`/posts/${id}`);
  }

  createPost(data) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  deletePost(id) {
    return this.request(`/posts/${id}`, { method: 'DELETE' });
  }

  // Likes
  likePost(id) {
    return this.request(`/posts/${id}/like`, { method: 'POST' });
  }

  unlikePost(id) {
    return this.request(`/posts/${id}/like`, { method: 'DELETE' });
  }

  // Comments
  getComments(postId) {
    return this.request(`/posts/${postId}/comments`);
  }

  addComment(postId, content) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  deleteComment(id) {
    return this.request(`/comments/${id}`, { method: 'DELETE' });
  }

  // Notifications
  getNotifications() {
    return this.request('/notifications');
  }

  markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, { method: 'PUT' });
  }

  markAllNotificationsRead() {
    return this.request('/notifications/read-all', { method: 'PUT' });
  }
}

const api = new ApiClient();
export default api;
