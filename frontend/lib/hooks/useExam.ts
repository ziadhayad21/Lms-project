'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { examApi } from '@/lib/api/exams.api';
import type { Exam, ExamResult, SubmitExamPayload } from '@/types';

export function useExam(courseId: string, examId: string) {
  const [exam,         setExam]         = useState<Exam | null>(null);
  const [answers,      setAnswers]      = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [result,       setResult]       = useState<ExamResult | null>(null);
  const [error,        setError]        = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    setLoading(true);
    examApi
      .getExam(courseId, examId)
      .then((res) => {
        setExam(res.data.exam);
        setAttemptCount(res.data.attemptCount ?? 0);
        startTime.current = Date.now();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId, examId]);

  const selectAnswer = useCallback((questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentIndex((i) => (exam ? Math.min(i + 1, exam.questions.length - 1) : i));
  }, [exam]);

  const prevQuestion = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const submit = useCallback(async (forced = false) => {
    if (!exam) return;

    if (!forced) {
      const unanswered = exam.questions.filter((q) => answers[q._id] === undefined).length;
      if (unanswered > 0) {
        const ok = window.confirm(`${unanswered} question(s) unanswered. Submit anyway?`);
        if (!ok) return;
      }
    }

    setSubmitting(true);
    setError('');
    try {
      const payload: SubmitExamPayload = {
        answers: exam.questions.map((q) => ({
          questionId:          q._id,
          selectedOptionIndex: answers[q._id] ?? -1,
        })),
        timeTakenSeconds: Math.round((Date.now() - startTime.current) / 1000),
      };
      const res = await examApi.submitExam(courseId, examId, payload);
      setResult(res.data.result);
    } catch (e: any) {
      setError(e.message ?? 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  }, [exam, answers, courseId, examId]);

  const reset = useCallback(() => {
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);
    startTime.current = Date.now();
  }, []);

  return {
    exam,
    answers,
    currentIndex,
    currentQuestion: exam?.questions[currentIndex] ?? null,
    loading,
    submitting,
    result,
    error,
    attemptCount,
    answeredCount:   Object.keys(answers).length,
    canRetry: exam
      ? exam.maxAttempts === -1 || attemptCount + 1 < exam.maxAttempts
      : false,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submit,
    reset,
  };
}
