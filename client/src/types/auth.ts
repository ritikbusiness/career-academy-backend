
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  domain?: string;
  branch?: string;
  year?: string;
  avatar?: string;
  createdAt: string;
  // Instructor specific fields
  bio?: string;
  expertise?: string[];
  qualifications?: string[];
  instructorStatus?: 'pending' | 'approved' | 'rejected';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface OnboardingData {
  fullName: string;
  domain: string;
  branch: string;
  year: string;
  fieldOfInterest: string;
}
