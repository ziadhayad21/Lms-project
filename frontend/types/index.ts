// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'teacher' | 'admin';
export type UserStatus = 'pending' | 'active';

export interface User {
  _id:             string;
  name:            string;
  email:           string;
  role:            UserRole;
  status:          UserStatus;
  level?:          string;
  avatar?:         string;
  avatarUrl?:      string;
  enrolledCourses: string[];
  isActive:        boolean;
  lastLogin?:      string;
  createdAt:       string;
  updatedAt:       string;
}

// ─── Course ───────────────────────────────────────────────────────────────────

export type CourseLevel    = 
  | 'أولى إعدادي' 
  | 'تانية إعدادي' 
  | 'تالتة إعدادي' 
  | 'أولى ثانوي' 
  | 'تانية ثانوي' 
  | 'تالتة ثانوي';
export type CourseCategory =
  | 'grammar' | 'speaking' | 'writing'
  | 'reading' | 'listening' | 'vocabulary' | 'general';

export interface Course {
  _id:             string;
  title:           string;
  description:     string;
  thumbnail?:      string;
  thumbnailUrl?:   string;
  level:           CourseLevel;
  category:        CourseCategory;
  language:        string;
  tags:            string[];
  teacher:         User | string;
  isPublished:     boolean;
  enrollmentCount: number;
  totalDuration:   number;
  lessons:         Lesson[];
  materials:       Material[];
  exams:           Exam[];
  createdAt:       string;
  updatedAt:       string;
}

// ─── Lesson ───────────────────────────────────────────────────────────────────

export interface VideoFile {
  filename:     string;
  originalName: string;
  path:         string;
  size:         number;
  mimetype:     string;
  duration?:    number;
}

export interface Lesson {
  _id:            string;
  title:          string;
  description?:   string;
  level?:         string;
  course:         string;
  teacher:        string;
  videoFile?:     VideoFile;
  videoUrl?:      string;
  order:          number;
  isPreview:      boolean;
  isPublished:    boolean;
  transcriptText?: string;
  createdAt:      string;
}

// ─── Material ─────────────────────────────────────────────────────────────────

export interface MaterialFile {
  filename:     string;
  originalName: string;
  path:         string;
  size:         number;
  mimetype:     string;
}

export interface Material {
  _id:           string;
  title:         string;
  description?:  string;
  course:        string;
  teacher:       string;
  file:          MaterialFile;
  type:          'pdf' | 'doc' | 'image' | 'audio' | 'other';
  downloadCount: number;
  isPublished:   boolean;
  createdAt:     string;
}

// ─── Exam ─────────────────────────────────────────────────────────────────────

export interface QuestionOption {
  text: string;
}

export interface Question {
  _id:                  string;
  type?:                'multiple-choice' | 'essay';
  questionText:         string;
  questionImage?:       string;
  options:              string[];
  points:               number;
  explanation?:         string;
  correctOptionIndex?:  number; // Only present for teachers
}

export interface Exam {
  _id:                string;
  title:              string;
  description?:       string;
  course?:            string;
  level?:             CourseLevel;
  teacher:            string;
  questions:          Question[];
  timeLimit?:         number;
  passingScore:       number;
  maxAttempts:        number;
  shuffleQuestions:   boolean;
  shuffleOptions:     boolean;
  showCorrectAnswers: boolean;
  isPublished:        boolean;
  availableFrom?:     string;
  availableUntil?:    string;
  createdAt:          string;
}

// ─── Result ───────────────────────────────────────────────────────────────────

export interface AnswerRecord {
  questionId:          string;
  selectedOptionIndex?: number;
  essayAnswer?:        string;
  isCorrect:           boolean;
  pointsEarned:        number;
}


export interface ExamResult {
  _id:              string;
  student:          User | string;
  exam:             Exam | string;
  course:           Course | string;
  answers:          AnswerRecord[];
  score:            number;
  totalPoints:      number;
  earnedPoints:     number;
  totalQuestions:   number;
  correctAnswers:   number;
  passed:           boolean;
  timeTakenSeconds: number;
  attemptNumber:    number;
  completedAt:      string;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface CompletedLesson {
  lesson:           string;
  completedAt:      string;
  watchTimeSeconds: number;
}

export interface Progress {
  _id:                  string;
  student:              string;
  course:               Course;
  completedLessons:     CompletedLesson[];
  downloadedMaterials:  Array<{ material: string; downloadedAt: string }>;
  completionPercentage: number;
  lastAccessed:         string;
  isCompleted:          boolean;
  completedAt?:         string;
  bestExamResult?:      ExamResult | null;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  status: 'success';
  data:   T;
  meta?: {
    page:         number;
    limit:        number;
    total:        number;
    totalPages:   number;
    hasNextPage:  boolean;
    hasPrevPage:  boolean;
  };
}

export interface ApiError {
  status:  'fail' | 'error';
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Form Payloads ────────────────────────────────────────────────────────────

export interface RegisterPayload {
  name:      string;
  email:     string;
  password:  string;
  level?:    string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface CreateCoursePayload {
  title:       string;
  description: string;
  level:       CourseLevel;
  category?:   CourseCategory;
  tags?:       string[];
}

export interface CreateLessonPayload {
  title:          string;
  description?:   string;
  level?:         string;
  order?:         number;
  isPreview?:     boolean;
  videoUrl?:      string;
}

export interface CreateExamPayload {
  title:              string;
  description?:       string;
  level?:             CourseLevel;
  questions:          Omit<Question, '_id'>[];
  timeLimit?:         number;
  passingScore?:      number;
  maxAttempts?:       number;
  shuffleQuestions?:  boolean;
  shuffleOptions?:    boolean;
  showCorrectAnswers?: boolean;
}

export interface SubmitExamPayload {
  answers:           Array<{ questionId: string; selectedOptionIndex?: number; essayAnswer?: string }>;
  timeTakenSeconds?: number;
}

