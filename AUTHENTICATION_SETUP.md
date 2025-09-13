# Production-Ready Authentication System Setup

This is a complete Node.js (Express) authentication system with local testing capabilities for password reset and email verification. The system is designed to be production-ready while allowing for easy local development and testing.

## Features

✅ **User Sign Up and Login** with secure password hashing  
✅ **Show/Hide Password** functionality on frontend  
✅ **Forgot Password** functionality with secure tokens  
✅ **Password Reset** without external email services (uses local token display)  
✅ **Environment Variables** from `.env` file for all sensitive information  
✅ **Proper Validation** and error handling throughout  
✅ **Production-Ready** architecture with comprehensive comments  

## Local Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Git

### 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-project-name>

# Install dependencies
npm install
```

### 3. Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your configuration:

```env
# Application Configuration
NODE_ENV=development
PORT=5000

# Frontend Configuration
FRONTEND_URL=http://localhost:5000
APP_BASE_URL=http://localhost:5000

# JWT Configuration (Generate secure random strings)
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
REFRESH_JWT_SECRET=your-super-secure-refresh-jwt-secret-key-here-minimum-32-characters

# Google OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Password Reset Testing Configuration
# Options: console (log to console), response (include in API response), none (no output)
TOKEN_EXPOSE_MODE=console

# Token Expiration Settings
TOKEN_TTL_EMAIL_HOURS=24
TOKEN_TTL_RESET_MIN=30

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name

# Session Configuration
SESSION_SECRET=your-super-secure-session-secret-key-here-minimum-32-characters
```

### 4. Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env` file
3. Run database migrations (if applicable):
```bash
npm run db:migrate
```

### 5. Generate Secure Keys

Use this command to generate secure JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this command twice to generate both `JWT_SECRET` and `REFRESH_JWT_SECRET`.

### 6. Start the Application

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The application will be available at: `http://localhost:5000`

## Testing the Authentication System

### 1. User Registration

1. Navigate to `/signup`
2. Fill out the registration form
3. **Local Email Testing**: Check your console for the verification link:
   ```
   🔗 VERIFICATION LINK (Copy to test):
   http://localhost:5000/verify-email?token=abc123...
   🎫 Token: abc123...
   ```

### 2. Password Reset Testing

1. Navigate to `/forgot-password`
2. Enter your email address
3. **Local Token Display**: Check your console for the reset link:
   ```
   🔒 PASSWORD RESET LINK (Copy to test):
   http://localhost:5000/reset-password?token=xyz789...
   🎫 Token: xyz789...
   ```
4. Copy the reset link and paste it in your browser
5. Enter your new password

### 3. Email Verification Testing

1. After registration, copy the verification link from console
2. Navigate to the verification URL
3. Your account will be verified and ready to use

## Configuration Options

### TOKEN_EXPOSE_MODE Options

- **`console`** (Recommended for development): Logs verification and reset links to console
- **`response`** (For API testing): Includes tokens in API responses (non-production only)
- **`none`** (Production): No token exposure, silent operation

### Security Features

- **Password Requirements**: Minimum 6 characters, must include numbers and symbols
- **Secure Token Generation**: Cryptographically secure random tokens
- **Token Expiration**: Email verification (24 hours), Password reset (30 minutes)
- **Rate Limiting**: Protects against brute force attacks
- **Input Validation**: Comprehensive validation on all endpoints
- **SQL Injection Protection**: Parameterized queries throughout

## Production Deployment

### 1. Environment Variables

Set these in your production environment:

```env
NODE_ENV=production
TOKEN_EXPOSE_MODE=none
# ... other production values
```

### 2. Add Real Email Service

To add real email functionality:

1. Install your preferred email service:
```bash
npm install nodemailer
# or
npm install @sendgrid/mail
```

2. Update `server/utils/email.ts`:
   - Replace the `sendEmail` function with real email sending
   - Keep the same function signatures for backwards compatibility
   - The email templates are already production-ready

3. Example nodemailer integration:
```javascript
// In server/utils/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  // Your email service configuration
});

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await transporter.sendMail({
      to: params.to,
      from: params.from || DEFAULT_FROM_EMAIL,
      subject: params.subject,
      text: params.text,
      html: params.html
    });
    return true;
  } catch (error) {
    logger.error('Email sending failed:', error);
    return false;
  }
}
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email

### Protected Endpoints

- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password (authenticated)

## File Structure

```
server/
├── controllers/
│   ├── authController.ts      # Main authentication logic
│   └── emailController.ts     # Email verification logic
├── utils/
│   ├── email.ts              # Local email testing system
│   ├── auth.ts               # Password validation and token utilities
│   └── errors.ts             # Error handling and codes
├── middleware/
│   ├── auth.ts               # JWT authentication middleware
│   └── rateLimiter.ts        # Rate limiting protection
├── storage/
│   └── authStorage.ts        # Database operations
└── config/
    └── passport.ts           # Google OAuth configuration

client/src/components/auth/
├── LoginForm.tsx             # Login form with show/hide password
├── SignupForm.tsx            # Registration form with validation
├── ForgotPasswordForm.tsx    # Password reset request form
├── ResetPasswordForm.tsx     # New password form
└── EmailVerificationForm.tsx # Email verification handling
```

## Security Best Practices

1. **Environment Variables**: All secrets in `.env` file, never in code
2. **Password Hashing**: Uses bcrypt with appropriate salt rounds
3. **JWT Security**: Secure token generation with expiration
4. **Rate Limiting**: Protects against brute force attacks
5. **Input Validation**: Zod schemas for all user inputs
6. **Error Handling**: Consistent error responses, no information leakage
7. **CORS Configuration**: Properly configured for your domain
8. **SQL Injection Protection**: Parameterized queries only

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Verify database exists and user has permissions

2. **JWT Token Errors**
   - Ensure `JWT_SECRET` and `REFRESH_JWT_SECRET` are set
   - Secrets should be at least 32 characters long
   - Generate new secrets if you suspect compromise

3. **Console Not Showing Reset Links**
   - Check `TOKEN_EXPOSE_MODE=console` in `.env`
   - Ensure you're in development mode (`NODE_ENV=development`)
   - Check server console/terminal output

4. **Google OAuth Not Working**
   - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Check OAuth callback URL in Google Console
   - Ensure redirect URI matches your configuration

### Support

For additional support or questions about this authentication system, please refer to the inline code comments which provide detailed explanations of each security decision and implementation detail.

---

**Note**: This system is designed to be production-ready while providing excellent local development experience. The local email testing system makes it easy to test password reset and email verification flows without requiring external email services during development.