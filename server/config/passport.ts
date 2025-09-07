import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from '../storage';

// Extend Express Request to include our User type for Passport
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      fullName: string;
      email: string;
      role: string;
      avatar?: string | null;
      instructorStatus?: string | null;
      [key: string]: any; // Allow additional properties from database
    }
  }
}

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
    
    if (user) {
      // User exists, return the user
      return done(null, user);
    } else {
      // Create new user
      const newUser = await storage.createUser({
        username: profile.emails?.[0]?.value || `google_${profile.id}`,
        email: profile.emails?.[0]?.value || '',
        fullName: profile.displayName || 'Google User',
        password: '', // No password for OAuth users
        role: 'student',
        avatar: profile.photos?.[0]?.value || undefined
      });

      // Initialize user stats for gamification
      await storage.createUserStats?.({
        userId: newUser.id,
        totalXP: 0,
        level: 1,
        streak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        coursesCompleted: 0,
        lessonsCompleted: 0,
        quizzesCompleted: 0,
        helpfulAnswers: 0
      });

      return done(null, newUser);
    }
  } catch (error) {
    return done(error, false);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
});

export default passport;