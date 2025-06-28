
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, Clock, PlayCircle } from 'lucide-react';
import { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled, onEnroll }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDomainImage = (domain: string) => {
    const imageMap: { [key: string]: string } = {
      'web-development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
      'data-science': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop',
      'devops': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop'
    };
    return imageMap[domain] || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop';
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-0 bg-white">
      {/* Course Thumbnail */}
      <div className="relative overflow-hidden">
        <img 
          src={getDomainImage(course.domain)} 
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3">
          <Badge className={`${getLevelColor(course.level)} font-medium px-2 py-1`}>
            {course.level}
          </Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 rounded-full p-3 backdrop-blur-sm">
            <PlayCircle className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs font-medium bg-purple-50 text-purple-700 border-purple-200">
            {course.domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          <span className="text-lg font-bold text-purple-600">
            {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
          </span>
        </div>
        <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900 group-hover:text-purple-600 transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-gray-600 text-sm">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium text-gray-800">{course.instructor.name}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.enrolledCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
          </div>

          <Button 
            className={`w-full font-medium py-2.5 transition-all duration-200 ${
              isEnrolled 
                ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200' 
                : course.price === 0 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
            }`}
            onClick={() => onEnroll(course.id)}
            disabled={isEnrolled}
            variant={isEnrolled ? "secondary" : "default"}
          >
            {isEnrolled ? '✓ Enrolled' : course.price === 0 ? 'Enroll Free' : 'Buy Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
