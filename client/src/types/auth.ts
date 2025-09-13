
export interface User {
  id: string;
  name: string; // Changed from fullName to match backend schema
  email: string;
  role: 'student' | 'instructor' | 'admin';
  domain?: string;
  branch?: string;
  year?: string;
  imageUrl?: string; // Changed from avatar to match backend schema
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
