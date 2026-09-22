import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    const request: Request = context.getRequest();
    const response: Response = context.getResponse();

    const httpStatus: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      code: httpStatus,
      status: false,
      message: exception.response?.message || exception.message || 'Internal server error',
      path: httpAdapter.getRequestUrl(request),
    };

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}