import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ['student', 'instructor', 'admin'] }).notNull().default('student'),
  domain: text("domain"),
  branch: text("branch"),
  year: text("year"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  domain: text("domain").notNull(),
  instructorId: integer("instructor_id").references(() => users.id).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default('0'),
  thumbnail: text("thumbnail"),
  duration: text("duration"),
  level: text("level", { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  enrolledCount: integer("enrolled_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Course modules
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lessons
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id).notNull(),
  title: text("title").notNull(),
  videoUrl: text("video_url"),
  materialsUrl: text("materials_url"),
  subtitleUrl: text("subtitle_url"),
  position: integer("position").notNull(),
  duration: text("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  progress: decimal("progress", { precision: 5, scale: 2 }).default('0'),
  completedLessons: json("completed_lessons").$type<string[]>().default([]),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

// Course Reviews & Ratings
export const courseReviews = pgTable("course_reviews", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  reviewText: text("review_text"),
  helpfulVotes: integer("helpful_votes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Discussion Forums
export const forumThreads = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").references(() => forumThreads.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Study Groups
export const studyGroups = pgTable("study_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  courseId: integer("course_id").references(() => courses.id),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  tags: json("tags").$type<string[]>().default([]),
  memberCount: integer("member_count").default(1),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studyGroupMembers = pgTable("study_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => studyGroups.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Notes
export const lessonNotes = pgTable("lesson_notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  content: text("content").notNull(),
  timestamp: text("timestamp"), // video timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bookmarks
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  timestamp: text("timestamp"), // video timestamp if applicable
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Live Sessions
export const liveSessions = pgTable("live_sessions", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  instructorId: integer("instructor_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration"), // in minutes
  meetingLink: text("meeting_link"),
  status: text("status", { enum: ['scheduled', 'live', 'ended', 'cancelled'] }).default('scheduled'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Assignments
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  instructorId: integer("instructor_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date").notNull(),
  maxPoints: integer("max_points").default(100),
  attachmentUrl: text("attachment_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").references(() => assignments.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  content: text("content"),
  attachmentUrl: text("attachment_url"),
  grade: integer("grade"),
  feedback: text("feedback"),
  status: text("status", { enum: ['not_submitted', 'submitted', 'graded'] }).default('not_submitted'),
  submittedAt: timestamp("submitted_at"),
  gradedAt: timestamp("graded_at"),
});

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  questions: json("questions").$type<any[]>().default([]),
  timeLimit: integer("time_limit"), // in minutes
  passingScore: integer("passing_score").default(70), // percentage
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  answers: json("answers").$type<{ [questionId: string]: string | number | boolean }>().default({}),
  score: integer("score").default(0),
  passed: boolean("passed").default(false),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  timeSpent: integer("time_spent").default(0), // in seconds
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
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
  quizAttempts: many(quizAttempts),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
  }),
  modules: many(modules),
  enrollments: many(enrollments),
  reviews: many(courseReviews),
  forumThreads: many(forumThreads),
  studyGroups: many(studyGroups),
  liveSessions: many(liveSessions),
  assignments: many(assignments),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  notes: many(lessonNotes),
  bookmarks: many(bookmarks),
  quizzes: many(quizzes),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true,
  domain: true,
  branch: true,
  year: true,
  avatar: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  enrolledCount: true,
  rating: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
  progress: true,
  completedLessons: true,
  lastAccessedAt: true,
});

export const insertCourseReviewSchema = createInsertSchema(courseReviews).omit({
  id: true,
  helpfulVotes: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumThreadSchema = createInsertSchema(forumThreads).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  isPinned: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  createdAt: true,
  updatedAt: true,
});

// GAMIFICATION SYSTEM
export const userStats = pgTable("user_stats", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  xpReward: integer("xp_reward").default(0),
  category: text("category", { enum: ['learning', 'social', 'streak', 'milestone', 'special'] }).notNull(),
  rarity: text("rarity", { enum: ['common', 'rare', 'epic', 'legendary'] }).default('common'),
  requirements: json("requirements").$type<{ [key: string]: any }>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  category: text("category", { enum: ['overall', 'weekly', 'monthly', 'course_specific'] }).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  xp: integer("xp").notNull(),
  rank: integer("rank").notNull(),
  period: text("period"), // e.g., "2024-01", "2024-W01"
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// PEER HELP CENTER
export const helpCategories = pgTable("help_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  sortOrder: integer("sort_order").default(0),
});

export const helpQuestions = pgTable("help_questions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  categoryId: integer("category_id").references(() => helpCategories.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: json("tags").$type<string[]>().default([]),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  viewCount: integer("view_count").default(0),
  status: text("status", { enum: ['open', 'answered', 'closed'] }).default('open'),
  bountyXP: integer("bounty_xp").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const helpAnswers = pgTable("help_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => helpQuestions.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  xpRating: integer("xp_rating"), // 1-10, only question author can set
  starRating: decimal("star_rating", { precision: 3, scale: 2 }), // 1-5 stars, community average
  starRatingCount: integer("star_rating_count").default(0),
  isAccepted: boolean("is_accepted").default(false),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const answerStarRatings = pgTable("answer_star_ratings", {
  id: serial("id").primaryKey(),
  answerId: integer("answer_id").references(() => helpAnswers.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// XP TRANSACTIONS
export const xpTransactions = pgTable("xp_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  sourceType: text("source_type", { enum: ['lesson_completion', 'quiz_completion', 'helpful_answer', 'achievement', 'streak_bonus', 'course_completion'] }).notNull(),
  sourceId: integer("source_id"), // ID of the source (lesson, quiz, answer, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// LEARNING ANALYTICS
export const learningAnalytics = pgTable("learning_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  activityType: text("activity_type", { enum: ['lesson_view', 'lesson_complete', 'quiz_attempt', 'note_taken', 'bookmark_added', 'forum_post', 'video_pause', 'video_seek'] }).notNull(),
  duration: integer("duration"), // in seconds
  progress: decimal("progress", { precision: 5, scale: 2 }), // percentage
  metadata: json("metadata").$type<{ [key: string]: any }>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const weeklyLearningStats = pgTable("weekly_learning_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  weekStart: timestamp("week_start").notNull(),
  lessonsCompleted: integer("lessons_completed").default(0),
  quizzesCompleted: integer("quizzes_completed").default(0),
  totalStudyTime: integer("total_study_time").default(0), // in minutes
  xpEarned: integer("xp_earned").default(0),
  streakDays: integer("streak_days").default(0),
});

// SUBSCRIPTION & MONETIZATION
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  interval: text("interval", { enum: ['monthly', 'yearly'] }).notNull(),
  features: json("features").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  status: text("status", { enum: ['active', 'cancelled', 'expired', 'paused'] }).notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const discountCoupons = pgTable("discount_coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type", { enum: ['percentage', 'fixed_amount'] }).notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const couponUsage = pgTable("coupon_usage", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").references(() => discountCoupons.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").defaultNow().notNull(),
});

// CERTIFICATES
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  certificateType: text("certificate_type", { enum: ['basic', 'verified', 'premium'] }).notNull(),
  certificateUrl: text("certificate_url"),
  verificationCode: text("verification_code").unique(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
});

// Insert schemas for new tables
export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertHelpQuestionSchema = createInsertSchema(helpQuestions).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  viewCount: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHelpAnswerSchema = createInsertSchema(helpAnswers).omit({
  id: true,
  xpRating: true,
  starRating: true,
  starRatingCount: true,
  isAccepted: true,
  upvotes: true,
  downvotes: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

export const insertDiscountCouponSchema = createInsertSchema(discountCoupons).omit({
  id: true,
  usedCount: true,
  createdAt: true,
});

// Additional Type exports for new gamification and enterprise tables
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type HelpQuestion = typeof helpQuestions.$inferSelect;
export type InsertHelpQuestion = z.infer<typeof insertHelpQuestionSchema>;
export type HelpAnswer = typeof helpAnswers.$inferSelect;
export type InsertHelpAnswer = z.infer<typeof insertHelpAnswerSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type DiscountCoupon = typeof discountCoupons.$inferSelect;
export type InsertDiscountCoupon = z.infer<typeof insertDiscountCouponSchema>;
export type HelpCategory = typeof helpCategories.$inferSelect;
export type XpTransaction = typeof xpTransactions.$inferSelect;
export type LearningAnalytics = typeof learningAnalytics.$inferSelect;
export type WeeklyLearningStats = typeof weeklyLearningStats.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;

export const insertStudyGroupSchema = createInsertSchema(studyGroups).omit({
  id: true,
  memberCount: true,
  createdAt: true,
});

export const insertLessonNoteSchema = createInsertSchema(lessonNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertLiveSessionSchema = createInsertSchema(liveSessions).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
});

export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({
  id: true,
  grade: true,
  feedback: true,
  status: true,
  submittedAt: true,
  gradedAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  score: true,
  passed: true,
  completedAt: true,
  timeSpent: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertCourseReview = z.infer<typeof insertCourseReviewSchema>;
export type CourseReview = typeof courseReviews.$inferSelect;
export type InsertForumThread = z.infer<typeof insertForumThreadSchema>;
export type ForumThread = typeof forumThreads.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertStudyGroup = z.infer<typeof insertStudyGroupSchema>;
export type StudyGroup = typeof studyGroups.$inferSelect;
export type InsertLessonNote = z.infer<typeof insertLessonNoteSchema>;
export type LessonNote = typeof lessonNotes.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertLiveSession = z.infer<typeof insertLiveSessionSchema>;
export type LiveSession = typeof liveSessions.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

// AI-POWERED BACKEND FEATURES

// AI Answer Analysis & Scoring
export const aiScores = pgTable("ai_scores", {
  id: serial("id").primaryKey(), 
  answerId: integer("answer_id").references(() => helpAnswers.id).notNull(),
  aiScore: decimal("ai_score", { precision: 3, scale: 1 }).notNull(), // 0.0 to 10.0
  summaryComment: text("summary_comment"),
  grammarScore: decimal("grammar_score", { precision: 3, scale: 1 }),
  clarityScore: decimal("clarity_score", { precision: 3, scale: 1 }),
  correctnessScore: decimal("correctness_score", { precision: 3, scale: 1 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Skill Tracking & Analytics
export const skillProgress = pgTable("skill_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  skillTag: text("skill_tag").notNull(), // DevOps, Python, Frontend, etc.
  totalXP: integer("total_xp").default(0),
  questionsAnswered: integer("questions_answered").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default('0'),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Missions & Daily Challenges
export const missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").notNull(),
  skillTag: text("skill_tag"), // Optional skill focus
  missionType: text("mission_type", { enum: ['daily', 'weekly', 'special'] }).notNull().default('daily'),
  requirements: json("requirements").$type<{type: string, count: number, skillTag?: string}>().notNull(),
  isActive: boolean("is_active").default(true),
  validFrom: timestamp("valid_from").defaultNow().notNull(),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const missionProgress = pgTable("mission_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  missionId: integer("mission_id").references(() => missions.id).notNull(),
  currentProgress: integer("current_progress").default(0),
  targetProgress: integer("target_progress").notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  xpClaimed: boolean("xp_claimed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Enhanced Answer Feedback System  
export const answerFeedback = pgTable("answer_feedback", {
  id: serial("id").primaryKey(),
  answerId: integer("answer_id").references(() => helpAnswers.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  voteType: text("vote_type", { enum: ['up', 'down'] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Live Peer Collaboration
export const questionRooms = pgTable("question_rooms", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => helpQuestions.id).notNull(),
  isActive: boolean("is_active").default(true),
  participantCount: integer("participant_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomParticipants = pgTable("room_participants", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => questionRooms.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
});

// Smart Notification System
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type", { enum: ['xp_gained', 'answer_received', 'level_up', 'mission_complete', 'badge_earned'] }).notNull(),
  isRead: boolean("is_read").default(false),
  relatedId: integer("related_id"), // Answer ID, Mission ID, etc.
  relatedType: text("related_type"), // 'answer', 'mission', 'course', etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Smart Content Unlock System
export const userUnlocks = pgTable("user_unlocks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  unlockType: text("unlock_type").notNull(), // 'mentor_status', 'premium_content', etc.
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  requirements: json("requirements").$type<{xp: number, answersGiven: number, rating: number}>(),
});

// AI Mentor Bot System
export const aiMentorResponses = pgTable("ai_mentor_responses", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => helpQuestions.id).notNull(),
  aiResponse: text("ai_response").notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).notNull(), // 0.00 to 1.00
  triggerReason: text("trigger_reason").notNull(), // '24_hour_timeout', 'no_human_answers', etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Enhanced AI Features Insert Schemas
export const insertAIScoreSchema = createInsertSchema(aiScores).omit({
  id: true,
  createdAt: true,
});

export const insertSkillProgressSchema = createInsertSchema(skillProgress).omit({
  id: true,
  lastUpdated: true,
});

export const insertMissionSchema = createInsertSchema(missions).omit({
  id: true,
  createdAt: true,
});

export const insertMissionProgressSchema = createInsertSchema(missionProgress).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// AI Feature Types
export type AIScore = typeof aiScores.$inferSelect;
export type InsertAIScore = z.infer<typeof insertAIScoreSchema>;
export type SkillProgress = typeof skillProgress.$inferSelect;
export type InsertSkillProgress = z.infer<typeof insertSkillProgressSchema>;
export type Mission = typeof missions.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type MissionProgress = typeof missionProgress.$inferSelect;
export type InsertMissionProgress = z.infer<typeof insertMissionProgressSchema>;
export type AnswerFeedback = typeof answerFeedback.$inferSelect;
export type QuestionRoom = typeof questionRooms.$inferSelect;
export type RoomParticipant = typeof roomParticipants.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type UserUnlock = typeof userUnlocks.$inferSelect;
export type AIMentorResponse = typeof aiMentorResponses.$inferSelect;
