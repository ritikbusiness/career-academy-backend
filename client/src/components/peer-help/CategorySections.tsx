import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

interface CategorySectionsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategorySections({ categories, selectedCategory, onCategoryChange }: CategorySectionsProps) {
  return (
    <Card className="sticky top-4">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4 text-lg">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🌟</span>
              <span className="font-medium">All Categories</span>
            </div>
            <Badge variant={selectedCategory === 'all' ? 'secondary' : 'outline'} className="text-xs">
              {categories.reduce((total, cat) => total + cat.count, 0)}
            </Badge>
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </div>
              <Badge variant={selectedCategory === category.id ? 'secondary' : 'outline'} className="text-xs">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>
        
        {/* Quick Stats */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Quick Stats</h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Total Questions:</span>
              <span className="font-medium">372</span>
            </div>
            <div className="flex justify-between">
              <span>Resolved Today:</span>
              <span className="font-medium text-green-600">23</span>
            </div>
            <div className="flex justify-between">
              <span>Your XP Earned:</span>
              <span className="font-medium text-blue-600">145</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}