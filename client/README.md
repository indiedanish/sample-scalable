# Video Platform Frontend

A modern, responsive video platform frontend built with React 18, Vite, TailwindCSS, and shadcn/ui components. This application provides a complete video streaming experience with role-based access control, video uploads, comments, and ratings.

## 🚀 Features

### User Management
- **Consumer Registration**: Self-service account creation
- **Role-based Authentication**: Consumer, Creator, and Admin roles
- **JWT Token Management**: Secure authentication with localStorage
- **Protected Routes**: Role-based access control

### Video Features
- **Video Streaming**: HTML5 video player with custom controls
- **Video Upload**: Drag & drop upload with progress indication
- **Video Management**: Edit, delete, and organize content
- **Search & Filter**: Advanced video discovery
- **Responsive Grid**: Mobile-first video browsing

### Social Features
- **Comments System**: Interactive commenting on videos
- **Star Ratings**: 5-star rating system with statistics
- **User Profiles**: Creator information and avatars

### Admin Features
- **User Management**: Create creator accounts
- **Analytics Dashboard**: Platform statistics
- **Content Moderation**: Video management across the platform

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form with validation
- **Icons**: Lucide React
- **State Management**: React Context API
- **Authentication**: JWT tokens
- **API Integration**: Fetch API with custom hooks

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── layout/             # Layout components
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── features/
│   │   ├── auth/
│   │   │   └── components/     # Login/Signup forms
│   │   ├── videos/
│   │   │   └── components/     # Video-related components
│   │   └── users/
│   │       └── components/     # User management components
│   ├── hooks/
│   │   └── use-toast.js        # Toast notification hook
│   ├── lib/
│   │   ├── api.js              # API integration
│   │   ├── auth.js             # Authentication utilities
│   │   └── utils.js            # Utility functions
│   ├── pages/                  # Page components
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:3001

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication & Roles

### User Roles

1. **CONSUMER**
   - Sign up directly through the registration form
   - View public videos
   - Comment and rate videos
   - Basic dashboard access

2. **CREATOR**
   - Account created by administrators
   - Upload and manage videos
   - View analytics dashboard
   - All consumer permissions

3. **ADMIN**
   - Create creator accounts
   - Manage all users
   - Full platform access
   - View comprehensive analytics

### Demo Accounts

The application includes demo credentials for testing:

- **Admin**: admin@example.com / password123
- **Creator**: creator@example.com / password123
- **Consumer**: user@example.com / password123

## 🎨 UI Components

The application uses shadcn/ui components for a consistent design system:

- **Forms**: Input, Label, Button with validation
- **Layout**: Card, Badge, Avatar components
- **Navigation**: Responsive navbar with role-based menus
- **Feedback**: Toast notifications and loading states
- **Data Display**: Video cards, user lists, statistics

## 📱 Responsive Design

- **Mobile-first approach** with TailwindCSS
- **Responsive navigation** with mobile hamburger menu
- **Adaptive video grid** that works on all screen sizes
- **Touch-friendly controls** for mobile video playback

## 🔌 API Integration

The frontend integrates with the backend API through a centralized API layer:

```javascript
// Example API usage
import { getVideos, uploadVideo } from '@/lib/api';

// Fetch videos with filters
const videos = await getVideos({ 
  search: 'react', 
  page: 1, 
  limit: 10 
});

// Upload a new video
const result = await uploadVideo(file, title, description);
```

### API Features

- **Automatic token handling** for authenticated requests
- **Error handling** with user-friendly messages
- **Request/response interceptors** for consistency
- **Loading states** and progress indication

## 🎥 Video Features

### Video Player
- **HTML5 video player** with custom controls
- **Streaming support** from Azure Blob Storage
- **Fullscreen mode** and volume controls
- **Seek functionality** with progress bar
- **Responsive design** for all devices

### Video Upload
- **Drag & drop interface** for easy file selection
- **Progress indication** during upload
- **File validation** for supported formats
- **Metadata input** (title, description, privacy)

### Video Management
- **Grid view** with thumbnail previews
- **Search and filtering** capabilities
- **Edit/delete actions** for authorized users
- **Privacy controls** (public/private)

## 💬 Comments & Ratings

### Comments System
- **Real-time commenting** on videos
- **User attribution** with avatars
- **Timestamp display** for all comments
- **Responsive comment threads**

### Rating System
- **5-star rating interface**
- **Average rating calculation**
- **Rating distribution charts**
- **User feedback collection**

## 🔍 Search & Discovery

### Advanced Search
- **Text-based search** across video titles and descriptions
- **Filter by duration** (min/max seconds)
- **Date range filtering**
- **Creator-specific filtering**

### Pagination
- **Efficient data loading** with pagination
- **Page size controls**
- **Smooth navigation** between pages
- **URL state preservation**

## 📊 Analytics Dashboard

### User Dashboard
- **Latest videos grid**
- **Quick action cards**
- **Role-specific content**

### Creator/Admin Dashboard
- **Video upload statistics**
- **User growth metrics**
- **Platform overview**
- **Monthly summaries**

## 🎯 Performance Optimizations

- **Code splitting** with React.lazy
- **Image optimization** and lazy loading
- **Efficient re-renders** with React.memo
- **Minimal bundle size** with Vite
- **Caching strategies** for API responses

## 🧪 Testing

The application is built with testing in mind:

- **Component isolation** for easy unit testing
- **Custom hooks** for testable business logic
- **Mock API responses** for development
- **Error boundary** components for graceful failures

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=VideoStream
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with shadcn/ui integration:

```javascript
// tailwind.config.js
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        // ... other custom colors
      }
    }
  }
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Options

1. **Static Hosting**: Netlify, Vercel, GitHub Pages
2. **CDN**: CloudFront, CloudFlare
3. **Container**: Docker with Nginx
4. **Server**: Node.js with serve

### Environment-specific Builds

Configure different API endpoints for different environments:

```javascript
// vite.config.js
export default defineConfig({
  define: {
    __API_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? 'https://api.yoursite.com'
        : 'http://localhost:3001'
    )
  }
})
```

## 🔒 Security Considerations

- **JWT token expiration** handling
- **XSS protection** with input sanitization
- **CORS configuration** for API requests
- **Role-based access control** on all routes
- **File upload validation** for security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the [GitHub Issues](link-to-issues)
2. Review the API documentation
3. Contact the development team

---

Built with ❤️ using React, Vite, and TailwindCSS 