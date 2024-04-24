import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { Response } from "express";
import { HttpException } from "@nestjs/common";

/**
 * 一个基础的异常过滤器类，捕获并处理 NestJS 中的异常。
 * @extends ExceptionFilter 基于 NestJS 的异常过滤器接口。
 */
@Catch()
export class BaseFilter implements ExceptionFilter {
  private readonly logger = new Logger(BaseFilter.name);

  /**
   * 捕获并处理异常。
   * @param exception 未知的异常对象，可能是 NestJS 的 HttpException 或其他自定义异常。
   * @param host 异常发生时的上下文环境，可以从中获取请求和响应对象。
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // 转换上下文为 HTTP 上下文，并获取响应对象
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 初始化异常响应的基本属性
    let status: number;
    let message: string;
    let data: Record<string, any> | undefined;

    // 如果异常是 NestJS 的 HttpException，则从中获取状态码和消息
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      data = exception.getResponse() as Record<string, any>;
    } else {
      // 如果异常不是 NestJS 的 HttpException，则默认为服务器内部错误
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "服务器开了点小差，请稍候再试～";
    }
    this.logger.error(exception);

    // 根据异常信息设置响应状态码和内容
    response.status(status).json({
      status: "fail",
      message: message,
      data: data?.data || null,
      timestamp: new Date().toISOString()
    });
  }
}
