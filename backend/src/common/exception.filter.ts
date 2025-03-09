import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request: Request = ctx.getRequest<Request>();
        const response: Response = ctx.getResponse<Response>();

        // Determine the status code.
        const status = exception instanceof HttpException ? exception.getStatus() : 500;

        // Get error response message.
        const errorResponse = exception instanceof HttpException ? exception.getResponse() : exception;

        // Log the error details.
        this.logger.error(`HTTP Status: ${status} Error Message: ${JSON.stringify(errorResponse)}`, exception instanceof Error ? exception.stack : '');

        // Send back a response.
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: errorResponse,
        });
    }
}
