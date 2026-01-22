/**
 * Common API Response Interface
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
