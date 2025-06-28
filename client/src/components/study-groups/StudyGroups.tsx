import { useState } from 'react';
import { Users, Plus, Search, Hash, Calendar, MessageCircle, UserPlus, UserMinus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  courseId?: string;
  courseName?: string;
  creatorId: string;
  creatorName: string;
  tags: string[];
  memberCount: number;
  maxMembers?: number;
  isPublic: boolean;
  recentActivity: string;
  lastActiveAt: string;
  createdAt: string;
  isMember: boolean;
  isCreator: boolean;
}

interface StudyGroupsProps {
  userId: string;
  enrolledCourses: Array<{ id: string; title: string }>;
}

const StudyGroupCard = ({ 
  group, 
  onJoin, 
  onLeave, 
  onEdit 
}: {
  group: StudyGroup;
  onJoin: (groupId: string) => void;
  onLeave: (groupId: string) => void;
  onEdit: (groupId: string) => void;
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 line-clamp-1">{group.name}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {group.description}
            </p>
            {group.courseName && (
              <Badge variant="outline" className="mb-2">
                {group.courseName}
              </Badge>
            )}
          </div>
          {group.isCreator && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(group.id)}
              className="p-1 h-8 w-8"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Tags */}
        {group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {group.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Hash className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {group.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{group.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Group Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{group.memberCount} {group.maxMembers ? `/ ${group.maxMembers}` : ''} members</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{group.recentActivity}</span>
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="text-xs text-gray-500 mb-4">
          Last active {new Date(group.lastActiveAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {group.isMember ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onLeave(group.id)}
              className="flex items-center gap-2"
            >
              <UserMinus className="w-4 h-4" />
              Leave Group
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={() => onJoin(group.id)}
              className="flex items-center gap-2"
              disabled={group.maxMembers ? group.memberCount >= group.maxMembers : false}
            >
              <UserPlus className="w-4 h-4" />
              Join Group
            </Button>
          )}
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CreateGroupDialog = ({ 
  userId,
  enrolledCourses,
  onSubmit, 
  isOpen, 
  onClose 
}: {
  userId: string;
  enrolledCourses: Array<{ id: string; title: string }>;
  onSubmit: (groupData: Omit<StudyGroup, 'id' | 'createdAt' | 'memberCount' | 'isMember' | 'isCreator' | 'recentActivity' | 'lastActiveAt'>) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    courseId: '',
    tags: '',
    maxMembers: '',
    isPublic: true
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.description.trim()) return;

    const selectedCourse = enrolledCourses.find(c => c.id === formData.courseId);
    
    onSubmit({
      name: formData.name,
      description: formData.description,
      courseId: formData.courseId || undefined,
      courseName: selectedCourse?.title,
      creatorId: userId,
      creatorName: 'Current User',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : undefined,
      isPublic: formData.isPublic
    });

    setFormData({
      name: '',
      description: '',
      courseId: '',
      tags: '',
      maxMembers: '',
      isPublic: true
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Study Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Group Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., React Study Circle"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What will this group focus on? What are your learning goals?"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Related Course (Optional)</label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No specific course</option>
              {enrolledCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., javascript, frontend, beginner"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Members (Optional)</label>
              <Input
                type="number"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                placeholder="No limit"
                min="2"
                max="50"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
              <label className="text-sm font-medium">Public group</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim() || !formData.description.trim()}>
              Create Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function StudyGroups({ userId, enrolledCourses }: StudyGroupsProps) {
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([
    // TODO: connect to backend - fetch user's groups
  ]);

  const [suggestedGroups, setSuggestedGroups] = useState<StudyGroup[]>([
    // TODO: connect to backend - fetch suggested groups
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [activeTab, setActiveTab] = useState('my-groups');

  const handleJoinGroup = (groupId: string) => {
    const group = suggestedGroups.find(g => g.id === groupId);
    if (!group) return;

    // Move to my groups
    const updatedGroup = { ...group, isMember: true, memberCount: group.memberCount + 1 };
    setMyGroups([updatedGroup, ...myGroups]);
    setSuggestedGroups(suggestedGroups.filter(g => g.id !== groupId));

    // TODO: connect to backend - POST /api/study-groups/{groupId}/join
    console.log('Joining group:', groupId);
  };

  const handleLeaveGroup = (groupId: string) => {
    const group = myGroups.find(g => g.id === groupId);
    if (!group) return;

    if (group.isCreator) {
      // Creator leaving means deleting the group
      setMyGroups(myGroups.filter(g => g.id !== groupId));
    } else {
      // Regular member leaving
      const updatedGroup = { ...group, isMember: false, memberCount: group.memberCount - 1 };
      setMyGroups(myGroups.filter(g => g.id !== groupId));
      setSuggestedGroups([updatedGroup, ...suggestedGroups]);
    }

    // TODO: connect to backend - POST /api/study-groups/{groupId}/leave
    console.log('Leaving group:', groupId);
  };

  const handleEditGroup = (groupId: string) => {
    // TODO: implement edit functionality
    console.log('Editing group:', groupId);
  };

  const handleCreateGroup = (groupData: Omit<StudyGroup, 'id' | 'createdAt' | 'memberCount' | 'isMember' | 'isCreator' | 'recentActivity' | 'lastActiveAt'>) => {
    const newGroup: StudyGroup = {
      ...groupData,
      id: Date.now().toString(),
      memberCount: 1,
      isMember: true,
      isCreator: true,
      recentActivity: 'Just created',
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setMyGroups([newGroup, ...myGroups]);

    // TODO: connect to backend - POST /api/study-groups
    console.log('Creating group:', newGroup);
  };

  const filteredMyGroups = myGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSuggestedGroups = suggestedGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Study Groups</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with peers, form study circles, and learn together
          </p>
        </div>
        <Button onClick={() => setShowCreateGroup(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Group
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search groups by name, description, or tags..."
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-groups" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            My Groups ({myGroups.length})
          </TabsTrigger>
          <TabsTrigger value="suggested" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Discover ({suggestedGroups.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups">
          {filteredMyGroups.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No groups found' : 'No study groups yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery 
                    ? 'Try adjusting your search terms or browse suggested groups.'
                    : 'Create your first study group or join existing ones to start collaborating!'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowCreateGroup(true)}>
                    Create Your First Group
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMyGroups.map((group) => (
                <StudyGroupCard
                  key={group.id}
                  group={group}
                  onJoin={handleJoinGroup}
                  onLeave={handleLeaveGroup}
                  onEdit={handleEditGroup}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="suggested">
          {filteredSuggestedGroups.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No groups found' : 'No suggestions available'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery 
                    ? 'Try different search terms or create a new group.'
                    : 'Enroll in more courses to see suggested study groups, or create your own!'
                  }
                </p>
                <Button onClick={() => setShowCreateGroup(true)}>
                  Create New Group
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuggestedGroups.map((group) => (
                <StudyGroupCard
                  key={group.id}
                  group={group}
                  onJoin={handleJoinGroup}
                  onLeave={handleLeaveGroup}
                  onEdit={handleEditGroup}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Group Dialog */}
      <CreateGroupDialog
        userId={userId}
        enrolledCourses={enrolledCourses}
        onSubmit={handleCreateGroup}
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />
    </div>
  );
}