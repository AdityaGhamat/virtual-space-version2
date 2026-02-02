import { Response } from "express";

export function SuccessResponse(
  res: Response,
  status_code: number,
  data?: any,
  message?: string,
  error?: any
) {
  return res.status(status_code).json({
    success: true,
    active: true,
    data: data ? data : {},
    message: message ? message : "Successfully completed request",
    error: {
      message: error ? error.message : "",
    },
  });
}

export function ErrorResponse(
  res: Response,
  status_code: number,
  data?: any,
  message?: string,
  error?: any
) {
  return res.status(status_code).json({
    success: false,
    active: false,
    data: data ? data : {},
    message: message ? message : "Failed the request",
    error: error ? error.message : "error request is failed",
  });
}
