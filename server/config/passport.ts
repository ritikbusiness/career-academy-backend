import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AuthStorage } from '../storage/authStorage';
import { comparePassword } from '../utils/auth';
import { logger } from '../utils/logger';

// Disable sessions - we're using JWT tokens
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as any);
});

// Local strategy for email/password authentication
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Use email instead of username
    passwordField: 'password',
    session: false // Disable sessions, use JWT instead
  },
  async (email: string, password: string, done) => {
    try {
      // Find user by email
      const user = await AuthStorage.getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Check if user has a password (not OAuth-only)
      if (!user.passwordHash) {
        return done(null, false, { message: 'Please sign in with Google' });
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.passwordHash);
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Update last activity
      await AuthStorage.updateLastActivity(user.id);

      // Return user without sensitive data
      const { passwordHash, ...safeUser } = user;
      return done(null, safeUser);
    } catch (error) {
      logger.error('Local strategy error:', error);
      return done(error);
    }
  }
));

// Google OAuth strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.OAUTH_CALLBACK_URL || '/api/auth/google/callback',
    scope: ['profile', 'email']
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Extract user data from Google profile
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName;
      const imageUrl = profile.photos?.[0]?.value;

      if (!email) {
        return done(new Error('No email found in Google profile'), undefined);
      }

      logger.info('Google OAuth - Processing user:', { email, googleId, name });

      // Check if user exists by Google ID
      let user = await AuthStorage.getUserByProviderId('google', googleId);

      if (user) {
        // User exists with Google provider, update last activity
        await AuthStorage.updateLastActivity(user.id);
        logger.info('Google OAuth - Existing Google user logged in:', { userId: user.id, email: user.email });
      } else {
        // Check if user exists by email (from local registration)
        user = await AuthStorage.getUserByEmail(email.toLowerCase().trim());

        if (user) {
          // User exists with email but different provider, link the Google account
          user = await AuthStorage.linkProvider(user.id, 'google', googleId);
          logger.info('Google OAuth - Linked Google account to existing user:', { userId: user.id, email: user.email });
        } else {
          // Create new user with Google provider
          user = await AuthStorage.createUser({
            email: email.toLowerCase().trim(),
            name: name || email.split('@')[0],
            imageUrl: imageUrl || null,
            provider: 'google',
            providerId: googleId,
            emailVerifiedAt: new Date(), // Google emails are pre-verified
            role: 'student' // Default role
          });
          logger.info('Google OAuth - Created new user from Google:', { userId: user.id, email: user.email });
        }
      }

      // Return user without sensitive data
      const { passwordHash, ...safeUser } = user;
      return done(null, safeUser);
    } catch (error) {
      logger.error('Google OAuth strategy error:', error);
      return done(error);
    }
  }
));

export default passport;