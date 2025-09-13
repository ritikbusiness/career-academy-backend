var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/utils/logger.ts
import winston from "winston";
import fs from "fs";
import path from "path";
var logFormat, logger, apiLogger, logsDir;
var init_logger = __esm({
  "server/utils/logger.ts"() {
    "use strict";
    logFormat = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ timestamp: timestamp2, level, message, stack }) => {
        return `${timestamp2} [${level.toUpperCase()}]: ${stack || message}`;
      })
    );
    logger = winston.createLogger({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: logFormat,
      defaultMeta: { service: "lms-backend" },
      transports: [
        // Console transport for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            logFormat
          )
        }),
        // File transport for errors
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
          maxsize: 5242880,
          // 5MB
          maxFiles: 5
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: "logs/combined.log",
          maxsize: 5242880,
          // 5MB
          maxFiles: 5
        })
      ],
      // Handle exceptions and rejections
      exceptionHandlers: [
        new winston.transports.File({ filename: "logs/exceptions.log" })
      ],
      rejectionHandlers: [
        new winston.transports.File({ filename: "logs/rejections.log" })
      ]
    });
    apiLogger = (req, res, next) => {
      const start = Date.now();
      res.on("finish", () => {
        const duration = Date.now() - start;
        const logData = {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          userAgent: req.get("User-Agent"),
          ip: req.ip,
          userId: req.user?.id || "anonymous"
        };
        if (res.statusCode >= 400) {
          logger.error("API Error", logData);
        } else {
          logger.info("API Request", logData);
        }
      });
      next();
    };
    logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }
});

// server/utils/config.ts
import { z as z2 } from "zod";
var envSchema, validateConfig, config;
var init_config = __esm({
  "server/utils/config.ts"() {
    "use strict";
    envSchema = z2.object({
      // Application
      NODE_ENV: z2.enum(["development", "production", "test"]).default("development"),
      PORT: z2.string().transform(Number).default("5000"),
      FRONTEND_URL: z2.string().url().default("http://localhost:5000"),
      SERVER_URL: z2.string().url().default("http://localhost:5000"),
      // Database
      DATABASE_URL: z2.string().min(1, "DATABASE_URL is required"),
      // JWT Secrets
      JWT_SECRET: z2.string().min(32, "JWT_SECRET must be at least 32 characters"),
      JWT_REFRESH_SECRET: z2.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters").optional(),
      // Authentication
      BCRYPT_SALT_ROUNDS: z2.string().transform(Number).default("12"),
      SESSION_SECRET: z2.string().optional(),
      // Google OAuth
      GOOGLE_CLIENT_ID: z2.string().min(1, "GOOGLE_CLIENT_ID is required for OAuth").optional(),
      GOOGLE_CLIENT_SECRET: z2.string().min(1, "GOOGLE_CLIENT_SECRET is required for OAuth").optional(),
      OAUTH_CALLBACK_URL: z2.string().url().default("http://localhost:5000/api/auth/google/callback"),
      // Cookies
      COOKIE_DOMAIN: z2.string().optional().default("localhost"),
      // Optional
      SMTP_HOST: z2.string().optional(),
      SMTP_PORT: z2.string().transform(Number).optional(),
      SMTP_USER: z2.string().optional(),
      SMTP_PASS: z2.string().optional(),
      SMTP_FROM: z2.string().optional()
    });
    validateConfig = () => {
      try {
        const config2 = envSchema.parse(process.env);
        if (config2.NODE_ENV === "production") {
          if (config2.FRONTEND_URL.includes("localhost")) {
            throw new Error("FRONTEND_URL cannot be localhost in production");
          }
          if (config2.COOKIE_DOMAIN === "localhost") {
            throw new Error("COOKIE_DOMAIN cannot be localhost in production");
          }
        }
        return config2;
      } catch (error) {
        if (error instanceof z2.ZodError) {
          const missingVars = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
          console.error("\u274C Environment validation failed:");
          missingVars.forEach((msg) => console.error(`  - ${msg}`));
          console.error("\n\u{1F4A1} Please check your .env file against .env.example");
          process.exit(1);
        }
        throw error;
      }
    };
    config = validateConfig();
  }
});

// server/utils/auth.ts
var auth_exports = {};
__export(auth_exports, {
  comparePassword: () => comparePassword,
  generateAccessToken: () => generateAccessToken,
  generatePasswordResetToken: () => generatePasswordResetToken,
  generateRefreshToken: () => generateRefreshToken,
  generateSecureToken: () => generateSecureToken,
  getCookieOptions: () => getCookieOptions,
  hashPassword: () => hashPassword,
  sanitizeUserData: () => sanitizeUserData,
  validateEmail: () => validateEmail,
  validatePassword: () => validatePassword,
  verifyAccessToken: () => verifyAccessToken,
  verifyRefreshToken: () => verifyRefreshToken
});
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
var hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, getCookieOptions, validateEmail, COMMON_PASSWORDS, validatePassword, generateSecureToken, generatePasswordResetToken, sanitizeUserData;
var init_auth = __esm({
  "server/utils/auth.ts"() {
    "use strict";
    init_config();
    hashPassword = async (password) => {
      return await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);
    };
    comparePassword = async (password, hash) => {
      return await bcrypt.compare(password, hash);
    };
    generateAccessToken = (payload) => {
      return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: "15m",
        // Short-lived access token
        issuer: "lms-auth",
        audience: "lms-api"
      });
    };
    generateRefreshToken = (userId) => {
      const jti = randomUUID();
      const payload = {
        userId,
        jti
      };
      const secret = config.JWT_REFRESH_SECRET;
      if (!secret) {
        throw new Error("JWT_REFRESH_SECRET is required for refresh token generation");
      }
      const token = jwt.sign(payload, secret, {
        expiresIn: "7d",
        // Long-lived refresh token
        issuer: "lms-auth",
        audience: "lms-api"
      });
      return { token, jti };
    };
    verifyAccessToken = (token) => {
      try {
        const payload = jwt.verify(token, config.JWT_SECRET, {
          issuer: "lms-auth",
          audience: "lms-api"
        });
        return payload;
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          throw new Error("Access token expired");
        } else if (error instanceof jwt.JsonWebTokenError) {
          throw new Error("Invalid access token");
        }
        throw error;
      }
    };
    verifyRefreshToken = (token) => {
      const secret = config.JWT_REFRESH_SECRET;
      if (!secret) {
        throw new Error("JWT_REFRESH_SECRET is required for refresh token verification");
      }
      try {
        const payload = jwt.verify(token, secret, {
          issuer: "lms-auth",
          audience: "lms-api"
        });
        return payload;
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          throw new Error("Refresh token expired");
        } else if (error instanceof jwt.JsonWebTokenError) {
          throw new Error("Invalid refresh token");
        }
        throw error;
      }
    };
    getCookieOptions = (maxAge) => {
      const isProduction = config.NODE_ENV === "production";
      const domain = config.COOKIE_DOMAIN;
      return {
        httpOnly: true,
        secure: isProduction,
        // HTTPS only in production
        sameSite: "lax",
        domain: domain && domain !== "localhost" ? domain : void 0,
        maxAge: maxAge || 7 * 24 * 60 * 60 * 1e3,
        // 7 days default
        path: "/"
      };
    };
    validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return false;
      }
      const localPart = email.split("@")[0]?.toLowerCase();
      const domain = email.split("@")[1]?.toLowerCase();
      if (!localPart || !domain) {
        return false;
      }
      const exactFakePatterns = [
        "asdf",
        "qwerty",
        "zxcv",
        "abcd",
        "wxyz",
        // Exact keyboard patterns
        "test",
        "fake",
        "dummy",
        "invalid",
        "temp"
        // Exact obvious fakes
      ];
      if (exactFakePatterns.includes(localPart) || exactFakePatterns.some((pattern) => localPart.startsWith(pattern) && /^\d+$/.test(localPart.slice(pattern.length)))) {
        return false;
      }
      if (/^\d+$/.test(localPart)) {
        return false;
      }
      const suspiciousDomains = [
        "test.com",
        "fake.com",
        "invalid.com",
        "dummy.com",
        "temp.com",
        "throwaway.email",
        "10minutemail.com",
        "mailinator.com",
        "guerrillamail.com",
        "yopmail.com",
        "tempmail.org",
        "dispostable.com"
      ];
      if (suspiciousDomains.includes(domain)) {
        return false;
      }
      if (!domain.includes(".") || !/[a-z]/.test(domain)) {
        return false;
      }
      return true;
    };
    COMMON_PASSWORDS = /* @__PURE__ */ new Set([
      "password",
      "123456",
      "123456789",
      "welcome",
      "admin",
      "password123",
      "root",
      "toor",
      "pass",
      "12345678",
      "123123",
      "1234567890",
      "qwerty",
      "abc123",
      "Password1",
      "password1",
      "admin123",
      "root123",
      "welcome123",
      "1qaz2wsx",
      "dragon",
      "master",
      "monkey",
      "letmein",
      "login",
      "princess",
      "qwertyuiop",
      "solo",
      "sunshine",
      "secret",
      "freedom",
      "whatever",
      "qazwsx",
      "football",
      "jesus",
      "michael",
      "ninja",
      "mustang",
      "password12",
      "shadow",
      "master123",
      "696969",
      "superman",
      "michael1",
      "batman",
      "trustno1",
      "thomas",
      "robert",
      "jesus1",
      "abcdef",
      "matrix",
      "cheese",
      "hunter",
      "buster",
      "killer",
      "soccer",
      "harley",
      "ranger",
      "jordan",
      "andrew",
      "charles",
      "daniel",
      "compaq",
      "merlin",
      "starwars",
      "computer",
      "michelle",
      "jessica",
      "pepper",
      "test",
      "changeme",
      "fuckme",
      "fuckyou",
      "pussy",
      "andrea",
      "joshua",
      "love",
      "amanda",
      "ashley",
      "bailey",
      "passw0rd",
      "shadow1",
      "power",
      "fire",
      "hammer",
      "diamond",
      "important",
      "secure",
      "welcome1",
      "admin1",
      "system",
      "manager",
      "office",
      "internet",
      "service",
      "hello",
      "guest",
      "university",
      "default",
      "money",
      "coffee",
      "house",
      "family",
      "business",
      "music",
      "student",
      "forever",
      "friend",
      "orange",
      "flower",
      "beautiful",
      "summer"
    ]);
    validatePassword = (password) => {
      const errors = [];
      if (password.length < 6) {
        errors.push("Password must be at least 6 characters long");
      }
      if (password.length > 128) {
        errors.push("Password must be less than 128 characters");
      }
      if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number");
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("Password must contain at least one symbol (!@#$%^&*...)");
      }
      if (COMMON_PASSWORDS.has(password.toLowerCase())) {
        errors.push("Password is too common. Please choose a more unique password");
      }
      return {
        isValid: errors.length === 0,
        errors
      };
    };
    generateSecureToken = () => {
      return randomUUID();
    };
    generatePasswordResetToken = () => {
      return randomUUID() + "-" + Date.now();
    };
    sanitizeUserData = (user) => {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    };
  }
});

// server/utils/email.ts
var email_exports = {};
__export(email_exports, {
  sendEmail: () => sendEmail,
  sendPasswordResetEmail: () => sendPasswordResetEmail,
  sendVerificationEmail: () => sendVerificationEmail
});
async function sendEmail(params) {
  try {
    logger.info("Email would be sent", {
      to: params.to,
      subject: params.subject,
      mode: TOKEN_EXPOSE_MODE
    });
    if (IS_PRODUCTION && TOKEN_EXPOSE_MODE === "none") {
      return { success: true };
    }
    if (TOKEN_EXPOSE_MODE === "console") {
      console.log("\n" + "=".repeat(60));
      console.log("\u{1F4E7} EMAIL WOULD BE SENT (Development Mode)");
      console.log("=".repeat(60));
      console.log(`To: ${params.to}`);
      console.log(`From: ${params.from || DEFAULT_FROM_EMAIL}`);
      console.log(`Subject: ${params.subject}`);
      console.log("\nContent:");
      console.log(params.text || "No text content");
      console.log("=".repeat(60) + "\n");
    }
    return { success: true };
  } catch (error) {
    logger.error("Local email system error:", error);
    return { success: false };
  }
}
async function sendVerificationEmail(email, name, token) {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5000";
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
  const text2 = `
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
          <p>\xA9 2025 Desired Career Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const result = await sendEmail({
    to: email,
    subject: "Verify Your Email - Desired Career Academy",
    text: text2,
    html
  });
  if (TOKEN_EXPOSE_MODE === "console") {
    console.log("\n\u{1F517} VERIFICATION LINK (Copy to test):");
    console.log(verificationUrl);
    console.log(`\u{1F3AB} Token: ${token}
`);
  }
  if (TOKEN_EXPOSE_MODE === "response" && !IS_PRODUCTION) {
    return {
      success: result.success,
      testData: {
        token,
        verificationUrl,
        mode: TOKEN_EXPOSE_MODE
      }
    };
  }
  return result.success;
}
async function sendPasswordResetEmail(email, name, token) {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  const text2 = `
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
          <p>\xA9 2025 Desired Career Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const result = await sendEmail({
    to: email,
    subject: "Reset Your Password - Desired Career Academy",
    text: text2,
    html
  });
  if (TOKEN_EXPOSE_MODE === "console") {
    console.log("\n\u{1F512} PASSWORD RESET LINK (Copy to test):");
    console.log(resetUrl);
    console.log(`\u{1F3AB} Token: ${token}
`);
  }
  if (TOKEN_EXPOSE_MODE === "response" && !IS_PRODUCTION) {
    return {
      success: result.success,
      testData: {
        token,
        resetUrl,
        mode: TOKEN_EXPOSE_MODE
      }
    };
  }
  return result.success;
}
var DEFAULT_FROM_EMAIL, TOKEN_EXPOSE_MODE, IS_PRODUCTION;
var init_email = __esm({
  "server/utils/email.ts"() {
    "use strict";
    init_logger();
    DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || "noreply@desiredcareeracademy.com";
    TOKEN_EXPOSE_MODE = process.env.TOKEN_EXPOSE_MODE || "console";
    IS_PRODUCTION = process.env.NODE_ENV === "production";
  }
});

// server/index.ts
import "dotenv/config";
import express3 from "express";
import { createServer } from "http";

// server/routes.ts
import express from "express";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  achievements: () => achievements,
  aiMentorResponses: () => aiMentorResponses,
  aiScores: () => aiScores,
  answerFeedback: () => answerFeedback,
  answerStarRatings: () => answerStarRatings,
  assignmentSubmissions: () => assignmentSubmissions,
  assignments: () => assignments,
  bookmarks: () => bookmarks,
  certificates: () => certificates,
  changePasswordSchema: () => changePasswordSchema,
  couponUsage: () => couponUsage,
  courseReviews: () => courseReviews,
  courses: () => courses,
  coursesRelations: () => coursesRelations,
  createInstructorInviteSchema: () => createInstructorInviteSchema,
  discountCoupons: () => discountCoupons,
  enrollments: () => enrollments,
  forumReplies: () => forumReplies,
  forumThreads: () => forumThreads,
  helpAnswers: () => helpAnswers,
  helpCategories: () => helpCategories,
  helpQuestions: () => helpQuestions,
  insertAIScoreSchema: () => insertAIScoreSchema,
  insertAchievementSchema: () => insertAchievementSchema,
  insertAssignmentSchema: () => insertAssignmentSchema,
  insertAssignmentSubmissionSchema: () => insertAssignmentSubmissionSchema,
  insertBookmarkSchema: () => insertBookmarkSchema,
  insertCourseReviewSchema: () => insertCourseReviewSchema,
  insertCourseSchema: () => insertCourseSchema,
  insertDiscountCouponSchema: () => insertDiscountCouponSchema,
  insertEnrollmentSchema: () => insertEnrollmentSchema,
  insertForumReplySchema: () => insertForumReplySchema,
  insertForumThreadSchema: () => insertForumThreadSchema,
  insertHelpAnswerSchema: () => insertHelpAnswerSchema,
  insertHelpQuestionSchema: () => insertHelpQuestionSchema,
  insertLessonNoteSchema: () => insertLessonNoteSchema,
  insertLessonSchema: () => insertLessonSchema,
  insertLiveSessionSchema: () => insertLiveSessionSchema,
  insertMissionProgressSchema: () => insertMissionProgressSchema,
  insertMissionSchema: () => insertMissionSchema,
  insertModuleSchema: () => insertModuleSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertQuizAttemptSchema: () => insertQuizAttemptSchema,
  insertQuizSchema: () => insertQuizSchema,
  insertRefreshTokenSchema: () => insertRefreshTokenSchema,
  insertSkillProgressSchema: () => insertSkillProgressSchema,
  insertStudyGroupSchema: () => insertStudyGroupSchema,
  insertSubscriptionPlanSchema: () => insertSubscriptionPlanSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserStatsSchema: () => insertUserStatsSchema,
  instructorInvites: () => instructorInvites,
  instructorProfileUpdateSchema: () => instructorProfileUpdateSchema,
  instructorSignupSchema: () => instructorSignupSchema,
  leaderboards: () => leaderboards,
  learningAnalytics: () => learningAnalytics,
  lessonNotes: () => lessonNotes,
  lessons: () => lessons,
  lessonsRelations: () => lessonsRelations,
  liveSessions: () => liveSessions,
  loginSchema: () => loginSchema,
  missionProgress: () => missionProgress,
  missions: () => missions,
  modules: () => modules,
  modulesRelations: () => modulesRelations,
  notifications: () => notifications,
  questionRooms: () => questionRooms,
  quizAttempts: () => quizAttempts,
  quizzes: () => quizzes,
  refreshTokens: () => refreshTokens,
  registerSchema: () => registerSchema,
  roomParticipants: () => roomParticipants,
  skillProgress: () => skillProgress,
  studyGroupMembers: () => studyGroupMembers,
  studyGroups: () => studyGroups,
  subscriptionPlans: () => subscriptionPlans,
  updateProfileSchema: () => updateProfileSchema,
  userAchievements: () => userAchievements,
  userStats: () => userStats,
  userSubscriptions: () => userSubscriptions,
  userUnlocks: () => userUnlocks,
  users: () => users,
  usersRelations: () => usersRelations,
  validateInstructorInviteSchema: () => validateInstructorInviteSchema,
  weeklyLearningStats: () => weeklyLearningStats,
  xpTransactions: () => xpTransactions
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal, json, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  // Core authentication fields
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  // Nullable for OAuth-only users
  name: text("name").notNull(),
  // Replaces fullName for simplicity
  imageUrl: text("image_url"),
  // Profile picture from OAuth or upload
  // OAuth provider fields
  provider: text("provider", { enum: ["local", "google"] }).notNull().default("local"),
  providerId: text("provider_id"),
  // Google ID, etc.
  emailVerifiedAt: timestamp("email_verified_at"),
  // Application-specific fields
  role: text("role", { enum: ["student", "instructor", "admin"] }).notNull().default("student"),
  domain: text("domain"),
  branch: text("branch"),
  year: text("year"),
  // Instructor-specific fields
  instructorStatus: text("instructor_status", { enum: ["pending", "approved", "rejected"] }),
  expertiseAreas: json("expertise_areas").$type().default([]),
  bio: text("bio"),
  credentialsUrl: text("credentials_url"),
  teachingExperience: integer("teaching_experience"),
  linkedinProfile: text("linkedin_profile"),
  personalWebsite: text("personal_website"),
  qualifications: json("qualifications").$type().default([]),
  verificationDate: timestamp("verification_date"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  providerIdx: index("users_provider_idx").on(table.provider, table.providerId)
}));
var refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  jti: text("jti").notNull().unique(),
  // JWT ID for token tracking
  revoked: boolean("revoked").default(false).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
  jtiIdx: index("refresh_tokens_jti_idx").on(table.jti),
  userIdIdx: index("refresh_tokens_user_id_idx").on(table.userId)
}));
var instructorInvites = pgTable("instructor_invites", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  email: text("email").notNull(),
  invitedBy: integer("invited_by").references(() => users.id).notNull(),
  isUsed: boolean("is_used").default(false).notNull(),
  usedBy: integer("used_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at")
});
var courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  domain: text("domain").notNull(),
  instructorId: integer("instructor_id").references(() => users.id).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  thumbnail: text("thumbnail"),
  duration: text("duration"),
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  enrolledCount: integer("enrolled_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id).notNull(),
  title: text("title").notNull(),
  videoUrl: text("video_url"),
  materialsUrl: text("materials_url"),
  subtitleUrl: text("subtitle_url"),
  position: integer("position").notNull(),
  duration: text("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  progress: decimal("progress", { precision: 5, scale: 2 }).default("0"),
  completedLessons: json("completed_lessons").$type().default([]),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow()
});
var courseReviews = pgTable("course_reviews", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  // 1-5 stars
  reviewText: text("review_text"),
  helpfulVotes: integer("helpful_votes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var forumThreads = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").references(() => forumThreads.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var studyGroups = pgTable("study_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  courseId: integer("course_id").references(() => courses.id),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  tags: json("tags").$type().default([]),
  memberCount: integer("member_count").default(1),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var studyGroupMembers = pgTable("study_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => studyGroups.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull()
});
var lessonNotes = pgTable("lesson_notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  content: text("content").notNull(),
  timestamp: text("timestamp"),
  // video timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  timestamp: text("timestamp"),
  // video timestamp if applicable
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var liveSessions = pgTable("live_sessions", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  instructorId: integer("instructor_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration"),
  // in minutes
  meetingLink: text("meeting_link"),
  status: text("status", { enum: ["scheduled", "live", "ended", "cancelled"] }).default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  instructorId: integer("instructor_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date").notNull(),
  maxPoints: integer("max_points").default(100),
  attachmentUrl: text("attachment_url"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var assignmentSubmissions = pgTable("assignment_submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").references(() => assignments.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  content: text("content"),
  attachmentUrl: text("attachment_url"),
  grade: integer("grade"),
  feedback: text("feedback"),
  status: text("status", { enum: ["not_submitted", "submitted", "graded"] }).default("not_submitted"),
  submittedAt: timestamp("submitted_at"),
  gradedAt: timestamp("graded_at")
});
var quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  questions: json("questions").$type().default([]),
  timeLimit: integer("time_limit"),
  // in minutes
  passingScore: integer("passing_score").default(70),
  // percentage
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  answers: json("answers").$type().default({}),
  score: integer("score").default(0),
  passed: boolean("passed").default(false),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  timeSpent: integer("time_spent").default(0)
  // in seconds
});
var usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  enrollments: many(enrollments),
  reviews: many(courseReviews),
  forumThreads: many(forumThreads),
  forumReplies: many(forumReplies),
  studyGroups: many(studyGroups),
  studyGroupMemberships: many(studyGroupMembers),
  notes: many(lessonNotes),
  bookmarks: many(bookmarks),
  liveSessions: many(liveSessions),
  assignments: many(assignments),
  submissions: many(assignmentSubmissions),
  quizAttempts: many(quizAttempts)
}));
var coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id]
  }),
  modules: many(modules),
  enrollments: many(enrollments),
  reviews: many(courseReviews),
  forumThreads: many(forumThreads),
  studyGroups: many(studyGroups),
  liveSessions: many(liveSessions),
  assignments: many(assignments)
}));
var modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id]
  }),
  lessons: many(lessons)
}));
var lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id]
  }),
  notes: many(lessonNotes),
  bookmarks: many(bookmarks),
  quizzes: many(quizzes)
}));
var insertUserSchema = createInsertSchema(users).pick({
  email: true,
  passwordHash: true,
  name: true,
  imageUrl: true,
  provider: true,
  providerId: true,
  emailVerifiedAt: true,
  role: true,
  domain: true,
  branch: true,
  year: true,
  instructorStatus: true,
  expertiseAreas: true,
  bio: true,
  credentialsUrl: true,
  teachingExperience: true,
  linkedinProfile: true,
  personalWebsite: true,
  qualifications: true
});
var insertRefreshTokenSchema = createInsertSchema(refreshTokens).omit({
  id: true,
  createdAt: true
});
var registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.enum(["student", "instructor"]).optional().default("student"),
  domain: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional()
});
var loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
var changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").max(128)
});
var updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  domain: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
  bio: z.string().max(500).optional(),
  linkedinProfile: z.string().url().optional().or(z.literal("")),
  personalWebsite: z.string().url().optional().or(z.literal(""))
});
var instructorSignupSchema = registerSchema.extend({
  expertiseAreas: z.array(z.string()).min(1, "At least one expertise area is required"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  teachingExperience: z.number().min(0, "Teaching experience must be 0 or greater"),
  qualifications: z.array(z.string()).min(1, "At least one qualification is required"),
  linkedinProfile: z.string().url().optional(),
  personalWebsite: z.string().url().optional()
});
var instructorProfileUpdateSchema = createInsertSchema(users).pick({
  name: true,
  bio: true,
  expertiseAreas: true,
  teachingExperience: true,
  linkedinProfile: true,
  personalWebsite: true,
  qualifications: true,
  imageUrl: true
});
var createInstructorInviteSchema = createInsertSchema(instructorInvites).pick({
  email: true
});
var validateInstructorInviteSchema = z.object({
  token: z.string().min(1, "Token is required")
});
var insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  enrolledCount: true,
  rating: true,
  createdAt: true,
  updatedAt: true
});
var insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true
});
var insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true
});
var insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
  progress: true,
  completedLessons: true,
  lastAccessedAt: true
});
var insertCourseReviewSchema = createInsertSchema(courseReviews).omit({
  id: true,
  helpfulVotes: true,
  createdAt: true,
  updatedAt: true
});
var insertForumThreadSchema = createInsertSchema(forumThreads).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  isPinned: true,
  createdAt: true,
  updatedAt: true
});
var insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  createdAt: true,
  updatedAt: true
});
var userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  totalXP: integer("total_xp").default(0),
  level: integer("level").default(1),
  streak: integer("streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  coursesCompleted: integer("courses_completed").default(0),
  lessonsCompleted: integer("lessons_completed").default(0),
  quizzesCompleted: integer("quizzes_completed").default(0),
  helpfulAnswers: integer("helpful_answers").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  xpReward: integer("xp_reward").default(0),
  category: text("category", { enum: ["learning", "social", "streak", "milestone", "special"] }).notNull(),
  rarity: text("rarity", { enum: ["common", "rare", "epic", "legendary"] }).default("common"),
  requirements: json("requirements").$type().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull()
});
var leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  category: text("category", { enum: ["overall", "weekly", "monthly", "course_specific"] }).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  xp: integer("xp").notNull(),
  rank: integer("rank").notNull(),
  period: text("period"),
  // e.g., "2024-01", "2024-W01"
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var helpCategories = pgTable("help_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  sortOrder: integer("sort_order").default(0)
});
var helpQuestions = pgTable("help_questions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  categoryId: integer("category_id").references(() => helpCategories.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: json("tags").$type().default([]),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  viewCount: integer("view_count").default(0),
  status: text("status", { enum: ["open", "answered", "closed"] }).default("open"),
  bountyXP: integer("bounty_xp").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var helpAnswers = pgTable("help_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => helpQuestions.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  xpRating: integer("xp_rating"),
  // 1-10, only question author can set
  starRating: decimal("star_rating", { precision: 3, scale: 2 }),
  // 1-5 stars, community average
  starRatingCount: integer("star_rating_count").default(0),
  isAccepted: boolean("is_accepted").default(false),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var answerStarRatings = pgTable("answer_star_ratings", {
  id: serial("id").primaryKey(),
  answerId: integer("answer_id").references(() => helpAnswers.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  // 1-5 stars
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var xpTransactions = pgTable("xp_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  sourceType: text("source_type", { enum: ["lesson_completion", "quiz_completion", "helpful_answer", "achievement", "streak_bonus", "course_completion"] }).notNull(),
  sourceId: integer("source_id"),
  // ID of the source (lesson, quiz, answer, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var learningAnalytics = pgTable("learning_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  activityType: text("activity_type", { enum: ["lesson_view", "lesson_complete", "quiz_attempt", "note_taken", "bookmark_added", "forum_post", "video_pause", "video_seek"] }).notNull(),
  duration: integer("duration"),
  // in seconds
  progress: decimal("progress", { precision: 5, scale: 2 }),
  // percentage
  metadata: json("metadata").$type().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var weeklyLearningStats = pgTable("weekly_learning_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  weekStart: timestamp("week_start").notNull(),
  lessonsCompleted: integer("lessons_completed").default(0),
  quizzesCompleted: integer("quizzes_completed").default(0),
  totalStudyTime: integer("total_study_time").default(0),
  // in minutes
  xpEarned: integer("xp_earned").default(0),
  streakDays: integer("streak_days").default(0)
});
var subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  interval: text("interval", { enum: ["monthly", "yearly"] }).notNull(),
  features: json("features").$type().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  status: text("status", { enum: ["active", "cancelled", "expired", "paused"] }).notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var discountCoupons = pgTable("discount_coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type", { enum: ["percentage", "fixed_amount"] }).notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var couponUsage = pgTable("coupon_usage", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").references(() => discountCoupons.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").defaultNow().notNull()
});
var certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  certificateType: text("certificate_type", { enum: ["basic", "verified", "premium"] }).notNull(),
  certificateUrl: text("certificate_url"),
  verificationCode: text("verification_code").unique(),
  issuedAt: timestamp("issued_at").defaultNow().notNull()
});
var insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true
});
var insertHelpQuestionSchema = createInsertSchema(helpQuestions).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  viewCount: true,
  status: true,
  createdAt: true,
  updatedAt: true
});
var insertHelpAnswerSchema = createInsertSchema(helpAnswers).omit({
  id: true,
  xpRating: true,
  starRating: true,
  starRatingCount: true,
  isAccepted: true,
  upvotes: true,
  downvotes: true,
  createdAt: true,
  updatedAt: true
});
var insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true
});
var insertDiscountCouponSchema = createInsertSchema(discountCoupons).omit({
  id: true,
  usedCount: true,
  createdAt: true
});
var insertStudyGroupSchema = createInsertSchema(studyGroups).omit({
  id: true,
  memberCount: true,
  createdAt: true
});
var insertLessonNoteSchema = createInsertSchema(lessonNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true
});
var insertLiveSessionSchema = createInsertSchema(liveSessions).omit({
  id: true,
  status: true,
  createdAt: true
});
var insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true
});
var insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({
  id: true,
  grade: true,
  feedback: true,
  status: true,
  submittedAt: true,
  gradedAt: true
});
var insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  score: true,
  passed: true,
  completedAt: true,
  timeSpent: true
});
var aiScores = pgTable("ai_scores", {
  id: serial("id").primaryKey(),
  answerId: integer("answer_id").references(() => helpAnswers.id).notNull(),
  aiScore: decimal("ai_score", { precision: 3, scale: 1 }).notNull(),
  // 0.0 to 10.0
  summaryComment: text("summary_comment"),
  grammarScore: decimal("grammar_score", { precision: 3, scale: 1 }),
  clarityScore: decimal("clarity_score", { precision: 3, scale: 1 }),
  correctnessScore: decimal("correctness_score", { precision: 3, scale: 1 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var skillProgress = pgTable("skill_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  skillTag: text("skill_tag").notNull(),
  // DevOps, Python, Frontend, etc.
  totalXP: integer("total_xp").default(0),
  questionsAnswered: integer("questions_answered").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull()
});
var missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").notNull(),
  skillTag: text("skill_tag"),
  // Optional skill focus
  missionType: text("mission_type", { enum: ["daily", "weekly", "special"] }).notNull().default("daily"),
  requirements: json("requirements").$type().notNull(),
  isActive: boolean("is_active").default(true),
  validFrom: timestamp("valid_from").defaultNow().notNull(),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var missionProgress = pgTable("mission_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  missionId: integer("mission_id").references(() => missions.id).notNull(),
  currentProgress: integer("current_progress").default(0),
  targetProgress: integer("target_progress").notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  xpClaimed: boolean("xp_claimed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var answerFeedback = pgTable("answer_feedback", {
  id: serial("id").primaryKey(),
  answerId: integer("answer_id").references(() => helpAnswers.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  voteType: text("vote_type", { enum: ["up", "down"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var questionRooms = pgTable("question_rooms", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => helpQuestions.id).notNull(),
  isActive: boolean("is_active").default(true),
  participantCount: integer("participant_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var roomParticipants = pgTable("room_participants", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => questionRooms.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type", { enum: ["xp_gained", "answer_received", "level_up", "mission_complete", "badge_earned"] }).notNull(),
  isRead: boolean("is_read").default(false),
  relatedId: integer("related_id"),
  // Answer ID, Mission ID, etc.
  relatedType: text("related_type"),
  // 'answer', 'mission', 'course', etc.
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userUnlocks = pgTable("user_unlocks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  unlockType: text("unlock_type").notNull(),
  // 'mentor_status', 'premium_content', etc.
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  requirements: json("requirements").$type()
});
var aiMentorResponses = pgTable("ai_mentor_responses", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => helpQuestions.id).notNull(),
  aiResponse: text("ai_response").notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).notNull(),
  // 0.00 to 1.00
  triggerReason: text("trigger_reason").notNull(),
  // '24_hour_timeout', 'no_human_answers', etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertAIScoreSchema = createInsertSchema(aiScores).omit({
  id: true,
  createdAt: true
});
var insertSkillProgressSchema = createInsertSchema(skillProgress).omit({
  id: true,
  lastUpdated: true
});
var insertMissionSchema = createInsertSchema(missions).omit({
  id: true,
  createdAt: true
});
var insertMissionProgressSchema = createInsertSchema(missionProgress).omit({
  id: true,
  createdAt: true
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/controllers/aiController.ts
import { eq, and, sql } from "drizzle-orm";

// server/services/aiService.ts
init_logger();
var AIService = class {
  static API_BASE_URL = "https://api.deepseek.com/v1";
  static API_KEY = process.env.DEEPSEEK_API_KEY;
  static async makeAPICall(messages, temperature = 0.7) {
    if (!this.API_KEY) {
      throw new Error("DEEPSEEK_API_KEY is not configured");
    }
    const response = await fetch(`${this.API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature,
        max_tokens: 1500,
        stream: false
      })
    });
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }
  // AI Lesson Summarizer
  static async generateLessonSummary(lessonContent, lessonTitle) {
    try {
      const messages = [
        {
          role: "system",
          content: "You are an expert educational AI assistant. Your task is to analyze lesson content and create comprehensive summaries that help students learn effectively."
        },
        {
          role: "user",
          content: `
            Please analyze this lesson content and provide:
            1. 5-7 key points from the lesson
            2. 3-5 main takeaways students should remember
            3. A concise summary (2-3 sentences)

            Lesson Title: ${lessonTitle}
            
            Lesson Content:
            ${lessonContent}

            Please format your response as JSON with the following structure:
            {
              "keyPoints": ["point1", "point2", ...],
              "takeaways": ["takeaway1", "takeaway2", ...],
              "summary": "Brief summary text"
            }
          `
        }
      ];
      const response = await this.makeAPICall(messages, 0.3);
      const content = response.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        logger.info("Generated lesson summary", {
          lessonTitle,
          keyPointsCount: parsed.keyPoints?.length,
          takeawaysCount: parsed.takeaways?.length
        });
        return parsed;
      } catch (parseError) {
        logger.error("Failed to parse AI summary response", { content, parseError });
        throw new Error("Invalid AI response format");
      }
    } catch (error) {
      logger.error("AI lesson summary generation failed", { error, lessonTitle });
      throw new Error("Failed to generate lesson summary");
    }
  }
  // AI Practice Questions Generator
  static async generatePracticeQuestions(lessonContent, lessonTitle, difficulty = "medium") {
    try {
      const messages = [
        {
          role: "system",
          content: `You are an expert quiz creator for educational content. Create engaging, accurate multiple-choice questions that test understanding at a ${difficulty} level.`
        },
        {
          role: "user",
          content: `
            Create 5 multiple-choice practice questions based on this lesson content.
            
            Lesson Title: ${lessonTitle}
            Difficulty Level: ${difficulty}
            
            Lesson Content:
            ${lessonContent}

            For each question, provide:
            - A clear, specific question
            - 4 multiple choice options (A, B, C, D)
            - The correct answer (0-3 index)
            - A brief explanation of why the answer is correct

            Format as JSON:
            {
              "questions": [
                {
                  "question": "Question text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correctAnswer": 2,
                  "explanation": "Explanation text",
                  "difficulty": "${difficulty}"
                }
              ]
            }
          `
        }
      ];
      const response = await this.makeAPICall(messages, 0.4);
      const content = response.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        logger.info("Generated practice questions", {
          lessonTitle,
          difficulty,
          questionCount: parsed.questions?.length
        });
        return parsed;
      } catch (parseError) {
        logger.error("Failed to parse AI questions response", { content, parseError });
        throw new Error("Invalid AI response format");
      }
    } catch (error) {
      logger.error("AI practice questions generation failed", { error, lessonTitle, difficulty });
      throw new Error("Failed to generate practice questions");
    }
  }
  // AI Study Buddy Chat
  static async getChatResponse(userMessage, conversationContext, lessonContext) {
    try {
      const systemPrompt = `You are a helpful AI study buddy for students. You help them understand concepts, answer questions, and provide study guidance. 
      ${lessonContext ? `Current lesson context: ${lessonContext}` : ""}
      
      Guidelines:
      - Be encouraging and supportive
      - Explain concepts clearly with examples
      - Ask follow-up questions to ensure understanding
      - Suggest study strategies when appropriate
      - Keep responses concise but informative`;
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationContext.slice(-10),
        // Keep last 10 messages for context
        { role: "user", content: userMessage }
      ];
      const response = await this.makeAPICall(messages, 0.7);
      const aiResponse = response.choices[0].message.content;
      const suggestionMessages = [
        {
          role: "system",
          content: "Based on the conversation, suggest 3 short study tips or follow-up questions the student might find helpful. Return as a JSON array of strings."
        },
        { role: "user", content: `Conversation: ${userMessage}
Response: ${aiResponse}

Suggest 3 helpful study tips or questions:` }
      ];
      const suggestionResponse = await this.makeAPICall(suggestionMessages, 0.5);
      let suggestions = [];
      try {
        suggestions = JSON.parse(suggestionResponse.choices[0].message.content);
      } catch {
        suggestions = [
          "Try explaining this concept in your own words",
          "What questions do you still have about this topic?",
          "Would you like to see some practice examples?"
        ];
      }
      logger.info("Generated AI chat response", {
        userMessage: userMessage.substring(0, 100),
        responseLength: aiResponse.length
      });
      return {
        response: aiResponse,
        suggestions
      };
    } catch (error) {
      logger.error("AI chat response generation failed", { error, userMessage });
      throw new Error("Failed to generate chat response");
    }
  }
  // AI Skill Gap Analyzer
  static async analyzeSkillGaps(userProgress, courseContent) {
    try {
      const messages = [
        {
          role: "system",
          content: "You are an expert learning analytics AI that identifies skill gaps and provides personalized learning recommendations."
        },
        {
          role: "user",
          content: `
            Analyze this student's learning progress and identify skill gaps:

            Progress Data:
            - Completed Lessons: ${userProgress.completedLessons.length}
            - Quiz Performance: ${JSON.stringify(userProgress.quizScores)}
            - Weak Areas: ${userProgress.weakAreas.join(", ")}
            - Strong Areas: ${userProgress.strongAreas.join(", ")}

            Course Content Overview:
            ${courseContent.substring(0, 1e3)}...

            Please provide:
            1. Identified skill gaps with proficiency levels and priorities
            2. Personalized recommendations for improvement
            3. Specific next steps for the student

            Format as JSON:
            {
              "skillGaps": [
                {
                  "skill": "Skill name",
                  "proficiencyLevel": "beginner|intermediate|advanced",
                  "recommendedActions": ["action1", "action2"],
                  "priority": "high|medium|low"
                }
              ],
              "personalizedRecommendations": ["recommendation1", "recommendation2"],
              "nextSteps": ["step1", "step2", "step3"]
            }
          `
        }
      ];
      const response = await this.makeAPICall(messages, 0.3);
      const content = response.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        logger.info("Generated skill gap analysis", {
          completedLessons: userProgress.completedLessons.length,
          skillGapsFound: parsed.skillGaps?.length
        });
        return parsed;
      } catch (parseError) {
        logger.error("Failed to parse AI skill gap response", { content, parseError });
        throw new Error("Invalid AI response format");
      }
    } catch (error) {
      logger.error("AI skill gap analysis failed", { error });
      throw new Error("Failed to analyze skill gaps");
    }
  }
  // AI Content Generator for Instructors
  static async generateLessonContent(topic, learningObjectives, targetAudience, duration) {
    try {
      const messages = [
        {
          role: "system",
          content: "You are an expert instructional designer creating engaging educational content."
        },
        {
          role: "user",
          content: `
            Create lesson content for the following specifications:

            Topic: ${topic}
            Learning Objectives: ${learningObjectives.join(", ")}
            Target Audience: ${targetAudience}
            Duration: ${duration} minutes

            Please provide:
            1. A detailed lesson outline
            2. Comprehensive lesson content
            3. Interactive activities or exercises
            4. Assessment questions

            Format as JSON:
            {
              "outline": ["section1", "section2", ...],
              "content": "Full lesson content with explanations and examples",
              "activities": ["activity1", "activity2", ...],
              "assessmentQuestions": ["question1", "question2", ...]
            }
          `
        }
      ];
      const response = await this.makeAPICall(messages, 0.5);
      const content = response.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        logger.info("Generated lesson content", {
          topic,
          targetAudience,
          duration
        });
        return parsed;
      } catch (parseError) {
        logger.error("Failed to parse AI lesson content response", { content, parseError });
        throw new Error("Invalid AI response format");
      }
    } catch (error) {
      logger.error("AI lesson content generation failed", { error, topic });
      throw new Error("Failed to generate lesson content");
    }
  }
  // Check API health
  static async checkHealth() {
    try {
      const messages = [
        { role: "user", content: "Hello, are you working?" }
      ];
      const response = await this.makeAPICall(messages, 0.1);
      return response.choices && response.choices.length > 0;
    } catch (error) {
      logger.error("AI service health check failed", { error });
      return false;
    }
  }
};

// server/controllers/aiController.ts
init_logger();
var healthCheck = async (req, res) => {
  try {
    const testResponse = await AIService.checkHealth();
    res.json({
      status: "healthy",
      aiService: testResponse ? "connected" : "disconnected",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      features: {
        answerAnalysis: true,
        skillTracking: true,
        missionSystem: true,
        smartUnlocks: true,
        aiMentor: true,
        qualityTracking: true
      }
    });
  } catch (error) {
    logger.error("AI health check failed:", error);
    res.status(500).json({
      status: "unhealthy",
      error: "AI service connection failed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
};

// server/controllers/authController.ts
import passport from "passport";

// server/storage/authStorage.ts
import { eq as eq2, and as and2, gt, lt, or } from "drizzle-orm";
var AuthStorage = class {
  // User operations
  static async getUserById(id) {
    const [user] = await db.select().from(users).where(eq2(users.id, id));
    return user;
  }
  static async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq2(users.email, email));
    return user;
  }
  static async getUserByProviderId(provider, providerId) {
    const [user] = await db.select().from(users).where(
      and2(
        eq2(users.provider, provider),
        eq2(users.providerId, providerId)
      )
    );
    return user;
  }
  static async createUser(userData) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  static async updateUser(id, updates) {
    const [user] = await db.update(users).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq2(users.id, id)).returning();
    return user;
  }
  static async linkProvider(userId, provider, providerId) {
    const [user] = await db.update(users).set({
      provider,
      providerId,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq2(users.id, userId)).returning();
    return user;
  }
  static async updateLastActivity(userId) {
    await db.update(users).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq2(users.id, userId));
  }
  // Refresh token operations
  static async createRefreshToken(tokenData) {
    const [token] = await db.insert(refreshTokens).values(tokenData).returning();
    return token;
  }
  static async getRefreshTokenByJti(jti) {
    const now = /* @__PURE__ */ new Date();
    const [token] = await db.select().from(refreshTokens).where(
      and2(
        eq2(refreshTokens.jti, jti),
        eq2(refreshTokens.revoked, false),
        gt(refreshTokens.expiresAt, now)
      )
    );
    return token;
  }
  static async revokeRefreshToken(jti) {
    await db.update(refreshTokens).set({ revoked: true }).where(eq2(refreshTokens.jti, jti));
  }
  static async revokeAllUserRefreshTokens(userId) {
    await db.update(refreshTokens).set({ revoked: true }).where(eq2(refreshTokens.userId, userId));
  }
  static async cleanupExpiredRefreshTokens() {
    const now = /* @__PURE__ */ new Date();
    await db.delete(refreshTokens).where(
      or(
        eq2(refreshTokens.revoked, true),
        lt(refreshTokens.expiresAt, now)
      )
    );
  }
  // User verification
  static async markEmailAsVerified(userId) {
    await db.update(users).set({
      emailVerifiedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq2(users.id, userId));
  }
  // Account management
  static async updatePassword(userId, passwordHash) {
    await db.update(users).set({
      passwordHash,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq2(users.id, userId));
  }
  static async deleteUser(userId) {
    await this.revokeAllUserRefreshTokens(userId);
    await db.delete(users).where(eq2(users.id, userId));
  }
  // Password reset token operations (using in-memory storage for now)
  static passwordResetTokens = /* @__PURE__ */ new Map();
  // Email verification token operations (using in-memory storage for now)
  static emailVerificationTokens = /* @__PURE__ */ new Map();
  static async createPasswordResetToken(data) {
    this.passwordResetTokens.set(data.token, { userId: data.userId, expiresAt: data.expiresAt });
  }
  static async findPasswordResetToken(token) {
    const tokenData = this.passwordResetTokens.get(token);
    if (!tokenData) {
      return null;
    }
    if (tokenData.expiresAt < /* @__PURE__ */ new Date()) {
      this.passwordResetTokens.delete(token);
      return null;
    }
    return tokenData;
  }
  static async deletePasswordResetToken(token) {
    this.passwordResetTokens.delete(token);
  }
  // Email verification token operations
  static async createEmailVerificationToken(data) {
    this.emailVerificationTokens.set(data.token, { userId: data.userId, expiresAt: data.expiresAt });
  }
  static async findEmailVerificationToken(token) {
    const tokenData = this.emailVerificationTokens.get(token);
    if (!tokenData) {
      return null;
    }
    if (tokenData.expiresAt < /* @__PURE__ */ new Date()) {
      this.emailVerificationTokens.delete(token);
      return null;
    }
    return tokenData;
  }
  static async deleteEmailVerificationToken(token) {
    this.emailVerificationTokens.delete(token);
  }
  static async verifyUserEmail(userId) {
    await this.markEmailAsVerified(userId);
  }
};

// server/controllers/authController.ts
init_auth();
init_email();

// server/utils/errors.ts
var ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_TOKEN: "INVALID_TOKEN",
  REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED",
  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  PASSWORD_TOO_WEAK: "PASSWORD_TOO_WEAK",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  INVALID_EMAIL: "INVALID_EMAIL",
  // Rate limiting
  RATE_LIMITED: "RATE_LIMITED",
  TOO_MANY_ATTEMPTS: "TOO_MANY_ATTEMPTS",
  // General errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NOT_FOUND: "NOT_FOUND",
  FORBIDDEN: "FORBIDDEN",
  UNAUTHORIZED: "UNAUTHORIZED",
  // OAuth errors
  GOOGLE_AUTH_FAILED: "GOOGLE_AUTH_FAILED",
  OAUTH_CANCELLED: "OAUTH_CANCELLED"
};
var createErrorResponse = (error, code, details) => ({
  success: false,
  error,
  code,
  ...details && { details }
});
var AUTH_ERRORS = {
  invalidCredentials: () => createErrorResponse(
    "Invalid email or password",
    ERROR_CODES.INVALID_CREDENTIALS
  ),
  tokenExpired: () => createErrorResponse(
    "Access token has expired",
    ERROR_CODES.TOKEN_EXPIRED
  ),
  invalidToken: () => createErrorResponse(
    "Invalid or malformed token",
    ERROR_CODES.INVALID_TOKEN
  ),
  refreshTokenExpired: () => createErrorResponse(
    "Refresh token has expired. Please log in again",
    ERROR_CODES.REFRESH_TOKEN_EXPIRED
  ),
  emailExists: () => createErrorResponse(
    "An account with this email already exists",
    ERROR_CODES.EMAIL_ALREADY_EXISTS
  ),
  weakPassword: (details) => createErrorResponse(
    "Password does not meet security requirements",
    ERROR_CODES.PASSWORD_TOO_WEAK,
    { requirements: details }
  ),
  rateLimited: (retryAfter) => createErrorResponse(
    "Too many attempts. Please try again later",
    ERROR_CODES.RATE_LIMITED,
    { retryAfter }
  ),
  googleAuthFailed: () => createErrorResponse(
    "Google authentication failed",
    ERROR_CODES.GOOGLE_AUTH_FAILED
  ),
  unauthorized: () => createErrorResponse(
    "Authentication required",
    ERROR_CODES.UNAUTHORIZED
  ),
  forbidden: () => createErrorResponse(
    "Insufficient permissions",
    ERROR_CODES.FORBIDDEN
  )
};

// server/controllers/authController.ts
init_logger();
var AuthController = class {
  // User registration with email/password
  static async register(req, res) {
    const startTime = Date.now();
    const requestId = `reg-${Math.random().toString(36).substr(2, 9)}`;
    logger.info(`[${requestId}] Registration request started`, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      body: { ...req.body, password: "[REDACTED]" }
    });
    try {
      logger.info(`[${requestId}] Step 1: Validating request body`);
      const validatedData = registerSchema.parse(req.body);
      const { email, password, name, role, domain, branch, year } = validatedData;
      logger.info(`[${requestId}] Request body validation successful`, {
        email,
        name,
        role: role || "student",
        hasOptionalFields: { domain: !!domain, branch: !!branch, year: !!year }
      });
      logger.info(`[${requestId}] Step 2: Normalizing email`);
      const normalizedEmail = email.toLowerCase().trim();
      logger.info(`[${requestId}] Email normalized: ${email} -> ${normalizedEmail}`);
      logger.info(`[${requestId}] Step 3: Validating email format`);
      if (!validateEmail(normalizedEmail)) {
        logger.warn(`[${requestId}] Email validation failed for: ${normalizedEmail}`);
        res.status(400).json({
          success: false,
          error: "Invalid email format",
          code: ERROR_CODES.INVALID_EMAIL
        });
        return;
      }
      logger.info(`[${requestId}] Email format validation passed`);
      logger.info(`[${requestId}] Step 4: Validating password strength`);
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        logger.warn(`[${requestId}] Password validation failed`, {
          errors: passwordValidation.errors
        });
        res.status(400).json(AUTH_ERRORS.weakPassword(passwordValidation.errors));
        return;
      }
      logger.info(`[${requestId}] Password validation passed`);
      logger.info(`[${requestId}] Step 5: Checking for existing user`);
      const existingUser = await AuthStorage.getUserByEmail(normalizedEmail);
      if (existingUser) {
        logger.warn(`[${requestId}] Registration failed - user already exists`, {
          email: normalizedEmail,
          existingUserId: existingUser.id
        });
        res.status(409).json(AUTH_ERRORS.emailExists());
        return;
      }
      logger.info(`[${requestId}] No existing user found - proceeding with registration`);
      logger.info(`[${requestId}] Step 6: Hashing password`);
      const hashStartTime = Date.now();
      const passwordHash = await hashPassword(password);
      const hashDuration = Date.now() - hashStartTime;
      logger.info(`[${requestId}] Password hashed successfully (${hashDuration}ms)`);
      logger.info(`[${requestId}] Step 7: Creating user in database`);
      const dbStartTime = Date.now();
      const user = await AuthStorage.createUser({
        email: normalizedEmail,
        passwordHash,
        name,
        provider: "local",
        role: role || "student",
        domain,
        branch,
        year
      });
      const dbDuration = Date.now() - dbStartTime;
      logger.info(`[${requestId}] User created successfully in database (${dbDuration}ms)`, {
        userId: user.id,
        email: user.email,
        role: user.role
      });
      logger.info(`[${requestId}] Step 8: Generating authentication tokens`);
      const tokenStartTime = Date.now();
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });
      const { token: refreshToken, jti } = generateRefreshToken(user.id);
      const tokenDuration = Date.now() - tokenStartTime;
      logger.info(`[${requestId}] Tokens generated successfully (${tokenDuration}ms)`, {
        accessTokenLength: accessToken.length,
        refreshTokenJti: jti
      });
      logger.info(`[${requestId}] Step 9: Storing refresh token in database`);
      const refreshStartTime = Date.now();
      await AuthStorage.createRefreshToken({
        userId: user.id,
        jti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
        // 7 days
        userAgent: req.get("User-Agent") || null,
        ipAddress: req.ip || null
      });
      const refreshDuration = Date.now() - refreshStartTime;
      logger.info(`[${requestId}] Refresh token stored successfully (${refreshDuration}ms)`);
      logger.info(`[${requestId}] Step 10: Setting refresh token cookie`);
      res.cookie("refreshToken", refreshToken, getCookieOptions());
      logger.info(`[${requestId}] Refresh token cookie set`);
      logger.info(`[${requestId}] Step 11: Sending email verification`);
      const emailStartTime = Date.now();
      const emailToken = generateSecureToken();
      await AuthStorage.createEmailVerificationToken({
        userId: user.id,
        token: emailToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3)
      });
      const emailResult = await sendVerificationEmail(user.email, user.name, emailToken);
      const emailDuration = Date.now() - emailStartTime;
      const emailSent = typeof emailResult === "boolean" ? emailResult : emailResult.success;
      const testData = typeof emailResult === "object" && emailResult.testData ? emailResult.testData : void 0;
      if (!emailSent) {
        logger.warn(`[${requestId}] Email verification failed to send`, { email: user.email });
      }
      logger.info(`[${requestId}] Email verification ${emailSent ? "sent" : "failed"} (${emailDuration}ms)`, {
        hasTestData: !!testData
      });
      const totalDuration = Date.now() - startTime;
      logger.info(`[${requestId}] Registration completed successfully`, {
        userId: user.id,
        email: user.email,
        emailVerificationSent: emailSent,
        totalDurationMs: totalDuration,
        performance: {
          validation: "N/A",
          passwordHashing: `${hashDuration}ms`,
          databaseInsert: `${dbDuration}ms`,
          tokenGeneration: `${tokenDuration}ms`,
          refreshTokenStorage: `${refreshDuration}ms`,
          emailSending: `${emailDuration}ms`
        }
      });
      const responseData = {
        user: sanitizeUserData(user),
        accessToken,
        emailVerificationSent: emailSent
      };
      if (testData && process.env.NODE_ENV !== "production") {
        responseData.testData = testData;
      }
      res.status(201).json({
        success: true,
        message: "User registered successfully. Please check your email to verify your account.",
        data: responseData
      });
    } catch (error) {
      const totalDuration = Date.now() - startTime;
      logger.error(`[${requestId}] Registration failed after ${totalDuration}ms`, {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error,
        ip: req.ip,
        userAgent: req.get("User-Agent")
      });
      if (error instanceof Error) {
        if (error.message.includes("duplicate key")) {
          logger.warn(`[${requestId}] Database constraint violation - duplicate user`, { error: error.message });
          res.status(409).json({
            success: false,
            error: "An account with this email already exists"
          });
          return;
        }
        if (error.message.includes("validation")) {
          logger.warn(`[${requestId}] Schema validation error`, { error: error.message });
          res.status(400).json({
            success: false,
            error: "Invalid registration data provided"
          });
          return;
        }
      }
      res.status(500).json({
        success: false,
        error: "Registration failed due to internal server error"
      });
    }
  }
  // User login with email/password
  static async login(req, res, next) {
    try {
      const validatedData = loginSchema.parse(req.body);
      passport.authenticate("local", { session: false }, async (err, user, info) => {
        if (err) {
          logger.error("Login error:", err);
          res.status(500).json({
            success: false,
            error: "Login failed"
          });
          return;
        }
        if (!user) {
          res.status(401).json({
            success: false,
            error: info?.message || "Invalid credentials"
          });
          return;
        }
        try {
          logger.info("User logged in successfully", { userId: user.id, email: user.email });
          const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
          });
          const { token: refreshToken, jti } = generateRefreshToken(user.id);
          await AuthStorage.createRefreshToken({
            userId: user.id,
            jti,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
            // 7 days
            userAgent: req.get("User-Agent") || null,
            ipAddress: req.ip || null
          });
          res.cookie("refreshToken", refreshToken, getCookieOptions());
          res.json({
            success: true,
            message: "Login successful",
            data: {
              user: sanitizeUserData(user),
              accessToken
            }
          });
        } catch (tokenError) {
          logger.error("Token generation error:", tokenError);
          res.status(500).json({
            success: false,
            error: "Login failed"
          });
        }
      })(req, res, next);
    } catch (error) {
      logger.error("Login validation error:", error);
      res.status(400).json({
        success: false,
        error: "Invalid request data"
      });
    }
  }
  // Google OAuth redirect
  static googleAuth(req, res, next) {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account"
      // Force Google account selection
    })(req, res, next);
  }
  // Google OAuth callback
  static async googleCallback(req, res, next) {
    passport.authenticate("google", { session: false }, async (err, user) => {
      if (err) {
        logger.error("Google OAuth error:", err);
        res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=google_auth_failed`);
        return;
      }
      if (!user) {
        res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=google_auth_cancelled`);
        return;
      }
      try {
        logger.info("Google OAuth successful", { userId: user.id, email: user.email });
        const accessToken = generateAccessToken({
          userId: user.id,
          email: user.email,
          role: user.role
        });
        const { token: refreshToken, jti } = generateRefreshToken(user.id);
        await AuthStorage.createRefreshToken({
          userId: user.id,
          jti,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
          // 7 days
          userAgent: req.get("User-Agent") || null,
          ipAddress: req.ip || null
        });
        res.cookie("refreshToken", refreshToken, getCookieOptions());
        res.redirect(`${process.env.FRONTEND_URL}/auth/google-success`);
      } catch (tokenError) {
        logger.error("Google OAuth token generation error:", tokenError);
        res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=token_generation_failed`);
      }
    })(req, res, next);
  }
  // Refresh access token
  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: "No refresh token provided"
        });
        return;
      }
      const payload = verifyRefreshToken(refreshToken);
      const storedToken = await AuthStorage.getRefreshTokenByJti(payload.jti);
      if (!storedToken) {
        res.status(401).json({
          success: false,
          error: "Invalid refresh token"
        });
        return;
      }
      const user = await AuthStorage.getUserById(payload.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          error: "User not found"
        });
        return;
      }
      await AuthStorage.revokeRefreshToken(payload.jti);
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });
      const { token: newRefreshToken, jti: newJti } = generateRefreshToken(user.id);
      await AuthStorage.createRefreshToken({
        userId: user.id,
        jti: newJti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
        // 7 days
        userAgent: req.get("User-Agent") || null,
        ipAddress: req.ip || null
      });
      res.cookie("refreshToken", newRefreshToken, getCookieOptions());
      res.json({
        success: true,
        data: {
          accessToken,
          user: sanitizeUserData(user)
        }
      });
    } catch (error) {
      logger.error("Token refresh error:", error);
      res.status(401).json({
        success: false,
        error: "Token refresh failed"
      });
    }
  }
  // Logout user
  static async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        try {
          const payload = verifyRefreshToken(refreshToken);
          await AuthStorage.revokeRefreshToken(payload.jti);
        } catch (error) {
          logger.debug("Error revoking refresh token during logout:", error);
        }
      }
      res.clearCookie("refreshToken");
      res.json({
        success: true,
        message: "Logout successful"
      });
    } catch (error) {
      logger.error("Logout error:", error);
      res.status(500).json({
        success: false,
        error: "Logout failed"
      });
    }
  }
  // Get current user profile
  static async getProfile(req, res) {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Not authenticated"
        });
        return;
      }
      const user = await AuthStorage.getUserById(req.user.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found"
        });
        return;
      }
      res.json({
        success: true,
        data: {
          user: sanitizeUserData(user)
        }
      });
    } catch (error) {
      logger.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch profile"
      });
    }
  }
  // Update user profile
  static async updateProfile(req, res) {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Not authenticated"
        });
        return;
      }
      const validatedData = updateProfileSchema.parse(req.body);
      const user = await AuthStorage.updateUser(req.user.id, validatedData);
      logger.info("User profile updated", { userId: user.id });
      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: sanitizeUserData(user)
        }
      });
    } catch (error) {
      logger.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update profile"
      });
    }
  }
  // Forgot password - request reset email
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({
          success: false,
          error: "Email is required",
          code: ERROR_CODES.VALIDATION_ERROR
        });
        return;
      }
      const normalizedEmail = email.toLowerCase().trim();
      if (!validateEmail(normalizedEmail)) {
        res.status(400).json({
          success: false,
          error: "Invalid email format",
          code: ERROR_CODES.INVALID_EMAIL
        });
        return;
      }
      const user = await AuthStorage.getUserByEmail(normalizedEmail);
      let testData = void 0;
      if (user && user.passwordHash) {
        const resetToken = generateSecureToken();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1e3);
        await AuthStorage.createPasswordResetToken({
          userId: user.id,
          token: resetToken,
          expiresAt
        });
        const emailResult = await sendPasswordResetEmail(user.email, user.name, resetToken);
        const emailSent = typeof emailResult === "boolean" ? emailResult : emailResult.success;
        testData = typeof emailResult === "object" && emailResult.testData ? emailResult.testData : void 0;
        logger.info("Password reset requested", {
          userId: user.id,
          email: user.email,
          emailSent,
          hasTestData: !!testData
        });
        if (!emailSent) {
          logger.warn("Password reset email failed to send", { email: user.email });
        }
      }
      const responseData = {
        success: true,
        message: "If an account with that email exists, a password reset link has been sent"
      };
      if (user && testData && process.env.NODE_ENV !== "production") {
        responseData.testData = testData;
      }
      res.json(responseData);
    } catch (error) {
      logger.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process password reset request"
      });
    }
  }
  // Reset password with token
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          error: "Reset token and new password are required"
        });
        return;
      }
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        res.status(400).json(AUTH_ERRORS.weakPassword(passwordValidation.errors));
        return;
      }
      const resetRecord = await AuthStorage.findPasswordResetToken(token);
      if (!resetRecord || resetRecord.expiresAt < /* @__PURE__ */ new Date()) {
        res.status(400).json({
          success: false,
          error: "Invalid or expired reset token",
          code: ERROR_CODES.INVALID_TOKEN
        });
        return;
      }
      const newPasswordHash = await hashPassword(newPassword);
      await AuthStorage.updatePassword(resetRecord.userId, newPasswordHash);
      await AuthStorage.deletePasswordResetToken(token);
      await AuthStorage.revokeAllUserRefreshTokens(resetRecord.userId);
      logger.info("Password reset successful", { userId: resetRecord.userId });
      res.json({
        success: true,
        message: "Password has been reset successfully. Please log in with your new password."
      });
    } catch (error) {
      logger.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to reset password"
      });
    }
  }
  // Change password
  static async changePassword(req, res) {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Not authenticated"
        });
        return;
      }
      const validatedData = changePasswordSchema.parse(req.body);
      const { currentPassword, newPassword } = validatedData;
      const user = await AuthStorage.getUserById(req.user.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found"
        });
        return;
      }
      if (!user.passwordHash) {
        res.status(400).json({
          success: false,
          error: "Cannot change password for OAuth-only accounts"
        });
        return;
      }
      const { comparePassword: comparePassword2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
      const isValidPassword = await comparePassword2(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: "Current password is incorrect"
        });
        return;
      }
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          error: "New password validation failed",
          details: passwordValidation.errors
        });
        return;
      }
      const newPasswordHash = await hashPassword(newPassword);
      await AuthStorage.updatePassword(user.id, newPasswordHash);
      await AuthStorage.revokeAllUserRefreshTokens(user.id);
      logger.info("User password changed", { userId: user.id });
      res.json({
        success: true,
        message: "Password changed successfully. Please log in again."
      });
    } catch (error) {
      logger.error("Change password error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to change password"
      });
    }
  }
};

// server/controllers/emailController.ts
init_logger();
var EmailController = class {
  // Verify email address
  static async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        res.status(400).json({
          success: false,
          error: "Verification token is required",
          code: ERROR_CODES.VALIDATION_ERROR
        });
        return;
      }
      const tokenData = await AuthStorage.findEmailVerificationToken(token);
      if (!tokenData) {
        res.status(400).json({
          success: false,
          error: "Invalid or expired verification token",
          code: ERROR_CODES.INVALID_TOKEN
        });
        return;
      }
      const user = await AuthStorage.getUserById(tokenData.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found",
          code: ERROR_CODES.INVALID_TOKEN
        });
        return;
      }
      if (user.emailVerifiedAt) {
        res.json({
          success: true,
          message: "Email has already been verified",
          data: { alreadyVerified: true }
        });
        return;
      }
      await AuthStorage.verifyUserEmail(tokenData.userId);
      await AuthStorage.deleteEmailVerificationToken(token);
      logger.info("Email verification successful", { userId: tokenData.userId, email: user.email });
      res.json({
        success: true,
        message: "Email verified successfully! You can now access all features.",
        data: { verified: true }
      });
    } catch (error) {
      logger.error("Email verification error:", error);
      res.status(500).json({
        success: false,
        error: "Email verification failed"
      });
    }
  }
  // Resend verification email
  static async resendVerification(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({
          success: false,
          error: "Email is required",
          code: ERROR_CODES.VALIDATION_ERROR
        });
        return;
      }
      const normalizedEmail = email.toLowerCase().trim();
      const user = await AuthStorage.getUserByEmail(normalizedEmail);
      if (!user) {
        res.json({
          success: true,
          message: "If an account with that email exists and is unverified, a verification email has been sent"
        });
        return;
      }
      if (user.emailVerifiedAt) {
        res.json({
          success: true,
          message: "Email is already verified"
        });
        return;
      }
      const { generateSecureToken: generateSecureToken2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
      const { sendVerificationEmail: sendVerificationEmail2 } = await Promise.resolve().then(() => (init_email(), email_exports));
      const emailToken = generateSecureToken2();
      await AuthStorage.createEmailVerificationToken({
        userId: user.id,
        token: emailToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3)
      });
      const emailSent = await sendVerificationEmail2(user.email, user.name, emailToken);
      if (!emailSent) {
        logger.warn("Resend verification email failed", { email: user.email });
      }
      logger.info("Verification email resent", { userId: user.id, email: user.email, sent: emailSent });
      res.json({
        success: true,
        message: "Verification email has been sent"
      });
    } catch (error) {
      logger.error("Resend verification error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to resend verification email"
      });
    }
  }
};

// server/middleware/auth.ts
init_auth();
init_logger();
var extractTokenFromHeader = (req) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }
  return parts[1];
};
var authenticateJWT = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req);
    if (!token) {
      res.status(401).json({
        success: false,
        error: "No authentication token provided"
      });
      return;
    }
    const payload = verifyAccessToken(token);
    const user = await AuthStorage.getUserById(payload.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: "User not found"
      });
      return;
    }
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
      imageUrl: user.imageUrl
    };
    next();
  } catch (error) {
    logger.error("JWT authentication error:", error);
    if (error instanceof Error) {
      if (error.message === "Access token expired") {
        res.status(401).json({
          success: false,
          error: "Token expired",
          code: "TOKEN_EXPIRED"
        });
        return;
      } else if (error.message === "Invalid access token") {
        res.status(401).json({
          success: false,
          error: "Invalid token",
          code: "INVALID_TOKEN"
        });
        return;
      }
    }
    res.status(401).json({
      success: false,
      error: "Authentication failed"
    });
  }
};
var requireAuth = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: "Authentication required"
    });
    return;
  }
  next();
};
var authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required"
      });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: "Insufficient permissions"
      });
      return;
    }
    next();
  };
};
var requireAdmin = authorize(["admin"]);
var requireInstructor = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: "Authentication required"
    });
    return;
  }
  if (!["instructor", "admin"].includes(req.user.role)) {
    res.status(403).json({
      success: false,
      error: "Instructor access required"
    });
    return;
  }
  if (req.user.role === "instructor") {
    const user = await AuthStorage.getUserById(req.user.id);
    if (!user || user.instructorStatus !== "approved") {
      res.status(403).json({
        success: false,
        error: "Instructor approval required"
      });
      return;
    }
  }
  next();
};
var requireStudent = authorize(["student", "instructor", "admin"]);

// server/middleware/rateLimiter.ts
var RateLimiter = class {
  clients = /* @__PURE__ */ new Map();
  windowMs;
  maxRequests;
  message;
  constructor(options) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
    this.message = options.message || "Too many requests, please try again later";
    setInterval(() => this.cleanup(), 6e4);
  }
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];
    this.clients.forEach((client, key) => {
      if (now > client.resetTime) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.clients.delete(key));
  }
  middleware = (req, res, next) => {
    const clientId = req.ip || "unknown";
    const now = Date.now();
    let client = this.clients.get(clientId);
    if (!client || now > client.resetTime) {
      client = {
        requests: 0,
        resetTime: now + this.windowMs
      };
      this.clients.set(clientId, client);
    }
    client.requests++;
    if (client.requests > this.maxRequests) {
      return res.status(429).json({
        error: this.message,
        retryAfter: Math.ceil((client.resetTime - now) / 1e3)
      });
    }
    res.set({
      "X-RateLimit-Limit": this.maxRequests.toString(),
      "X-RateLimit-Remaining": Math.max(0, this.maxRequests - client.requests).toString(),
      "X-RateLimit-Reset": new Date(client.resetTime).toISOString()
    });
    next();
  };
};
var generalLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  maxRequests: 100,
  message: "Too many requests from this IP, please try again later"
});
var authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  maxRequests: 5,
  message: "Too many authentication attempts, please try again later"
});
var aiLimiter = new RateLimiter({
  windowMs: 60 * 1e3,
  // 1 minute
  maxRequests: 10,
  message: "AI features rate limit exceeded, please wait before making more requests"
});
var uploadLimiter = new RateLimiter({
  windowMs: 60 * 1e3,
  // 1 minute
  maxRequests: 5,
  message: "Upload rate limit exceeded, please wait before uploading again"
});

// server/middleware/errorHandler.ts
init_logger();
var AppError = class extends Error {
  statusCode;
  isOperational;
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
};
var asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
var errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  logger.error(err);
  if (err.name === "CastError") {
    const message2 = "Resource not found";
    error = new AppError(message2, 404);
  }
  if (err.name === "MongoError" && err.code === 11e3) {
    const message2 = "Duplicate field value entered";
    error = new AppError(message2, 400);
  }
  if (err.name === "ValidationError") {
    const message2 = Object.values(err.errors).map((val) => val.message);
    error = new AppError(message2.join(", "), 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message2 = "Invalid token";
    error = new AppError(message2, 401);
  }
  if (err.name === "TokenExpiredError") {
    const message2 = "Token expired";
    error = new AppError(message2, 401);
  }
  if (err.message?.includes("connect ECONNREFUSED")) {
    const message2 = "Database connection failed";
    error = new AppError(message2, 503);
  }
  if (err.message?.includes("DeepSeek") || err.message?.includes("OpenAI")) {
    const message2 = "AI service temporarily unavailable";
    error = new AppError(message2, 503);
  }
  if (err.message?.includes("File too large")) {
    const message2 = "File size exceeds limit";
    error = new AppError(message2, 413);
  }
  if (err.message?.includes("Too many requests")) {
    error = new AppError(err.message, 429);
  }
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const errorResponse = {
    success: false,
    error: message,
    ...process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: error
    }
  };
  res.status(statusCode).json(errorResponse);
};
var notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// server/routes.ts
var router = express.Router();
router.use(generalLimiter.middleware);
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime()
  });
});
router.get("/health/ai", asyncHandler(healthCheck));
var authLimiter2 = generalLimiter;
router.post("/auth/register", authLimiter2.middleware, asyncHandler(AuthController.register));
router.post("/auth/login", authLimiter2.middleware, asyncHandler(AuthController.login));
router.post("/auth/refresh", asyncHandler(AuthController.refreshToken));
router.post("/auth/logout", authenticateJWT, asyncHandler(AuthController.logout));
router.post("/auth/forgot-password", authLimiter2.middleware, asyncHandler(AuthController.forgotPassword));
router.post("/auth/reset-password", authLimiter2.middleware, asyncHandler(AuthController.resetPassword));
router.get("/auth/verify-email", asyncHandler(EmailController.verifyEmail));
router.post("/auth/resend-verification", authLimiter2.middleware, asyncHandler(EmailController.resendVerification));
router.get("/auth/google", AuthController.googleAuth);
router.get("/auth/google/callback", asyncHandler(AuthController.googleCallback));
router.get("/auth/me", authenticateJWT, requireAuth, asyncHandler(AuthController.getProfile));
router.put("/auth/profile", authenticateJWT, requireAuth, asyncHandler(AuthController.updateProfile));
router.put("/auth/change-password", authenticateJWT, requireAuth, asyncHandler(AuthController.changePassword));
router.get("/courses", (req, res) => {
  res.json({
    success: true,
    message: "Course endpoints will be restored after authentication system is complete",
    data: []
  });
});
router.get("/courses/:id", (req, res) => {
  res.json({
    success: true,
    message: "Course details endpoint will be restored after authentication system is complete",
    data: null
  });
});
router.all("/admin/*", authenticateJWT, requireAdmin, (req, res) => {
  res.status(503).json({
    success: false,
    error: "Admin features will be restored after authentication system integration is complete."
  });
});
router.all("/instructor/*", authenticateJWT, requireInstructor, (req, res) => {
  res.status(503).json({
    success: false,
    error: "Instructor features will be restored after authentication system integration is complete."
  });
});
router.all("/student/*", authenticateJWT, requireAuth, (req, res) => {
  res.status(503).json({
    success: false,
    error: "Student features will be restored after authentication system integration is complete."
  });
});
router.all("/courses/:id/enroll", authenticateJWT, requireAuth, (req, res) => {
  res.status(503).json({
    success: false,
    error: "Course enrollment will be restored after authentication system integration is complete."
  });
});
router.all("/gamification/*", authenticateJWT, requireAuth, (req, res) => {
  res.status(503).json({
    success: false,
    error: "Gamification features will be restored after authentication system integration is complete."
  });
});
router.all("/peer-help/*", (req, res) => {
  res.status(503).json({
    success: false,
    error: "Peer help features will be restored after authentication system integration is complete."
  });
});
router.all("/ai/*", authenticateJWT, requireAuth, (req, res) => {
  res.status(503).json({
    success: false,
    error: "AI features will be restored after authentication system integration is complete."
  });
});
router.all("/video/*", authenticateJWT, requireAuth, (req, res) => {
  res.status(503).json({
    success: false,
    error: "Video features will be restored after authentication system integration is complete."
  });
});
router.all("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({
      success: false,
      error: "API endpoint not found"
    });
  } else {
    res.status(404).json({
      success: false,
      error: "Route not found"
    });
  }
});

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { componentTagger } from "lovable-tagger";
var vite_config_default = defineConfig(async ({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
}));

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: [
      "replit.app",
      "replit.dev",
      "localhost",
      /.*\.replit\.dev$/,
      /.*\.kirk\.replit\.dev$/,
      /.*\.spock\.replit\.dev$/
    ]
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_logger();
import cors from "cors";

// server/config/passport.ts
import passport2 from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
init_auth();
init_logger();
passport2.serializeUser((user, done) => {
  done(null, user);
});
passport2.deserializeUser((user, done) => {
  done(null, user);
});
passport2.use(new LocalStrategy(
  {
    usernameField: "email",
    // Use email instead of username
    passwordField: "password",
    session: false
    // Disable sessions, use JWT instead
  },
  async (email, password, done) => {
    try {
      const user = await AuthStorage.getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        return done(null, false, { message: "Invalid email or password" });
      }
      if (!user.passwordHash) {
        return done(null, false, { message: "Please sign in with Google" });
      }
      const isValidPassword = await comparePassword(password, user.passwordHash);
      if (!isValidPassword) {
        return done(null, false, { message: "Invalid email or password" });
      }
      await AuthStorage.updateLastActivity(user.id);
      const { passwordHash, ...safeUser } = user;
      return done(null, safeUser);
    } catch (error) {
      logger.error("Local strategy error:", error);
      return done(error);
    }
  }
));
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport2.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_CALLBACK_URL || "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || profile.name?.givenName + " " + profile.name?.familyName;
        const imageUrl = profile.photos?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in Google profile"), void 0);
        }
        logger.info("Google OAuth - Processing user:", { email, googleId, name });
        let user = await AuthStorage.getUserByProviderId("google", googleId);
        if (user) {
          await AuthStorage.updateLastActivity(user.id);
          logger.info("Google OAuth - Existing Google user logged in:", { userId: user.id, email: user.email });
        } else {
          user = await AuthStorage.getUserByEmail(email.toLowerCase().trim());
          if (user) {
            user = await AuthStorage.linkProvider(user.id, "google", googleId);
            logger.info("Google OAuth - Linked Google account to existing user:", { userId: user.id, email: user.email });
          } else {
            user = await AuthStorage.createUser({
              email: email.toLowerCase().trim(),
              name: name || email.split("@")[0],
              imageUrl: imageUrl || null,
              provider: "google",
              providerId: googleId,
              emailVerifiedAt: /* @__PURE__ */ new Date(),
              // Google emails are pre-verified
              role: "student"
              // Default role
            });
            logger.info("Google OAuth - Created new user from Google:", { userId: user.id, email: user.email });
          }
        }
        const { passwordHash, ...safeUser } = user;
        return done(null, safeUser);
      } catch (error) {
        logger.error("Google OAuth strategy error:", error);
        return done(error);
      }
    }
  ));
} else {
  console.log("Google OAuth not configured - skipping Google strategy initialization");
}
var passport_default = passport2;

// server/index.ts
import cookieParser from "cookie-parser";
var app = express3();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5000",
  credentials: true
  // Enable cookies for authentication
}));
app.use(express3.json({ limit: "10mb" }));
app.use(express3.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());
app.use(passport_default.initialize());
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.use(apiLogger);
app.use("/api", router);
app.use("/api", notFound);
(async () => {
  app.use(errorHandler);
  const server = createServer(app);
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }
  const port = 5e3;
  server.listen(port, "0.0.0.0", () => {
    console.log(`[express] serving on port ${port}`);
  });
})();
