import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Loader2, Target, BookOpen, AlertTriangle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  recommendations: string[];
  practiceAreas: string[];
}

interface SkillGapAnalyzerProps {
  completedLessons: string[];
  quizResults: any[];
  targetSkills: string[];
  onAnalysisComplete?: (skillGaps: SkillGap[]) => void;
}

const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({
  completedLessons,
  quizResults,
  targetSkills,
  onAnalysisComplete
}) => {
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);

  const analyzeSkillsMutation = useMutation({
    mutationFn: async ({ lessons, results, skills }: { 
      lessons: string[]; 
      results: any[]; 
      skills: string[] 
    }) => {
      const response = await fetch('/api/ai/analyze-skill-gaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completedLessons: lessons,
          quizResults: results,
          targetSkills: skills
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze skill gaps');
      }

      return response.json();
    },
    onSuccess: (data: { skillGaps: SkillGap[] }) => {
      setSkillGaps(data.skillGaps);
      onAnalysisComplete?.(data.skillGaps);
    },
  });

  const handleAnalyzeSkills = () => {
    analyzeSkillsMutation.mutate({
      lessons: completedLessons,
      results: quizResults,
      skills: targetSkills
    });
  };

  const getGapSeverity = (currentLevel: number, targetLevel: number) => {
    const gap = targetLevel - currentLevel;
    if (gap <= 10) return 'low';
    if (gap <= 30) return 'medium';
    return 'high';
  };

  const getGapColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <Target className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          AI Skill Gap Analysis
        </CardTitle>
        <CardDescription>
          Analyze your learning progress and identify areas for improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {skillGaps.length === 0 && (
          <div className="text-center space-y-4">
            <div className="p-6 bg-gray-50 rounded-lg">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready for Skill Analysis
              </h3>
              <p className="text-gray-600 mb-4">
                Analyze your completed lessons and quiz performance to identify skill gaps and get personalized recommendations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-gray-900">Completed Lessons</div>
                  <div className="text-blue-600 font-semibold">{completedLessons.length}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-gray-900">Quiz Results</div>
                  <div className="text-green-600 font-semibold">{quizResults.length}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-gray-900">Target Skills</div>
                  <div className="text-purple-600 font-semibold">{targetSkills.length}</div>
                </div>
              </div>

              <Button 
                onClick={handleAnalyzeSkills}
                disabled={analyzeSkillsMutation.isPending || completedLessons.length === 0}
                className="w-full"
              >
                {analyzeSkillsMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Skills...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyze My Skills
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {analyzeSkillsMutation.isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              Failed to analyze skill gaps. Please try again.
            </p>
          </div>
        )}

        {skillGaps.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Skill Gap Analysis Results</h3>
              <Button
                onClick={handleAnalyzeSkills}
                variant="outline"
                size="sm"
                disabled={analyzeSkillsMutation.isPending}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Re-analyze
              </Button>
            </div>

            <div className="grid gap-4">
              {skillGaps.map((gap, index) => {
                const severity = getGapSeverity(gap.currentLevel, gap.targetLevel);
                const gapPercentage = gap.targetLevel - gap.currentLevel;

                return (
                  <Card key={index} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {gap.skill}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getGapColor(severity)}`}>
                              <span className="flex items-center gap-1">
                                {getSeverityIcon(severity)}
                                {gapPercentage}% gap
                              </span>
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Current Level</span>
                            <span className="font-medium">{gap.currentLevel}%</span>
                          </div>
                          <Progress value={gap.currentLevel} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Target Level</span>
                            <span className="font-medium">{gap.targetLevel}%</span>
                          </div>
                          <Progress value={gap.targetLevel} className="h-2" />
                        </div>

                        <div className="pt-3 border-t">
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            Recommendations
                          </h5>
                          <ul className="space-y-1">
                            {gap.recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 border-t">
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-green-600" />
                            Practice Areas
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {gap.practiceAreas.map((area, areaIndex) => (
                              <Badge key={areaIndex} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
              <p className="text-blue-800 text-sm">
                Focus on the skills with the largest gaps first. Use the recommended practice areas 
                to guide your learning, and retake quizzes to track your improvement over time.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillGapAnalyzer;