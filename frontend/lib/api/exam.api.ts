import { apiClient } from './client';
import type { Exam, ExamResult, ApiSuccess, CreateExamPayload, SubmitExamPayload } from '@/types';

interface ExamsResponse extends ApiSuccess<{ exams: Exam[] }> {}
interface ExamResponse extends ApiSuccess<{ exam: Exam; attemptCount: number }> {}
interface SubmitResponse extends ApiSuccess<{ result: any }> {} // simplified result for now

export const examApi = {
  getGlobalExams: (): Promise<ExamsResponse> =>
    apiClient.get('/exams'),

  getCourseExams: (courseId: string): Promise<ExamsResponse> =>

    apiClient.get(`/courses/${courseId}/exams`),

  getExam: (courseId: string, examId: string): Promise<ExamResponse> =>
    apiClient.get(`/courses/${courseId}/exams/${examId}`),

  getExamFull: (courseId: string, examId: string): Promise<ApiSuccess<{ exam: Exam }>> =>
    apiClient.get(`/courses/${courseId}/exams/${examId}/full`),

  createExam: (payload: CreateExamPayload, courseId?: string): Promise<ApiSuccess<{ exam: Exam }>> =>
    courseId 
      ? apiClient.post(`/courses/${courseId}/exams`, payload)
      : apiClient.post(`/exams`, payload),

  getExam: (examId: string): Promise<ExamResponse> =>
    apiClient.get(`/exams/${examId}`),

  submitExam: (examId: string, payload: SubmitExamPayload): Promise<SubmitResponse> =>
    apiClient.post(`/exams/${examId}/submit`, payload),

};
