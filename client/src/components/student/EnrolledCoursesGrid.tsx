
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Course, Enrollment, CourseProgress } from '@/types/course';

interface EnrolledCoursesGridProps {
  enrollments: Enrollment[];
  availableCourses: Course[];
  courseProgress: { [courseId: string]: CourseProgress };
  onCourseSelect: (course: Course) => void;
}

const EnrolledCoursesGrid: React.FC<EnrolledCoursesGridProps> = ({
  enrollments,
  availableCourses,
  courseProgress,
  onCourseSelect
}) => {
  const getEnrolledCourses = () => {
    return enrollments.map(enrollment => {
      const course = availableCourses.find(c => c.id === enrollment.courseId);
      return course ? { ...course, enrollment } : null;
    }).filter(Boolean) as (Course & { enrollment: Enrollment })[];
  };

  const enrolledCourses = getEnrolledCourses();

  if (enrollments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No courses enrolled yet</h3>
          <p className="text-gray-600 mb-4">Start learning by browsing our available courses</p>
          <Button onClick={() => {
            const browseTab = document.querySelector('[value="browse"]') as HTMLElement;
            browseTab?.click();
          }}>
            Browse Courses
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {enrolledCourses.map((course) => {
        const progress = courseProgress[course.id] || { progress: 0, completedLessons: [], totalLessons: 0 };
        
        return (
          <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription>{course.instructor.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress.progress)}%</span>
                  </div>
                  <Progress value={progress.progress} />
                  <p className="text-xs text-gray-600 mt-1">
                    {progress.completedLessons.length} of {progress.totalLessons} lessons completed
                  </p>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => onCourseSelect(course)}
                >
                  {progress.progress === 0 ? 'Start Learning' : 'Continue Learning'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EnrolledCoursesGrid;
