
export interface PaymentTransaction {
  id: string;
  courseId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  stripeSessionId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentSession {
  id: string;
  url: string;
  status: string;
}

export interface CoursePrice {
  courseId: string;
  price: number;
  currency: string;
  discountPrice?: number;
  isActive: boolean;
}
