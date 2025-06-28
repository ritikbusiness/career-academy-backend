import OpenAI from "openai";

// DeepSeek API is compatible with OpenAI's interface
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1"
});

export interface LessonSummary {
  mainPoints: string[];
  keyTakeaways: string[];
  summary: string;
}

export interface PracticeQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SkillGap {
  skill: string;
  currentLevel: number; // 0-100
  targetLevel: number;
  recommendations: string[];
  practiceAreas: string[];
}

export class AIService {
  async generateLessonSummary(lessonContent: string, lessonTitle: string): Promise<LessonSummary> {
    try {
      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an expert educational content summarizer. Create concise, actionable summaries that help students retain key information. Respond in JSON format."
          },
          {
            role: "user",
            content: `Summarize this lesson titled "${lessonTitle}". Content: ${lessonContent}

            Please provide a JSON response with:
            - mainPoints: array of 3-5 main points
            - keyTakeaways: array of 2-3 key takeaways
            - summary: one paragraph overview`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating lesson summary:', error);
      throw new Error('Failed to generate lesson summary');
    }
  }

  async generatePracticeQuestions(lessonContent: string, lessonTitle: string, count: number = 5): Promise<PracticeQuestion[]> {
    try {
      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an expert quiz creator. Generate diverse, educational questions that test understanding, not just memorization. Respond in JSON format."
          },
          {
            role: "user",
            content: `Create ${count} practice questions for the lesson "${lessonTitle}". Content: ${lessonContent}

            Requirements:
            - Mix of multiple-choice and true-false questions
            - Vary difficulty levels (easy, medium, hard)
            - Include explanations for each answer
            - Focus on understanding and application

            Respond with JSON array where each question has:
            - id: unique identifier
            - type: "multiple-choice" or "true-false"
            - question: the question text
            - options: array of choices (for multiple-choice only)
            - correctAnswer: the correct answer
            - explanation: why this answer is correct
            - difficulty: "easy", "medium", or "hard"`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8
      });

      const result = JSON.parse(response.choices[0].message.content || '{"questions": []}');
      return result.questions || [];
    } catch (error) {
      console.error('Error generating practice questions:', error);
      throw new Error('Failed to generate practice questions');
    }
  }

  async chatWithStudyBuddy(question: string, lessonContext: string, conversationHistory: string[] = []): Promise<string> {
    try {
      const context = conversationHistory.length > 0 
        ? `Previous conversation: ${conversationHistory.join('\n')}\n\n`
        : '';

      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI study buddy. You help students understand concepts from their lessons. 
            Be encouraging, clear, and educational. Break down complex topics into simple explanations.
            Ask follow-up questions to ensure understanding.`
          },
          {
            role: "user",
            content: `${context}Lesson context: ${lessonContext}

            Student question: ${question}

            Please provide a helpful, encouraging response that aids learning.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content || 'I apologize, but I could not provide a response at this time.';
    } catch (error) {
      console.error('Error in study buddy chat:', error);
      throw new Error('Failed to get study buddy response');
    }
  }

  async analyzeSkillGaps(completedLessons: string[], quizResults: any[], targetSkills: string[]): Promise<SkillGap[]> {
    try {
      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an expert learning analytics specialist. Analyze student performance to identify skill gaps and provide actionable recommendations."
          },
          {
            role: "user",
            content: `Analyze the learning progress and identify skill gaps:

            Completed lessons: ${completedLessons.join(', ')}
            Quiz results: ${JSON.stringify(quizResults)}
            Target skills: ${targetSkills.join(', ')}

            Please provide a JSON response with an array of skill gaps, each containing:
            - skill: name of the skill
            - currentLevel: estimated proficiency (0-100)
            - targetLevel: recommended target level (0-100)
            - recommendations: array of specific recommendations
            - practiceAreas: array of areas that need more practice`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6
      });

      const result = JSON.parse(response.choices[0].message.content || '{"skillGaps": []}');
      return result.skillGaps || [];
    } catch (error) {
      console.error('Error analyzing skill gaps:', error);
      throw new Error('Failed to analyze skill gaps');
    }
  }
}

export const aiService = new AIService();