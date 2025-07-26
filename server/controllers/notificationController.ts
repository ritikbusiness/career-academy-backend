import { Request, Response } from 'express';
import { db } from '../db';
import { notifications, users } from '@shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { logger } from '../utils/logger';

// Get user notifications
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0, unreadOnly = false } = req.query;
    
    let whereCondition = eq(notifications.userId, parseInt(userId));
    
    if (unreadOnly === 'true') {
      whereCondition = and(
        eq(notifications.userId, parseInt(userId)),
        eq(notifications.isRead, false)
      );
    }

    const userNotifications = await db.select({
      id: notifications.id,
      title: notifications.title,
      message: notifications.message,
      type: notifications.type,
      isRead: notifications.isRead,
      relatedId: notifications.relatedId,
      relatedType: notifications.relatedType,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(whereCondition)
    .orderBy(desc(notifications.createdAt))
    .limit(parseInt(limit as string))
    .offset(parseInt(offset as string));


    
    // Get unread count
    const unreadCount = await db.select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(
        eq(notifications.userId, parseInt(userId)),
        eq(notifications.isRead, false)
      ));

    res.json({
      notifications: userNotifications,
      unreadCount: unreadCount[0].count,
      hasMore: userNotifications.length === parseInt(limit as string)
    });
  } catch (error) {
    logger.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;
    
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(
        eq(notifications.id, parseInt(notificationId)),
        eq(notifications.userId, userId)
      ));

    res.json({ success: true });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));

    res.json({ success: true });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

// Create notification (internal use)
export const createNotification = async (
  userId: number,
  title: string,
  message: string,
  type: 'xp_gained' | 'answer_received' | 'level_up' | 'mission_complete' | 'badge_earned',
  relatedId?: number,
  relatedType?: string
) => {
  try {
    const notification = await db.insert(notifications).values({
      userId,
      title,
      message,
      type,
      relatedId,
      relatedType,
    }).returning();

    logger.info(`Notification created for user ${userId}`, { notificationId: notification[0].id });
    return notification[0];
  } catch (error) {
    logger.error('Error creating notification:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;
    
    await db.delete(notifications)
      .where(and(
        eq(notifications.id, parseInt(notificationId)),
        eq(notifications.userId, userId)
      ));

    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Get notification summary
export const getNotificationSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Get notification counts by type
    const summary = await db.execute(sql`
      SELECT 
        type,
        COUNT(*) as count,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread_count
      FROM notifications
      WHERE user_id = ${userId}
      AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY type
      ORDER BY count DESC
    `);

    // Get recent achievements/milestones
    const recentAchievements = await db.select()
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        sql`type IN ('level_up', 'badge_earned', 'mission_complete')`
      ))
      .orderBy(desc(notifications.createdAt))
      .limit(5);

    res.json({
      summary: summary.rows,
      recentAchievements
    });
  } catch (error) {
    logger.error('Error fetching notification summary:', error);
    res.status(500).json({ error: 'Failed to fetch notification summary' });
  }
};