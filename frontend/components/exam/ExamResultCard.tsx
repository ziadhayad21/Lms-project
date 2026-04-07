'use client';

import Link from 'next/link';
import clsx from 'clsx';

interface ResultSummary {
  score:          number;
  passed:         boolean;
  correctAnswers: number;
  totalQuestions: number;
  earnedPoints:   number;
  totalPoints:    number;
  attemptNumber:  number;
  passingScore:   number;
}

interface Props {
  result:     ResultSummary;
  examTitle:  string;
  courseId:   string;
  onRetry:    () => void;
  canRetry:   boolean;
}

function StatTile({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 text-center">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={clsx('text-xl font-bold font-display', highlight ? 'text-primary-600' : 'text-slate-800')}>
        {value}
      </p>
    </div>
  );
}

export default function ExamResultCard({ result, examTitle, courseId, onRetry, canRetry }: Props) {
  const { score, passed, correctAnswers, totalQuestions, earnedPoints, totalPoints, attemptNumber, passingScore } = result;

  // Determine emoji & message based on score
  const emoji   = passed ? (score >= 90 ? '🏆' : '🎉') : score >= passingScore - 10 ? '📝' : '💪';
  const message = passed
    ? score >= 90 ? 'Outstanding work!' : 'Well done!'
    : 'Keep practicing!';

  return (
    <div className="max-w-lg mx-auto animate-slide-up">
      <div className="card p-8 text-center space-y-6">
        {/* Result Icon */}
        <div className={clsx(
          'inline-flex items-center justify-center w-24 h-24 rounded-full text-5xl mx-auto',
          passed ? 'bg-green-50' : 'bg-slate-100'
        )}>
          {emoji}
        </div>

        {/* Headline */}
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">{message}</h2>
          <p className="text-slate-400 text-sm mt-1">{examTitle} · Attempt #{attemptNumber}</p>
        </div>

        {/* Score Arc Visual */}
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 120 80" className="w-48 h-32">
            {/* Background arc */}
            <path
              d="M 10 70 A 50 50 0 0 1 110 70"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Score arc — draw proportionally */}
            <path
              d="M 10 70 A 50 50 0 0 1 110 70"
              fill="none"
              stroke={passed ? '#4f46e5' : '#f59e0b'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 157} 157`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute bottom-2 text-center">
            <p className={clsx('text-4xl font-bold font-display', passed ? 'text-primary-600' : 'text-amber-600')}>
              {score}%
            </p>
            <p className="text-xs text-slate-400">Your score</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <StatTile label="Status"         value={passed ? 'Passed ✅' : 'Failed ❌'} highlight={passed} />
          <StatTile label="Passing Score"  value={`${passingScore}%`} />
          <StatTile label="Correct"        value={`${correctAnswers} / ${totalQuestions}`} />
          <StatTile label="Points Earned"  value={`${earnedPoints} / ${totalPoints}`} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/student/courses/${courseId}`}
            className="btn-secondary flex-1 justify-center"
          >
            ← Back to Course
          </Link>
          {!passed && canRetry && (
            <button onClick={onRetry} className="btn-primary flex-1 justify-center">
              Try Again →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
