'use client';

import clsx from 'clsx';
import type { Question } from '@/types';

interface Props {
  question:       Question;
  questionNumber: number;
  selectedOption: number | null;
  onSelect:       (index: number) => void;
  disabled?:      boolean;
  showCorrect?:   boolean; // highlight correct answer after submission
}

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuestionCard({
  question,
  questionNumber,
  selectedOption,
  onSelect,
  disabled = false,
  showCorrect = false,
}: Props) {
  return (
    <div className="card p-6 md:p-8 space-y-5">
      {/* Question Text */}
      <div className="flex items-start gap-4">
        <span className="shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
          {questionNumber}
        </span>
        <div className="flex-1">
          <p className="text-slate-800 font-semibold text-base leading-relaxed">
            {question.questionText}
          </p>
          {question.points > 1 && (
            <p className="text-xs text-slate-400 mt-1">{question.points} points</p>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2.5 pl-12">
        {question.options.map((option, i) => {
          const isSelected = selectedOption === i;
          const isCorrect  = showCorrect && question.correctOptionIndex === i;
          const isWrong    = showCorrect && isSelected && !isCorrect;

          return (
            <button
              key={i}
              onClick={() => !disabled && onSelect(i)}
              disabled={disabled}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                disabled && 'cursor-default',
                // Correct answer shown
                isCorrect
                  ? 'border-green-400 bg-green-50 text-green-800'
                  : isWrong
                  ? 'border-red-400 bg-red-50 text-red-800'
                  : isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-slate-50'
              )}
            >
              {/* Letter Badge */}
              <span
                className={clsx(
                  'shrink-0 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center',
                  isCorrect
                    ? 'bg-green-500 text-white'
                    : isWrong
                    ? 'bg-red-500 text-white'
                    : isSelected
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                )}
              >
                {optionLetters[i]}
              </span>

              <span className="flex-1">{option}</span>

              {/* Check / X icon */}
              {isCorrect && <span className="shrink-0 text-green-600 font-bold">✓</span>}
              {isWrong   && <span className="shrink-0 text-red-600 font-bold">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after review) */}
      {showCorrect && question.explanation && (
        <div className="pl-12">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
            <p className="font-semibold mb-0.5">💡 Explanation</p>
            <p className="leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
