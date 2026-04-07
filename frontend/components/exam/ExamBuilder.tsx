'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { examApi } from '@/lib/api/exams.api';
import type { CreateExamPayload, Question } from '@/types';
import clsx from 'clsx';

interface QuestionDraft {
  id:                 string; // local draft id
  questionText:       string;
  options:            string[];
  correctOptionIndex: number;
  explanation:        string;
  points:             number;
}

const blankQuestion = (): QuestionDraft => ({
  id:                 crypto.randomUUID(),
  questionText:       '',
  options:            ['', '', '', ''],
  correctOptionIndex: 0,
  explanation:        '',
  points:             1,
});

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

interface Props { courseId: string }

export default function ExamBuilder({ courseId }: Props) {
  const router = useRouter();

  // Exam-level state
  const [title,        setTitle]        = useState('');
  const [description,  setDescription]  = useState('');
  const [timeLimit,    setTimeLimit]    = useState('');
  const [passingScore, setPassingScore] = useState('60');
  const [maxAttempts,  setMaxAttempts]  = useState('3');
  const [shuffle,      setShuffle]      = useState(false);

  // Questions state
  const [questions, setQuestions] = useState<QuestionDraft[]>([blankQuestion()]);
  const [expanded,  setExpanded]  = useState<string>(questions[0].id);

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  // ─── Question Mutations ───────────────────────────────────────────────────

  const updateQuestion = useCallback((id: string, patch: Partial<QuestionDraft>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }, []);

  const updateOption = useCallback((qId: string, optIdx: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const options = [...q.options];
        options[optIdx] = value;
        return { ...q, options };
      })
    );
  }, []);

  const addOption = useCallback((qId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId && q.options.length < 6
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    );
  }, []);

  const removeOption = useCallback((qId: string, optIdx: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || q.options.length <= 2) return q;
        const options = q.options.filter((_, i) => i !== optIdx);
        const correctOptionIndex =
          q.correctOptionIndex >= options.length
            ? options.length - 1
            : q.correctOptionIndex;
        return { ...q, options, correctOptionIndex };
      })
    );
  }, []);

  const addQuestion = useCallback(() => {
    const q = blankQuestion();
    setQuestions((prev) => [...prev, q]);
    setExpanded(q.id);
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      if (prev.length === 1) return prev; // Must keep at least one
      const next = prev.filter((q) => q.id !== id);
      setExpanded(next[next.length - 1]?.id ?? '');
      return next;
    });
  }, []);

  const moveQuestion = useCallback((id: string, dir: 'up' | 'down') => {
    setQuestions((prev) => {
      const idx  = prev.findIndex((q) => q.id === id);
      const next = [...prev];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  // ─── Validation ───────────────────────────────────────────────────────────

  const validate = (): string => {
    if (!title.trim())         return 'Exam title is required.';
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim())               return `Question ${i + 1}: question text is required.`;
      if (q.options.some((o) => !o.trim()))     return `Question ${i + 1}: all options must be filled in.`;
      if (q.correctOptionIndex >= q.options.length) return `Question ${i + 1}: correct answer selection is invalid.`;
    }
    return '';
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (publish: boolean) => {
    const err = validate();
    if (err) { setError(err); return; }

    setSaving(true);
    setError('');
    try {
      const payload: CreateExamPayload = {
        title:            title.trim(),
        description:      description.trim() || undefined,
        timeLimit:        timeLimit ? parseInt(timeLimit, 10) : undefined,
        passingScore:     parseInt(passingScore, 10),
        maxAttempts:      parseInt(maxAttempts, 10),
        shuffleQuestions: shuffle,
        isPublished:      publish,
        questions:        questions.map(({ id, ...q }) => ({
          questionText:       q.questionText.trim(),
          options:            q.options.map((o) => o.trim()),
          correctOptionIndex: q.correctOptionIndex,
          explanation:        q.explanation.trim() || undefined,
          points:             q.points,
        })),
      } as any;

      await examApi.create(courseId, payload);
      router.push(`/teacher/courses/${courseId}`);
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? 'Failed to save exam.');
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ── Exam Settings ── */}
      <div className="card p-6 space-y-5">
        <h2 className="section-title">Exam Settings</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Exam Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="e.g. Grammar Unit 3 Quiz"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field resize-none"
            rows={2}
            placeholder="Optional description shown to students"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="input-field"
              placeholder="None"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Passing Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Max Attempts (-1 = unlimited)
            </label>
            <input
              type="number"
              min="-1"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={shuffle}
            onChange={(e) => setShuffle(e.target.checked)}
            className="w-4 h-4 rounded accent-primary-600"
          />
          <span className="text-sm text-slate-700">Shuffle question order for each student</span>
        </label>
      </div>

      {/* ── Questions ── */}
      <div className="space-y-3">
        {questions.map((q, qi) => (
          <QuestionAccordion
            key={q.id}
            question={q}
            index={qi}
            total={questions.length}
            isExpanded={expanded === q.id}
            onToggle={() => setExpanded((p) => (p === q.id ? '' : q.id))}
            onUpdate={(patch) => updateQuestion(q.id, patch)}
            onOptionChange={(oi, val) => updateOption(q.id, oi, val)}
            onAddOption={() => addOption(q.id)}
            onRemoveOption={(oi) => removeOption(q.id, oi)}
            onRemove={() => removeQuestion(q.id)}
            onMoveUp={() => moveQuestion(q.id, 'up')}
            onMoveDown={() => moveQuestion(q.id, 'down')}
          />
        ))}

        <button
          onClick={addQuestion}
          className="btn-secondary w-full py-3 border-dashed"
        >
          + Add Question
        </button>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          onClick={() => handleSubmit(false)}
          disabled={saving}
          className="btn-secondary"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </span>
          ) : (
            'Publish Exam'
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Sub-component: Question Accordion ───────────────────────────────────────

interface AccordionProps {
  question:       QuestionDraft;
  index:          number;
  total:          number;
  isExpanded:     boolean;
  onToggle:       () => void;
  onUpdate:       (patch: Partial<QuestionDraft>) => void;
  onOptionChange: (optIdx: number, value: string) => void;
  onAddOption:    () => void;
  onRemoveOption: (optIdx: number) => void;
  onRemove:       () => void;
  onMoveUp:       () => void;
  onMoveDown:     () => void;
}

function QuestionAccordion({
  question, index, total, isExpanded, onToggle,
  onUpdate, onOptionChange, onAddOption, onRemoveOption, onRemove,
  onMoveUp, onMoveDown,
}: AccordionProps) {
  const hasText = question.questionText.trim().length > 0;

  return (
    <div className={clsx('card overflow-hidden transition-shadow', isExpanded && 'shadow-md')}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
        onClick={onToggle}
      >
        <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
          {index + 1}
        </span>
        <p className={clsx('flex-1 text-sm truncate', hasText ? 'text-slate-800 font-medium' : 'text-slate-400 italic')}>
          {hasText ? question.questionText : 'Untitled question — click to edit'}
        </p>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-500 text-xs"
            title="Move up"
          >↑</button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-500 text-xs"
            title="Move down"
          >↓</button>
          {total > 1 && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors text-xs ml-1"
              title="Remove question"
            >✕</button>
          )}
        </div>
        <svg
          className={clsx('w-4 h-4 text-slate-400 transition-transform shrink-0', isExpanded && 'rotate-180')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="px-5 pb-6 space-y-5 border-t border-slate-100">
          {/* Question Text */}
          <div className="pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Question Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={question.questionText}
              onChange={(e) => onUpdate({ questionText: e.target.value })}
              className="input-field resize-none"
              rows={3}
              placeholder="Enter your question here…"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Answer Options <span className="text-red-500">*</span>
              <span className="text-slate-400 font-normal ml-1">(select the correct one)</span>
            </label>
            <div className="space-y-2">
              {question.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  {/* Correct answer radio */}
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctOptionIndex === oi}
                    onChange={() => onUpdate({ correctOptionIndex: oi })}
                    className="w-4 h-4 accent-primary-600 shrink-0 cursor-pointer"
                    title="Mark as correct answer"
                  />
                  <span
                    className={clsx(
                      'shrink-0 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center',
                      question.correctOptionIndex === oi
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {optionLetters[oi]}
                  </span>
                  <input
                    value={opt}
                    onChange={(e) => onOptionChange(oi, e.target.value)}
                    className="input-field flex-1 py-2.5"
                    placeholder={`Option ${optionLetters[oi]}`}
                  />
                  {question.options.length > 2 && (
                    <button
                      onClick={() => onRemoveOption(oi)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      title="Remove option"
                    >✕</button>
                  )}
                </div>
              ))}
            </div>
            {question.options.length < 6 && (
              <button
                onClick={onAddOption}
                className="mt-2 text-sm text-primary-600 hover:underline font-medium"
              >
                + Add option
              </button>
            )}
          </div>

          {/* Footer row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Points for this question
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={question.points}
                onChange={(e) => onUpdate({ points: parseInt(e.target.value, 10) || 1 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Explanation (shown after completion)
              </label>
              <input
                value={question.explanation}
                onChange={(e) => onUpdate({ explanation: e.target.value })}
                className="input-field"
                placeholder="Optional explanation…"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
