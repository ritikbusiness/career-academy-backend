
export interface Course {
  id: string;
  title: string;
  description: string;
  domain: string;
  instructor: {
    id: string;
    name: string;
  };
  price: number;
  thumbnail?: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolledCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  position: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  videoUrl?: string;
  materialsUrl?: string;
  subtitleUrl?: string;
  position: number;
  duration: string;
  isCompleted?: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  completedLessons: string[];
  lastAccessedAt: string;
}

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: string[];
  progress: number;
  currentModule?: string;
  currentLesson?: string;
}
