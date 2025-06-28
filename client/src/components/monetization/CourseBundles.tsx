import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Package, Plus, Edit, Trash2, Clock, Users, 
  Star, BookOpen, DollarSign, Percent, Play,
  CheckCircle, Tag
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  enrolledCount: number;
  thumbnail?: string;
}

interface CourseBundle {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  originalPrice: number;
  bundlePrice: number;
  discountPercentage: number;
  totalDuration: string;
  enrolledCount: number;
  rating: number;
  instructorId: string;
  isActive: boolean;
  createdAt: string;
  tags: string[];
}

interface CourseBundlesProps {
  userRole: 'student' | 'instructor';
  userId: string;
  availableCourses?: Course[];
}

export default function CourseBundles({ userRole, userId, availableCourses = [] }: CourseBundlesProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBundle, setEditingBundle] = useState<CourseBundle | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [bundleForm, setBundleForm] = useState({
    title: '',
    description: '',
    discountPercentage: 20,
    tags: ''
  });

  // Mock data
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React',
      price: 99,
      duration: '8 hours',
      level: 'beginner',
      rating: 4.5,
      enrolledCount: 1250
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts',
      price: 149,
      duration: '12 hours',
      level: 'advanced',
      rating: 4.8,
      enrolledCount: 680
    },
    {
      id: '3',
      title: 'React Testing Library',
      description: 'Complete guide to testing React apps',
      price: 79,
      duration: '6 hours',
      level: 'intermediate',
      rating: 4.6,
      enrolledCount: 890
    },
    {
      id: '4',
      title: 'React Native Mobile Dev',
      description: 'Build mobile apps with React Native',
      price: 129,
      duration: '15 hours',
      level: 'intermediate',
      rating: 4.7,
      enrolledCount: 540
    }
  ];

  const [bundles, setBundles] = useState<CourseBundle[]>([
    {
      id: '1',
      title: 'Complete React Developer Bundle',
      description: 'Master React from beginner to advanced with this comprehensive bundle including fundamentals, advanced patterns, and testing.',
      courses: [mockCourses[0], mockCourses[1], mockCourses[2]],
      originalPrice: 327,
      bundlePrice: 229,
      discountPercentage: 30,
      totalDuration: '26 hours',
      enrolledCount: 340,
      rating: 4.7,
      instructorId: userId,
      isActive: true,
      createdAt: '2024-12-15',
      tags: ['React', 'Frontend', 'JavaScript']
    },
    {
      id: '2',
      title: 'Full Stack React Bundle',
      description: 'Complete full-stack development with React for web and mobile applications.',
      courses: [mockCourses[0], mockCourses[1], mockCourses[3]],
      originalPrice: 377,
      bundlePrice: 279,
      discountPercentage: 26,
      totalDuration: '35 hours',
      enrolledCount: 210,
      rating: 4.6,
      instructorId: userId,
      isActive: true,
      createdAt: '2024-11-20',
      tags: ['React', 'Mobile', 'Full Stack']
    }
  ]);

  const handleCreateBundle = () => {
    const selectedCourseData = mockCourses.filter(c => selectedCourses.includes(c.id));
    const originalPrice = selectedCourseData.reduce((sum, course) => sum + course.price, 0);
    const bundlePrice = originalPrice * (1 - bundleForm.discountPercentage / 100);
    const totalDuration = selectedCourseData.reduce((sum, course) => {
      const hours = parseInt(course.duration.split(' ')[0]);
      return sum + hours;
    }, 0);

    const newBundle: CourseBundle = {
      id: Date.now().toString(),
      title: bundleForm.title,
      description: bundleForm.description,
      courses: selectedCourseData,
      originalPrice,
      bundlePrice,
      discountPercentage: bundleForm.discountPercentage,
      totalDuration: `${totalDuration} hours`,
      enrolledCount: 0,
      rating: 0,
      instructorId: userId,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      tags: bundleForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    // TODO: connect to backend - create bundle
    setBundles(prev => [newBundle, ...prev]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdateBundle = () => {
    if (!editingBundle) return;

    const selectedCourseData = mockCourses.filter(c => selectedCourses.includes(c.id));
    const originalPrice = selectedCourseData.reduce((sum, course) => sum + course.price, 0);
    const bundlePrice = originalPrice * (1 - bundleForm.discountPercentage / 100);

    const updatedBundle: CourseBundle = {
      ...editingBundle,
      title: bundleForm.title,
      description: bundleForm.description,
      courses: selectedCourseData,
      originalPrice,
      bundlePrice,
      discountPercentage: bundleForm.discountPercentage,
      tags: bundleForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    // TODO: connect to backend - update bundle
    setBundles(prev => prev.map(b => b.id === editingBundle.id ? updatedBundle : b));
    setEditingBundle(null);
    resetForm();
  };

  const handleDeleteBundle = (bundleId: string) => {
    // TODO: connect to backend - delete bundle
    setBundles(prev => prev.filter(b => b.id !== bundleId));
  };

  const handleToggleActive = (bundleId: string) => {
    // TODO: connect to backend - toggle bundle status
    setBundles(prev => prev.map(b => 
      b.id === bundleId ? { ...b, isActive: !b.isActive } : b
    ));
  };

  const handleEnrollBundle = (bundleId: string) => {
    // TODO: connect to backend - enroll in bundle
    console.log('Enrolling in bundle:', bundleId);
  };

  const resetForm = () => {
    setBundleForm({
      title: '',
      description: '',
      discountPercentage: 20,
      tags: ''
    });
    setSelectedCourses([]);
  };

  const openEditModal = (bundle: CourseBundle) => {
    setEditingBundle(bundle);
    setBundleForm({
      title: bundle.title,
      description: bundle.description,
      discountPercentage: bundle.discountPercentage,
      tags: bundle.tags.join(', ')
    });
    setSelectedCourses(bundle.courses.map(c => c.id));
  };

  const calculateProgress = (bundle: CourseBundle) => {
    // Mock progress calculation
    return Math.floor(Math.random() * 100);
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {userRole === 'instructor' ? 'Course Bundles Management' : 'Course Bundles'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'instructor' 
              ? 'Create and manage course bundles with discounted pricing'
              : 'Get multiple courses at discounted prices with our curated bundles'
            }
          </p>
        </div>

        {userRole === 'instructor' && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Bundle
          </Button>
        )}
      </div>

      {/* Bundles Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {bundles.map((bundle) => (
          <Card key={bundle.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{bundle.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {bundle.courses.length} courses
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {bundle.totalDuration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {bundle.rating > 0 ? bundle.rating.toFixed(1) : 'New'}
                    </div>
                  </div>
                </div>

                {userRole === 'instructor' && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(bundle)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteBundle(bundle.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>

              {!bundle.isActive && (
                <Badge variant="secondary" className="w-fit">
                  Inactive
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                {bundle.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {bundle.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Included Courses */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                  Included Courses:
                </h4>
                <div className="space-y-1">
                  {bundle.courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">{course.title}</span>
                        <Badge className={`text-xs ${getLevelBadgeColor(course.level)}`}>
                          {course.level}
                        </Badge>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">{course.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress for Students */}
              {userRole === 'student' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium">{calculateProgress(bundle)}%</span>
                  </div>
                  <Progress value={calculateProgress(bundle)} className="h-2" />
                </div>
              )}

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${bundle.bundlePrice}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ${bundle.originalPrice}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    <Percent className="w-3 h-3 mr-1" />
                    {bundle.discountPercentage}% off
                  </Badge>
                </div>

                <div className="text-xs text-green-600 dark:text-green-400">
                  Save ${bundle.originalPrice - bundle.bundlePrice}
                </div>
              </div>

              {/* Enrollment Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {bundle.enrolledCount} enrolled
                </div>
              </div>

              {/* Action Button */}
              {userRole === 'student' ? (
                <Button 
                  onClick={() => handleEnrollBundle(bundle.id)}
                  className="w-full"
                  disabled={!bundle.isActive}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {bundle.isActive ? 'Enroll Now' : 'Unavailable'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleToggleActive(bundle.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    {bundle.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Analytics
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Bundle Modal */}
      <Dialog open={showCreateModal || !!editingBundle} onOpenChange={(open) => {
        if (!open) {
          setShowCreateModal(false);
          setEditingBundle(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBundle ? 'Edit Bundle' : 'Create New Bundle'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Bundle Title</Label>
                <Input
                  id="title"
                  placeholder="Complete React Developer Bundle"
                  value={bundleForm.title}
                  onChange={(e) => setBundleForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn from this bundle"
                  value={bundleForm.description}
                  onChange={(e) => setBundleForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount">Discount Percentage</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="5"
                    max="70"
                    value={bundleForm.discountPercentage}
                    onChange={(e) => setBundleForm(prev => ({ 
                      ...prev, 
                      discountPercentage: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="React, Frontend, JavaScript"
                    value={bundleForm.tags}
                    onChange={(e) => setBundleForm(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Course Selection */}
            <div className="space-y-4">
              <Label>Select Courses for Bundle</Label>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {mockCourses.map((course) => (
                  <div key={course.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCourses(prev => [...prev, course.id]);
                        } else {
                          setSelectedCourses(prev => prev.filter(id => id !== course.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{course.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{course.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>${course.price}</span>
                        <span>{course.duration}</span>
                        <Badge className={getLevelBadgeColor(course.level)}>
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Preview */}
            {selectedCourses.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">Pricing Preview</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span>
                      ${mockCourses
                        .filter(c => selectedCourses.includes(c.id))
                        .reduce((sum, c) => sum + c.price, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({bundleForm.discountPercentage}%):</span>
                    <span>
                      -${(mockCourses
                        .filter(c => selectedCourses.includes(c.id))
                        .reduce((sum, c) => sum + c.price, 0) * bundleForm.discountPercentage / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-1">
                    <span>Bundle Price:</span>
                    <span>
                      ${(mockCourses
                        .filter(c => selectedCourses.includes(c.id))
                        .reduce((sum, c) => sum + c.price, 0) * (1 - bundleForm.discountPercentage / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={editingBundle ? handleUpdateBundle : handleCreateBundle}
              className="w-full"
              disabled={!bundleForm.title || selectedCourses.length < 2}
            >
              {editingBundle ? 'Update Bundle' : 'Create Bundle'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}