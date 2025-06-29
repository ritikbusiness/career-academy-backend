import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X, Plus, HelpCircle } from 'lucide-react';

interface AskQuestionFormProps {
  onClose: () => void;
}

const categories = [
  { id: 'devops', name: 'DevOps', icon: '🚀' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'frontend', name: 'Frontend', icon: '🎨' },
  { id: 'backend', name: 'Backend', icon: '⚙️' },
  { id: 'mobile', name: 'Mobile', icon: '📱' },
  { id: 'ai-ml', name: 'AI/ML', icon: '🤖' },
];

const popularTags = [
  'javascript', 'react', 'python', 'node.js', 'typescript', 'docker', 
  'aws', 'database', 'api', 'css', 'html', 'git', 'testing', 'deployment'
];

export function AskQuestionForm({ onClose }: AskQuestionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag.toLowerCase()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Submit question to backend
    console.log('Question submitted:', {
      title: title.trim(),
      description: description.trim(),
      category,
      tags
    });
    
    setIsSubmitting(false);
    onClose();
  };

  const isValid = title.trim() && description.trim() && category;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          Ask a Question
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Get help from the community by asking a clear, detailed question
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium">
              Question Title *
            </Label>
            <Input
              id="title"
              placeholder="Be specific and clear. What is your main question?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              className="text-base"
            />
            <p className="text-xs text-gray-500">
              {title.length}/150 characters
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="font-medium">
              Category *
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select the most relevant category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">
              Detailed Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Provide context, what you've tried, error messages, code snippets, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="text-base"
              maxLength={2000}
            />
            <p className="text-xs text-gray-500">
              {description.length}/2000 characters
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="font-medium">
              Tags (optional)
            </Label>
            
            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Add Custom Tag */}
            {tags.length < 5 && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(newTag);
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddTag(newTag)}
                  disabled={!newTag.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {/* Popular Tags */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags
                  .filter(tag => !tags.includes(tag))
                  .slice(0, 8)
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      disabled={tags.length >= 5}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
            
            {tags.length >= 5 && (
              <p className="text-xs text-amber-600">
                Maximum 5 tags allowed
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2 text-blue-800 dark:text-blue-200">
              💡 Tips for getting great answers:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Be specific about your problem and environment</li>
              <li>• Include error messages or unexpected behavior</li>
              <li>• Show what you've already tried</li>
              <li>• Use proper formatting for code snippets</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid || isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isSubmitting ? 'Posting...' : 'Post Question'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}