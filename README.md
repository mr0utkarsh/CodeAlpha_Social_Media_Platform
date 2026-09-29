# PULSE — Share What Moves You

<div align="center">

![PULSE](https://img.shields.io/badge/PULSE-Social_Media_Platform-6366f1)
![React](https://img.shields.io/badge/React-18-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-20-339933)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06b6d4)

**A modern, full-stack social media platform built for the CodeAlpha Full Stack Development Internship (Task 2)**

</div>

---

## 📋 Project Overview

PULSE is a premium social media platform that enables users to share their thoughts, connect with others, and discover inspiring content. Built with a modern tech stack and polished UI/UX, it delivers a complete social networking experience with authentication, real-time interactions, and a responsive design that works beautifully across all devices.

**Tagline:** *Share what moves you.*

---

## ✨ Features

### Core Features
- 🔐 **User Authentication** — JWT-based registration and login with secure password hashing (bcrypt)
- 📝 **Posts** — Create, view, and delete posts with optional images
- ❤️ **Likes** — Like/unlike posts with animated interactions and duplicate prevention
- 💬 **Comments** — Add and delete comments on posts
- 👥 **Follow System** — Follow/unfollow users with follower/following counts
- 🔔 **Notifications** — Real-time notifications for likes, comments, and new followers
- 👤 **User Profiles** — Rich profile pages with bio, avatar, and post history
- 🔍 **Explore & Search** — Discover users and trending content
- 🌙 **Dark/Light Theme** — Beautiful theme switching with system preference detection
- 📱 **Fully Responsive** — Mobile-first design with bottom navigation and desktop sidebar

### UI/UX Highlights
- Smooth page transitions with Framer Motion
- Skeleton loading states
- Toast notifications for user feedback
- Optimistic UI updates for likes
- Empty states and error handling
- Confirmation dialogs for destructive actions
- Character counters for posts and bios
- Hover animations and micro-interactions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router 6 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion | Animations & transitions |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express | REST API framework |
| Prisma ORM | Database ORM & migrations |
| SQLite / PostgreSQL | Database |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| CORS | Cross-origin resource sharing |
| dotenv | Environment configuration |

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Landing | Hero section with feature highlights and modern gradient design |
| Login/Register | Split-screen auth pages with validation |
| Home Feed | Post cards with likes, comments, and create-post composer |
| Profile | User info, follower stats, edit button, and user posts |
| Explore | Search users, suggested users grid, trending posts |
| Notifications | Activity feed with like/comment/follow notifications |
| Settings | Account management, theme toggle, logout |

---

## 📁 Project Structure

```
CodeAlpha_Social_Media_Platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (6 models)
│   │   ├── migrations/            # Database migrations
│   │   └── seed.js                # Seed data (10 users, 18 posts, etc.)
│   ├── src/
│   │   ├── index.js               # Express server entry point
│   │   ├── lib/
│   │   │   └── prisma.js          # Prisma client instance
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT authentication middleware
│   │   └── routes/
│   │       ├── auth.js            # Register, login, me
│   │       ├── users.js           # CRUD, follow/unfollow, search
│   │       ├── posts.js           # Feed, trending, like/unlike
│   │       ├── comments.js        # Add, list, delete comments
│   │       └── notifications.js   # List, mark read
│   ├── .env                       # Environment variables
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── favicon.svg            # PULSE brand icon
│   ├── src/
│   │   ├── main.jsx               # App entry point
│   │   ├── App.jsx                # Routes & layout
│   │   ├── index.css              # Tailwind + custom styles
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth state management
│   │   │   ├── ThemeContext.jsx    # Dark/light theme
│   │   │   └── ToastContext.jsx   # Toast notifications
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   └── AppLayout.jsx  # Sidebar + mobile nav
│   │   │   └── Posts/
│   │   │       ├── PostCard.jsx   # Post display component
│   │   │       └── CreatePost.jsx # Post composer
│   │   ├── pages/
│   │   │   ├── Landing.jsx        # Marketing page
│   │   │   ├── Login.jsx          # Login form
│   │   │   ├── Register.jsx       # Registration form
│   │   │   ├── Home.jsx           # Main feed
│   │   │   ├── PostDetail.jsx     # Single post + comments
│   │   │   ├── Profile.jsx        # User profile page
│   │   │   ├── EditProfile.jsx    # Profile editor
│   │   │   ├── Explore.jsx        # Discovery & search
│   │   │   ├── Notifications.jsx  # Activity feed
│   │   │   └── Settings.jsx       # App settings
│   │   └── utils/
│   │       └── api.js             # API client
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm 8+ installed
- PostgreSQL 14+ (optional — SQLite is used by default for development)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CodeAlpha_Social_Media_Platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables (edit .env as needed)
# Default uses SQLite for development

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed

# Start the development server
npm run dev
```

The API server will start on `http://localhost:3001`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

### 4. Access the Application
Open `http://localhost:5173` in your browser. You'll be redirected to the landing page.

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# For PostgreSQL, use:
# DATABASE_URL="postgresql://user:password@localhost:5432/pulse_db"

# JWT Secret (change this in production!)
JWT_SECRET="your_super_secret_jwt_key_here"

# Server port
PORT=3001

# Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

---

## 🗄️ PostgreSQL Setup (Production)

To use PostgreSQL instead of SQLite:

1. Create a PostgreSQL database:
```sql
CREATE DATABASE pulse_db;
```

2. Update `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Update `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pulse_db"
```

4. Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

---

## 🌱 Seed Data

The seed script creates a realistic populated database:

| Data | Count |
|------|-------|
| Users | 10 |
| Posts | 18 |
| Comments | ~56 |
| Likes | ~91 |
| Follow relationships | 39 |
| Notifications | ~100+ |

### Default Login Credentials
```
Email: aria@pulse.dev
Password: password123
```

### Seed Command
```bash
cd backend
npx prisma db seed
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login with email/username |
| GET | `/api/auth/me` | Get current user profile |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:username` | Get user profile |
| PUT | `/api/users/me` | Update own profile |
| GET | `/api/users/search?q=query` | Search users |
| GET | `/api/users/suggested` | Get suggested users |
| POST | `/api/users/:username/follow` | Follow a user |
| DELETE | `/api/users/:username/follow` | Unfollow a user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/feed` | Get feed posts (paginated) |
| GET | `/api/posts/trending` | Get trending posts |
| GET | `/api/posts/user/:username` | Get user's posts |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create new post |
| DELETE | `/api/posts/:id` | Delete own post |
| POST | `/api/posts/:id/like` | Like a post |
| DELETE | `/api/posts/:id/like` | Unlike a post |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/:postId/comments` | Get post comments |
| POST | `/api/posts/:postId/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete own comment |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get all notifications |
| PUT | `/api/notifications/:id/read` | Mark notification as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

---

## 🗃️ Database Schema

### Models
- **User** — id, name, username, email, password, bio, avatar, timestamps
- **Post** — id, content, image, authorId, timestamps
- **Comment** — id, content, postId, authorId, timestamps
- **Like** — id, postId, userId (unique constraint on post+user)
- **Follow** — id, followerId, followingId (unique constraint on pair)
- **Notification** — id, userId, actorId, type, postId, read, timestamps

### Relationships
- User → Posts (one-to-many)
- User → Comments (one-to-many)
- User → Likes (one-to-many)
- Post → Comments (one-to-many)
- Post → Likes (one-to-many)
- User → Follows (many-to-many via Follow table)
- User → Notifications (one-to-many)

---

## 🔮 Future Improvements

- [ ] Real-time updates using WebSockets
- [ ] Image upload (not just URL) with cloud storage
- [ ] Direct messaging between users
- [ ] Post sharing/reposting functionality
- [ ] Hashtag support and topic pages
- [ ] Rich text editor for posts
- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Post pagination with infinite scroll
- [ ] Rate limiting and spam prevention
- [ ] Admin dashboard
- [ ] Analytics and engagement metrics
- [ ] Push notifications
- [ ] Stories/temporary content feature
- [ ] Video post support

---

## 📄 License

This project is created as part of the **CodeAlpha Full Stack Development Internship** — Task 2.

Built with ❤️ by the PULSE team.

---

<div align="center">
  <strong>PULSE — Share what moves you.</strong>
</div>
