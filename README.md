# Enterprise Learning Management System (LMS)

## 🚀 Overview

A comprehensive, production-ready Learning Management System with AI-powered features built using modern web technologies. This enterprise-grade platform supports multiple user roles, advanced analytics, gamification, peer help systems, and intelligent learning assistance.

## ✨ Key Features

### 🎯 Core LMS Functionality
- **Multi-role Authentication**: Students, Instructors, and Administrators
- **Course Management**: Create, organize, and deliver structured learning content
- **Progress Tracking**: Comprehensive learning analytics and completion tracking
- **Quiz System**: Interactive assessments with multiple question types
- **Certificate Generation**: Automated course completion certificates

### 🤖 AI-Powered Learning Features
- **Lesson Summarizer**: Auto-generates key points and takeaways using DeepSeek API
- **Practice Questions Generator**: Creates custom quiz questions based on lesson content
- **AI Study Buddy**: Real-time chatbot for answering student questions
- **Skill Gap Analyzer**: Identifies learning gaps and provides personalized recommendations

### 🎮 Gamification System
- **XP & Level System**: Earn points and level up through learning activities
- **Achievement Badges**: Unlock rewards for completing milestones
- **Learning Streaks**: Track consecutive days of learning
- **Leaderboards**: Competitive rankings with weekly/monthly views

### 👥 Peer Help Center
- **Category-based Q&A**: Specialized sections for different topics
- **Dual Rating System**: XP rewards for authors, social ratings for community
- **Rewards System**: Course discounts, merchandise, certificates based on contributions

### 📊 Learning Analytics
- **Progress Visualization**: Weekly/monthly learning activity charts
- **Performance Insights**: Detailed analytics for students and instructors
- **Learning Patterns**: Identify peak learning times and habits
- **Custom Reports**: Exportable analytics for administrators

### 🔧 Enterprise Features
- **JWT Authentication**: Secure session management with refresh tokens
- **Rate Limiting**: API protection with configurable limits
- **Comprehensive Logging**: Winston-based logging with multiple levels
- **Error Handling**: Centralized error management with proper status codes
- **Input Validation**: Zod-based request validation
- **Role-based Access Control**: Granular permissions system

## 🛠 Technical Stack

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT + bcryptjs password hashing
- **AI Integration**: DeepSeek API for intelligent features
- **Logging**: Winston logger with file and console transports
- **Validation**: Zod schemas for request/response validation
- **Security**: CORS, rate limiting, input sanitization

### Frontend (Ready for Integration)
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development
- **UI Components**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query for server state
- **Routing**: React Router for navigation

### Development Tools
- **Hot Reload**: tsx for backend development
- **Database Migrations**: Drizzle Kit
- **API Testing**: Built-in health checks
- **Development Server**: Integrated Vite middleware

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- DeepSeek API key

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd lms-enterprise

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-super-secret-jwt-key

# AI Integration
DEEPSEEK_API_KEY=your-deepseek-api-key

# Development
NODE_ENV=development
```

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Course Management
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create new course (instructor/admin)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course (student)
- `GET /api/my-courses` - Get user's enrolled courses

### AI Features
- `POST /api/ai/lesson-summary` - Generate lesson summary
- `POST /api/ai/practice-questions` - Generate practice questions
- `POST /api/ai/study-buddy/chat` - AI study buddy chat
- `POST /api/ai/skill-gap-analysis` - Analyze skill gaps

### Analytics
- `GET /api/analytics/user` - User learning analytics
- `GET /api/analytics/dashboard` - Dashboard summary
- `POST /api/analytics/activity` - Record learning activity
- `GET /api/analytics/progress-report` - Generate progress report

### Gamification
- `GET /api/gamification/stats` - User gamification stats
- `GET /api/gamification/leaderboard` - Global leaderboard
- `PUT /api/gamification/streak` - Update learning streak

### Health Checks
- `GET /api/health` - Server health status
- `GET /api/health/ai` - AI service health status

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Zod schemas prevent invalid data
- **CORS Configuration**: Cross-origin request protection
- **Error Sanitization**: No sensitive data in error responses

## 📈 Performance & Monitoring

- **Winston Logging**: Comprehensive logging with configurable levels
- **Request Tracking**: Automatic API request/response logging
- **Error Monitoring**: Centralized error handling and logging
- **Health Checks**: Built-in endpoints for monitoring system status

## 🎯 AI Integration

The platform integrates with DeepSeek AI to provide intelligent learning features:

- **Lesson Summarization**: Automatically extract key points from content
- **Question Generation**: Create relevant practice questions
- **Study Assistant**: Provide real-time learning support
- **Skill Analysis**: Identify learning gaps and recommend improvements

## 📊 Database Schema

The system uses a comprehensive PostgreSQL schema supporting:
- User management with role-based permissions
- Hierarchical course structure (Courses → Modules → Lessons)
- Enrollment and progress tracking
- Gamification data (XP, achievements, streaks)
- Analytics and activity logging
- Peer help system (questions, answers, ratings)

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
- Configure DATABASE_URL for PostgreSQL
- Set JWT_SECRET for secure token generation
- Add DEEPSEEK_API_KEY for AI features
- Configure rate limiting and CORS as needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the API documentation above
- Review the health check endpoints
- Check the logs for debugging information
- Ensure all environment variables are properly configured

---

**Built with ❤️ using modern web technologies and AI-powered features**