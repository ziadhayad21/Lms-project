import { apiClient, apiUpload } from './client';
import type { Lesson, CreateLessonPayload, ApiSuccess } from '@/types';

interface LessonsResponse extends ApiSuccess<{ lessons: Lesson[] }> {}
interface LessonResponse  extends ApiSuccess<{ lesson:  Lesson    }> {}

export const lessonApi = {
  list: (courseId: string): Promise<LessonsResponse> =>
    apiClient.get(`/courses/${courseId}/lessons`),

  getLesson: (courseId: string, lessonId: string): Promise<LessonResponse> =>
    apiClient.get(`/courses/${courseId}/lessons/${lessonId}`),

  listAll: (): Promise<LessonsResponse> =>
    apiClient.get('/lessons'),

  create: (courseId: string, payload: CreateLessonPayload, videoFile?: File, pdfFile?: File): Promise<LessonResponse> => {
    if (videoFile || pdfFile) {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, String(v));
      });
      if (videoFile) fd.append('video', videoFile);
      if (pdfFile)   fd.append('pdf', pdfFile);
      return apiUpload<LessonResponse>(`/courses/${courseId}/lessons`, fd);
    }
    return apiClient.post(`/courses/${courseId}/lessons`, payload);
  },

  createAcademic: (payload: CreateLessonPayload, videoFile?: File, pdfFile?: File): Promise<LessonResponse> => {
    if (videoFile || pdfFile) {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, String(v));
      });
      if (videoFile) fd.append('video', videoFile);
      if (pdfFile)   fd.append('pdf', pdfFile);
      return apiUpload<LessonResponse>('/lessons', fd);
    }
    return apiClient.post('/lessons', payload);
  },

  update: (courseId: string, lessonId: string, payload: Partial<CreateLessonPayload>, videoFile?: File, pdfFile?: File): Promise<LessonResponse> => {
    if (videoFile || pdfFile) {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, String(v));
      });
      if (videoFile) fd.append('video', videoFile);
      if (pdfFile)   fd.append('pdf', pdfFile);
      return apiUpload<LessonResponse>(`/courses/${courseId}/lessons/${lessonId}`, fd, 'patch');
    }
    return apiClient.patch(`/courses/${courseId}/lessons/${lessonId}`, payload);
  },

  delete: (courseId: string, lessonId: string): Promise<void> =>
    apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`),

  completeLesson: (
    courseId: string,
    lessonId: string,
    watchTimeSeconds = 0,
    totalDurationSeconds = 0,
    watchedRanges: Array<{ start: number; end: number }> = [],
  ): Promise<ApiSuccess<any>> =>
    apiClient.post(`/courses/${courseId}/lessons/${lessonId}/complete`, {
      watchTimeSeconds,
      totalDurationSeconds,
      watchedRanges,
    }),
};
