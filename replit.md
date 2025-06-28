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

### Payment Integration
- Dual payment gateway support (Stripe and Razorpay)
- Course checkout and payment success handling
- Transaction tracking and receipt generation

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

## Changelog

Changelog:
- June 28, 2025. Initial setup