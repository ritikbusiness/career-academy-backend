import { logger } from './logger';

/**
 * Local Email Testing System
 * 
 * This module provides a production-ready email system that works locally for development
 * and testing without requiring external email services like SendGrid.
 * 
 * Configuration via .env:
 * - TOKEN_EXPOSE_MODE: 'console' | 'response' | 'none'
 *   - console: Log verification links/tokens to console (default for development)
 *   - response: Include tokens in API responses (for testing only, not production)
 *   - none: No token exposure (production mode)
 * 
 * To add real email functionality later:
 * 1. Install your preferred email service (nodemailer, sendgrid, etc.)
 * 2. Replace the sendEmail function implementation
 * 3. Keep the same function signatures for backwards compatibility
 */

interface EmailParams {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
}

interface EmailResult {
  success: boolean;
  testData?: {
    token?: string;
    verificationUrl?: string;
    resetUrl?: string;
    mode: string;
  };
}

const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@desiredcareeracademy.com';
const TOKEN_EXPOSE_MODE = process.env.TOKEN_EXPOSE_MODE || 'console';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Local email sending function for development and testing
 * 
 * In development/testing, this logs email content and returns test data
 * In production with TOKEN_EXPOSE_MODE='none', this acts as a no-op
 * 
 * @param params Email parameters (to, from, subject, text, html)
 * @returns Promise<EmailResult> Success status and optional test data
 */
export async function sendEmail(params: EmailParams): Promise<EmailResult> {
  try {
    // Log email being "sent" for development visibility
    logger.info('Email would be sent', { 
      to: params.to, 
      subject: params.subject,
      mode: TOKEN_EXPOSE_MODE 
    });

    // In production with 'none' mode, just return success (no-op)
    if (IS_PRODUCTION && TOKEN_EXPOSE_MODE === 'none') {
      return { success: true };
    }

    // For development/testing, log the email content
    if (TOKEN_EXPOSE_MODE === 'console') {
      console.log('\n' + '='.repeat(60));
      console.log('📧 EMAIL WOULD BE SENT (Development Mode)');
      console.log('='.repeat(60));
      console.log(`To: ${params.to}`);
      console.log(`From: ${params.from || DEFAULT_FROM_EMAIL}`);
      console.log(`Subject: ${params.subject}`);
      console.log('\nContent:');
      console.log(params.text || 'No text content');
      console.log('='.repeat(60) + '\n');
    }

    return { success: true };
  } catch (error) {
    logger.error('Local email system error:', error);
    return { success: false };
  }
}

/**
 * Send email verification link (local testing version)
 * 
 * This function maintains the same signature as the original SendGrid version
 * but uses local token display for development and testing.
 * 
 * @param email User's email address
 * @param name User's display name
 * @param token Email verification token
 * @returns Promise<boolean | EmailResult> Success status or detailed result for testing
 */
export async function sendVerificationEmail(
  email: string, 
  name: string, 
  token: string
): Promise<boolean | EmailResult> {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  // Create email content (same as original for consistency)
  const text = `
    Hi ${name},

    Thank you for signing up for Desired Career Academy! 

    To complete your registration, please verify your email address by visiting this link:
    ${verificationUrl}

    This verification link will expire in 24 hours.

    If you didn't create an account with us, please ignore this email.

    Welcome aboard!
    The Desired Career Academy Team
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email - Desired Career Academy</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Desired Career Academy!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for signing up for Desired Career Academy! We're excited to have you join our learning community.</p>
          <p>To complete your registration and start your learning journey, please verify your email address by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify My Email</a>
          </p>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
          <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
          <p>Welcome aboard!</p>
          <p>The Desired Career Academy Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>© 2025 Desired Career Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send the "email" using local system
  const result = await sendEmail({
    to: email,
    subject: 'Verify Your Email - Desired Career Academy',
    text,
    html
  });

  // Handle token exposure for testing
  if (TOKEN_EXPOSE_MODE === 'console') {
    console.log('\n' + '🔗 VERIFICATION LINK (Copy to test):');
    console.log(verificationUrl);
    console.log(`🎫 Token: ${token}\n`);
  }

  // For API response mode (testing only), return detailed data
  if (TOKEN_EXPOSE_MODE === 'response' && !IS_PRODUCTION) {
    return {
      success: result.success,
      testData: {
        token,
        verificationUrl,
        mode: TOKEN_EXPOSE_MODE
      }
    };
  }

  // Default return for backwards compatibility
  return result.success;
}

/**
 * Send password reset link (local testing version)
 * 
 * This function maintains the same signature as the original SendGrid version
 * but uses local token display for development and testing.
 * 
 * @param email User's email address
 * @param name User's display name
 * @param token Password reset token
 * @returns Promise<boolean | EmailResult> Success status or detailed result for testing
 */
export async function sendPasswordResetEmail(
  email: string, 
  name: string, 
  token: string
): Promise<boolean | EmailResult> {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  // Create email content (same as original for consistency)
  const text = `
    Hi ${name},

    We received a request to reset your password for your Desired Career Academy account.

    If you requested this password reset, visit this link to create a new password:
    ${resetUrl}

    IMPORTANT:
    - This link will expire in 30 minutes
    - If you didn't request this reset, please ignore this email
    - This link can only be used once

    Stay secure!
    The Desired Career Academy Team
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password - Desired Career Academy</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We received a request to reset your password for your Desired Career Academy account.</p>
          <p>If you requested this password reset, click the button below to create a new password:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset My Password</a>
          </p>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
          <div class="warning">
            <p><strong>Important Security Information:</strong></p>
            <ul>
              <li>This password reset link will expire in 30 minutes</li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>For security, this link can only be used once</li>
            </ul>
          </div>
          <p>If you're having trouble accessing your account or didn't request this reset, please contact our support team.</p>
          <p>Stay secure!</p>
          <p>The Desired Career Academy Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>© 2025 Desired Career Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send the "email" using local system
  const result = await sendEmail({
    to: email,
    subject: 'Reset Your Password - Desired Career Academy',
    text,
    html
  });

  // Handle token exposure for testing
  if (TOKEN_EXPOSE_MODE === 'console') {
    console.log('\n' + '🔒 PASSWORD RESET LINK (Copy to test):');
    console.log(resetUrl);
    console.log(`🎫 Token: ${token}\n`);
  }

  // For API response mode (testing only), return detailed data
  if (TOKEN_EXPOSE_MODE === 'response' && !IS_PRODUCTION) {
    return {
      success: result.success,
      testData: {
        token,
        resetUrl,
        mode: TOKEN_EXPOSE_MODE
      }
    };
  }

  // Default return for backwards compatibility
  return result.success;
}