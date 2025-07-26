import { logger } from '../utils/logger';

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIService {
  private static readonly API_BASE_URL = 'https://api.deepseek.com/v1';
  private static readonly API_KEY = process.env.DEEPSEEK_API_KEY;

  private static async makeAPICall(messages: Array<{ role: string; content: string }>, temperature: number = 0.7): Promise<DeepSeekResponse> {
    if (!this.API_KEY) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }

    const response = await fetch(`${this.API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
  static async generateLessonSummary(lessonContent: string, lessonTitle: string): Promise<{
    keyPoints: string[];
    takeaways: string[];
    summary: string;
  }> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert educational AI assistant. Your task is to analyze lesson content and create comprehensive summaries that help students learn effectively.'
        },
        {
          role: 'user',
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
        logger.info('Generated lesson summary', { 
          lessonTitle, 
          keyPointsCount: parsed.keyPoints?.length,
          takeawaysCount: parsed.takeaways?.length
        });
        
        return parsed;
      } catch (parseError) {
        logger.error('Failed to parse AI summary response', { content, parseError });
        throw new Error('Invalid AI response format');
      }
    } catch (error) {
      logger.error('AI lesson summary generation failed', { error, lessonTitle });
      throw new Error('Failed to generate lesson summary');
    }
  }

  // AI Practice Questions Generator
  static async generatePracticeQuestions(lessonContent: string, lessonTitle: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<{
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      difficulty: string;
    }>;
  }> {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an expert quiz creator for educational content. Create engaging, accurate multiple-choice questions that test understanding at a ${difficulty} level.`
        },
        {
          role: 'user',
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
        logger.info('Generated practice questions', { 
          lessonTitle, 
          difficulty,
          questionCount: parsed.questions?.length
        });
        
        return parsed;
      } catch (parseError) {
        logger.error('Failed to parse AI questions response', { content, parseError });
        throw new Error('Invalid AI response format');
      }
    } catch (error) {
      logger.error('AI practice questions generation failed', { error, lessonTitle, difficulty });
      throw new Error('Failed to generate practice questions');
    }
  }

  // AI Study Buddy Chat
  static async getChatResponse(userMessage: string, conversationContext: Array<{ role: string; content: string }>, lessonContext?: string): Promise<{
    response: string;
    suggestions: string[];
  }> {
    try {
      const systemPrompt = `You are a helpful AI study buddy for students. You help them understand concepts, answer questions, and provide study guidance. 
      ${lessonContext ? `Current lesson context: ${lessonContext}` : ''}
      
      Guidelines:
      - Be encouraging and supportive
      - Explain concepts clearly with examples
      - Ask follow-up questions to ensure understanding
      - Suggest study strategies when appropriate
      - Keep responses concise but informative`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationContext.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: userMessage }
      ];

      const response = await this.makeAPICall(messages, 0.7);
      const aiResponse = response.choices[0].message.content;

      // Generate study suggestions based on the conversation
      const suggestionMessages = [
        {
          role: 'system',
          content: 'Based on the conversation, suggest 3 short study tips or follow-up questions the student might find helpful. Return as a JSON array of strings.'
        },
        { role: 'user', content: `Conversation: ${userMessage}\nResponse: ${aiResponse}\n\nSuggest 3 helpful study tips or questions:` }
      ];

      const suggestionResponse = await this.makeAPICall(suggestionMessages, 0.5);
      let suggestions: string[] = [];
      
      try {
        suggestions = JSON.parse(suggestionResponse.choices[0].message.content);
      } catch {
        suggestions = [
          "Try explaining this concept in your own words",
          "What questions do you still have about this topic?",
          "Would you like to see some practice examples?"
        ];
      }

      logger.info('Generated AI chat response', { 
        userMessage: userMessage.substring(0, 100),
        responseLength: aiResponse.length
      });

      return {
        response: aiResponse,
        suggestions
      };
    } catch (error) {
      logger.error('AI chat response generation failed', { error, userMessage });
      throw new Error('Failed to generate chat response');
    }
  }

  // AI Skill Gap Analyzer
  static async analyzeSkillGaps(userProgress: {
    completedLessons: string[];
    quizScores: Array<{ lessonId: string; score: number; topic: string }>;
    weakAreas: string[];
    strongAreas: string[];
  }, courseContent: string): Promise<{
    skillGaps: Array<{
      skill: string;
      proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
      recommendedActions: string[];
      priority: 'high' | 'medium' | 'low';
    }>;
    personalizedRecommendations: string[];
    nextSteps: string[];
  }> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert learning analytics AI that identifies skill gaps and provides personalized learning recommendations.'
        },
        {
          role: 'user',
          content: `
            Analyze this student's learning progress and identify skill gaps:

            Progress Data:
            - Completed Lessons: ${userProgress.completedLessons.length}
            - Quiz Performance: ${JSON.stringify(userProgress.quizScores)}
            - Weak Areas: ${userProgress.weakAreas.join(', ')}
            - Strong Areas: ${userProgress.strongAreas.join(', ')}

            Course Content Overview:
            ${courseContent.substring(0, 1000)}...

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
        logger.info('Generated skill gap analysis', { 
          completedLessons: userProgress.completedLessons.length,
          skillGapsFound: parsed.skillGaps?.length
        });
        
        return parsed;
      } catch (parseError) {
        logger.error('Failed to parse AI skill gap response', { content, parseError });
        throw new Error('Invalid AI response format');
      }
    } catch (error) {
      logger.error('AI skill gap analysis failed', { error });
      throw new Error('Failed to analyze skill gaps');
    }
  }

  // AI Content Generator for Instructors
  static async generateLessonContent(topic: string, learningObjectives: string[], targetAudience: string, duration: number): Promise<{
    outline: string[];
    content: string;
    activities: string[];
    assessmentQuestions: string[];
  }> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert instructional designer creating engaging educational content.'
        },
        {
          role: 'user',
          content: `
            Create lesson content for the following specifications:

            Topic: ${topic}
            Learning Objectives: ${learningObjectives.join(', ')}
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
        logger.info('Generated lesson content', { 
          topic,
          targetAudience,
          duration
        });
        
        return parsed;
      } catch (parseError) {
        logger.error('Failed to parse AI lesson content response', { content, parseError });
        throw new Error('Invalid AI response format');
      }
    } catch (error) {
      logger.error('AI lesson content generation failed', { error, topic });
      throw new Error('Failed to generate lesson content');
    }
  }

  // Check API health
  static async checkHealth(): Promise<boolean> {
    try {
      const messages = [
        { role: 'user', content: 'Hello, are you working?' }
      ];

      const response = await this.makeAPICall(messages, 0.1);
      return response.choices && response.choices.length > 0;
    } catch (error) {
      logger.error('AI service health check failed', { error });
      return false;
    }
  }
}