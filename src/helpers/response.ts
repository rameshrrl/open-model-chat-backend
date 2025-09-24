export type ApiResponse<T = any> = {
  status: boolean;
  message: string;
  response: T | null;
};

export const generateResponse = <T>(
  message: string,
  status: boolean = false,
  data: T | null = null
): ApiResponse<T> => ({
  status,
  message,
  response: data,
});