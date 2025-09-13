import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { X, Plus, User, GraduationCap, Award, Link as LinkIcon } from 'lucide-react';

const InstructorSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    bio: '',
    expertiseAreas: [] as string[],
    qualifications: [] as string[],
    teachingExperience: 0,
    linkedinProfile: '',
    personalWebsite: '',
    credentialsUrl: '',
    agreeToTerms: false,
  });
  const [newExpertise, setNewExpertise] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const expertiseOptions = [
    'Web Development', 'Mobile App Development', 'Data Science', 'Machine Learning',
    'Artificial Intelligence', 'Cloud Computing', 'DevOps', 'Cybersecurity',
    'UI/UX Design', 'Digital Marketing', 'Business Analytics', 'Project Management',
    'Software Engineering', 'Database Management', 'Network Security', 'Blockchain'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExpertise = (area: string) => {
    if (area && !formData.expertiseAreas.includes(area)) {
      setFormData(prev => ({
        ...prev,
        expertiseAreas: [...prev.expertiseAreas, area]
      }));
    }
    setNewExpertise('');
  };

  const removeExpertise = (area: string) => {
    setFormData(prev => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.filter(e => e !== area)
    }));
  };

  const addQualification = () => {
    if (newQualification && !formData.qualifications.includes(newQualification)) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification]
      }));
      setNewQualification('');
    }
  };

  const removeQualification = (qualification: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter(q => q !== qualification)
    }));
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.username) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords don't match.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (formData.bio.length < 50) {
      toast({
        title: "Bio Too Short",
        description: "Please provide a bio with at least 50 characters.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.expertiseAreas.length === 0) {
      toast({
        title: "Expertise Required",
        description: "Please select at least one area of expertise.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.qualifications.length === 0) {
      toast({
        title: "Qualifications Required",
        description: "Please add at least one qualification.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/instructor/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'instructor',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const result = await response.json();

      toast({
        title: "Registration Submitted!",
        description: "Your instructor application has been submitted for review. You'll be notified once approved.",
      });
      
      // Store token and redirect to instructor dashboard
      localStorage.setItem('token', result.data.token);
      navigate('/instructor');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <User className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            data-testid="input-fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <Label htmlFor="username">Username *</Label>
          <Input
            id="username"
            data-testid="input-username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="johndoe"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          data-testid="input-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email address"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            data-testid="input-password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            data-testid="input-confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold">Professional Background</h3>
      </div>

      <div>
        <Label htmlFor="bio">Professional Bio * (minimum 50 characters)</Label>
        <Textarea
          id="bio"
          data-testid="textarea-bio"
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Tell us about your professional background, teaching experience, and what makes you a great instructor..."
          rows={4}
          required
        />
        <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/50 characters minimum</p>
      </div>

      <div>
        <Label>Areas of Expertise *</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.expertiseAreas.map((area) => (
            <Badge key={area} variant="secondary" className="flex items-center gap-1">
              {area}
              <button
                type="button"
                onClick={() => removeExpertise(area)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 mb-2">
          <Input
            data-testid="input-newExpertise"
            value={newExpertise}
            onChange={(e) => setNewExpertise(e.target.value)}
            placeholder="Add custom expertise area"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise(newExpertise))}
          />
          <Button
            type="button"
            data-testid="button-addCustomExpertise"
            variant="outline"
            onClick={() => addExpertise(newExpertise)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {expertiseOptions.map((option) => (
            <Button
              key={option}
              type="button"
              data-testid={`button-expertise-${option.replace(/\s+/g, '-').toLowerCase()}`}
              variant="outline"
              size="sm"
              onClick={() => addExpertise(option)}
              disabled={formData.expertiseAreas.includes(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Qualifications & Certifications *</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.qualifications.map((qual) => (
            <Badge key={qual} variant="secondary" className="flex items-center gap-1">
              {qual}
              <button
                type="button"
                onClick={() => removeQualification(qual)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            data-testid="input-newQualification"
            value={newQualification}
            onChange={(e) => setNewQualification(e.target.value)}
            placeholder="e.g., PhD in Computer Science, AWS Certified Solutions Architect"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
          />
          <Button
            type="button"
            data-testid="button-addQualification"
            variant="outline"
            onClick={addQualification}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="teachingExperience">Years of Teaching Experience</Label>
        <Input
          id="teachingExperience"
          data-testid="input-teachingExperience"
          type="number"
          min="0"
          value={formData.teachingExperience}
          onChange={(e) => handleInputChange('teachingExperience', parseInt(e.target.value) || 0)}
          placeholder="0"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Award className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold">Additional Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="linkedinProfile"
              data-testid="input-linkedinProfile"
              value={formData.linkedinProfile}
              onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="personalWebsite">Personal Website</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="personalWebsite"
              data-testid="input-personalWebsite"
              value={formData.personalWebsite}
              onChange={(e) => handleInputChange('personalWebsite', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="credentialsUrl">Portfolio/Credentials URL</Label>
        <Input
          id="credentialsUrl"
          data-testid="input-credentialsUrl"
          value={formData.credentialsUrl}
          onChange={(e) => handleInputChange('credentialsUrl', e.target.value)}
          placeholder="Link to your portfolio, resume, or credentials"
        />
        <p className="text-sm text-gray-500 mt-1">
          Optional: Provide a link to your portfolio, resume, or any credentials that showcase your expertise.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreeToTerms"
          data-testid="checkbox-agreeToTerms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
        />
        <Label htmlFor="agreeToTerms" className="text-sm">
          I agree to the{' '}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your application will be reviewed by our team within 2-3 business days</li>
          <li>• We may contact you for additional information or verification</li>
          <li>• Once approved, you'll receive an email confirmation</li>
          <li>• You can then start creating and publishing courses</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Become an Instructor</CardTitle>
            <CardDescription>
              Join Desired Career Academy and share your expertise with students worldwide.
            </CardDescription>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between mt-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <div className="flex justify-between mt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    data-testid="button-previous"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      data-testid="button-next"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      data-testid="button-submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </div>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorSignupForm;