import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  reviewText: string;
  helpfulVotes: number;
  isHelpful: boolean;
  createdAt: string;
}

interface CourseReviewsProps {
  courseId: string;
  averageRating: number;
  totalReviews: number;
  userHasReviewed: boolean;
}

const StarRating = ({ rating, onRatingChange, readonly = false }: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          } ${readonly ? 'cursor-default' : 'hover:text-yellow-400'}`}
          onClick={() => !readonly && onRatingChange?.(star)}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review, onHelpfulToggle }: {
  review: Review;
  onHelpfulToggle: (reviewId: string) => void;
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={review.userAvatar} />
            <AvatarFallback>{review.userName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">{review.userName}</h4>
              <StarRating rating={review.rating} readonly />
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{review.reviewText}</p>
            <div className="flex items-center gap-4">
              <Button
                variant={review.isHelpful ? "default" : "outline"}
                size="sm"
                onClick={() => onHelpfulToggle(review.id)}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpfulVotes})
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CourseReviews({ courseId, averageRating, totalReviews, userHasReviewed }: CourseReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([
    // TODO: connect to backend - fetch reviews from API
  ]);

  const [newReview, setNewReview] = useState({ rating: 0, text: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');

  const handleSubmitReview = () => {
    if (newReview.rating === 0 || !newReview.text.trim()) return;

    const review: Review = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      rating: newReview.rating,
      reviewText: newReview.text,
      helpfulVotes: 0,
      isHelpful: false,
      createdAt: new Date().toISOString()
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, text: '' });
    setShowReviewForm(false);

    // TODO: connect to backend - POST /api/courses/{courseId}/reviews
    console.log('Submitting review:', review);
  };

  const handleHelpfulToggle = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            isHelpful: !review.isHelpful,
            helpfulVotes: review.isHelpful ? review.helpfulVotes - 1 : review.helpfulVotes + 1
          }
        : review
    ));

    // TODO: connect to backend - POST /api/reviews/{reviewId}/helpful
    console.log('Toggling helpful for review:', reviewId);
  };

  const filteredAndSortedReviews = reviews
    .filter(review => filterRating === 'all' || review.rating.toString() === filterRating)
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'helpful') return b.helpfulVotes - a.helpfulVotes;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Overview Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            Course Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  <StarRating rating={Math.round(averageRating)} readonly />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Based on {totalReviews} reviews
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Rating Distribution</h4>
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3 mb-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Section */}
      {!userHasReviewed && (
        <Card className="mb-8">
          <CardContent className="p-6">
            {!showReviewForm ? (
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="w-full flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Write a Review
              </Button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Share Your Experience</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <StarRating 
                    rating={newReview.rating} 
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <Textarea
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    placeholder="Share your thoughts about this course..."
                    className="min-h-[120px]"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSubmitReview} disabled={newReview.rating === 0 || !newReview.text.trim()}>
                    Submit Review
                  </Button>
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              <SelectItem value="5">5 stars</SelectItem>
              <SelectItem value="4">4 stars</SelectItem>
              <SelectItem value="3">3 stars</SelectItem>
              <SelectItem value="2">2 stars</SelectItem>
              <SelectItem value="1">1 star</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="helpful">Most helpful</SelectItem>
            <SelectItem value="rating">Highest rating</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="ml-auto">
          {filteredAndSortedReviews.length} reviews
        </Badge>
      </div>

      {/* Reviews List */}
      <div>
        {filteredAndSortedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No reviews available yet. Be the first to review this course!</p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onHelpfulToggle={handleHelpfulToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}