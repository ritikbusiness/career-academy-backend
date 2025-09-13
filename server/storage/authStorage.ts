import { eq, and, gt, lt, or } from "drizzle-orm";
import { db } from "../db";
import { users, refreshTokens, type User, type InsertUser, type RefreshToken, type InsertRefreshToken } from "@shared/schema";

export class AuthStorage {
  // User operations
  static async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  static async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  static async getUserByProviderId(provider: string, providerId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      and(
        eq(users.provider, provider as 'local' | 'google'),
        eq(users.providerId, providerId)
      )
    );
    return user;
  }

  static async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  static async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  static async linkProvider(userId: number, provider: string, providerId: string): Promise<User> {
    const [user] = await db.update(users)
      .set({
        provider: provider as 'local' | 'google',
        providerId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  static async updateLastActivity(userId: number): Promise<void> {
    await db.update(users)
      .set({ updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Refresh token operations
  static async createRefreshToken(tokenData: InsertRefreshToken): Promise<RefreshToken> {
    const [token] = await db.insert(refreshTokens).values(tokenData).returning();
    return token;
  }

  static async getRefreshTokenByJti(jti: string): Promise<RefreshToken | undefined> {
    const now = new Date();
    const [token] = await db.select().from(refreshTokens).where(
      and(
        eq(refreshTokens.jti, jti),
        eq(refreshTokens.revoked, false),
        gt(refreshTokens.expiresAt, now)
      )
    );
    return token;
  }

  static async revokeRefreshToken(jti: string): Promise<void> {
    await db.update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.jti, jti));
  }

  static async revokeAllUserRefreshTokens(userId: number): Promise<void> {
    await db.update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.userId, userId));
  }

  static async cleanupExpiredRefreshTokens(): Promise<void> {
    const now = new Date();
    await db.delete(refreshTokens)
      .where(
        or(
          eq(refreshTokens.revoked, true),
          lt(refreshTokens.expiresAt, now)
        )
      );
  }

  // User verification
  static async markEmailAsVerified(userId: number): Promise<void> {
    await db.update(users)
      .set({
        emailVerifiedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Account management
  static async updatePassword(userId: number, passwordHash: string): Promise<void> {
    await db.update(users)
      .set({
        passwordHash,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  static async deleteUser(userId: number): Promise<void> {
    // First revoke all refresh tokens
    await this.revokeAllUserRefreshTokens(userId);
    
    // Then delete the user (this will cascade to refresh tokens due to foreign key)
    await db.delete(users).where(eq(users.id, userId));
  }

  // Password reset token operations (using in-memory storage for now)
  private static passwordResetTokens = new Map<string, { userId: number; expiresAt: Date }>();

  static async createPasswordResetToken(data: { userId: number; token: string; expiresAt: Date }): Promise<void> {
    this.passwordResetTokens.set(data.token, { userId: data.userId, expiresAt: data.expiresAt });
  }

  static async findPasswordResetToken(token: string): Promise<{ userId: number; expiresAt: Date } | null> {
    const tokenData = this.passwordResetTokens.get(token);
    if (!tokenData) {
      return null;
    }
    
    // Check if expired
    if (tokenData.expiresAt < new Date()) {
      this.passwordResetTokens.delete(token);
      return null;
    }
    
    return tokenData;
  }

  static async deletePasswordResetToken(token: string): Promise<void> {
    this.passwordResetTokens.delete(token);
  }
}