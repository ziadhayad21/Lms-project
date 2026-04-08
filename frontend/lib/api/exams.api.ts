import { apiClient } from './client';
import type { Exam, ExamResult, ApiSuccess, CreateExamPayload, SubmitExamPayload } from '@/types';

interface ExamsResponse  extends ApiSuccess<{ exams: Exam[]       }> {}
interface ExamResponse   extends ApiSuccess<{ exam: Exam; attemptCount?: number }> {}
interface ResultResponse extends ApiSuccess<{ result: ExamResult }> {}

export const examApi = {
  // ─── Global Exams ──────────────────────────────────────────────────────────
  getGlobalExams: (): Promise<ExamsResponse> =>
    apiClient.get('/exams'),

  getExamById: (examId: string): Promise<ExamResponse> =>
    apiClient.get(`/exams/${examId}`),

  createGlobalExam: (payload: CreateExamPayload): Promise<ExamResponse> =>
    apiClient.post('/exams', payload),

  submitExam: (examId: string, payload: SubmitExamPayload): Promise<ResultResponse> =>
    apiClient.post(`/exams/${examId}/submit`, payload),

  // ─── Course Exams ──────────────────────────────────────────────────────────
  getCourseExams: (courseId: string): Promise<ExamsResponse> =>
    apiClient.get(`/courses/${courseId}/exams`),

  getCourseExam: (courseId: string, examId: string): Promise<ExamResponse> =>
    apiClient.get(`/courses/${courseId}/exams/${examId}`),

  getCourseExamFull: (courseId: string, examId: string): Promise<ExamResponse> =>
    apiClient.get(`/courses/${courseId}/exams/${examId}/full`),

  createCourseExam: (courseId: string, payload: CreateExamPayload): Promise<ExamResponse> =>
    apiClient.post(`/courses/${courseId}/exams`, payload),

  updateCourseExam: (courseId: string, examId: string, payload: Partial<CreateExamPayload>): Promise<ExamResponse> =>
    apiClient.patch(`/courses/${courseId}/exams/${examId}`, payload),

  deleteCourseExam: (courseId: string, examId: string): Promise<void> =>
    apiClient.delete(`/courses/${courseId}/exams/${examId}`),

  submitCourseExam: (courseId: string, examId: string, payload: SubmitExamPayload): Promise<ResultResponse> =>
    apiClient.post(`/courses/${courseId}/exams/${examId}/submit`, payload),

  // ─── Compatibility Aliases ────────────────────────────────────────────────
  // These are kept to avoid breaking existing code until refactored
  getExam: (examId: string): Promise<ExamResponse> =>
    apiClient.get(`/exams/${examId}`),

  createExam: (payload: CreateExamPayload, courseId?: string): Promise<ExamResponse> =>
    courseId 
      ? apiClient.post(`/courses/${courseId}/exams`, payload)
      : apiClient.post(`/exams`, payload),
};
