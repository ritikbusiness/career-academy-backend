
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Question } from '@/types/quiz';

interface QuestionFormProps {
  question: Question;
  questionIndex: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onOptionUpdate: (optionIndex: number, value: string) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  questionIndex,
  onUpdate,
  onDelete,
  onOptionUpdate
}) => {
  return (
    <div className="bg-white border-2 border-blue-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-blue-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
              {questionIndex + 1}
            </div>
            <h4 className="text-xl font-semibold text-gray-800">Question {questionIndex + 1}</h4>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300 rounded-xl"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Question Type</Label>
          <Select
            value={question.type}
            onValueChange={(value: 'multiple-choice' | 'true-false') => 
              onUpdate({ 
                type: value,
                options: value === 'true-false' ? undefined : ['', '', '', ''],
                correctAnswer: value === 'true-false' ? true : 0
              })
            }
          >
            <SelectTrigger className="h-14 rounded-2xl border-gray-300 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="true-false">True/False</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Question Text</Label>
          <Textarea
            value={question.question}
            onChange={(e) => onUpdate({ question: e.target.value })}
            placeholder="Enter your question here..."
            rows={4}
            className="rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
          />
        </div>

        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Answer Options</Label>
            <div className="space-y-4">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      value={option}
                      onChange={(e) => onOptionUpdate(optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="h-14 rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                    <input
                      type="radio"
                      name={`correct-${questionIndex}`}
                      checked={question.correctAnswer === optionIndex}
                      onChange={() => onUpdate({ correctAnswer: optionIndex })}
                      className="text-blue-600 focus:ring-blue-500 w-5 h-5"
                    />
                    <Label className="text-sm font-medium text-gray-600 cursor-pointer">Correct</Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Correct Answer</Label>
            <Select
              value={String(question.correctAnswer)}
              onValueChange={(value) => onUpdate({ correctAnswer: value === 'true' })}
            >
              <SelectTrigger className="h-14 rounded-2xl border-gray-300 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Explanation (Optional)</Label>
          <Textarea
            value={question.explanation || ''}
            onChange={(e) => onUpdate({ explanation: e.target.value })}
            placeholder="Explain why this is the correct answer..."
            rows={3}
            className="rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
