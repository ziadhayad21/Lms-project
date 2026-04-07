'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';

interface Props {
  totalMinutes: number;
  onTimeUp:     () => void;
}

export default function ExamTimer({ totalMinutes, onTimeUp }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(totalMinutes * 60);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp; // Always latest without causing re-renders

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Defer so state update completes before callback fires
          setTimeout(() => onTimeUpRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Mount only — intentional

  const totalSeconds = totalMinutes * 60;
  const pct          = (secondsLeft / totalSeconds) * 100;
  const minutes      = Math.floor(secondsLeft / 60);
  const seconds      = secondsLeft % 60;
  const isDanger     = pct <= 10;
  const isWarning    = pct <= 25 && !isDanger;

  return (
    <div
      className={clsx(
        'flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold transition-colors select-none',
        isDanger
          ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
          : isWarning
          ? 'bg-amber-50 border-amber-200 text-amber-600'
          : 'bg-slate-50 border-slate-200 text-slate-700'
      )}
      role="timer"
      aria-label={`Time remaining: ${minutes} minutes and ${seconds} seconds`}
    >
      <svg
        className={clsx('w-4 h-4 shrink-0', isDanger && 'animate-spin-slow')}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
