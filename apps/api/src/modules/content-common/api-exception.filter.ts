import {
  Catch,
  HttpException,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { isDatabaseUnavailableError } from "./database-error.js";
import {
  ContentApiError,
  ContentNotFoundError,
  DatabaseUnavailableError,
  InternalError,
} from "./errors.js";

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._-]{8,64}$/;

interface ErrorPayload {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
}

function isSafeRequestId(value: unknown): value is string {
  return typeof value === "string" && REQUEST_ID_PATTERN.test(value);
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const requestId = isSafeRequestId(request.requestId)
      ? request.requestId
      : randomUUID();

    const error = this.toContentApiError(exception, requestId);

    const payload: ErrorPayload = {
      error: {
        code: error.code,
        message: error.message,
      },
      requestId,
    };

    if (error.details !== undefined) {
      payload.error.details = error.details;
    }

    response.status(error.status).json(payload);
  }

  private toContentApiError(
    exception: unknown,
    requestId: string,
  ): ContentApiError {
    if (exception instanceof ContentApiError) {
      return exception;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      if (status === 404) {
        return new ContentNotFoundError();
      }

      if (status >= 500) {
        this.logger.error(`[${requestId}] INTERNAL_ERROR`);
        return new InternalError();
      }

      return new ContentApiError(
        status,
        "REQUEST_ERROR",
        "Request could not be processed.",
      );
    }

    if (isDatabaseUnavailableError(exception)) {
      this.logger.warn(`[${requestId}] DATABASE_UNAVAILABLE`);
      return new DatabaseUnavailableError();
    }

    this.logger.error(`[${requestId}] INTERNAL_ERROR`);

    return new InternalError();
  }
}
