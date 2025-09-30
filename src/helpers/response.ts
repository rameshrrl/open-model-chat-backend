export type ApiResponse<T = any> = {
  status: boolean;
  message: string;
  data?: T | null;
  error?:any
};

export const generateResponse = <T>(
  message: string,
  status: boolean = false,
  data: T | null = null
): ApiResponse<T> => ({
  status,
  message,
  [status ? 'data' : 'error']: data,
});