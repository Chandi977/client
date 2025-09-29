# ⚡ VideoTube Client - YouTube Clone Frontend

A modern, responsive React frontend application for the VideoTube YouTube clone platform. Built with React 18 and Vite for optimal performance, this client provides an intuitive and engaging user interface for video streaming, content management, and social interactions.

## ✨ Features

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Frontend-orange?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

### User Interface & Experience

- 🎨 **Modern Design System** - Clean, contemporary UI with responsive layouts
- 📱 **Mobile-First Responsive** - Seamless experience across all devices and screen sizes
- ⚡ **Lightning Fast** - Vite-powered development with Hot Module Replacement (HMR)
- 🎯 **Intuitive Navigation** - User-friendly interface following YouTube design patterns
- 🌙 **Theme Support** - Ready for dark/light mode implementation

### Core Functionality (Planned/In Development)

- 🔐 **Authentication UI** - Login, registration, and profile management interfaces
- 📹 **Video Player** - Custom video player with full playback controls
- 🎬 **Video Gallery** - Grid and list layouts for video browsing
- 👤 **User Profiles** - Channel pages with customizable layouts
- 🔍 **Search Interface** - Advanced search with filtering capabilities
- 💬 **Comment System** - Interactive commenting and reply interfaces
- 👍 **Engagement UI** - Like, dislike, and subscription interaction components
- 📋 **Playlist Management** - Create and organize video collection interfaces
- 📊 **Creator Dashboard** - Analytics and content management interface
- 🎛️ **Settings Panel** - User preferences and account management

### Technical Features

- 🔄 **Real-time Updates** - Dynamic content loading and state management
- 📤 **File Upload Interface** - Drag-and-drop video and thumbnail uploads
- 🎮 **Interactive Controls** - Advanced video player customization
- 📲 **Social Integration** - Share functionality and social features
- 🔔 **Notification System** - In-app notifications and alerts
- ⚙️ **Performance Optimized** - Code splitting and lazy loading implementation

## 📸 Screenshots

<img alt="Home Page" src="https://github.com/user-attachments/assets/bcb89e51-688a-4f87-91ab-26630d95d6c1" width="49%">
<img alt="Search Results" src="https://github.com/user-attachments/assets/1341026b-ed3e-4d00-bc5a-be7bf7fe4309" width="49%">
<img alt="Video Watch Page" src="https://github.com/user-attachments/assets/e7a77227-a1b1-444a-8a93-00b4b3f103fe" width="49%">
<img alt="Channel Page" src="https://github.com/user-attachments/assets/59d62d3a-70ac-41e5-998c-47a9a89e00eb" width="49%">
<img alt="Creator Dashboard" src="https://github.com/user-attachments/assets/54c9b927-8b1f-4f7f-9e5c-dd885ace8e38" width="49%">
<img alt="Liked Videos" src="https://github.com/user-attachments/assets/59e9c6c1-0fb4-4b59-88a8-d13d78c6f318" width="49%">
<img alt="Login Page" src="https://github.com/user-attachments/assets/1027e38d-d771-47f7-a5f6-1a06fbe4d9da" width="49%">
<img alt="Sign Up Page" src="https://github.com/user-attachments/assets/3aef1a6a-25a0-48ee-84a4-3077a249a38a" width="49%">
<img alt="Video Upload" src="https://github.com/user-attachments/assets/90773e2d-0a9c-41f8-b1c6-892af735ca38" width="49%">
<img alt="User Library" src="https://github.com/user-attachments/assets/1fa06161-fb37-4e21-b33e-a6959b37b1ca" width="49%">

## 🛠️ Tech Stack

### Core Technologies

- **React 18** - Latest React with concurrent features and improved performance
- **Vite** - Next-generation frontend build tool for faster development
- **JavaScript (ES6+)** - Modern JavaScript with latest ECMAScript features
- **CSS3** - Modern styling with Flexbox, Grid, and CSS custom properties
- **HTML5** - Semantic markup with accessibility best practices

### Development Tools & Configuration

- **ESLint** - Code quality enforcement and consistent coding standards
- **Vite HMR** - Hot Module Replacement for instant development feedback
- **@vitejs/plugin-react** - Official React plugin for Vite (using Babel)
- **React DevTools** - Browser extensions for React debugging
- **VS Code Integration** - Optimized development environment setup

### Future Integration Plans

- **React Router v6** - Client-side routing and navigation
- **Axios/Fetch API** - HTTP client for backend communication
- **React Query/TanStack Query** - Server state management and caching
- **React Hook Form** - Form handling and validation
- **Framer Motion** - Animation library for smooth transitions
- **React Context API** - Global state management
- **React Helmet** - Dynamic head management for SEO

## 📁 Project Structure

Based on the repository analysis, here's the recommended project organization for the React frontend:

```
client/
├── public/                       # Static assets
│   ├── index.html               # Main HTML template
│   ├── favicon.ico              # App favicon
│   ├── logo.svg                 # App logo
│   ├── manifest.json            # PWA manifest (future)
│   └── robots.txt               # SEO crawler instructions
├── src/                         # Source code directory
│   ├── components/              # Reusable UI components
│   │   ├── common/             # Shared components
│   │   │   ├── Header/         # Navigation header component
│   │   │   ├── Footer/         # Site footer component
│   │   │   ├── Sidebar/        # Navigation sidebar
│   │   │   ├── Modal/          # Modal dialog components
│   │   │   ├── Button/         # Custom button variants
│   │   │   ├── Input/          # Form input components
│   │   │   ├── Loader/         # Loading indicators
│   │   │   └── ErrorBoundary/  # Error handling wrapper
│   │   ├── video/              # Video-related components
│   │   │   ├── VideoPlayer/    # Custom video player
│   │   │   ├── VideoCard/      # Video thumbnail cards
│   │   │   ├── VideoList/      # Video listing component
│   │   │   ├── VideoUpload/    # Upload interface
│   │   │   ├── VideoForm/      # Video metadata form
│   │   │   └── VideoStats/     # Views, likes display
│   │   ├── user/               # User-related components
│   │   │   ├── ProfileCard/    # User profile display
│   │   │   ├── AuthForm/       # Login/register forms
│   │   │   ├── UserSettings/   # Profile settings interface
│   │   │   ├── ChannelPage/    # Channel layout component
│   │   │   └── SubscribeButton/ # Subscription toggle
│   │   ├── comment/            # Comment system components
│   │   │   ├── CommentList/    # Comments display
│   │   │   ├── CommentForm/    # Add comment form
│   │   │   ├── CommentItem/    # Individual comment
│   │   │   └── CommentReply/   # Reply functionality
│   │   └── dashboard/          # Creator dashboard components
│   │       ├── AnalyticsCard/  # Statistics display
│   │       ├── VideoManager/   # Content management
│   │       └── UploadForm/     # Content upload interface
│   ├── pages/                  # Top-level page components
│   │   ├── Home/               # Landing/homepage
│   │   ├── Watch/              # Video watching page
│   │   ├── Search/             # Search results page
│   │   ├── Channel/            # Channel profile page
│   │   ├── Upload/             # Video upload page
│   │   ├── Dashboard/          # Creator dashboard
│   │   ├── Settings/           # User settings page
│   │   ├── Auth/               # Authentication pages
│   │   └── NotFound/           # 404 error page
│   ├── hooks/                  # Custom React hooks (future)
│   │   ├── useAuth.js          # Authentication logic
│   │   ├── useApi.js           # API communication
│   │   ├── useLocalStorage.js  # Local storage management
│   │   ├── useDebounce.js      # Input debouncing
│   │   └── useVideoPlayer.js   # Video player controls
│   ├── context/                # React Context providers (future)
│   │   ├── AuthContext.js      # User authentication state
│   │   ├── ThemeContext.js     # UI theme management
│   │   └── VideoContext.js     # Video playback state
│   ├── utils/                  # Utility functions
│   │   ├── api.js              # API configuration
│   │   ├── constants.js        # App constants
│   │   ├── helpers.js          # Helper functions
│   │   ├── formatters.js       # Data formatting utilities
│   │   └── validators.js       # Input validation functions
│   ├── styles/                 # CSS and styling files
│   │   ├── index.css           # Global styles
│   │   ├── variables.css       # CSS custom properties
│   │   ├── components/         # Component-specific styles
│   │   └── responsive.css      # Media queries
│   ├── assets/                 # Static assets
│   │   ├── images/             # Image files
│   │   ├── icons/              # SVG icons and symbols
│   │   └── fonts/              # Custom font files
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global CSS imports
├── .eslintrc.cjs               # ESLint configuration
├── .gitignore                  # Git ignore rules
├── index.html                  # Vite HTML template
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Dependency lock file
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (>=16.0.0) - JavaScript runtime
- **npm** (>=8.0.0) or **yarn** (>=1.22.0) - Package manager
- **Git** - Version control system
- **Modern Browser** - Chrome, Firefox, Safari, or Edge

### Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/Chandi977/client.git
cd client
```

2. **Install dependencies**

```bash
npm install
# or if using yarn
yarn install
```

3. **Environment Configuration**

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=10000

# Application Settings
VITE_APP_NAME=VideoTube
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=YouTube Clone Frontend Application

# Development Configuration
VITE_DEV_MODE=true
VITE_SHOW_DEBUG_INFO=true

# Feature Flags (for future features)
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PWA=false

# External Services (when implemented)
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Analytics (future implementation)
VITE_GOOGLE_ANALYTICS_ID=your_ga_tracking_id
VITE_ENABLE_ANALYTICS=false
```

4. **Start the development server**

```bash
npm run dev
# or with yarn
yarn dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality check
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

## 🎨 Component Development

### Basic Component Structure

Here's the recommended structure for creating components:

```jsx
// components/video/VideoCard.jsx
import { useState } from "react";
import "./VideoCard.css";

const VideoCard = ({ video, onClick, className = "", showStats = true }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(video);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <article
      className={`video-card ${className}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && handleCardClick()}
    >
      <div className="video-card__thumbnail">
        {!imageLoaded && !imageError && (
          <div className="video-card__thumbnail-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img
          src={video.thumbnail}
          alt={video.title}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        {video.duration && (
          <span className="video-card__duration">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>

      <div className="video-card__content">
        <div className="video-card__header">
          {video.owner?.avatar && (
            <img
              src={video.owner.avatar}
              alt={video.owner.fullName}
              className="video-card__avatar"
            />
          )}
          <div className="video-card__info">
            <h3 className="video-card__title" title={video.title}>
              {video.title}
            </h3>
            <div className="video-card__meta">
              <span className="video-card__channel">
                {video.owner?.fullName || video.owner?.username}
              </span>
              {showStats && (
                <>
                  <span className="video-card__views">
                    {formatViews(video.views)} views
                  </span>
                  <span className="video-card__date">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
```

### Component Styling Example

```css
/* components/video/VideoCard.css */
.video-card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.video-card:focus {
  outline: 2px solid #ff0000;
  outline-offset: 2px;
}

.video-card__thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #f0f0f0;
  overflow: hidden;
}

.video-card__thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.video-card__thumbnail-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.video-card__duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.video-card__content {
  padding: 12px;
}

.video-card__header {
  display: flex;
  gap: 12px;
}

.video-card__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.video-card__info {
  flex: 1;
  min-width: 0;
}

.video-card__title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: #030303;
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-card__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: #606060;
}

.video-card__channel {
  font-weight: 400;
}

.video-card__views,
.video-card__date {
  font-weight: 400;
}

/* Loading spinner */
.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #ff0000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .video-card {
    flex-direction: row;
    height: 94px;
  }

  .video-card__thumbnail {
    width: 168px;
    height: 94px;
    aspect-ratio: 16/9;
    flex-shrink: 0;
  }

  .video-card__content {
    padding: 8px 12px;
    flex: 1;
  }

  .video-card__header {
    gap: 8px;
  }

  .video-card__avatar {
    display: none;
  }

  .video-card__title {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }

  .video-card__meta {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .video-card__thumbnail {
    width: 120px;
    height: 68px;
  }

  .video-card {
    height: 68px;
  }

  .video-card__title {
    font-size: 12px;
    -webkit-line-clamp: 1;
  }
}
```

## 🔧 Configuration Files

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  // Development server configuration
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true,
  },

  // Build configuration
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          utils: ["axios", "lodash"],
        },
      },
    },
  },

  // Path aliases for cleaner imports
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@pages": resolve(__dirname, "src/pages"),
      "@utils": resolve(__dirname, "src/utils"),
      "@assets": resolve(__dirname, "src/assets"),
      "@styles": resolve(__dirname, "src/styles"),
    },
  },

  // CSS configuration
  css: {
    modules: {
      localsConvention: "camelCase",
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
```

### ESLint Configuration

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["react", "react-hooks", "jsx-a11y", "react-refresh"],
  rules: {
    // React specific rules
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "warn",
    "react/jsx-no-target-blank": "error",
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "error",

    // React hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // General JavaScript rules
    "no-unused-vars": "warn",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "prefer-const": "error",
    "no-var": "error",

    // Accessibility rules
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/img-redundant-alt": "warn",
    "jsx-a11y/aria-role": "error",

    // Hot reload
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
```

## 🎯 Development Guidelines

### Component Best Practices

1. **Functional Components with Hooks**

```jsx
// ✅ Good: Use functional components
const VideoPlayer = ({ src, autoplay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <video src={src} autoPlay={autoplay} />
  );
};

// ❌ Avoid: Class components for new development
class VideoPlayer extends Component { ... }
```

2. **Props Validation and Default Values**

```jsx
// ✅ Good: Define prop types and defaults
const VideoCard = ({
  video,
  onClick = () => {},
  showStats = true,
  className = "",
}) => {
  // Component logic
};

// Add PropTypes in development
VideoCard.propTypes = {
  video: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  showStats: PropTypes.bool,
  className: PropTypes.string,
};
```

3. **Custom Hooks for Logic Reuse**

```jsx
// hooks/useVideoPlayer.js
const useVideoPlayer = (videoRef) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  return {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
  };
};
```

### File Organization

```jsx
// ✅ Good: Organized imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Internal components
import VideoCard from "@components/video/VideoCard";
import LoadingSpinner from "@components/common/LoadingSpinner";

// Utils and helpers
import { formatDuration, formatViews } from "@utils/formatters";
import { videoService } from "@utils/api";

// Styles
import "./VideoList.css";
```

### State Management Patterns

```jsx
// ✅ Good: Use useReducer for complex state
const initialState = {
  videos: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

const videoReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        videos: [...state.videos, ...action.payload],
        hasMore: action.payload.length > 0,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const VideoList = () => {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  // Component logic
};
```

## 🚀 Performance Optimization

### Code Splitting and Lazy Loading

```jsx
// App.jsx - Route-based code splitting
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingSpinner from "@components/common/LoadingSpinner";

// Lazy load page components
const Home = lazy(() => import("@pages/Home"));
const Watch = lazy(() => import("@pages/Watch"));
const Upload = lazy(() => import("@pages/Upload"));
const Dashboard = lazy(() => import("@pages/Dashboard"));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### Image Optimization

```jsx
// components/common/OptimizedImage.jsx
import { useState, useRef, useEffect } from "react";

const OptimizedImage = ({
  src,
  alt,
  placeholder = "/placeholder.jpg",
  className = "",
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef();

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`optimized-image ${className}`}>
      <img
        src={inView ? src : placeholder}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0.7,
          transition: "opacity 0.3s ease",
        }}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
```

### Virtual Scrolling for Large Lists

```jsx
// hooks/useVirtualList.js
import { useState, useEffect, useMemo } from "react";

export const useVirtualList = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, start + visibleCount + overscan),
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items
      .slice(visibleRange.start, visibleRange.end)
      .map((item, index) => ({
        ...item,
        index: visibleRange.start + index,
      }));
  }, [items, visibleRange]);

  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    offsetY: visibleRange.start * itemHeight,
    onScroll: (e) => setScrollTop(e.target.scrollTop),
  };
};
```

## 🧪 Testing Setup

### Component Testing

```jsx
// components/video/__tests__/VideoCard.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import VideoCard from "../VideoCard";

const mockVideo = {
  _id: "1",
  title: "Test Video",
  thumbnail: "https://example.com/thumb.jpg",
  duration: 300,
  views: 1500,
  owner: {
    username: "testuser",
    fullName: "Test User",
    avatar: "https://example.com/avatar.jpg",
  },
  createdAt: "2024-01-01T00:00:00.000Z",
};

describe("VideoCard Component", () => {
  test("renders video information correctly", () => {
    render(<VideoCard video={mockVideo} />);

    expect(screen.getByText("Test Video")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText(/1.5K views/)).toBeInTheDocument();
    expect(screen.getByText("5:00")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<VideoCard video={mockVideo} onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledWith(mockVideo);
  });

  test("handles keyboard navigation", () => {
    const handleClick = vi.fn();
    render(<VideoCard video={mockVideo} onClick={handleClick} />);

    const card = screen.getByRole("button");
    fireEvent.keyPress(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledWith(mockVideo);
  });
});
```

### Test Configuration

```javascript
// vitest.config.js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@utils": resolve(__dirname, "src/utils"),
    },
  },
});
```

## 🚧 Roadmap & Future Development

### Phase 1: Foundation Setup (Current)

- [x] **Vite + React Setup** - Basic development environment
- [x] **ESLint Configuration** - Code quality enforcement
- [ ] **Router Integration** - React Router v6 implementation
- [ ] **API Integration** - Axios setup with backend communication
- [ ] **Basic Components** - Core UI components development
- [ ] **Authentication UI** - Login and registration interfaces

### Phase 2: Core Features (Next 2-4 weeks)

- [ ] **Video Player** - Custom video player with controls
- [ ] **Video Gallery** - Home page video listing
- [ ] **Search Interface** - Search functionality with filters
- [ ] **User Profiles** - Channel pages and user management
- [ ] **Upload Interface** - Video upload with progress tracking
- [ ] **Responsive Design** - Mobile-first responsive layouts

### Phase 3: Social Features (4-6 weeks)

- [ ] **Comment System** - Video comments and replies
- [ ] **Like/Dislike System** - Engagement features
- [ ] **Subscription System** - Channel following
- [ ] **Playlist Management** - Create and manage playlists
- [ ] **Dashboard** - Creator analytics and management
- [ ] **Real-time Updates** - WebSocket integration

### Phase 4: Advanced Features (6-8 weeks)

- [ ] **PWA Implementation** - Progressive Web App features
- [ ] **Dark Mode** - Theme switching functionality
- [ ] **Video Editing** - Basic in-browser editing tools
- [ ] **Live Streaming** - Real-time streaming interface
- [ ] **Advanced Search** - AI-powered search suggestions
- [ ] **Social Sharing** - Share to external platforms

### Phase 5: Performance & Polish (8-10 weeks)

- [ ] **Performance Optimization** - Bundle size and loading improvements
- [ ] **Accessibility Enhancement** - WCAG compliance
- [ ] **SEO Optimization** - Meta tags and structured data
- [ ] **Analytics Integration** - User behavior tracking
- [ ] **Error Tracking** - Comprehensive error monitoring
- [ ] **Testing Coverage** - Unit and integration tests

## 🤝 Contributing

### Development Workflow

1. **Setup Development Environment**

```bash
git clone https://github.com/Chandi977/client.git
cd client
npm install
npm run dev
```

2. **Create Feature Branch**

```bash
git checkout -b feature/video-player
```

3. **Follow Code Standards**

- Use functional components with hooks
- Follow established file structure
- Write tests for new components
- Ensure accessibility compliance
- Update documentation as needed

4. **Submit Pull Request**

- Clear description of changes
- Screenshots for UI changes
- Link to related issues
- Ensure CI/CD passes

### Code Standards

```jsx
// ✅ Component naming: PascalCase
const VideoPlayer = () => { ... };

// ✅ File naming: PascalCase for components
// VideoPlayer.jsx, VideoCard.jsx

// ✅ Hook naming: camelCase starting with 'use'
const useVideoPlayer = () => { ... };

// ✅ Utility naming: camelCase
const formatDuration = () => { ... };

// ✅ Constant naming: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This React frontend application represents a modern approach to building video streaming interfaces. While the backend foundation was inspired by **[Hitesh Choudhary](https://www.youtube.com/@chaiaurcode)** (Chai aur Code), this frontend implementation focuses on:

### Frontend Development Principles

- **Modern React Patterns** - Hooks, functional components, and best practices
- **Performance Optimization** - Code splitting, lazy loading, and efficient rendering
- **User Experience** - Responsive design, accessibility, and intuitive navigation
- **Developer Experience** - Fast development with Vite, ESLint, and modern tooling
- **Code Quality** - Consistent patterns, testing, and maintainable architecture

### Learning Resources

- 📚 **[React Documentation](https://react.dev)** - Official React guides and API reference
- ⚡ **[Vite Guide](https://vitejs.dev/guide/)** - Modern build tool documentation
- 🎨 **[CSS-Tricks](https://css-tricks.com)** - Modern CSS techniques and best practices
- 🎥 **[Chai aur React](https://www.youtube.com/@chaiaurcode)** - React development tutorials
- 🌐 **[MDN Web Docs](https://developer.mozilla.org)** - Comprehensive web development reference

## 📞 Contact & Support

- **Developer:** [Chandi977](https://github.com/Chandi977)
- **Frontend Repository:** [https://github.com/Chandi977/client](https://github.com/Chandi977/client)
- **Backend Repository:** [https://github.com/Chandi977/Youtube-Backend](https://github.com/Chandi977/Youtube-Backend)

### Getting Help

- 🐛 **Bug Reports:** Create detailed issues with reproduction steps
- 💡 **Feature Requests:** Submit enhancement ideas via GitHub issues
- 📧 **Direct Support:** your-email@example.com
- 💬 **Community:** Use GitHub Discussions for questions and ideas

### Project Status

🔄 **Status:** Active Development  
📅 **Last Updated:** December 2024  
🎯 **Current Focus:** Core component development and API integration

---

**⚡ Built with React 18 + Vite | Modern, Fast, and Scalable Frontend Architecture**
