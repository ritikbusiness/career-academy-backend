import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Filter, Star, Clock, DollarSign, Users, BookOpen, TrendingUp } from 'lucide-react';
import { Course } from '@/types/course';

interface SearchFilters {
  query: string;
  domains: string[];
  levels: string[];
  priceRange: [number, number];
  duration: string;
  rating: number;
  sortBy: string;
  free: boolean;
}

interface AdvancedCourseSearchProps {
  courses: Course[];
  onFilteredResults: (filteredCourses: Course[], searchStats: SearchStats) => void;
  recentSearches?: string[];
  onAddToWishlist?: (courseId: string) => void;
}

interface SearchStats {
  total: number;
  free: number;
  premium: number;
  averageRating: number;
  totalEnrollments: number;
}

const AdvancedCourseSearch: React.FC<AdvancedCourseSearchProps> = ({
  courses,
  onFilteredResults,
  recentSearches = [],
  onAddToWishlist
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    domains: [],
    levels: [],
    priceRange: [0, 10000],
    duration: '',
    rating: 0,
    sortBy: 'relevance',
    free: false
  });

  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Extract unique domains and other filter options from courses
  const availableDomains = Array.from(new Set(courses.map(course => course.domain)));
  const availableLevels = ['beginner', 'intermediate', 'advanced'];
  const maxPrice = courses.length > 0 ? Math.max(...courses.map(course => course.price)) : 10000;

  const applyFilters = (currentFilters: SearchFilters) => {
    let filtered = [...courses];

    // Text search
    if (currentFilters.query) {
      const query = currentFilters.query.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.name.toLowerCase().includes(query) ||
        course.domain.toLowerCase().includes(query)
      );
    }

    // Domain filter
    if (currentFilters.domains.length > 0) {
      filtered = filtered.filter(course => 
        currentFilters.domains.includes(course.domain)
      );
    }

    // Level filter
    if (currentFilters.levels.length > 0) {
      filtered = filtered.filter(course => 
        currentFilters.levels.includes(course.level)
      );
    }

    // Price filter
    filtered = filtered.filter(course => 
      course.price >= currentFilters.priceRange[0] && 
      course.price <= currentFilters.priceRange[1]
    );

    // Free courses filter
    if (currentFilters.free) {
      filtered = filtered.filter(course => course.price === 0);
    }

    // Rating filter
    if (currentFilters.rating > 0) {
      filtered = filtered.filter(course => course.rating >= currentFilters.rating);
    }

    // Duration filter
    if (currentFilters.duration) {
      filtered = filtered.filter(course => {
        const duration = parseInt(course.duration);
        switch (currentFilters.duration) {
          case 'short': return duration <= 5;
          case 'medium': return duration > 5 && duration <= 15;
          case 'long': return duration > 15;
          default: return true;
        }
      });
    }

    // Sorting
    switch (currentFilters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.enrolledCount - a.enrolledCount);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default: // relevance
        break;
    }

    // Calculate stats
    const stats: SearchStats = {
      total: filtered.length,
      free: filtered.filter(c => c.price === 0).length,
      premium: filtered.filter(c => c.price > 0).length,
      averageRating: filtered.length > 0 ? 
        filtered.reduce((sum, c) => sum + c.rating, 0) / filtered.length : 0,
      totalEnrollments: filtered.reduce((sum, c) => sum + c.enrolledCount, 0)
    };

    onFilteredResults(filtered, stats);
  };

  useEffect(() => {
    applyFilters(filters);
  }, [filters, courses]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDomainToggle = (domain: string) => {
    setFilters(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain]
    }));
  };

  const handleLevelToggle = (level: string) => {
    setFilters(prev => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      domains: [],
      levels: [],
      priceRange: [0, maxPrice],
      duration: '',
      rating: 0,
      sortBy: 'relevance',
      free: false
    });
  };

  const handleRecentSearchClick = (search: string) => {
    handleFilterChange('query', search);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses, instructors, or topics..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filters.domains.length > 0 || filters.levels.length > 0 || filters.free || filters.rating > 0) && (
                <Badge variant="secondary" className="ml-1">
                  {filters.domains.length + filters.levels.length + (filters.free ? 1 : 0) + (filters.rating > 0 ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !filters.query && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRecentSearchClick(search)}
                    className="text-xs h-6 px-2"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {isFiltersExpanded && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Domains */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Subject Areas</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableDomains.map(domain => (
                    <div key={domain} className="flex items-center space-x-2">
                      <Checkbox
                        id={domain}
                        checked={filters.domains.includes(domain)}
                        onCheckedChange={() => handleDomainToggle(domain)}
                      />
                      <Label htmlFor={domain} className="text-sm capitalize">
                        {domain.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Levels */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Difficulty Level</Label>
                <div className="space-y-2">
                  {availableLevels.map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={level}
                        checked={filters.levels.includes(level)}
                        onCheckedChange={() => handleLevelToggle(level)}
                      />
                      <Label htmlFor={level} className="text-sm capitalize">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Course Duration</Label>
                <Select value={filters.duration} onValueChange={(value) => handleFilterChange('duration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any duration</SelectItem>
                    <SelectItem value="short">Short (≤ 5 hours)</SelectItem>
                    <SelectItem value="medium">Medium (6-15 hours)</SelectItem>
                    <SelectItem value="long">Long (15+ hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  max={maxPrice}
                  step={100}
                  className="mt-2"
                />
                <div className="flex items-center space-x-2 mt-3">
                  <Checkbox
                    id="free"
                    checked={filters.free}
                    onCheckedChange={(checked) => handleFilterChange('free', checked)}
                  />
                  <Label htmlFor="free" className="text-sm">Free courses only</Label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
                <Select value={filters.rating.toString()} onValueChange={(value) => handleFilterChange('rating', parseFloat(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort Options */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Sort by:</Label>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Relevance
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Highest Rated
                  </div>
                </SelectItem>
                <SelectItem value="popularity">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Most Popular
                  </div>
                </SelectItem>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Newest
                  </div>
                </SelectItem>
                <SelectItem value="price-low">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price: Low to High
                  </div>
                </SelectItem>
                <SelectItem value="price-high">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price: High to Low
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedCourseSearch;