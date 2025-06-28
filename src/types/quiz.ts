
export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: { [questionId: string]: string | number };
  score: number;
  passed: boolean;
  completedAt: string;
  timeSpent: number; // in seconds
}

export interface QuizResult {
  attempt: QuizAttempt;
  quiz: Quiz;
  correctAnswers: { [questionId: string]: string | number };
  feedback: { [questionId: string]: string };
}
