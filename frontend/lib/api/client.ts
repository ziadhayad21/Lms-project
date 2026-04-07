import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000; // Large video uploads can take several minutes

/** Client whose response interceptor returns `response.data` (unwrapped). */
export type ApiClient = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  request<T = unknown>(config: AxiosRequestConfig): Promise<T>;
  interceptors: ReturnType<typeof axios.create>['interceptors'];
};

const rawClient = axios.create({
  baseURL:         BASE_URL,
  withCredentials: true,           // Send HTTP-only cookie on every request
  timeout:         30_000,
  // Removed default Content-Type to let Axios handle FormData boundaries automatically
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
rawClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
rawClient.interceptors.response.use(
  (response: AxiosResponse) => response.data, // Unwrap .data automatically
  (error: AxiosError<{ message: string; status: string }>) => {
    const message =
      error.response?.data?.message
      ?? (error.code === 'ECONNABORTED' ? 'Upload timed out. Please try again with a smaller file or a faster connection.' : undefined)
      ?? (error.message === 'Network Error' ? 'Network error while contacting the server. Check server availability and CORS settings.' : undefined)
      ?? error.message
      ?? 'An unexpected error occurred.';
    const statusCode = error.response?.status;

    // Redirect to login on 401 (client-side only)
    if (statusCode === 401 && typeof window !== 'undefined') {
      const isLoginPage = window.location.pathname.startsWith('/login');
      if (!isLoginPage) {
        window.location.href = '/login';
        return Promise.reject({ message, statusCode });
      }
    }



    return Promise.reject({ message, statusCode });
  }
);

export const apiClient = rawClient as unknown as ApiClient;

// ─── Multipart Helper ────────────────────────────────────────────────────────
export const apiUpload = <T = unknown>(
  url: string,
  formData: FormData,
  method: 'post' | 'patch' = 'post'
) =>
  apiClient.request<T>({
    method,
    url,
    data: formData,
    timeout: UPLOAD_TIMEOUT_MS,
    headers: { 'Content-Type': 'multipart/form-data' }, // Specific header that axios knows how to handle with boundaries
  });
