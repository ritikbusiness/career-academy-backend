import { 
  users, courses, modules, lessons, enrollments, userStats, achievements, userAchievements,
  helpCategories, helpQuestions, helpAnswers, xpTransactions, learningAnalytics,
  subscriptionPlans, userSubscriptions, discountCoupons,
  type User, type InsertUser, type Course, type InsertCourse, type Module, type InsertModule,
  type Lesson, type InsertLesson, type Enrollment, type InsertEnrollment,
  type UserStats, type InsertUserStats, type Achievement, type InsertAchievement,
  type HelpQuestion, type InsertHelpQuestion, type HelpAnswer, type InsertHelpAnswer,
  type HelpCategory, type XpTransaction, type LearningAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, like, sql, count } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail?(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile?(data: any): Promise<User>;
  updateUserPassword?(userId: number, hashedPassword: string): Promise<void>;
  updateUserActivity?(userId: number): Promise<void>;

  // User stats and gamification
  getUserStats?(userId: number): Promise<UserStats | undefined>;
  createUserStats?(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats?(userId: number, updates: Partial<UserStats>): Promise<UserStats>;
  addXP?(userId: number, amount: number, reason: string, sourceType: string, sourceId?: number): Promise<void>;
  getUserAchievements?(userId: number): Promise<Achievement[]>;
  unlockAchievement?(userId: number, achievementId: number): Promise<void>;

  // Course management
  getCourse?(id: number): Promise<Course | undefined>;
  getCourses?(filters?: any): Promise<Course[]>;
  createCourse?(course: InsertCourse): Promise<Course>;
  updateCourse?(id: number, updates: Partial<Course>): Promise<Course>;
  deleteCourse?(id: number): Promise<void>;
  getUserEnrolledCourses?(userId: number): Promise<Course[]>;
  getInstructorCourses?(instructorId: number): Promise<Course[]>;

  // Enrollment management
  enrollInCourse?(userId: number, courseId: number): Promise<Enrollment>;
  getUserEnrollment?(userId: number, courseId: number): Promise<Enrollment | undefined>;
  updateLessonProgress?(userId: number, courseId: number, lessonId: number): Promise<void>;
  getCourseProgress?(userId: number, courseId: number): Promise<number>;

  // Module and lesson management
  getCourseModules?(courseId: number): Promise<Module[]>;
  getModuleLessons?(moduleId: number): Promise<Lesson[]>;
  createModule?(module: InsertModule): Promise<Module>;
  createLesson?(lesson: InsertLesson): Promise<Lesson>;

  // Help center (Peer Q&A)
  getHelpCategories?(): Promise<HelpCategory[]>;
  getHelpQuestions?(categoryId?: number, filters?: any): Promise<HelpQuestion[]>;
  getHelpQuestion?(id: number): Promise<HelpQuestion | undefined>;
  createHelpQuestion?(question: InsertHelpQuestion): Promise<HelpQuestion>;
  getQuestionAnswers?(questionId: number): Promise<HelpAnswer[]>;
  createHelpAnswer?(answer: InsertHelpAnswer): Promise<HelpAnswer>;
  rateAnswer?(answerId: number, userId: number, xpRating?: number, starRating?: number): Promise<void>;

  // Analytics
  recordLearningActivity?(activity: Partial<LearningAnalytics>): Promise<void>;
  getUserLearningAnalytics?(userId: number, filters?: any): Promise<LearningAnalytics[]>;
  getCourseLearningAnalytics?(courseId: number, filters?: any): Promise<LearningAnalytics[]>;

  // Dashboard data
  getUserRecentQuizzes?(userId: number): Promise<any[]>;
  getUserUpcomingAssignments?(userId: number): Promise<any[]>;
  getInstructorRecentStudents?(instructorId: number): Promise<any[]>;
  getInstructorPendingAssignments?(instructorId: number): Promise<any[]>;

  // Leaderboards
  getLeaderboard?(category: string, limit?: number): Promise<any[]>;
  updateLeaderboard?(userId: number, category: string, xp: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserProfile(data: any): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, data.id))
      .returning();
    return user;
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }

  async updateUserActivity(userId: number): Promise<void> {
    await db
      .update(userStats)
      .set({ lastActivityDate: new Date() })
      .where(eq(userStats.userId, userId));
  }

  // User stats and gamification
  async getUserStats(userId: number): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats || undefined;
  }

  async createUserStats(stats: InsertUserStats): Promise<UserStats> {
    const [newStats] = await db
      .insert(userStats)
      .values(stats)
      .returning();
    return newStats;
  }

  async updateUserStats(userId: number, updates: Partial<UserStats>): Promise<UserStats> {
    const [stats] = await db
      .update(userStats)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    return stats;
  }

  async addXP(userId: number, amount: number, reason: string, sourceType: string, sourceId?: number): Promise<void> {
    // Record XP transaction
    await db.insert(xpTransactions).values({
      userId,
      amount,
      reason,
      sourceType: sourceType as any,
      sourceId
    });

    // Update user stats
    await db
      .update(userStats)
      .set({
        totalXP: sql`${userStats.totalXP} + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(userStats.userId, userId));

    // Update level if necessary (business logic would handle this)
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const userAchievementsList = await db
      .select({ achievement: achievements })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.earnedAt));

    return userAchievementsList.map(ua => ua.achievement);
  }

  async unlockAchievement(userId: number, achievementId: number): Promise<void> {
    await db.insert(userAchievements).values({
      userId,
      achievementId
    });
  }

  // Course management
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getCourses(filters: any = {}): Promise<Course[]> {
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

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db
      .insert(courses)
      .values(course)
      .returning();
    return newCourse;
  }

  async updateCourse(id: number, updates: Partial<Course>): Promise<Course> {
    const [course] = await db
      .update(courses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  async getUserEnrolledCourses(userId: number): Promise<Course[]> {
    const enrolledCourses = await db
      .select({ course: courses })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));

    return enrolledCourses.map(ec => ec.course);
  }

  async getInstructorCourses(instructorId: number): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.instructorId, instructorId))
      .orderBy(desc(courses.createdAt));
  }

  // Enrollment management
  async enrollInCourse(userId: number, courseId: number): Promise<Enrollment> {
    const [enrollment] = await db
      .insert(enrollments)
      .values({ userId, courseId })
      .returning();
    return enrollment;
  }

  async getUserEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment || undefined;
  }

  async updateLessonProgress(userId: number, courseId: number, lessonId: number): Promise<void> {
    // Update completed lessons array and progress
    await db
      .update(enrollments)
      .set({
        completedLessons: sql`array_append(${enrollments.completedLessons}, ${lessonId.toString()})`,
        lastAccessedAt: new Date()
      })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
  }

  async getCourseProgress(userId: number, courseId: number): Promise<number> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));

    return enrollment ? Number(enrollment.progress) : 0;
  }

  // Module and lesson management
  async getCourseModules(courseId: number): Promise<Module[]> {
    return await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(asc(modules.position));
  }

  async getModuleLessons(moduleId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(asc(lessons.position));
  }

  async createModule(module: InsertModule): Promise<Module> {
    const [newModule] = await db
      .insert(modules)
      .values(module)
      .returning();
    return newModule;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db
      .insert(lessons)
      .values(lesson)
      .returning();
    return newLesson;
  }

  // Help center
  async getHelpCategories(): Promise<HelpCategory[]> {
    return await db
      .select()
      .from(helpCategories)
      .orderBy(asc(helpCategories.sortOrder));
  }

  async getHelpQuestions(categoryId?: number, filters: any = {}): Promise<HelpQuestion[]> {
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

  async getHelpQuestion(id: number): Promise<HelpQuestion | undefined> {
    const [question] = await db.select().from(helpQuestions).where(eq(helpQuestions.id, id));
    return question || undefined;
  }

  async createHelpQuestion(question: InsertHelpQuestion): Promise<HelpQuestion> {
    const [newQuestion] = await db
      .insert(helpQuestions)
      .values(question)
      .returning();
    return newQuestion;
  }

  async getQuestionAnswers(questionId: number): Promise<HelpAnswer[]> {
    return await db
      .select()
      .from(helpAnswers)
      .where(eq(helpAnswers.questionId, questionId))
      .orderBy(desc(helpAnswers.createdAt));
  }

  async createHelpAnswer(answer: InsertHelpAnswer): Promise<HelpAnswer> {
    const [newAnswer] = await db
      .insert(helpAnswers)
      .values(answer)
      .returning();
    return newAnswer;
  }

  async rateAnswer(answerId: number, userId: number, xpRating?: number, starRating?: number): Promise<void> {
    if (xpRating) {
      await db
        .update(helpAnswers)
        .set({ xpRating })
        .where(eq(helpAnswers.id, answerId));
    }

    if (starRating) {
      // Handle star rating logic (community rating average)
      // This would typically involve inserting into answerStarRatings table
      // and updating the average
    }
  }

  // Analytics
  async recordLearningActivity(activity: Partial<LearningAnalytics>): Promise<void> {
    await db.insert(learningAnalytics).values(activity as any);
  }

  async getUserLearningAnalytics(userId: number, filters: any = {}): Promise<LearningAnalytics[]> {
    let query = db.select().from(learningAnalytics).where(eq(learningAnalytics.userId, userId));

    if (filters.startDate) {
      query = query.where(sql`${learningAnalytics.createdAt} >= ${filters.startDate}`);
    }

    if (filters.endDate) {
      query = query.where(sql`${learningAnalytics.createdAt} <= ${filters.endDate}`);
    }

    return await query.orderBy(desc(learningAnalytics.createdAt));
  }

  async getCourseLearningAnalytics(courseId: number, filters: any = {}): Promise<LearningAnalytics[]> {
    return await db
      .select()
      .from(learningAnalytics)
      .where(eq(learningAnalytics.courseId, courseId))
      .orderBy(desc(learningAnalytics.createdAt));
  }

  // Dashboard placeholders (to be implemented based on specific requirements)
  async getUserRecentQuizzes(userId: number): Promise<any[]> {
    // TODO: Implement based on quiz schema
    return [];
  }

  async getUserUpcomingAssignments(userId: number): Promise<any[]> {
    // TODO: Implement based on assignment schema
    return [];
  }

  async getInstructorRecentStudents(instructorId: number): Promise<any[]> {
    // TODO: Implement
    return [];
  }

  async getInstructorPendingAssignments(instructorId: number): Promise<any[]> {
    // TODO: Implement
    return [];
  }

  // Leaderboards
  async getLeaderboard(category: string, limit: number = 10): Promise<any[]> {
    // TODO: Implement leaderboard queries
    return [];
  }

  async updateLeaderboard(userId: number, category: string, xp: number): Promise<void> {
    // TODO: Implement leaderboard updates
  }
}

export const storage = new DatabaseStorage();
