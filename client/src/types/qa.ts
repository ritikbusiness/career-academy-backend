
export interface Question {
  id: string;
  lessonId: string;
  userId: string;
  userType: 'student' | 'instructor';
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  upvotes: number;
  isResolved: boolean;
  acceptedAnswerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  userType: 'student' | 'instructor';
  userName: string;
  userAvatar?: string;
  content: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QAThread {
  question: Question;
  answers: Answer[];
  totalAnswers: number;
}
