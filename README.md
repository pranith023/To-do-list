# TaskMaster Pro - Premium Todo Application

A beautiful, feature-rich todo application built with React, TypeScript, and Firebase. Features real-time synchronization, modern glassmorphism design, dark/light themes, and advanced task management capabilities.

## 🌟 Features

### Core Functionality
- **User Authentication** - Email/password and Google Sign-In via Firebase Auth
- **Real-time Sync** - Tasks sync instantly across all devices using Firestore
- **Task Management** - Create, edit, delete, and mark tasks as complete
- **Categories** - Organize tasks with customizable categories (Work, Personal, Shopping, General)
- **Search & Filter** - Advanced filtering by status, category, and search terms

### Premium UI/UX
- **Glassmorphism Design** - Modern translucent cards with backdrop blur effects
- **Dark/Light Themes** - Smooth animated theme switching with system preference detection
- **Responsive Design** - Optimized for mobile, tablet, and desktop viewing
- **Micro-interactions** - Smooth hover effects, transitions, and loading states
- **Progress Tracking** - Visual progress bars and completion statistics

### Advanced Features
- **Real-time Statistics** - Live task completion rates and progress tracking
- **Floating Action Button** - Animated FAB with ripple effects for quick task creation
- **Toast Notifications** - Beautiful success/error messages
- **Offline-Ready** - Firebase persistence for offline functionality
- **Security** - User-specific data isolation with Firestore security rules

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Firebase account
- Modern web browser

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Enable Google Analytics (optional)

2. **Enable Authentication**
   - Navigate to Authentication > Sign-in method
   - Enable Email/Password and Google providers
   - Add your domain to authorized domains

3. **Setup Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /tasks/{taskId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```

4. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Web app" icon and register your app
   - Copy the configuration object

5. **Update Configuration**
   - Open `src/config/firebase.ts`
   - Replace the placeholder config with your actual Firebase configuration

### Local Development

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd taskmaster-pro
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:5173`
   - Create an account or sign in to start using the app

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Project Structure
```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Header, FAB components
│   └── Tasks/          # Task-related components
├── contexts/           # React contexts for state management
├── config/            # Firebase configuration
└── App.tsx           # Main application component
```

### Key Components
- **AuthContext** - Manages user authentication state
- **TaskContext** - Handles task CRUD operations and real-time sync
- **ThemeContext** - Controls dark/light theme switching
- **TaskList** - Main task display with filtering and search
- **TaskForm** - Modal for creating new tasks
- **Header** - Navigation with progress tracking

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3B82F6 to #2563EB)
- **Secondary**: Purple gradient (#8B5CF6 to #7C3AED)
- **Success**: Green (#10B981)
- **Categories**: Blue (Work), Green (Personal), Purple (Shopping), Gray (General)

### Typography
- **Headlines**: Bold, gradient text effects
- **Body**: Clean, readable fonts with proper line spacing
- **Interactive**: Smooth hover and focus states

### Animations
- **Theme Transitions**: 300ms ease-in-out
- **Micro-interactions**: Scale, rotate, and opacity effects
- **Progress Bars**: Smooth width transitions
- **Modal Animations**: Backdrop blur with scale effects

## 🚢 Deployment

### Firebase Hosting (Recommended)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Hosting**
   ```bash
   firebase init hosting
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Other Platforms
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after building
- **GitHub Pages**: Use GitHub Actions for automated deployment

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security

- Firebase Authentication handles all user management
- Firestore security rules ensure users only access their own data
- No sensitive data stored in client-side code
- HTTPS enforced in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the Firebase Console for authentication/database errors
2. Ensure your Firebase configuration is correct
3. Verify security rules are properly set up
4. Check browser console for JavaScript errors

For additional help, please open an issue on GitHub.

---

**TaskMaster Pro** - Built with ❤️ for productivity enthusiasts