# Learning Management System (LMS)

## Overview

This is a full-stack Learning Management System (LMS) designed to offer a comprehensive e-learning experience. It supports multiple user roles (students, instructors, administrators) and includes advanced features such as course management, interactive quizzes, Q&A forums, and integrated payment processing. The system aims to provide a robust, scalable, and engaging platform for online education, leveraging AI for personalized learning and analytics for informed decision-making, positioning it to capture a significant share of the e-learning market.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The frontend utilizes React with TypeScript, Vite for optimized builds, and Tailwind CSS with shadcn/ui for a modern, accessible, and responsive user interface. It includes a custom design system with dark mode support. The UI components are designed to be professional, matching standards seen in leading LMS platforms like Udemy/Whizlabs, with a focus on intuitive navigation and user engagement. Key UI/UX features include:
- Enhanced Course Discovery with advanced search, filtering, recommendations, wishlist, and recently viewed courses.
- Learning Analytics Dashboard with progress visualization, learning streaks, skill progression, and achievement tracking.
- Mobile optimization with touch controls, offline downloads, push notifications, and resume playback.
- Comprehensive accessibility support (WCAG 2.1 AA compliant) including screen reader compatibility and keyboard navigation.
- Gamification features like level-up systems, XP/badges, course streaks, leaderboards, puzzle quiz chains, and real-time battle mode.
- Smart Learning Modes: Challenge, Relax, Binge, and Revision modes.
- Interactive demo pages for key features (/features, /monetization, /mobile-accessibility, /gamification).

### Technical Implementations
The system is built on a React frontend and an Express.js backend, both using TypeScript.
- **Frontend**: React with TypeScript, Vite, Tailwind CSS, shadcn/ui, React Context API for authentication, TanStack Query for server state, React Router for navigation.
- **Backend**: Express.js with TypeScript, Node.js (ESM modules), Drizzle ORM, PostgreSQL (Neon serverless driver), PostgreSQL-based session storage.
- **Authentication**: Multi-role authentication (student, instructor, admin) with Google OAuth, protected role-based routes, user onboarding, and session-based authentication.
- **Course Management**: Instructor tools for course creation, content management (videos, materials, quizzes, Q&A), and module organization (Courses → Modules → Lessons). Student features for course browsing, enrollment, and progress tracking.
- **Interactive Learning**: Quiz system (multiple choice, true/false, timed), lesson-specific Q&A forums, and detailed progress tracking.
- **AI-Powered Features**: AI Lesson Summarizer, AI Practice Questions Generator, AI Study Buddy chatbot, AI Skill Gap Analyzer, AI Answer Analysis & Scoring, Advanced Skill Progress Analytics, Mission & Daily Challenge System, Smart Content Unlock System, and AI Mentor Bot.
- **Payment Integration**: Dual gateway support (Stripe and Razorpay) for course checkout, transaction tracking, and receipt generation.
- **Business Monetization**: Subscription management (monthly/yearly), discount codes/coupons, automated refund processing, affiliate program, course bundles, early access, and multi-tier certificate system.
- **Technical Infrastructure**: Performance optimization (CDN, caching), security framework (content protection, AI moderation, plagiarism detection), automated backups, and scalability tools (lazy loading, adaptive streaming).
- **Peer Help Center**: Category-based Q&A with dual rating systems (XP and star ratings), interactive answer threads, gamified leaderboards, and a comprehensive rewards system.

### System Design Choices
- **Project Structure**: Organized into `client/` (React frontend), `server/` (Express.js backend), `shared/` (shared types/schemas), and `migrations/` (database migration files).
- **Database Schema**: Comprehensive PostgreSQL schema including users (role-based), course hierarchy, enrollments, quizzes, Q&A, payments, and extensive tables for AI and gamification features.
- **Data Flow**: Defined flows for authentication (login → session → dashboard), course enrollment (selection → payment → enrollment), learning (lesson → progress → quiz → certificate), and content management (instructor creates/publishes → students access).
- **Deployment Strategy**: Development mode uses Vite HMR for frontend and `tsx` hot reload for backend. Production build bundles frontend with Vite and backend with `esbuild`, utilizing migration-based database deployment. Environment configuration uses variables for database URLs, secrets, and credentials.

## External Dependencies

- **@neondatabase/serverless**: For PostgreSQL database connections.
- **drizzle-orm**: Type-safe ORM for database operations.
- **@tanstack/react-query**: For server state management in the frontend.
- **@radix-ui/react-\***: Accessible UI components.
- **class-variance-authority**: For component variant management.
- **tsx**: Used for TypeScript execution during development.
- **esbuild**: Used for production bundling.
- **drizzle-kit**: For database migrations and schema management.
- **tailwindcss**: Utility-first CSS framework.
- **lucide-react**: Icon library.
- **embla-carousel-react**: Carousel component.
- **cmdk**: For command palette functionality.
- **DeepSeek API**: Powers all AI-driven features (lesson summarization, question generation, study buddy, skill analysis, answer analysis, etc.) via an OpenAI-compatible interface.
- **Stripe and Razorpay**: Payment gateway integrations.
- **jsonwebtoken, winston, bcryptjs, cors**: Core enterprise packages for backend security and logging.