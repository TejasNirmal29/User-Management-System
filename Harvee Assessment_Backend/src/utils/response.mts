import { Response } from "express";
import MESSAGES from "@constants/message.mts";

// Interfaces for type safety
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    details?: any;
  };
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

// Utility class for handling HTTP responses
class HttpResponse {
  private static isProduction = process.env.NODE_ENV === "production";

  // Private method for error handling
  private static error(
    res: Response,
    statusCode: number,
    message: string,
    details?: any
  ): void {
    const responseDetails = this.isProduction ? undefined : details;

    // Log the error
    console.error({ statusCode, message, details });

    // Send error response
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message,
        details: responseDetails,
      },
    };

    res.status(statusCode).json(errorResponse);
  }

  // Private method for success handling
  private static success<T>(
    res: Response,
    data: T,
    message: string,
    statusCode: number
  ): void {
    const successResponse: SuccessResponse<T> = {
      success: true,
      message,
      data,
    };

    res.status(statusCode).json(successResponse);
  }

  // Public helper for success responses
  public static ok<T>(res: Response, data: T, message: string): void {
    this.success(res, data, message, 200);
  }

  public static created<T>(res: Response, data: T, message: string): void {
    this.success(res, data, message, 201);
  }

  // Public helpers for common error status codes
  public static badRequest(
    res: Response,
    message = MESSAGES.ERROR.BAD_REQUEST,
    details?: any
  ): void {
    this.error(res, 400, message, details);
  }

  public static unauthorized(
    res: Response,
    message = MESSAGES.ERROR.UNAUTHORIZED,
    details?: any
  ): void {
    this.error(res, 401, message, details);
  }

  public static forbidden(
    res: Response,
    message = "Forbidden",
    details?: any
  ): void {
    this.error(res, 403, message, details);
  }

  public static notFound(
    res: Response,
    message = "Not Found",
    details?: any
  ): void {
    this.error(res, 404, message, details);
  }

  public static conflict(
    res: Response,
    message = "Conflict",
    details?: any
  ): void {
    this.error(res, 409, message, details);
  }

  public static internalServerError(
    res: Response,
    message = MESSAGES.ERROR.SERVER_ERROR,
    details?: any
  ): void {
    this.error(res, 500, message, details);
  }

  // Public helper for validation errors
  public static validationError(res: Response, errors: any): void {
    this.error(res, 422, "Validation Failed", errors);
  }
}

export default HttpResponse;
