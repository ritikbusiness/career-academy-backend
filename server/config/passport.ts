import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from '../storage';
import { logger } from '../utils/logger';

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
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Validate that we have required Google profile data
    if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
      return done(new Error('No email provided by Google'), false);
    }

    const googleEmail = profile.emails[0].value;
    const googleName = profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName || 'Google User';
    const googleAvatar = profile.photos?.[0]?.value;

    // Check if user already exists with this Google email
    let user = await storage.getUserByEmail(googleEmail);
    
    if (user) {
      // User exists, log them in
      logger.info(`Existing user logged in via Google: ${googleEmail}`);
      return done(null, user);
    } else {
      // Create new user with real Google data
      const newUser = await storage.createUser({
        username: googleEmail, // Use email as username for Google users
        email: googleEmail,    // Use actual Google email
        fullName: googleName,  // Use actual Google display name
        password: '',          // No password for OAuth users
        role: 'student',
        avatar: googleAvatar
      });

      logger.info(`New user created via Google OAuth: ${googleEmail}`);

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
    logger.error('Google OAuth error:', error);
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