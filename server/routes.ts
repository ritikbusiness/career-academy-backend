import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./services/aiService";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI-powered features routes
  
  // AI Lesson Summarizer
  app.post("/api/ai/summarize-lesson", async (req, res) => {
    try {
      const { lessonContent, lessonTitle } = req.body;
      
      if (!lessonContent || !lessonTitle) {
        return res.status(400).json({ 
          error: "Missing required fields: lessonContent and lessonTitle" 
        });
      }

      const summary = await aiService.generateLessonSummary(lessonContent, lessonTitle);
      res.json(summary);
    } catch (error) {
      console.error('Error in lesson summarizer:', error);
      res.status(500).json({ 
        error: "Failed to generate lesson summary" 
      });
    }
  });

  // AI Practice Questions Generator
  app.post("/api/ai/generate-questions", async (req, res) => {
    try {
      const { lessonContent, lessonTitle, count = 5 } = req.body;
      
      if (!lessonContent || !lessonTitle) {
        return res.status(400).json({ 
          error: "Missing required fields: lessonContent and lessonTitle" 
        });
      }

      const questions = await aiService.generatePracticeQuestions(lessonContent, lessonTitle, count);
      res.json({ questions });
    } catch (error) {
      console.error('Error in question generator:', error);
      res.status(500).json({ 
        error: "Failed to generate practice questions" 
      });
    }
  });

  // AI Study Buddy Chat
  app.post("/api/ai/study-buddy", async (req, res) => {
    try {
      const { question, lessonContext, conversationHistory = [] } = req.body;
      
      if (!question || !lessonContext) {
        return res.status(400).json({ 
          error: "Missing required fields: question and lessonContext" 
        });
      }

      const response = await aiService.chatWithStudyBuddy(question, lessonContext, conversationHistory);
      res.json({ response });
    } catch (error) {
      console.error('Error in study buddy chat:', error);
      res.status(500).json({ 
        error: "Failed to get study buddy response" 
      });
    }
  });

  // AI Skill Gap Analyzer
  app.post("/api/ai/analyze-skill-gaps", async (req, res) => {
    try {
      const { completedLessons, quizResults, targetSkills } = req.body;
      
      if (!completedLessons || !quizResults || !targetSkills) {
        return res.status(400).json({ 
          error: "Missing required fields: completedLessons, quizResults, and targetSkills" 
        });
      }

      const skillGaps = await aiService.analyzeSkillGaps(completedLessons, quizResults, targetSkills);
      res.json({ skillGaps });
    } catch (error) {
      console.error('Error in skill gap analysis:', error);
      res.status(500).json({ 
        error: "Failed to analyze skill gaps" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
