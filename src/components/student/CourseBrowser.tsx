
import React, { useState } from 'react';
import { Course } from '@/types/course';
import CourseFilters from './CourseFilters';
import CourseCard from './CourseCard';

interface CourseBrowserProps {
  courses: Course[];
  onEnroll: (courseId: string) => void;
  enrolledCourses: string[];
}

const CourseBrowser: React.FC<CourseBrowserProps> = ({ 
  courses, 
  onEnroll, 
  enrolledCourses 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const domains = Array.from(new Set(courses.map(course => course.domain)));

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === 'all' || course.domain === selectedDomain;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      
      return matchesSearch && matchesDomain && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.enrolledCount - a.enrolledCount;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-8">
      <CourseFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDomain={selectedDomain}
        onDomainChange={setSelectedDomain}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
        sortBy={sortBy}
        onSort={setSortBy}
        domains={domains}
        resultsCount={filteredCourses.length}
      />

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourses.includes(course.id);
          
          return (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={isEnrolled}
              onEnroll={onEnroll}
            />
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.077-2.33M15 17.024A7.962 7.962 0 0012 9c2.34 0 4.467.881 6.077 2.33M18 14h.01M6 14h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search filters to find more courses.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBrowser;
