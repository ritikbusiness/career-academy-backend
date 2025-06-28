
import React from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  timeRemaining: number;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ timeRemaining }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isUrgent = timeRemaining <= 300; // 5 minutes

  return (
    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 ${
      isUrgent 
        ? 'bg-red-50 text-red-700 border-2 border-red-200' 
        : 'bg-blue-50 text-blue-700 border-2 border-blue-200'
    }`}>
      <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-blue-600'}`} />
      <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
      <span className="text-sm font-medium">remaining</span>
    </div>
  );
};

export default QuizTimer;
