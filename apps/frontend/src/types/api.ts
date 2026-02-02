export interface IApiResponse<T> {
  success: boolean;
  active: boolean;
  data: any | T;
  message: string;
  error: string;
}
