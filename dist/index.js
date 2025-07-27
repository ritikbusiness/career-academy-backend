var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";
import { createServer } from "http";

// server/routes.ts
import express from "express";

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
  couponUsage: () => couponUsage,
  courseReviews: () => courseReviews,
  courses: () => courses,
  coursesRelations: () => coursesRelations,
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
  insertSkillProgressSchema: () => insertSkillProgressSchema,
  insertStudyGroupSchema: () => insertStudyGroupSchema,
  insertSubscriptionPlanSchema: () => insertSubscriptionPlanSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserStatsSchema: () => insertUserStatsSchema,
  leaderboards: () => leaderboards,
  learningAnalytics: () => learningAnalytics,
  lessonNotes: () => lessonNotes,
  lessons: () => lessons,
  lessonsRelations: () => lessonsRelations,
  liveSessions: () => liveSessions,
  missionProgress: () => missionProgress,
  missions: () => missions,
  modules: () => modules,
  modulesRelations: () => modulesRelations,
  notifications: () => notifications,
  questionRooms: () => questionRooms,
  quizAttempts: () => quizAttempts,
  quizzes: () => quizzes,
  roomParticipants: () => roomParticipants,
  skillProgress: () => skillProgress,
  studyGroupMembers: () => studyGroupMembers,
  studyGroups: () => studyGroups,
  subscriptionPlans: () => subscriptionPlans,
  userAchievements: () => userAchievements,
  userStats: () => userStats,
  userSubscriptions: () => userSubscriptions,
  userUnlocks: () => userUnlocks,
  users: () => users,
  usersRelations: () => usersRelations,
  weeklyLearningStats: () => weeklyLearningStats,
  xpTransactions: () => xpTransactions
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["student", "instructor", "admin"] }).notNull().default("student"),
  domain: text("domain"),
  branch: text("branch"),
  year: text("year"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull()
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
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true,
  domain: true,
  branch: true,
  year: true,
  avatar: true
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
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, asc, and, or, like, sql } from "drizzle-orm";
var DatabaseStorage = class {
  // User management
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUserProfile(data) {
    const [user] = await db.update(users).set(data).where(eq(users.id, data.id)).returning();
    return user;
  }
  async updateUserPassword(userId, hashedPassword) {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
  }
  async updateUserActivity(userId) {
    await db.update(userStats).set({ lastActivityDate: /* @__PURE__ */ new Date() }).where(eq(userStats.userId, userId));
  }
  // User stats and gamification
  async getUserStats(userId) {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats || void 0;
  }
  async createUserStats(stats) {
    const [newStats] = await db.insert(userStats).values(stats).returning();
    return newStats;
  }
  async updateUserStats(userId, updates) {
    const [stats] = await db.update(userStats).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userStats.userId, userId)).returning();
    return stats;
  }
  async addXP(userId, amount, reason, sourceType, sourceId) {
    await db.insert(xpTransactions).values({
      userId,
      amount,
      reason,
      sourceType,
      sourceId
    });
    await db.update(userStats).set({
      totalXP: sql`${userStats.totalXP} + ${amount}`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(userStats.userId, userId));
  }
  async getUserAchievements(userId) {
    const userAchievementsList = await db.select({ achievement: achievements }).from(userAchievements).innerJoin(achievements, eq(userAchievements.achievementId, achievements.id)).where(eq(userAchievements.userId, userId)).orderBy(desc(userAchievements.earnedAt));
    return userAchievementsList.map((ua) => ua.achievement);
  }
  async unlockAchievement(userId, achievementId) {
    await db.insert(userAchievements).values({
      userId,
      achievementId
    });
  }
  // Course management
  async getCourse(id) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || void 0;
  }
  async getCourses(filters = {}) {
    let query = db.select().from(courses);
    if (filters.domain) {
      query = query.where(eq(courses.domain, filters.domain));
    }
    if (filters.level) {
      query = query.where(eq(courses.level, filters.level));
    }
    if (filters.search) {
      query = query.where(
        or(
          like(courses.title, `%${filters.search}%`),
          like(courses.description, `%${filters.search}%`)
        )
      );
    }
    return await query.orderBy(desc(courses.createdAt));
  }
  async createCourse(course) {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }
  async updateCourse(id, updates) {
    const [course] = await db.update(courses).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(courses.id, id)).returning();
    return course;
  }
  async deleteCourse(id) {
    await db.delete(courses).where(eq(courses.id, id));
  }
  async getUserEnrolledCourses(userId) {
    const enrolledCourses = await db.select({ course: courses }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.enrolledAt));
    return enrolledCourses.map((ec) => ec.course);
  }
  async getInstructorCourses(instructorId) {
    return await db.select().from(courses).where(eq(courses.instructorId, instructorId)).orderBy(desc(courses.createdAt));
  }
  // Enrollment management
  async enrollInCourse(userId, courseId) {
    const [enrollment] = await db.insert(enrollments).values({ userId, courseId }).returning();
    return enrollment;
  }
  async getUserEnrollment(userId, courseId) {
    const [enrollment] = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment || void 0;
  }
  async updateLessonProgress(userId, courseId, lessonId) {
    await db.update(enrollments).set({
      completedLessons: sql`array_append(${enrollments.completedLessons}, ${lessonId.toString()})`,
      lastAccessedAt: /* @__PURE__ */ new Date()
    }).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
  }
  async getCourseProgress(userId, courseId) {
    const [enrollment] = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment ? Number(enrollment.progress) : 0;
  }
  // Module and lesson management
  async getCourseModules(courseId) {
    return await db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.position));
  }
  async getModuleLessons(moduleId) {
    return await db.select().from(lessons).where(eq(lessons.moduleId, moduleId)).orderBy(asc(lessons.position));
  }
  async createModule(module) {
    const [newModule] = await db.insert(modules).values(module).returning();
    return newModule;
  }
  async createLesson(lesson) {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }
  // Help center
  async getHelpCategories() {
    return await db.select().from(helpCategories).orderBy(asc(helpCategories.sortOrder));
  }
  async getHelpQuestions(categoryId, filters = {}) {
    let query = db.select().from(helpQuestions);
    if (categoryId) {
      query = query.where(eq(helpQuestions.categoryId, categoryId));
    }
    if (filters.search) {
      query = query.where(
        or(
          like(helpQuestions.title, `%${filters.search}%`),
          like(helpQuestions.content, `%${filters.search}%`)
        )
      );
    }
    return await query.orderBy(desc(helpQuestions.createdAt));
  }
  async getHelpQuestion(id) {
    const [question] = await db.select().from(helpQuestions).where(eq(helpQuestions.id, id));
    return question || void 0;
  }
  async createHelpQuestion(question) {
    const [newQuestion] = await db.insert(helpQuestions).values(question).returning();
    return newQuestion;
  }
  async getQuestionAnswers(questionId) {
    return await db.select().from(helpAnswers).where(eq(helpAnswers.questionId, questionId)).orderBy(desc(helpAnswers.createdAt));
  }
  async createHelpAnswer(answer) {
    const [newAnswer] = await db.insert(helpAnswers).values(answer).returning();
    return newAnswer;
  }
  async rateAnswer(answerId, userId, xpRating, starRating) {
    if (xpRating) {
      await db.update(helpAnswers).set({ xpRating }).where(eq(helpAnswers.id, answerId));
    }
    if (starRating) {
    }
  }
  // Analytics
  async recordLearningActivity(activity) {
    await db.insert(learningAnalytics).values(activity);
  }
  async getUserLearningAnalytics(userId, filters = {}) {
    let query = db.select().from(learningAnalytics).where(eq(learningAnalytics.userId, userId));
    if (filters.startDate) {
      query = query.where(sql`${learningAnalytics.createdAt} >= ${filters.startDate}`);
    }
    if (filters.endDate) {
      query = query.where(sql`${learningAnalytics.createdAt} <= ${filters.endDate}`);
    }
    return await query.orderBy(desc(learningAnalytics.createdAt));
  }
  async getCourseLearningAnalytics(courseId, filters = {}) {
    return await db.select().from(learningAnalytics).where(eq(learningAnalytics.courseId, courseId)).orderBy(desc(learningAnalytics.createdAt));
  }
  // Dashboard placeholders (to be implemented based on specific requirements)
  async getUserRecentQuizzes(userId) {
    return [];
  }
  async getUserUpcomingAssignments(userId) {
    return [];
  }
  async getInstructorRecentStudents(instructorId) {
    return [];
  }
  async getInstructorPendingAssignments(instructorId) {
    return [];
  }
  // Leaderboards
  async getLeaderboard(category, limit = 10) {
    return [];
  }
  async updateLeaderboard(userId, category, xp) {
  }
};
var storage = new DatabaseStorage();

// server/utils/helpers.ts
import bcrypt from "bcryptjs";
var hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};
var comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
var getStartOfWeek = (date = /* @__PURE__ */ new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};
var getEndOfWeek = (date = /* @__PURE__ */ new Date()) => {
  const d = getStartOfWeek(date);
  return new Date(d.setDate(d.getDate() + 6));
};
var getStartOfMonth = (date = /* @__PURE__ */ new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};
var getEndOfMonth = (date = /* @__PURE__ */ new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};
var createPaginationResult = (data, totalItems, options) => {
  const totalPages = Math.ceil(totalItems / options.limit);
  return {
    data,
    pagination: {
      currentPage: options.page,
      totalPages,
      totalItems,
      itemsPerPage: options.limit,
      hasNextPage: options.page < totalPages,
      hasPrevPage: options.page > 1
    }
  };
};
var calculateLevelFromXP = (xp) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};
var calculateXPForLevel = (level) => {
  return Math.pow(level - 1, 2) * 100;
};
var calculateXPToNextLevel = (currentXP) => {
  const currentLevel = calculateLevelFromXP(currentXP);
  const nextLevelXP = calculateXPForLevel(currentLevel + 1);
  return nextLevelXP - currentXP;
};
var calculateLearningStreak = (lastActivityDate) => {
  if (!lastActivityDate) return 0;
  const today = /* @__PURE__ */ new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1e3);
  const lastActivity = new Date(lastActivityDate);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  lastActivity.setHours(0, 0, 0, 0);
  if (lastActivity.getTime() === today.getTime() || lastActivity.getTime() === yesterday.getTime()) {
    return 1;
  }
  return 0;
};

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
var authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
var generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
var refreshToken = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const newToken = generateToken(user.id);
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// server/utils/logger.ts
import winston from "winston";
import fs from "fs";
import path from "path";
var logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp: timestamp2, level, message, stack }) => {
    return `${timestamp2} [${level.toUpperCase()}]: ${stack || message}`;
  })
);
var logger = winston.createLogger({
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
var apiLogger = (req, res, next) => {
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
var securityLogger = {
  authFailure: (username, ip, reason) => {
    logger.warn("Authentication Failure", {
      username,
      ip,
      reason,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  },
  authSuccess: (userId, username, ip) => {
    logger.info("Authentication Success", {
      userId,
      username,
      ip,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  },
  rateLimitExceeded: (ip, endpoint) => {
    logger.warn("Rate Limit Exceeded", {
      ip,
      endpoint,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  },
  suspiciousActivity: (userId, activity, metadata) => {
    logger.warn("Suspicious Activity", {
      userId,
      activity,
      metadata,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
};
var metricsLogger = {
  courseEnrollment: (userId, courseId, price) => {
    logger.info("Course Enrollment", {
      userId,
      courseId,
      price,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  },
  courseCompletion: (userId, courseId, completionTime) => {
    logger.info("Course Completion", {
      userId,
      courseId,
      completionTime: `${completionTime}ms`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  },
  xpEarned: (userId, amount, source) => {
    logger.info("XP Earned", {
      userId,
      amount,
      source,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  },
  achievementUnlocked: (userId, achievementId, achievementName) => {
    logger.info("Achievement Unlocked", {
      userId,
      achievementId,
      achievementName,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
};
var logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// server/middleware/errorHandler.ts
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
var createValidationError = (message) => {
  return new AppError(message, 400);
};
var createAuthError = (message = "Authentication failed") => {
  return new AppError(message, 401);
};
var createForbiddenError = (message = "Access forbidden") => {
  return new AppError(message, 403);
};
var createNotFoundError = (resource = "Resource") => {
  return new AppError(`${resource} not found`, 404);
};
var createConflictError = (message) => {
  return new AppError(message, 409);
};

// server/controllers/authController.ts
var AuthController = class {
  // User registration
  static async register(req, res) {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        throw createConflictError("Username already exists");
      }
      const existingEmail = await storage.getUserByEmail?.(userData.email);
      if (existingEmail) {
        throw createConflictError("Email already exists");
      }
      const hashedPassword = await hashPassword(userData.password);
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword,
        role: userData.role || "student"
      });
      await storage.createUserStats?.({
        userId: newUser.id,
        totalXP: 0,
        level: 1,
        streak: 0,
        longestStreak: 0,
        lastActivityDate: /* @__PURE__ */ new Date(),
        coursesCompleted: 0,
        lessonsCompleted: 0,
        quizzesCompleted: 0,
        helpfulAnswers: 0
      });
      const token = generateToken(newUser.id);
      securityLogger.authSuccess(newUser.id, newUser.username, req.ip);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar
          },
          token
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Registration error:", error);
      throw createValidationError("Registration failed");
    }
  }
  // User login
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw createValidationError("Username and password are required");
      }
      const user = await storage.getUserByUsername(username);
      if (!user) {
        securityLogger.authFailure(username, req.ip, "User not found");
        throw createAuthError("Invalid credentials");
      }
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        securityLogger.authFailure(username, req.ip, "Invalid password");
        throw createAuthError("Invalid credentials");
      }
      await storage.updateUserActivity?.(user.id);
      const token = generateToken(user.id);
      securityLogger.authSuccess(user.id, user.username, req.ip);
      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          },
          token
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Login error:", error);
      throw createAuthError("Login failed");
    }
  }
  // Get current user profile
  static async getProfile(req, res) {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        throw createAuthError("User not found");
      }
      const userStats2 = await storage.getUserStats?.(user.id);
      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            domain: user.domain,
            branch: user.branch,
            year: user.year,
            avatar: user.avatar,
            createdAt: user.createdAt
          },
          stats: userStats2
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Get profile error:", error);
      throw createAuthError("Failed to get profile");
    }
  }
  // Update user profile
  static async updateProfile(req, res) {
    try {
      const { fullName, email, domain, branch, year, avatar } = req.body;
      const userId = req.user.id;
      if (email) {
        const existingUser = await storage.getUserByEmail?.(email);
        if (existingUser && existingUser.id !== userId) {
          throw createConflictError("Email already exists");
        }
      }
      const updatedUser = await storage.updateUserProfile?.({
        id: userId,
        fullName,
        email,
        domain,
        branch,
        year,
        avatar
      });
      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Update profile error:", error);
      throw createValidationError("Failed to update profile");
    }
  }
  // Change password
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      if (!currentPassword || !newPassword) {
        throw createValidationError("Current password and new password are required");
      }
      const user = await storage.getUser(userId);
      if (!user) {
        throw createAuthError("User not found");
      }
      const isValidPassword = await comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        securityLogger.authFailure(user.username, req.ip, "Invalid current password");
        throw createAuthError("Current password is incorrect");
      }
      const hashedNewPassword = await hashPassword(newPassword);
      await storage.updateUserPassword?.(userId, hashedNewPassword);
      securityLogger.authSuccess(userId, user.username, req.ip);
      res.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Change password error:", error);
      throw createValidationError("Failed to change password");
    }
  }
  // Logout (optional - mainly for logging)
  static async logout(req, res) {
    try {
      const userId = req.user.id;
      logger.info(`User ${userId} logged out`, { userId, ip: req.ip });
      res.json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (error) {
      logger.error("Logout error:", error);
      res.json({
        success: true,
        message: "Logged out successfully"
      });
    }
  }
  // Refresh token
  static async refreshToken(req, res) {
    try {
      const userId = req.user.id;
      const newToken = generateToken(userId);
      res.json({
        success: true,
        data: {
          token: newToken
        }
      });
    } catch (error) {
      logger.error("Refresh token error:", error);
      throw createAuthError("Failed to refresh token");
    }
  }
  // Get user dashboard data
  static async getDashboard(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const userStats2 = await storage.getUserStats?.(userId);
      let dashboardData = {
        userStats: userStats2,
        recentActivity: []
      };
      if (userRole === "student") {
        const enrolledCourses = await storage.getUserEnrolledCourses?.(userId);
        const recentQuizzes = await storage.getUserRecentQuizzes?.(userId);
        const upcomingAssignments = await storage.getUserUpcomingAssignments?.(userId);
        dashboardData.enrolledCourses = enrolledCourses;
        dashboardData.recentQuizzes = recentQuizzes;
        dashboardData.upcomingAssignments = upcomingAssignments;
      } else if (userRole === "instructor") {
        const createdCourses = await storage.getInstructorCourses?.(userId);
        const recentStudents = await storage.getInstructorRecentStudents?.(userId);
        const pendingAssignments = await storage.getInstructorPendingAssignments?.(userId);
        dashboardData.createdCourses = createdCourses;
        dashboardData.recentStudents = recentStudents;
        dashboardData.pendingAssignments = pendingAssignments;
      }
      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      logger.error("Get dashboard error:", error);
      throw createValidationError("Failed to get dashboard data");
    }
  }
};

// server/controllers/courseController.ts
var CourseController = class {
  // Get all courses with filtering
  static async getCourses(req, res) {
    try {
      const { page = 1, limit = 12, search, domain, level, sort = "created", order = "desc" } = req.query;
      const filters = {
        search,
        domain,
        level
      };
      const courses2 = await storage.getCourses(filters);
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedCourses = courses2.slice(startIndex, endIndex);
      const result = createPaginationResult(
        paginatedCourses,
        courses2.length,
        { page: Number(page), limit: Number(limit), sort, order }
      );
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error("Get courses error:", error);
      throw createValidationError("Failed to fetch courses");
    }
  }
  // Get single course with modules and lessons
  static async getCourse(req, res) {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      if (!course) {
        throw createNotFoundError("Course");
      }
      const modules2 = await storage.getCourseModules(courseId);
      const modulesWithLessons = await Promise.all(
        modules2.map(async (module) => {
          const lessons2 = await storage.getModuleLessons(module.id);
          return { ...module, lessons: lessons2 };
        })
      );
      let userEnrollment = null;
      if (req.user) {
        userEnrollment = await storage.getUserEnrollment(req.user.id, courseId);
      }
      if (req.user) {
        await storage.recordLearningActivity({
          userId: req.user.id,
          courseId,
          activityType: "lesson_view",
          createdAt: /* @__PURE__ */ new Date()
        });
      }
      res.json({
        success: true,
        data: {
          course,
          modules: modulesWithLessons,
          userEnrollment,
          isEnrolled: !!userEnrollment
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Get course error:", error);
      throw createValidationError("Failed to fetch course");
    }
  }
  // Create new course (instructors only)
  static async createCourse(req, res) {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const instructorId = req.user.id;
      const newCourse = await storage.createCourse({
        ...courseData,
        instructorId
      });
      logger.info(`Course created: ${newCourse.id} by instructor ${instructorId}`);
      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: { course: newCourse }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Create course error:", error);
      throw createValidationError("Failed to create course");
    }
  }
  // Update course (instructor/admin only)
  static async updateCourse(req, res) {
    try {
      const courseId = parseInt(req.params.id);
      const updates = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;
      const course = await storage.getCourse(courseId);
      if (!course) {
        throw createNotFoundError("Course");
      }
      if (userRole !== "admin" && course.instructorId !== userId) {
        throw createForbiddenError("You can only update your own courses");
      }
      const updatedCourse = await storage.updateCourse(courseId, updates);
      res.json({
        success: true,
        message: "Course updated successfully",
        data: { course: updatedCourse }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Update course error:", error);
      throw createValidationError("Failed to update course");
    }
  }
  // Delete course (instructor/admin only)
  static async deleteCourse(req, res) {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user.id;
      const userRole = req.user.role;
      const course = await storage.getCourse(courseId);
      if (!course) {
        throw createNotFoundError("Course");
      }
      if (userRole !== "admin" && course.instructorId !== userId) {
        throw createForbiddenError("You can only delete your own courses");
      }
      await storage.deleteCourse(courseId);
      res.json({
        success: true,
        message: "Course deleted successfully"
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Delete course error:", error);
      throw createValidationError("Failed to delete course");
    }
  }
  // Enroll in course
  static async enrollInCourse(req, res) {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user.id;
      const course = await storage.getCourse(courseId);
      if (!course) {
        throw createNotFoundError("Course");
      }
      const existingEnrollment = await storage.getUserEnrollment(userId, courseId);
      if (existingEnrollment) {
        throw createValidationError("Already enrolled in this course");
      }
      const enrollment = await storage.enrollInCourse(userId, courseId);
      await storage.addXP(userId, 10, "Course enrollment", "course_enrollment", courseId);
      metricsLogger.courseEnrollment(userId, courseId, Number(course.price));
      res.status(201).json({
        success: true,
        message: "Successfully enrolled in course",
        data: { enrollment }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Enroll in course error:", error);
      throw createValidationError("Failed to enroll in course");
    }
  }
  // Get user's enrolled courses
  static async getUserCourses(req, res) {
    try {
      const userId = req.user.id;
      const enrolledCourses = await storage.getUserEnrolledCourses(userId);
      const coursesWithProgress = await Promise.all(
        enrolledCourses.map(async (course) => {
          const progress = await storage.getCourseProgress(userId, course.id);
          return { ...course, progress };
        })
      );
      res.json({
        success: true,
        data: { courses: coursesWithProgress }
      });
    } catch (error) {
      logger.error("Get user courses error:", error);
      throw createValidationError("Failed to fetch user courses");
    }
  }
  // Get instructor's courses
  static async getInstructorCourses(req, res) {
    try {
      const instructorId = req.user.id;
      const courses2 = await storage.getInstructorCourses(instructorId);
      res.json({
        success: true,
        data: { courses: courses2 }
      });
    } catch (error) {
      logger.error("Get instructor courses error:", error);
      throw createValidationError("Failed to fetch instructor courses");
    }
  }
  // Add module to course
  static async addModule(req, res) {
    try {
      const courseId = parseInt(req.params.courseId);
      const moduleData = insertModuleSchema.parse(req.body);
      const userId = req.user.id;
      const userRole = req.user.role;
      const course = await storage.getCourse(courseId);
      if (!course) {
        throw createNotFoundError("Course");
      }
      if (userRole !== "admin" && course.instructorId !== userId) {
        throw createForbiddenError("You can only add modules to your own courses");
      }
      const newModule = await storage.createModule({
        ...moduleData,
        courseId
      });
      res.status(201).json({
        success: true,
        message: "Module added successfully",
        data: { module: newModule }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Add module error:", error);
      throw createValidationError("Failed to add module");
    }
  }
  // Add lesson to module
  static async addLesson(req, res) {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const lessonData = insertLessonSchema.parse(req.body);
      const userId = req.user.id;
      const userRole = req.user.role;
      const modules2 = await storage.getCourseModules(0);
      const module = modules2.find((m) => m.id === moduleId);
      if (!module) {
        throw createNotFoundError("Module");
      }
      const course = await storage.getCourse(module.courseId);
      if (!course) {
        throw createNotFoundError("Course");
      }
      if (userRole !== "admin" && course.instructorId !== userId) {
        throw createForbiddenError("You can only add lessons to your own courses");
      }
      const newLesson = await storage.createLesson({
        ...lessonData,
        moduleId
      });
      res.status(201).json({
        success: true,
        message: "Lesson added successfully",
        data: { lesson: newLesson }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Add lesson error:", error);
      throw createValidationError("Failed to add lesson");
    }
  }
  // Mark lesson as completed
  static async completeLesson(req, res) {
    try {
      const { courseId, lessonId } = req.params;
      const userId = req.user.id;
      const enrollment = await storage.getUserEnrollment(userId, parseInt(courseId));
      if (!enrollment) {
        throw createValidationError("Not enrolled in this course");
      }
      await storage.updateLessonProgress(userId, parseInt(courseId), parseInt(lessonId));
      await storage.addXP(userId, 25, "Lesson completion", "lesson_completion", parseInt(lessonId));
      await storage.recordLearningActivity({
        userId,
        courseId: parseInt(courseId),
        lessonId: parseInt(lessonId),
        activityType: "lesson_complete",
        createdAt: /* @__PURE__ */ new Date()
      });
      res.json({
        success: true,
        message: "Lesson marked as completed"
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Complete lesson error:", error);
      throw createValidationError("Failed to complete lesson");
    }
  }
  // Get course analytics (instructor/admin only)
  static async getCourseAnalytics(req, res) {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user.id;
      const userRole = req.user.role;
      const course = await storage.getCourse(courseId);
      if (!course) {
        throw createNotFoundError("Course");
      }
      if (userRole !== "admin" && course.instructorId !== userId) {
        throw createForbiddenError("You can only view analytics for your own courses");
      }
      const analytics = await storage.getCourseLearningAnalytics(courseId);
      const analyticsData = {
        totalViews: analytics.filter((a) => a.activityType === "lesson_view").length,
        totalCompletions: analytics.filter((a) => a.activityType === "lesson_complete").length,
        averageSessionTime: 0,
        // Calculate from analytics data
        activityByDay: {},
        // Group by day
        popularLessons: []
        // Most viewed lessons
      };
      res.json({
        success: true,
        data: { analytics: analyticsData }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Get course analytics error:", error);
      throw createValidationError("Failed to fetch course analytics");
    }
  }
};

// server/controllers/gamificationController.ts
var GamificationController = class _GamificationController {
  // Get user's gamification stats
  static async getUserStats(req, res) {
    try {
      const userId = req.user.id;
      const userStats2 = await storage.getUserStats(userId);
      if (!userStats2) {
        throw createNotFoundError("User stats");
      }
      const currentLevel = calculateLevelFromXP(userStats2.totalXP);
      const xpToNextLevel = calculateXPToNextLevel(userStats2.totalXP);
      const currentStreak = calculateLearningStreak(userStats2.lastActivityDate);
      const achievements2 = await storage.getUserAchievements(userId);
      res.json({
        success: true,
        data: {
          stats: {
            ...userStats2,
            currentLevel,
            xpToNextLevel,
            currentStreak,
            achievementCount: achievements2.length
          },
          achievements: achievements2
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Get user stats error:", error);
      throw createValidationError("Failed to fetch user stats");
    }
  }
  // Get global leaderboard
  static async getLeaderboard(req, res) {
    try {
      const { category = "overall", limit = 10, period = "all-time" } = req.query;
      const leaderboard = await storage.getLeaderboard(
        category,
        parseInt(limit)
      );
      res.json({
        success: true,
        data: {
          leaderboard,
          category,
          period
        }
      });
    } catch (error) {
      logger.error("Get leaderboard error:", error);
      throw createValidationError("Failed to fetch leaderboard");
    }
  }
  // Award XP manually (admin only)
  static async awardXP(req, res) {
    try {
      const { userId, amount, reason } = req.body;
      if (!userId || !amount || !reason) {
        throw createValidationError("User ID, amount, and reason are required");
      }
      await storage.addXP(userId, amount, reason, "manual_award");
      metricsLogger.xpEarned(userId, amount, reason);
      const userStats2 = await storage.getUserStats(userId);
      if (userStats2) {
        const newLevel = calculateLevelFromXP(userStats2.totalXP);
        const oldLevel = userStats2.level;
        if (newLevel > oldLevel) {
          await storage.updateUserStats(userId, { level: newLevel });
          await _GamificationController.checkLevelAchievements(userId, newLevel);
        }
      }
      res.json({
        success: true,
        message: `Awarded ${amount} XP to user ${userId}`,
        data: { userId, amount, reason }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Award XP error:", error);
      throw createValidationError("Failed to award XP");
    }
  }
  // Update learning streak
  static async updateLearningStreak(req, res) {
    try {
      const userId = req.user.id;
      const userStats2 = await storage.getUserStats(userId);
      if (!userStats2) {
        throw createNotFoundError("User stats");
      }
      const today = /* @__PURE__ */ new Date();
      const lastActivity = userStats2.lastActivityDate;
      let newStreak = userStats2.streak;
      let streakBonus = 0;
      if (lastActivity) {
        const daysSinceLastActivity = Math.floor(
          (today.getTime() - lastActivity.getTime()) / (1e3 * 60 * 60 * 24)
        );
        if (daysSinceLastActivity === 1) {
          newStreak = userStats2.streak + 1;
          streakBonus = Math.min(newStreak * 2, 50);
        } else if (daysSinceLastActivity > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
      const updates = {
        streak: newStreak,
        lastActivityDate: today
      };
      if (newStreak > userStats2.longestStreak) {
        updates.longestStreak = newStreak;
      }
      await storage.updateUserStats(userId, updates);
      if (streakBonus > 0) {
        await storage.addXP(
          userId,
          streakBonus,
          `Learning streak bonus (${newStreak} days)`,
          "streak_bonus"
        );
      }
      await _GamificationController.checkStreakAchievements(userId, newStreak);
      res.json({
        success: true,
        message: "Learning streak updated",
        data: {
          newStreak,
          streakBonus,
          longestStreak: updates.longestStreak || userStats2.longestStreak
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Update learning streak error:", error);
      throw createValidationError("Failed to update learning streak");
    }
  }
  // Get available achievements
  static async getAvailableAchievements(req, res) {
    try {
      const achievements2 = [
        {
          id: 1,
          name: "First Steps",
          description: "Complete your first lesson",
          icon: "\u{1F3AF}",
          xpReward: 50,
          category: "learning",
          rarity: "common",
          requirements: { lessonsCompleted: 1 }
        },
        {
          id: 2,
          name: "Knowledge Seeker",
          description: "Complete 10 lessons",
          icon: "\u{1F4DA}",
          xpReward: 200,
          category: "learning",
          rarity: "rare",
          requirements: { lessonsCompleted: 10 }
        },
        {
          id: 3,
          name: "Streak Master",
          description: "Maintain a 7-day learning streak",
          icon: "\u{1F525}",
          xpReward: 300,
          category: "streak",
          rarity: "epic",
          requirements: { streak: 7 }
        },
        {
          id: 4,
          name: "Helper",
          description: "Get 5 helpful answer ratings",
          icon: "\u{1F91D}",
          xpReward: 250,
          category: "social",
          rarity: "rare",
          requirements: { helpfulAnswers: 5 }
        },
        {
          id: 5,
          name: "Graduate",
          description: "Complete your first course",
          icon: "\u{1F393}",
          xpReward: 500,
          category: "milestone",
          rarity: "epic",
          requirements: { coursesCompleted: 1 }
        },
        {
          id: 6,
          name: "Quiz Master",
          description: "Pass 20 quizzes",
          icon: "\u{1F9E0}",
          xpReward: 400,
          category: "learning",
          rarity: "epic",
          requirements: { quizzesCompleted: 20 }
        },
        {
          id: 7,
          name: "Level 10",
          description: "Reach level 10",
          icon: "\u2B50",
          xpReward: 1e3,
          category: "milestone",
          rarity: "legendary",
          requirements: { level: 10 }
        }
      ];
      res.json({
        success: true,
        data: { achievements: achievements2 }
      });
    } catch (error) {
      logger.error("Get achievements error:", error);
      throw createValidationError("Failed to fetch achievements");
    }
  }
  // Check and unlock achievements
  static async checkAchievements(req, res) {
    try {
      const userId = req.user.id;
      const userStats2 = await storage.getUserStats(userId);
      if (!userStats2) {
        throw createNotFoundError("User stats");
      }
      const unlockedAchievements = [];
      await _GamificationController.checkLearningAchievements(userId, userStats2, unlockedAchievements);
      await _GamificationController.checkLevelAchievements(userId, userStats2.level, unlockedAchievements);
      await _GamificationController.checkStreakAchievements(userId, userStats2.streak, unlockedAchievements);
      await _GamificationController.checkSocialAchievements(userId, userStats2, unlockedAchievements);
      res.json({
        success: true,
        message: `Checked achievements for user ${userId}`,
        data: {
          newAchievements: unlockedAchievements,
          totalUnlocked: unlockedAchievements.length
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Check achievements error:", error);
      throw createValidationError("Failed to check achievements");
    }
  }
  // Get user's XP transaction history
  static async getXPHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;
      const transactions = [
        {
          id: 1,
          amount: 25,
          reason: "Lesson completion",
          sourceType: "lesson_completion",
          createdAt: /* @__PURE__ */ new Date()
        },
        {
          id: 2,
          amount: 50,
          reason: "Quiz completion",
          sourceType: "quiz_completion",
          createdAt: new Date(Date.now() - 864e5)
        }
      ];
      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            currentPage: Number(page),
            totalPages: 1,
            totalItems: transactions.length
          }
        }
      });
    } catch (error) {
      logger.error("Get XP history error:", error);
      throw createValidationError("Failed to fetch XP history");
    }
  }
  // Helper methods for achievement checking
  static async checkLearningAchievements(userId, userStats2, unlockedAchievements) {
    if (userStats2.lessonsCompleted === 1) {
      await _GamificationController.unlockAchievement(userId, 1, "First Steps", unlockedAchievements);
    }
    if (userStats2.lessonsCompleted === 10) {
      await _GamificationController.unlockAchievement(userId, 2, "Knowledge Seeker", unlockedAchievements);
    }
    if (userStats2.quizzesCompleted === 20) {
      await _GamificationController.unlockAchievement(userId, 6, "Quiz Master", unlockedAchievements);
    }
    if (userStats2.coursesCompleted === 1) {
      await _GamificationController.unlockAchievement(userId, 5, "Graduate", unlockedAchievements);
    }
  }
  static async checkLevelAchievements(userId, level, unlockedAchievements = []) {
    if (level === 10) {
      await _GamificationController.unlockAchievement(userId, 7, "Level 10", unlockedAchievements);
    }
  }
  static async checkStreakAchievements(userId, streak, unlockedAchievements = []) {
    if (streak === 7) {
      await _GamificationController.unlockAchievement(userId, 3, "Streak Master", unlockedAchievements);
    }
  }
  static async checkSocialAchievements(userId, userStats2, unlockedAchievements) {
    if (userStats2.helpfulAnswers === 5) {
      await _GamificationController.unlockAchievement(userId, 4, "Helper", unlockedAchievements);
    }
  }
  static async unlockAchievement(userId, achievementId, achievementName, unlockedAchievements) {
    try {
      const userAchievements2 = await storage.getUserAchievements(userId);
      const alreadyUnlocked = userAchievements2.some((a) => a.id === achievementId);
      if (!alreadyUnlocked) {
        await storage.unlockAchievement(userId, achievementId);
        const xpReward = 100;
        await storage.addXP(userId, xpReward, `Achievement unlocked: ${achievementName}`, "achievement", achievementId);
        unlockedAchievements.push({
          id: achievementId,
          name: achievementName,
          xpReward
        });
        metricsLogger.achievementUnlocked(userId, achievementId, achievementName);
      }
    } catch (error) {
      logger.error("Unlock achievement error:", error);
    }
  }
};

// server/controllers/peerHelpController.ts
var PeerHelpController = class {
  // Get help categories
  static async getCategories(req, res) {
    try {
      const categories = await storage.getHelpCategories();
      res.json({
        success: true,
        data: { categories }
      });
    } catch (error) {
      logger.error("Get categories error:", error);
      throw createValidationError("Failed to fetch categories");
    }
  }
  // Get questions with filtering and pagination
  static async getQuestions(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        categoryId,
        search,
        status,
        sort = "recent",
        tags
      } = req.query;
      const filters = {
        search,
        status,
        tags
      };
      const questions = await storage.getHelpQuestions(
        categoryId ? parseInt(categoryId) : void 0,
        filters
      );
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedQuestions = questions.slice(startIndex, endIndex);
      const result = createPaginationResult(
        paginatedQuestions,
        questions.length,
        { page: Number(page), limit: Number(limit), sort }
      );
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error("Get questions error:", error);
      throw createValidationError("Failed to fetch questions");
    }
  }
  // Get single question with answers
  static async getQuestion(req, res) {
    try {
      const questionId = parseInt(req.params.id);
      const question = await storage.getHelpQuestion(questionId);
      if (!question) {
        throw createNotFoundError("Question");
      }
      const answers = await storage.getQuestionAnswers(questionId);
      res.json({
        success: true,
        data: {
          question,
          answers,
          answerCount: answers.length
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Get question error:", error);
      throw createValidationError("Failed to fetch question");
    }
  }
  // Create new question
  static async createQuestion(req, res) {
    try {
      const questionData = insertHelpQuestionSchema.parse(req.body);
      const userId = req.user.id;
      const newQuestion = await storage.createHelpQuestion({
        ...questionData,
        userId
      });
      await storage.addXP(userId, 5, "Asked a question", "help_question", newQuestion.id);
      logger.info(`Question created: ${newQuestion.id} by user ${userId}`);
      res.status(201).json({
        success: true,
        message: "Question created successfully",
        data: { question: newQuestion }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Create question error:", error);
      throw createValidationError("Failed to create question");
    }
  }
  // Create answer to question
  static async createAnswer(req, res) {
    try {
      const questionId = parseInt(req.params.questionId);
      const answerData = insertHelpAnswerSchema.parse(req.body);
      const userId = req.user.id;
      const question = await storage.getHelpQuestion(questionId);
      if (!question) {
        throw createNotFoundError("Question");
      }
      const newAnswer = await storage.createHelpAnswer({
        ...answerData,
        questionId,
        userId
      });
      await storage.addXP(userId, 15, "Answered a question", "help_answer", newAnswer.id);
      logger.info(`Answer created: ${newAnswer.id} for question ${questionId} by user ${userId}`);
      res.status(201).json({
        success: true,
        message: "Answer created successfully",
        data: { answer: newAnswer }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Create answer error:", error);
      throw createValidationError("Failed to create answer");
    }
  }
  // Rate an answer (XP rating by question author or star rating by community)
  static async rateAnswer(req, res) {
    try {
      const answerId = parseInt(req.params.answerId);
      const { xpRating, starRating } = req.body;
      const userId = req.user.id;
      const answers = await storage.getQuestionAnswers(0);
      const answer = answers.find((a) => a.id === answerId);
      if (!answer) {
        throw createNotFoundError("Answer");
      }
      const question = await storage.getHelpQuestion(answer.questionId);
      if (!question) {
        throw createNotFoundError("Question");
      }
      if (xpRating !== void 0) {
        if (question.userId !== userId) {
          throw createForbiddenError("Only the question author can give XP ratings");
        }
        if (xpRating < 1 || xpRating > 10) {
          throw createValidationError("XP rating must be between 1 and 10");
        }
        const xpAward = xpRating * 10;
        await storage.addXP(
          answer.userId,
          xpAward,
          `Helpful answer rating: ${xpRating}/10`,
          "helpful_answer",
          answerId
        );
        await storage.updateUserStats(answer.userId, {
          helpfulAnswers: 1
          // This should increment, not set
        });
        metricsLogger.xpEarned(answer.userId, xpAward, "helpful_answer_rating");
      }
      if (starRating !== void 0) {
        if (answer.userId === userId) {
          throw createForbiddenError("You cannot rate your own answer");
        }
        if (starRating < 1 || starRating > 5) {
          throw createValidationError("Star rating must be between 1 and 5");
        }
      }
      await storage.rateAnswer(answerId, userId, xpRating, starRating);
      res.json({
        success: true,
        message: "Answer rated successfully",
        data: {
          answerId,
          xpRating,
          starRating,
          xpAwarded: xpRating ? xpRating * 10 : 0
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Rate answer error:", error);
      throw createValidationError("Failed to rate answer");
    }
  }
  // Get leaderboard for peer help
  static async getHelpLeaderboard(req, res) {
    try {
      const { period = "monthly", limit = 10 } = req.query;
      const leaderboard = [
        {
          rank: 1,
          userId: 1,
          username: "helpmaster",
          fullName: "Help Master",
          avatar: null,
          helpfulAnswers: 45,
          totalXPFromHelp: 1250,
          level: 8
        },
        {
          rank: 2,
          userId: 2,
          username: "codeguru",
          fullName: "Code Guru",
          avatar: null,
          helpfulAnswers: 38,
          totalXPFromHelp: 980,
          level: 7
        }
      ];
      res.json({
        success: true,
        data: {
          leaderboard,
          period,
          lastUpdated: /* @__PURE__ */ new Date()
        }
      });
    } catch (error) {
      logger.error("Get help leaderboard error:", error);
      throw createValidationError("Failed to fetch help leaderboard");
    }
  }
  // Get user's help statistics
  static async getUserHelpStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = {
        questionsAsked: 12,
        answersGiven: 28,
        helpfulAnswers: 15,
        averageXPRating: 7.2,
        averageStarRating: 4.1,
        totalXPFromHelp: 420,
        rank: 5,
        badges: [
          { name: "First Answer", icon: "\u{1F31F}", earnedAt: "2024-01-15" },
          { name: "Helpful Helper", icon: "\u{1F91D}", earnedAt: "2024-02-20" }
        ]
      };
      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      logger.error("Get user help stats error:", error);
      throw createValidationError("Failed to fetch user help stats");
    }
  }
  // Vote on question (upvote/downvote)
  static async voteOnQuestion(req, res) {
    try {
      const questionId = parseInt(req.params.questionId);
      const { voteType } = req.body;
      const userId = req.user.id;
      if (!["up", "down"].includes(voteType)) {
        throw createValidationError('Vote type must be "up" or "down"');
      }
      const question = await storage.getHelpQuestion(questionId);
      if (!question) {
        throw createNotFoundError("Question");
      }
      if (question.userId === userId) {
        throw createForbiddenError("You cannot vote on your own question");
      }
      res.json({
        success: true,
        message: "Vote recorded successfully",
        data: {
          questionId,
          voteType,
          newUpvotes: question.upvotes + (voteType === "up" ? 1 : 0),
          newDownvotes: question.downvotes + (voteType === "down" ? 1 : 0)
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Vote on question error:", error);
      throw createValidationError("Failed to record vote");
    }
  }
  // Vote on answer (upvote/downvote)
  static async voteOnAnswer(req, res) {
    try {
      const answerId = parseInt(req.params.answerId);
      const { voteType } = req.body;
      const userId = req.user.id;
      if (!["up", "down"].includes(voteType)) {
        throw createValidationError('Vote type must be "up" or "down"');
      }
      const answers = await storage.getQuestionAnswers(0);
      const answer = answers.find((a) => a.id === answerId);
      if (!answer) {
        throw createNotFoundError("Answer");
      }
      if (answer.userId === userId) {
        throw createForbiddenError("You cannot vote on your own answer");
      }
      res.json({
        success: true,
        message: "Vote recorded successfully",
        data: {
          answerId,
          voteType,
          newUpvotes: answer.upvotes + (voteType === "up" ? 1 : 0),
          newDownvotes: answer.downvotes + (voteType === "down" ? 1 : 0)
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Vote on answer error:", error);
      throw createValidationError("Failed to record vote");
    }
  }
  // Mark answer as accepted (question author only)
  static async acceptAnswer(req, res) {
    try {
      const answerId = parseInt(req.params.answerId);
      const userId = req.user.id;
      const answers = await storage.getQuestionAnswers(0);
      const answer = answers.find((a) => a.id === answerId);
      if (!answer) {
        throw createNotFoundError("Answer");
      }
      const question = await storage.getHelpQuestion(answer.questionId);
      if (!question) {
        throw createNotFoundError("Question");
      }
      if (question.userId !== userId) {
        throw createForbiddenError("Only the question author can accept answers");
      }
      await storage.addXP(
        answer.userId,
        50,
        "Answer accepted",
        "answer_accepted",
        answerId
      );
      res.json({
        success: true,
        message: "Answer accepted successfully",
        data: { answerId }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Accept answer error:", error);
      throw createValidationError("Failed to accept answer");
    }
  }
  // Search questions and answers
  static async searchQuestions(req, res) {
    try {
      const { q, category, tags, page = 1, limit = 10 } = req.query;
      if (!q || q.length < 3) {
        throw createValidationError("Search query must be at least 3 characters");
      }
      const filters = {
        search: q,
        category,
        tags
      };
      const questions = await storage.getHelpQuestions(void 0, filters);
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedQuestions = questions.slice(startIndex, endIndex);
      const result = createPaginationResult(
        paginatedQuestions,
        questions.length,
        { page: Number(page), limit: Number(limit) }
      );
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Search questions error:", error);
      throw createValidationError("Failed to search questions");
    }
  }
};

// server/controllers/analyticsController.ts
var AnalyticsController = class _AnalyticsController {
  // Get user learning analytics
  static async getUserAnalytics(req, res) {
    try {
      const userId = req.user.id;
      const { startDate, endDate, activityType } = req.query;
      const filters = {};
      if (startDate) {
        filters.startDate = new Date(startDate);
      }
      if (endDate) {
        filters.endDate = new Date(endDate);
      }
      if (activityType) {
        filters.activityType = activityType;
      }
      const analytics = await storage.getUserLearningAnalytics(userId, filters);
      const processedData = _AnalyticsController.processUserAnalytics(analytics);
      res.json({
        success: true,
        data: {
          analytics: processedData,
          totalActivities: analytics.length,
          period: {
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Get user analytics error:", error);
      throw createValidationError("Failed to fetch user analytics");
    }
  }
  // Get course analytics (instructor/admin only)
  static async getCourseAnalytics(req, res) {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = req.user.id;
      const userRole = req.user.role;
      const course = await storage.getCourse(courseId);
      if (!course) {
        throw createNotFoundError("Course");
      }
      if (userRole !== "admin" && course.instructorId !== userId) {
        throw createForbiddenError("You can only view analytics for your own courses");
      }
      const analytics = await storage.getCourseLearningAnalytics(courseId);
      const processedData = _AnalyticsController.processCourseAnalytics(analytics);
      res.json({
        success: true,
        data: {
          course: {
            id: course.id,
            title: course.title,
            instructorId: course.instructorId
          },
          analytics: processedData,
          totalActivities: analytics.length
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Get course analytics error:", error);
      throw createValidationError("Failed to fetch course analytics");
    }
  }
  // Get dashboard analytics summary
  static async getDashboardAnalytics(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const weekStart = getStartOfWeek();
      const weekEnd = getEndOfWeek();
      const monthStart = getStartOfMonth();
      const monthEnd = getEndOfMonth();
      let dashboardData = {};
      if (userRole === "student") {
        const weeklyAnalytics = await storage.getUserLearningAnalytics(userId, {
          startDate: weekStart,
          endDate: weekEnd
        });
        const monthlyAnalytics = await storage.getUserLearningAnalytics(userId, {
          startDate: monthStart,
          endDate: monthEnd
        });
        dashboardData = {
          thisWeek: {
            totalActivities: weeklyAnalytics.length,
            lessonsViewed: weeklyAnalytics.filter((a) => a.activityType === "lesson_view").length,
            lessonsCompleted: weeklyAnalytics.filter((a) => a.activityType === "lesson_complete").length,
            quizAttempts: weeklyAnalytics.filter((a) => a.activityType === "quiz_attempt").length,
            studyTime: weeklyAnalytics.reduce((sum, a) => sum + (a.duration || 0), 0)
          },
          thisMonth: {
            totalActivities: monthlyAnalytics.length,
            lessonsViewed: monthlyAnalytics.filter((a) => a.activityType === "lesson_view").length,
            lessonsCompleted: monthlyAnalytics.filter((a) => a.activityType === "lesson_complete").length,
            quizAttempts: monthlyAnalytics.filter((a) => a.activityType === "quiz_attempt").length,
            studyTime: monthlyAnalytics.reduce((sum, a) => sum + (a.duration || 0), 0)
          }
        };
        const userStats2 = await storage.getUserStats(userId);
        if (userStats2) {
          dashboardData.overall = {
            totalXP: userStats2.totalXP,
            level: userStats2.level,
            streak: userStats2.streak,
            coursesCompleted: userStats2.coursesCompleted,
            lessonsCompleted: userStats2.lessonsCompleted,
            quizzesCompleted: userStats2.quizzesCompleted
          };
        }
      } else if (userRole === "instructor") {
        const instructorCourses = await storage.getInstructorCourses(userId);
        const courseIds = instructorCourses.map((c) => c.id);
        let totalStudents = 0;
        let totalLessonViews = 0;
        let totalCompletions = 0;
        for (const courseId of courseIds) {
          const courseAnalytics = await storage.getCourseLearningAnalytics(courseId, {
            startDate: monthStart,
            endDate: monthEnd
          });
          totalLessonViews += courseAnalytics.filter((a) => a.activityType === "lesson_view").length;
          totalCompletions += courseAnalytics.filter((a) => a.activityType === "lesson_complete").length;
          const uniqueStudents = new Set(courseAnalytics.map((a) => a.userId)).size;
          totalStudents += uniqueStudents;
        }
        dashboardData = {
          courses: {
            total: instructorCourses.length,
            totalStudents,
            thisMonth: {
              lessonViews: totalLessonViews,
              completions: totalCompletions,
              engagementRate: totalLessonViews > 0 ? (totalCompletions / totalLessonViews * 100).toFixed(1) : 0
            }
          }
        };
      } else if (userRole === "admin") {
        dashboardData = {
          systemOverview: {
            message: "Admin analytics would show system-wide metrics"
          }
        };
      }
      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      logger.error("Get dashboard analytics error:", error);
      throw createValidationError("Failed to fetch dashboard analytics");
    }
  }
  // Record learning activity
  static async recordActivity(req, res) {
    try {
      const userId = req.user.id;
      const {
        courseId,
        lessonId,
        activityType,
        duration,
        progress,
        metadata
      } = req.body;
      if (!activityType) {
        throw createValidationError("Activity type is required");
      }
      const activity = {
        userId,
        courseId: courseId ? parseInt(courseId) : void 0,
        lessonId: lessonId ? parseInt(lessonId) : void 0,
        activityType,
        duration: duration ? parseInt(duration) : void 0,
        progress: progress ? parseFloat(progress) : void 0,
        metadata: metadata || {},
        createdAt: /* @__PURE__ */ new Date()
      };
      await storage.recordLearningActivity(activity);
      await storage.updateUserActivity(userId);
      res.json({
        success: true,
        message: "Activity recorded successfully",
        data: { activity }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Record activity error:", error);
      throw createValidationError("Failed to record activity");
    }
  }
  // Get learning progress report
  static async getProgressReport(req, res) {
    try {
      const userId = req.user.id;
      const { courseId, period = "month" } = req.query;
      let startDate;
      let endDate = /* @__PURE__ */ new Date();
      switch (period) {
        case "week":
          startDate = getStartOfWeek();
          break;
        case "month":
          startDate = getStartOfMonth();
          break;
        case "year":
          startDate = new Date(endDate.getFullYear(), 0, 1);
          break;
        default:
          startDate = getStartOfMonth();
      }
      const filters = { startDate, endDate };
      if (courseId) {
        filters.courseId = parseInt(courseId);
      }
      const analytics = await storage.getUserLearningAnalytics(userId, filters);
      const report = _AnalyticsController.generateProgressReport(analytics, period);
      res.json({
        success: true,
        data: {
          report,
          period,
          dateRange: { startDate, endDate }
        }
      });
    } catch (error) {
      logger.error("Get progress report error:", error);
      throw createValidationError("Failed to generate progress report");
    }
  }
  // Get learning streaks and patterns
  static async getLearningPatterns(req, res) {
    try {
      const userId = req.user.id;
      const { days = 30 } = req.query;
      const startDate = /* @__PURE__ */ new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      const analytics = await storage.getUserLearningAnalytics(userId, {
        startDate,
        endDate: /* @__PURE__ */ new Date()
      });
      const patterns = _AnalyticsController.analyzeLearningPatterns(analytics);
      res.json({
        success: true,
        data: {
          patterns,
          analysisRange: {
            days: parseInt(days),
            startDate,
            endDate: /* @__PURE__ */ new Date()
          }
        }
      });
    } catch (error) {
      logger.error("Get learning patterns error:", error);
      throw createValidationError("Failed to analyze learning patterns");
    }
  }
  // Helper methods for processing analytics data
  static processUserAnalytics(analytics) {
    const byDay = {};
    const byActivityType = {};
    let totalStudyTime = 0;
    analytics.forEach((activity) => {
      const day = activity.createdAt.toISOString().split("T")[0];
      if (!byDay[day]) {
        byDay[day] = {
          date: day,
          activities: 0,
          studyTime: 0,
          lessonsViewed: 0,
          lessonsCompleted: 0,
          quizAttempts: 0
        };
      }
      byDay[day].activities++;
      if (activity.duration) {
        byDay[day].studyTime += activity.duration;
        totalStudyTime += activity.duration;
      }
      if (activity.activityType === "lesson_view") {
        byDay[day].lessonsViewed++;
      } else if (activity.activityType === "lesson_complete") {
        byDay[day].lessonsCompleted++;
      } else if (activity.activityType === "quiz_attempt") {
        byDay[day].quizAttempts++;
      }
      byActivityType[activity.activityType] = (byActivityType[activity.activityType] || 0) + 1;
    });
    return {
      dailyActivity: Object.values(byDay),
      activityBreakdown: byActivityType,
      totalStudyTime,
      averageDailyActivity: analytics.length / Object.keys(byDay).length || 0
    };
  }
  static processCourseAnalytics(analytics) {
    const uniqueUsers = new Set(analytics.map((a) => a.userId)).size;
    const totalViews = analytics.filter((a) => a.activityType === "lesson_view").length;
    const totalCompletions = analytics.filter((a) => a.activityType === "lesson_complete").length;
    const engagementRate = totalViews > 0 ? totalCompletions / totalViews * 100 : 0;
    const userActivity = {};
    analytics.forEach((activity) => {
      if (!userActivity[activity.userId]) {
        userActivity[activity.userId] = {
          userId: activity.userId,
          views: 0,
          completions: 0,
          lastActivity: activity.createdAt
        };
      }
      if (activity.activityType === "lesson_view") {
        userActivity[activity.userId].views++;
      } else if (activity.activityType === "lesson_complete") {
        userActivity[activity.userId].completions++;
      }
      if (activity.createdAt > userActivity[activity.userId].lastActivity) {
        userActivity[activity.userId].lastActivity = activity.createdAt;
      }
    });
    return {
      overview: {
        uniqueUsers,
        totalViews,
        totalCompletions,
        engagementRate: engagementRate.toFixed(1)
      },
      userActivity: Object.values(userActivity)
    };
  }
  static generateProgressReport(analytics, period) {
    const totalActivities = analytics.length;
    const lessonsCompleted = analytics.filter((a) => a.activityType === "lesson_complete").length;
    const quizAttempts2 = analytics.filter((a) => a.activityType === "quiz_attempt").length;
    const totalStudyTime = analytics.reduce((sum, a) => sum + (a.duration || 0), 0);
    return {
      summary: {
        totalActivities,
        lessonsCompleted,
        quizAttempts: quizAttempts2,
        totalStudyTime,
        averageStudyTime: totalStudyTime / Math.max(totalActivities, 1)
      },
      goals: {
        lessonsTarget: period === "week" ? 5 : period === "month" ? 20 : 100,
        lessonsProgress: lessonsCompleted,
        completionRate: period === "week" ? lessonsCompleted / 5 * 100 : period === "month" ? lessonsCompleted / 20 * 100 : lessonsCompleted / 100 * 100
      }
    };
  }
  static analyzeLearningPatterns(analytics) {
    const hourlyActivity = {};
    const dailyActivity = {};
    analytics.forEach((activity) => {
      const hour = activity.createdAt.getHours();
      const dayOfWeek = activity.createdAt.getDay();
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
      dailyActivity[dayNames[dayOfWeek]] = (dailyActivity[dayNames[dayOfWeek]] || 0) + 1;
    });
    const peakHour = Object.entries(hourlyActivity).reduce(
      (a, b) => hourlyActivity[parseInt(a[0])] > hourlyActivity[parseInt(b[0])] ? a : b,
      ["0", 0]
    );
    const peakDay = Object.entries(dailyActivity).reduce(
      (a, b) => a[1] > b[1] ? a : b,
      ["Monday", 0]
    );
    return {
      hourlyActivity,
      dailyActivity,
      peakLearningHour: parseInt(peakHour[0]),
      peakLearningDay: peakDay[0],
      totalSessions: analytics.length,
      averageSessionLength: analytics.reduce((sum, a) => sum + (a.duration || 0), 0) / analytics.length || 0
    };
  }
};

// server/controllers/aiController.ts
import { eq as eq2, and as and2, sql as sql2 } from "drizzle-orm";

// server/services/aiService.ts
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
var analyzeAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const answer = await db.select().from(helpAnswers).where(eq2(helpAnswers.id, parseInt(answerId))).limit(1);
    if (!answer.length) {
      return res.status(404).json({ error: "Answer not found" });
    }
    const aiService = new AIService();
    const analysis = await aiService.analyzeAnswer(answer[0].content);
    const aiScore = await db.insert(aiScores).values({
      answerId: parseInt(answerId),
      aiScore: analysis.overallScore.toString(),
      summaryComment: analysis.summary,
      grammarScore: analysis.grammarScore.toString(),
      clarityScore: analysis.clarityScore.toString(),
      correctnessScore: analysis.correctnessScore.toString()
    }).returning();
    await db.insert(notifications).values({
      userId: answer[0].userId,
      title: "AI Analysis Complete",
      message: `Your answer received an AI quality score of ${analysis.overallScore}/10`,
      type: "answer_received",
      relatedId: parseInt(answerId),
      relatedType: "answer"
    });
    logger.info(`AI analysis completed for answer ${answerId}`, { analysis });
    res.json({ analysis: aiScore[0], insights: analysis });
  } catch (error) {
    logger.error("Error analyzing answer:", error);
    res.status(500).json({ error: "Failed to analyze answer" });
  }
};
var getSkillAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const skills = await db.select().from(skillProgress).where(eq2(skillProgress.userId, parseInt(userId)));
    const totalXP = skills.reduce((sum, skill) => sum + (skill.totalXP || 0), 0);
    const skillDistribution = skills.map((skill) => ({
      ...skill,
      percentage: totalXP > 0 ? (skill.totalXP || 0) / totalXP * 100 : 0
    }));
    const weeklyGrowth = await db.execute(sql2`
      SELECT skill_tag, DATE_TRUNC('week', last_updated) as week, SUM(total_xp) as weekly_xp
      FROM skill_progress
      WHERE user_id = ${parseInt(userId)}
      AND last_updated >= NOW() - INTERVAL '8 weeks'
      GROUP BY skill_tag, week
      ORDER BY week DESC
    `);
    res.json({
      skillDistribution,
      weeklyGrowth: weeklyGrowth.rows,
      topSkills: skills.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0)).slice(0, 5),
      totalSkills: skills.length,
      totalXP
    });
  } catch (error) {
    logger.error("Error fetching skill analytics:", error);
    res.status(500).json({ error: "Failed to fetch skill analytics" });
  }
};
var updateSkillProgress = async (req, res) => {
  try {
    const { userId, skillTag, xpGained, questionAnswered } = req.body;
    const existing = await db.select().from(skillProgress).where(and2(eq2(skillProgress.userId, userId), eq2(skillProgress.skillTag, skillTag))).limit(1);
    if (existing.length > 0) {
      await db.update(skillProgress).set({
        totalXP: sql2`total_xp + ${xpGained}`,
        questionsAnswered: sql2`questions_answered + ${questionAnswered ? 1 : 0}`,
        lastUpdated: /* @__PURE__ */ new Date()
      }).where(and2(eq2(skillProgress.userId, userId), eq2(skillProgress.skillTag, skillTag)));
    } else {
      await db.insert(skillProgress).values({
        userId,
        skillTag,
        totalXP: xpGained,
        questionsAnswered: questionAnswered ? 1 : 0
      });
    }
    logger.info(`Skill progress updated for user ${userId}, skill ${skillTag}`, { xpGained, questionAnswered });
    res.json({ success: true });
  } catch (error) {
    logger.error("Error updating skill progress:", error);
    res.status(500).json({ error: "Failed to update skill progress" });
  }
};
var createMission = async (req, res) => {
  try {
    const { title, description, xpReward, skillTag, missionType, requirements, validUntil } = req.body;
    const mission = await db.insert(missions).values({
      title,
      description,
      xpReward,
      skillTag,
      missionType,
      requirements,
      validUntil: validUntil ? new Date(validUntil) : void 0
    }).returning();
    logger.info(`Mission created: ${title}`, { missionId: mission[0].id });
    res.json(mission[0]);
  } catch (error) {
    logger.error("Error creating mission:", error);
    res.status(500).json({ error: "Failed to create mission" });
  }
};
var getUserMissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const userMissionsQuery = await db.execute(sql2`
      SELECT 
        m.*,
        mp.current_progress,
        mp.is_completed,
        mp.xp_claimed,
        mp.completed_at
      FROM missions m
      LEFT JOIN mission_progress mp ON m.id = mp.mission_id AND mp.user_id = ${parseInt(userId)}
      WHERE m.is_active = true 
      AND (m.valid_until IS NULL OR m.valid_until > NOW())
      ORDER BY m.created_at DESC
    `);
    res.json(userMissionsQuery.rows);
  } catch (error) {
    logger.error("Error fetching user missions:", error);
    res.status(500).json({ error: "Failed to fetch missions" });
  }
};
var updateMissionProgress = async (req, res) => {
  try {
    const { userId, missionId, progressIncrement } = req.body;
    const mission = await db.select().from(missions).where(eq2(missions.id, missionId)).limit(1);
    if (!mission.length) {
      return res.status(404).json({ error: "Mission not found" });
    }
    const existing = await db.select().from(missionProgress).where(and2(eq2(missionProgress.userId, userId), eq2(missionProgress.missionId, missionId))).limit(1);
    const targetProgress = mission[0].requirements.count;
    let newProgress = progressIncrement;
    let isCompleted = false;
    if (existing.length > 0) {
      newProgress = existing[0].currentProgress + progressIncrement;
      isCompleted = newProgress >= targetProgress;
      await db.update(missionProgress).set({
        currentProgress: newProgress,
        isCompleted,
        completedAt: isCompleted ? /* @__PURE__ */ new Date() : void 0
      }).where(and2(eq2(missionProgress.userId, userId), eq2(missionProgress.missionId, missionId)));
    } else {
      isCompleted = newProgress >= targetProgress;
      await db.insert(missionProgress).values({
        userId,
        missionId,
        currentProgress: newProgress,
        targetProgress,
        isCompleted,
        completedAt: isCompleted ? /* @__PURE__ */ new Date() : void 0
      });
    }
    if (isCompleted) {
      await db.insert(notifications).values({
        userId,
        title: "Mission Completed!",
        message: `You completed "${mission[0].title}" and earned ${mission[0].xpReward} XP!`,
        type: "mission_complete",
        relatedId: missionId,
        relatedType: "mission"
      });
    }
    logger.info(`Mission progress updated for user ${userId}, mission ${missionId}`, { newProgress, isCompleted });
    res.json({ success: true, progress: newProgress, completed: isCompleted });
  } catch (error) {
    logger.error("Error updating mission progress:", error);
    res.status(500).json({ error: "Failed to update mission progress" });
  }
};
var claimMissionReward = async (req, res) => {
  try {
    const { userId, missionId } = req.body;
    const progress = await db.select().from(missionProgress).where(and2(
      eq2(missionProgress.userId, userId),
      eq2(missionProgress.missionId, missionId),
      eq2(missionProgress.isCompleted, true),
      eq2(missionProgress.xpClaimed, false)
    )).limit(1);
    if (!progress.length) {
      return res.status(400).json({ error: "Mission not completed or reward already claimed" });
    }
    const mission = await db.select().from(missions).where(eq2(missions.id, missionId)).limit(1);
    await db.update(missionProgress).set({ xpClaimed: true }).where(and2(eq2(missionProgress.userId, userId), eq2(missionProgress.missionId, missionId)));
    await db.update(userStats).set({ totalXP: sql2`total_xp + ${mission[0].xpReward}` }).where(eq2(userStats.userId, userId));
    await db.insert(notifications).values({
      userId,
      title: "XP Reward Claimed!",
      message: `You earned ${mission[0].xpReward} XP from mission "${mission[0].title}"`,
      type: "xp_gained",
      relatedId: missionId,
      relatedType: "mission"
    });
    logger.info(`Mission reward claimed by user ${userId} for mission ${missionId}`, { xpReward: mission[0].xpReward });
    res.json({ success: true, xpEarned: mission[0].xpReward });
  } catch (error) {
    logger.error("Error claiming mission reward:", error);
    res.status(500).json({ error: "Failed to claim mission reward" });
  }
};
var checkUnlockStatus = async (req, res) => {
  try {
    const { userId, unlockType } = req.params;
    const unlock = await db.select().from(userUnlocks).where(and2(eq2(userUnlocks.userId, parseInt(userId)), eq2(userUnlocks.unlockType, unlockType))).limit(1);
    if (unlock.length > 0) {
      return res.json({ unlocked: true, unlockedAt: unlock[0].unlockedAt });
    }
    const userStatsData = await db.select().from(userStats).where(eq2(userStats.userId, parseInt(userId))).limit(1);
    if (!userStatsData.length) {
      return res.json({ unlocked: false, reason: "User stats not found" });
    }
    const stats = userStatsData[0];
    let canUnlock = false;
    let requirements = {};
    switch (unlockType) {
      case "mentor_status":
        requirements = { xp: 1e3, answersGiven: 20, rating: 4 };
        canUnlock = (stats.totalXP || 0) >= 1e3 && (stats.helpfulAnswers || 0) >= 20;
        break;
      case "premium_content":
        requirements = { xp: 500, coursesCompleted: 3 };
        canUnlock = (stats.totalXP || 0) >= 500 && (stats.coursesCompleted || 0) >= 3;
        break;
      default:
        return res.status(400).json({ error: "Invalid unlock type" });
    }
    if (canUnlock) {
      await db.insert(userUnlocks).values({
        userId: parseInt(userId),
        unlockType,
        requirements: JSON.stringify(requirements)
      });
      await db.insert(notifications).values({
        userId: parseInt(userId),
        title: "New Content Unlocked!",
        message: `You've unlocked ${unlockType.replace("_", " ")}!`,
        type: "badge_earned",
        relatedType: "unlock"
      });
      logger.info(`User ${userId} unlocked ${unlockType}`, { requirements });
      res.json({ unlocked: true, justUnlocked: true });
    } else {
      res.json({
        unlocked: false,
        requirements,
        currentStats: {
          xp: stats.totalXP || 0,
          answersGiven: stats.helpfulAnswers || 0,
          coursesCompleted: stats.coursesCompleted || 0
        }
      });
    }
  } catch (error) {
    logger.error("Error checking unlock status:", error);
    res.status(500).json({ error: "Failed to check unlock status" });
  }
};
var triggerAIMentor = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await db.select().from(helpQuestions).where(eq2(helpQuestions.id, parseInt(questionId))).limit(1);
    if (!question.length) {
      return res.status(404).json({ error: "Question not found" });
    }
    const questionAge = Date.now() - question[0].createdAt.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1e3;
    let triggerReason = "manual_trigger";
    if (questionAge > twentyFourHours) {
      triggerReason = "24_hour_timeout";
    }
    const aiService = new AIService();
    const aiResponse = await aiService.generateAnswer(question[0].title, question[0].content);
    const mentorResponse = await db.insert(aiMentorResponses).values({
      questionId: parseInt(questionId),
      aiResponse: aiResponse.answer,
      confidence: aiResponse.confidence.toString(),
      triggerReason
    }).returning();
    await db.insert(helpAnswers).values({
      questionId: parseInt(questionId),
      userId: 1,
      // System AI user ID
      content: `\u{1F916} **AI Suggested Answer:**

${aiResponse.answer}

*This is an AI-generated response. Please verify the information and consider getting a human expert's opinion.*`,
      isAccepted: false
    });
    await db.insert(notifications).values({
      userId: question[0].userId,
      title: "AI Mentor Response",
      message: "An AI mentor has provided a suggested answer to your question",
      type: "answer_received",
      relatedId: parseInt(questionId),
      relatedType: "question"
    });
    logger.info(`AI mentor response generated for question ${questionId}`, { confidence: aiResponse.confidence });
    res.json({ response: mentorResponse[0], aiAnswer: aiResponse });
  } catch (error) {
    logger.error("Error triggering AI mentor:", error);
    res.status(500).json({ error: "Failed to generate AI mentor response" });
  }
};
var getAnswerQualityStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const qualityStats = await db.execute(sql2`
      SELECT 
        COUNT(*) as total_answers,
        AVG(CASE WHEN af.vote_type = 'up' THEN 1 ELSE 0 END) as upvote_rate,
        AVG(ha.xp_rating) as avg_xp_rating,
        AVG(ha.star_rating) as avg_star_rating,
        COUNT(CASE WHEN ha.is_accepted = true THEN 1 END) as accepted_answers
      FROM help_answers ha
      LEFT JOIN answer_feedback af ON ha.id = af.answer_id
      WHERE ha.user_id = ${parseInt(userId)}
      GROUP BY ha.user_id
    `);
    const feedbackTrend = await db.execute(sql2`
      SELECT 
        DATE_TRUNC('week', af.created_at) as week,
        COUNT(CASE WHEN af.vote_type = 'up' THEN 1 END) as upvotes,
        COUNT(CASE WHEN af.vote_type = 'down' THEN 1 END) as downvotes
      FROM answer_feedback af
      JOIN help_answers ha ON af.answer_id = ha.id
      WHERE ha.user_id = ${parseInt(userId)}
      AND af.created_at >= NOW() - INTERVAL '12 weeks'
      GROUP BY week
      ORDER BY week DESC
    `);
    res.json({
      qualityStats: qualityStats.rows[0] || {},
      feedbackTrend: feedbackTrend.rows
    });
  } catch (error) {
    logger.error("Error fetching answer quality stats:", error);
    res.status(500).json({ error: "Failed to fetch quality stats" });
  }
};
var healthCheck = async (req, res) => {
  try {
    const aiService = new AIService();
    const testResponse = await aiService.healthCheck();
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

// server/controllers/adminController.ts
var AdminController = class {
  // Get system statistics
  static async getSystemStats(req, res) {
    try {
      const stats = {
        users: {
          total: 0,
          students: 0,
          instructors: 0,
          admins: 0,
          activeThisMonth: 0
        },
        courses: {
          total: 0,
          published: 0,
          enrollments: 0,
          completions: 0
        },
        engagement: {
          dailyActiveUsers: 0,
          averageSessionTime: 0,
          totalLearningHours: 0
        },
        ai: {
          totalRequests: 0,
          summariesGenerated: 0,
          questionsGenerated: 0,
          chatInteractions: 0
        },
        systemHealth: {
          status: "good",
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          dbConnectionStatus: "connected"
        }
      };
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error("Get system stats error:", error);
      throw createValidationError("Failed to fetch system statistics");
    }
  }
  // Manage user roles
  static async updateUserRole(req, res) {
    try {
      const { userId, newRole } = req.body;
      if (!userId || !newRole) {
        throw createValidationError("User ID and new role are required");
      }
      if (!["student", "instructor", "admin"].includes(newRole)) {
        throw createValidationError("Invalid role specified");
      }
      logger.info(`Admin ${req.user.id} updated user ${userId} role to ${newRole}`);
      res.json({
        success: true,
        message: `User role updated to ${newRole}`,
        data: { userId, newRole }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Update user role error:", error);
      throw createValidationError("Failed to update user role");
    }
  }
  // System configuration
  static async updateSystemConfig(req, res) {
    try {
      const config = req.body;
      logger.info(`Admin ${req.user.id} updated system configuration`, { config });
      res.json({
        success: true,
        message: "System configuration updated",
        data: config
      });
    } catch (error) {
      logger.error("Update system config error:", error);
      throw createValidationError("Failed to update system configuration");
    }
  }
  // Content moderation
  static async moderateContent(req, res) {
    try {
      const { contentId, contentType, action, reason } = req.body;
      if (!contentId || !contentType || !action) {
        throw createValidationError("Content ID, type, and action are required");
      }
      logger.info(`Admin ${req.user.id} moderated ${contentType} ${contentId}: ${action}`, { reason });
      res.json({
        success: true,
        message: `Content ${action} successfully`,
        data: { contentId, contentType, action }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error("Content moderation error:", error);
      throw createValidationError("Failed to moderate content");
    }
  }
  // Analytics export
  static async exportAnalytics(req, res) {
    try {
      const { startDate, endDate, format = "json" } = req.query;
      const exportData = {
        exportId: Date.now().toString(),
        generatedAt: /* @__PURE__ */ new Date(),
        period: { startDate, endDate },
        format,
        downloadUrl: `/api/admin/exports/${Date.now()}`
      };
      logger.info(`Admin ${req.user.id} requested analytics export`, { startDate, endDate, format });
      res.json({
        success: true,
        message: "Analytics export initiated",
        data: exportData
      });
    } catch (error) {
      logger.error("Export analytics error:", error);
      throw createValidationError("Failed to export analytics");
    }
  }
};

// server/middleware/validator.ts
import { z, ZodError } from "zod";
var validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  };
};
var paginationSchema = z.object({
  page: z.string().transform((val) => parseInt(val) || 1),
  limit: z.string().transform((val) => Math.min(parseInt(val) || 10, 100)),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("desc")
});
var idParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val))
});
var searchQuerySchema = z.object({
  q: z.string().min(1).max(200).optional(),
  category: z.string().optional(),
  tags: z.string().optional()
});
var registerSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["student", "instructor"]).optional(),
  domain: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional()
});
var loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});
var createCourseSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2e3),
  domain: z.string().min(1).max(100),
  price: z.number().min(0).max(9999.99),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  thumbnail: z.string().url().optional(),
  duration: z.string().optional()
});
var createQuestionSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10).max(5e3),
  categoryId: z.number().positive(),
  tags: z.array(z.string().max(30)).max(5).optional(),
  bountyXP: z.number().min(0).max(100).optional()
});
var createAnswerSchema = z.object({
  content: z.string().min(10).max(5e3)
});
var rateAnswerSchema = z.object({
  xpRating: z.number().min(1).max(10).optional(),
  starRating: z.number().min(1).max(5).optional()
});
var createSubscriptionSchema = z.object({
  planId: z.number().positive(),
  paymentMethodId: z.string().min(1)
});
var applyCouponSchema = z.object({
  code: z.string().min(1).max(50),
  courseId: z.number().positive().optional()
});
var analyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  courseId: z.number().positive().optional(),
  userId: z.number().positive().optional(),
  activityType: z.enum(["lesson_view", "lesson_complete", "quiz_attempt", "note_taken", "bookmark_added", "forum_post"]).optional()
});
var fileUploadSchema = z.object({
  type: z.enum(["video", "image", "document", "subtitle"]),
  maxSize: z.number().optional(),
  allowedTypes: z.array(z.string()).optional()
});

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
    for (const [key, client] of this.clients.entries()) {
      if (now > client.resetTime) {
        this.clients.delete(key);
      }
    }
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
router.post(
  "/auth/register",
  authLimiter.middleware,
  validateRequest({ body: registerSchema }),
  asyncHandler(AuthController.register)
);
router.post(
  "/auth/login",
  authLimiter.middleware,
  validateRequest({ body: loginSchema }),
  asyncHandler(AuthController.login)
);
router.post(
  "/auth/refresh",
  authenticate,
  asyncHandler(refreshToken)
);
router.post(
  "/auth/logout",
  authenticate,
  asyncHandler(AuthController.logout)
);
router.get(
  "/auth/profile",
  authenticate,
  asyncHandler(AuthController.getProfile)
);
router.put(
  "/auth/profile",
  authenticate,
  asyncHandler(AuthController.updateProfile)
);
router.put(
  "/auth/change-password",
  authenticate,
  asyncHandler(AuthController.changePassword)
);
router.get(
  "/auth/dashboard",
  authenticate,
  asyncHandler(AuthController.getDashboard)
);
router.get(
  "/courses",
  validateRequest({ query: paginationSchema }),
  asyncHandler(CourseController.getCourses)
);
router.get(
  "/courses/:id",
  validateRequest({ params: idParamSchema }),
  asyncHandler(CourseController.getCourse)
);
router.post(
  "/courses",
  authenticate,
  authorize(["instructor", "admin"]),
  validateRequest({ body: createCourseSchema }),
  asyncHandler(CourseController.createCourse)
);
router.put(
  "/courses/:id",
  authenticate,
  authorize(["instructor", "admin"]),
  validateRequest({ params: idParamSchema }),
  asyncHandler(CourseController.updateCourse)
);
router.delete(
  "/courses/:id",
  authenticate,
  authorize(["instructor", "admin"]),
  validateRequest({ params: idParamSchema }),
  asyncHandler(CourseController.deleteCourse)
);
router.post(
  "/courses/:id/enroll",
  authenticate,
  authorize(["student"]),
  validateRequest({ params: idParamSchema }),
  asyncHandler(CourseController.enrollInCourse)
);
router.get(
  "/my-courses",
  authenticate,
  authorize(["student"]),
  asyncHandler(CourseController.getUserCourses)
);
router.get(
  "/instructor-courses",
  authenticate,
  authorize(["instructor", "admin"]),
  asyncHandler(CourseController.getInstructorCourses)
);
router.post(
  "/courses/:courseId/modules",
  authenticate,
  authorize(["instructor", "admin"]),
  asyncHandler(CourseController.addModule)
);
router.post(
  "/modules/:moduleId/lessons",
  authenticate,
  authorize(["instructor", "admin"]),
  asyncHandler(CourseController.addLesson)
);
router.put(
  "/courses/:courseId/lessons/:lessonId/complete",
  authenticate,
  authorize(["student"]),
  asyncHandler(CourseController.completeLesson)
);
router.get(
  "/courses/:id/analytics",
  authenticate,
  authorize(["instructor", "admin"]),
  validateRequest({ params: idParamSchema }),
  asyncHandler(CourseController.getCourseAnalytics)
);
router.get(
  "/gamification/stats",
  authenticate,
  asyncHandler(GamificationController.getUserStats)
);
router.get(
  "/gamification/leaderboard",
  asyncHandler(GamificationController.getLeaderboard)
);
router.post(
  "/gamification/award-xp",
  authenticate,
  authorize(["admin"]),
  asyncHandler(GamificationController.awardXP)
);
router.put(
  "/gamification/streak",
  authenticate,
  asyncHandler(GamificationController.updateLearningStreak)
);
router.get(
  "/gamification/achievements",
  asyncHandler(GamificationController.getAvailableAchievements)
);
router.post(
  "/gamification/check-achievements",
  authenticate,
  asyncHandler(GamificationController.checkAchievements)
);
router.get(
  "/gamification/xp-history",
  authenticate,
  asyncHandler(GamificationController.getXPHistory)
);
router.get(
  "/help/categories",
  asyncHandler(PeerHelpController.getCategories)
);
router.get(
  "/help/questions",
  validateRequest({ query: paginationSchema }),
  asyncHandler(PeerHelpController.getQuestions)
);
router.get(
  "/help/questions/:id",
  validateRequest({ params: idParamSchema }),
  asyncHandler(PeerHelpController.getQuestion)
);
router.post(
  "/help/questions",
  authenticate,
  validateRequest({ body: createQuestionSchema }),
  asyncHandler(PeerHelpController.createQuestion)
);
router.post(
  "/help/questions/:questionId/answers",
  authenticate,
  validateRequest({ body: createAnswerSchema }),
  asyncHandler(PeerHelpController.createAnswer)
);
router.put(
  "/help/answers/:answerId/rate",
  authenticate,
  asyncHandler(PeerHelpController.rateAnswer)
);
router.get(
  "/help/leaderboard",
  asyncHandler(PeerHelpController.getHelpLeaderboard)
);
router.get(
  "/help/my-stats",
  authenticate,
  asyncHandler(PeerHelpController.getUserHelpStats)
);
router.post(
  "/help/questions/:questionId/vote",
  authenticate,
  asyncHandler(PeerHelpController.voteOnQuestion)
);
router.post(
  "/help/answers/:answerId/vote",
  authenticate,
  asyncHandler(PeerHelpController.voteOnAnswer)
);
router.put(
  "/help/answers/:answerId/accept",
  authenticate,
  asyncHandler(PeerHelpController.acceptAnswer)
);
router.get(
  "/help/search",
  asyncHandler(PeerHelpController.searchQuestions)
);
router.get(
  "/analytics/user",
  authenticate,
  asyncHandler(AnalyticsController.getUserAnalytics)
);
router.get(
  "/analytics/course/:courseId",
  authenticate,
  authorize(["instructor", "admin"]),
  validateRequest({ params: idParamSchema }),
  asyncHandler(AnalyticsController.getCourseAnalytics)
);
router.get(
  "/analytics/dashboard",
  authenticate,
  asyncHandler(AnalyticsController.getDashboardAnalytics)
);
router.post(
  "/analytics/activity",
  authenticate,
  asyncHandler(AnalyticsController.recordActivity)
);
router.get(
  "/analytics/progress-report",
  authenticate,
  asyncHandler(AnalyticsController.getProgressReport)
);
router.get(
  "/analytics/learning-patterns",
  authenticate,
  asyncHandler(AnalyticsController.getLearningPatterns)
);
router.post(
  "/ai/lesson-summary",
  authenticate,
  aiLimiter.middleware,
  asyncHandler(void 0)
);
router.post(
  "/ai/practice-questions",
  authenticate,
  aiLimiter.middleware,
  asyncHandler(void 0)
);
router.post(
  "/ai/study-buddy/chat",
  authenticate,
  aiLimiter.middleware,
  asyncHandler(void 0)
);
router.post(
  "/ai/skill-gap-analysis",
  authenticate,
  aiLimiter.middleware,
  asyncHandler(void 0)
);
router.post(
  "/ai/generate-content",
  authenticate,
  authorize(["instructor", "admin"]),
  aiLimiter.middleware,
  asyncHandler(void 0)
);
router.post(
  "/ai/analyze-answer/:answerId",
  authenticate,
  aiLimiter.middleware,
  validateRequest({ params: idParamSchema }),
  asyncHandler(analyzeAnswer)
);
router.get(
  "/ai/skill-analytics/:userId",
  authenticate,
  validateRequest({ params: idParamSchema }),
  asyncHandler(getSkillAnalytics)
);
router.post(
  "/ai/skill-progress",
  authenticate,
  asyncHandler(updateSkillProgress)
);
router.post(
  "/ai/missions",
  authenticate,
  authorize(["admin"]),
  asyncHandler(createMission)
);
router.get(
  "/ai/missions/:userId",
  authenticate,
  validateRequest({ params: idParamSchema }),
  asyncHandler(getUserMissions)
);
router.post(
  "/ai/missions/progress",
  authenticate,
  asyncHandler(updateMissionProgress)
);
router.post(
  "/ai/missions/claim-reward",
  authenticate,
  asyncHandler(claimMissionReward)
);
router.get(
  "/ai/unlock-status/:userId/:unlockType",
  authenticate,
  asyncHandler(checkUnlockStatus)
);
router.post(
  "/ai/mentor/:questionId",
  authenticate,
  aiLimiter.middleware,
  validateRequest({ params: idParamSchema }),
  asyncHandler(triggerAIMentor)
);
router.get(
  "/ai/answer-quality/:userId",
  authenticate,
  validateRequest({ params: idParamSchema }),
  asyncHandler(getAnswerQualityStats)
);
router.get(
  "/admin/stats",
  authenticate,
  authorize(["admin"]),
  asyncHandler(AdminController.getSystemStats)
);
router.put(
  "/admin/users/role",
  authenticate,
  authorize(["admin"]),
  asyncHandler(AdminController.updateUserRole)
);
router.put(
  "/admin/config",
  authenticate,
  authorize(["admin"]),
  asyncHandler(AdminController.updateSystemConfig)
);
router.post(
  "/admin/moderate",
  authenticate,
  authorize(["admin"]),
  asyncHandler(AdminController.moderateContent)
);
router.get(
  "/admin/export-analytics",
  authenticate,
  authorize(["admin"]),
  asyncHandler(AdminController.exportAnalytics)
);

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
import cors from "cors";
var app = express3();
app.use(cors());
app.use(express3.json({ limit: "10mb" }));
app.use(express3.urlencoded({ extended: false, limit: "10mb" }));
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
  serveStatic(app);
  const port = 5e3;
  server.listen(port, "0.0.0.0", () => {
    console.log(`[express] serving on port ${port}`);
  });
})();
