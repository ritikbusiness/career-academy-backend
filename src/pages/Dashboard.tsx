
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Continue your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Enrolled courses</p>
                <Button className="mt-4 w-full">Browse Courses</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>Your learning progress</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0%</p>
                <p className="text-sm text-muted-foreground">Overall completion</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>Your achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Certificates earned</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'instructor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Courses you're teaching</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Active courses</p>
                <Button className="mt-4 w-full">Create Course</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>Total enrolled students</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Enrolled students</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Earnings</CardTitle>
                <CardDescription>Your total earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹0</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Published courses</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹0</p>
                <p className="text-sm text-muted-foreground">Total revenue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Courses to review</p>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <div>Welcome to your dashboard!</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.domain && user?.branch && (
              <>
                {user.domain} • {user.branch} {user.year && `• ${user.year}`}
              </>
            )}
          </p>
        </div>
        
        {getDashboardContent()}
      </main>
    </div>
  );
};

export default Dashboard;
