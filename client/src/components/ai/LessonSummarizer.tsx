import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, BookOpen, Target, Lightbulb } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

interface LessonSummary {
  mainPoints: string[];
  keyTakeaways: string[];
  summary: string;
}

interface LessonSummarizerProps {
  lessonContent: string;
  lessonTitle: string;
  onSummaryGenerated?: (summary: LessonSummary) => void;
}

const LessonSummarizer: React.FC<LessonSummarizerProps> = ({
  lessonContent,
  lessonTitle,
  onSummaryGenerated
}) => {
  const [summary, setSummary] = useState<LessonSummary | null>(null);

  const generateSummaryMutation = useMutation({
    mutationFn: async ({ content, title }: { content: string; title: string }) => {
      const response = await fetch('/api/ai/summarize-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonContent: content,
          lessonTitle: title
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      return response.json();
    },
    onSuccess: (data: LessonSummary) => {
      setSummary(data);
      onSummaryGenerated?.(data);
    },
  });

  const handleGenerateSummary = () => {
    generateSummaryMutation.mutate({
      content: lessonContent,
      title: lessonTitle
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Lesson Summary
        </CardTitle>
        <CardDescription>
          Get an AI-powered summary of the key concepts and takeaways
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!summary && (
          <Button 
            onClick={handleGenerateSummary}
            disabled={generateSummaryMutation.isPending || !lessonContent}
            className="w-full"
          >
            {generateSummaryMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Summary
              </>
            )}
          </Button>
        )}

        {generateSummaryMutation.isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              Failed to generate summary. Please try again.
            </p>
          </div>
        )}

        {summary && (
          <div className="space-y-6">
            {/* Overview Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Overview
              </h4>
              <p className="text-blue-800 leading-relaxed">{summary.summary}</p>
            </div>

            {/* Main Points */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                Main Points
              </h4>
              <div className="space-y-2">
                {summary.mainPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5 text-xs">
                      {index + 1}
                    </Badge>
                    <p className="text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Takeaways */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                Key Takeaways
              </h4>
              <div className="space-y-2">
                {summary.keyTakeaways.map((takeaway, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm font-medium">{takeaway}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleGenerateSummary}
              variant="outline"
              size="sm"
              disabled={generateSummaryMutation.isPending}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LessonSummarizer;