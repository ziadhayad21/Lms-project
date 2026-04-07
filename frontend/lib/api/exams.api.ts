import { apiClient } from './client';
import type { Exam, ExamResult, CreateExamPayload, SubmitExamPayload, ApiSuccess } from '@/types';

interface ExamsResponse  extends ApiSuccess<{ exams: any[]      }> {}
interface ExamResponse   extends ApiSuccess<{ exam: Exam; attemptCount?: number }> {}
interface ResultResponse extends ApiSuccess<{ result: ExamResult }> {}

export const examApi = {
  list: (courseId: string): Promise<ExamsResponse> =>
    apiClient.get(`/courses/${courseId}/exams`),

  getExam: (courseId: string, examId: string): Promise<ExamResponse> =>
    apiClient.get(`/courses/${courseId}/exams/${examId}`),

  getExamFull: (courseId: string, examId: string): Promise<ExamResponse> =>
    apiClient.get(`/courses/${courseId}/exams/${examId}/full`),

  create: (courseId: string, payload: CreateExamPayload): Promise<ExamResponse> =>
    apiClient.post(`/courses/${courseId}/exams`, payload),

  update: (courseId: string, examId: string, payload: Partial<CreateExamPayload>): Promise<ExamResponse> =>
    apiClient.patch(`/courses/${courseId}/exams/${examId}`, payload),

  delete: (courseId: string, examId: string): Promise<void> =>
    apiClient.delete(`/courses/${courseId}/exams/${examId}`),

  submitExam: (courseId: string, examId: string, payload: SubmitExamPayload): Promise<ResultResponse> =>
    apiClient.post(`/courses/${courseId}/exams/${examId}/submit`, payload),
};
