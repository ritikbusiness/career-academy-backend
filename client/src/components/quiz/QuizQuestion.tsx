
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Question } from '@/types/quiz';

interface QuizQuestionProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | number | boolean | undefined;
  onAnswerSelect: (answer: string | number | boolean) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
            {questionIndex + 1}
          </div>
          <div>
            <div className="text-sm font-medium text-blue-600">
              Question {questionIndex + 1} of {totalQuestions}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {question.type === 'multiple-choice' ? 'Multiple Choice' : 'True or False'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed mb-8">
          {question.question}
        </h2>
        
        {/* Multiple Choice Options */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswerSelect(index)}
                className={`w-full p-6 text-left border-2 rounded-2xl transition-all duration-300 group ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-gray-800 font-medium text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* True/False Options */}
        {question.type === 'true-false' && (
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'True', value: true, color: 'emerald' },
              { label: 'False', value: false, color: 'rose' }
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => onAnswerSelect(option.value)}
                className={`p-8 text-center border-2 rounded-2xl transition-all duration-300 group ${
                  selectedAnswer === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg shadow-${option.color}-100`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    selectedAnswer === option.value
                      ? `border-${option.color}-500 bg-${option.color}-500`
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {selectedAnswer === option.value && (
                      <CheckCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <span className="text-xl font-semibold text-gray-800">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
