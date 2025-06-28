# Learning Management System (LMS)

## Overview

This is a full-stack Learning Management System built with a modern tech stack featuring React frontend, Express.js backend, and PostgreSQL database. The application supports multiple user roles (students, instructors, administrators) with comprehensive course management, quiz functionality, Q&A forums, and payment processing.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for authentication, TanStack Query for server state
- **Routing**: React Router for client-side navigation
- **Styling**: Tailwind CSS with custom design system and dark mode support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless driver
- **Session Management**: PostgreSQL-based session storage
- **Development**: Hot reload with tsx and Vite middleware integration

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend application
├── shared/          # Shared TypeScript types and schemas
└── migrations/      # Database migration files
```

## Key Components

### Authentication System
- Multi-role authentication (student, instructor, admin)
- Google OAuth integration
- Protected route system with role-based access control
- User onboarding flow for profile completion
- Session-based authentication with PostgreSQL storage

### Course Management
- **For Instructors**: Course creation, content management, module organization
- **For Students**: Course browsing, enrollment, progress tracking
- Course content includes videos, materials, quizzes, and Q&A sections
- Hierarchical structure: Courses → Modules → Lessons

### Interactive Learning Features
- **Quiz System**: Multiple choice and true/false questions with timed assessments
- **Q&A Forums**: Lesson-specific discussion threads with upvoting and instructor responses
- **Progress Tracking**: Completion tracking for lessons and overall course progress

### AI-Powered Learning Features (NEW)
- **AI Lesson Summarizer**: Auto-generates key points, takeaways, and summaries using DeepSeek API
- **AI Practice Questions Generator**: Creates custom quiz questions based on lesson content
- **AI Study Buddy**: Real-time chatbot for answering student questions about lessons
- **AI Skill Gap Analyzer**: Identifies learning gaps and provides personalized recommendations

### Enhanced Course Discovery
- **Advanced Search & Filtering**: Smart filters by price, duration, difficulty, ratings, and domains
- **Course Recommendations**: AI-powered suggestions based on user interests
- **Wishlist Functionality**: Save courses for later access
- **Recently Viewed Courses**: Quick access to previously browsed content

### Learning Analytics Dashboard
- **Progress Visualization**: Weekly/monthly learning activity charts
- **Learning Streaks**: Track consecutive days of learning with achievements
- **Skill Progression**: Visual representation of acquired skills and competencies
- **Achievement System**: Badges and milestones for learning accomplishments
- **Performance Analytics**: Detailed insights into learning patterns and velocity

### Payment Integration
- Dual payment gateway support (Stripe and Razorpay)
- Course checkout and payment success handling
- Transaction tracking and receipt generation

### Business Monetization System
- **Subscription Management**: Flexible monthly/yearly plans with comprehensive billing
- **Promotional Tools**: Discount codes and coupon system with usage analytics
- **Revenue Protection**: Automated refund processing with approval workflows
- **Growth Engine**: Complete affiliate program with commission tracking
- **Value Packaging**: Course bundles with dynamic pricing strategies
- **Premium Access**: Early access system for subscriber exclusivity
- **Credential Monetization**: Multi-tier certificate system (basic/verified/premium)

### Technical Infrastructure
- **Performance Optimization**: CDN management, caching, and content delivery optimization
- **Security Framework**: Content protection, AI moderation, and plagiarism detection
- **Quality Assurance**: Automated backup systems and recovery protocols
- **Scalability Tools**: Lazy loading, adaptive streaming, and resource optimization

### Database Schema
- Users table with role-based permissions
- Course hierarchy with instructors, modules, and lessons
- Enrollment tracking with progress metrics
- Quiz attempts and Q&A interactions
- Payment transaction records

## Data Flow

1. **Authentication Flow**: User login → Session creation → Role-based dashboard routing
2. **Course Enrollment**: Course selection → Payment processing → Enrollment creation → Access granted
3. **Learning Flow**: Lesson access → Progress tracking → Quiz completion → Certificate generation
4. **Content Management**: Instructor creates courses → Adds modules/lessons → Publishes content → Students access

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI components
- **class-variance-authority**: Component variant management

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling
- **drizzle-kit**: Database migrations and schema management

### UI and Styling
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **embla-carousel-react**: Carousel component
- **cmdk**: Command palette functionality

## Deployment Strategy

### Development Mode
- Frontend: Vite dev server with HMR
- Backend: tsx with hot reload
- Database: Development database with push migrations

### Production Build
- Frontend: Vite build to `dist/public`
- Backend: esbuild bundle to `dist/index.js`
- Database: Migration-based deployment
- Static assets served by Express

### Environment Configuration
- Database URL configuration via environment variables
- Separate development and production database instances
- Session secret and payment gateway credentials management

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **June 28, 2025**: Successfully migrated from Lovable to Replit environment
- **June 28, 2025**: Implemented AI-powered learning features using DeepSeek API:
  - AI Lesson Summarizer for automatic content summarization
  - AI Practice Questions Generator for custom quiz creation
  - AI Study Buddy chatbot for real-time learning assistance
  - AI Skill Gap Analyzer for personalized learning recommendations
- **June 28, 2025**: Added enhanced course discovery and search functionality:
  - Advanced search with smart filtering by price, duration, difficulty, ratings
  - Course wishlist and recently viewed features
  - Real-time search statistics and course recommendations
- **June 28, 2025**: Implemented comprehensive learning analytics dashboard:
  - Progress visualization with weekly/monthly charts
  - Learning streak tracking with achievement system
  - Skill progression monitoring and performance analytics
  - Achievement badges and milestone tracking
- **June 28, 2025**: Added complete PostgreSQL database integration:
  - Comprehensive schema for all learning platform features
  - Database-backed storage replacing in-memory implementation
  - Full CRUD operations with proper relationships and constraints
- **June 28, 2025**: Implemented premium student engagement features:
  - Course Reviews & Ratings with 5-star system and helpful voting
  - Course-Specific Discussion Forums with threaded conversations
  - Study Groups for peer learning communities
  - Rich Text Note-Taking System with video timestamp integration
  - Smart Bookmarks System for saving important content
- **June 28, 2025**: Built comprehensive instructor tools:
  - Live Session Scheduling with countdown timers and meeting links
  - Assignment Management System with submission tracking and grading
  - Student Analytics Dashboard with progress visualization and insights
- **June 28, 2025**: Created feature demonstration page accessible at /features route
- **June 28, 2025**: Implemented complete business monetization features:
  - Subscription Plans with flexible billing (monthly/yearly) and payment processing
  - Discount Codes & Coupons with usage tracking and expiry management
  - Refund Management with approval workflows and admin controls
  - Affiliate Program with commission tracking and payout systems
  - Course Bundles with dynamic pricing and discount calculations
  - Early Access system for premium users with exclusive benefits
  - Certificate System with basic, verified, and premium certificate options
- **June 28, 2025**: Added technical enhancement components:
  - Performance Optimization with CDN management and caching controls
  - Security & Quality Control with content protection and AI moderation
  - Plagiarism Detection system with automatic scanning capabilities
  - Backup & Recovery tools with automated data protection
- **June 28, 2025**: Created comprehensive monetization demo page at /monetization route

## External Dependencies

### AI Integration
- **DeepSeek API**: Powers all AI-driven features including lesson summarization, question generation, and skill analysis
- **OpenAI-compatible interface**: Enables seamless integration with DeepSeek's language models

## Changelog

Changelog:
- June 28, 2025. Initial setup and migration to Replit completed with enhanced AI features