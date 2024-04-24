import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class BaseInterceptor implements NestInterceptor {
  /**
   * 拦截请求，并对响应进行统一处理。
   * @param context 执行上下文，提供了当前请求的相关信息。
   * @param next 下一个中间件或处理器的调用。
   * @returns 返回一个 Observable，包含经过统一处理后的响应数据。
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        status: "success",
        message: "操作成功!",
        data: data || null,
        timestamp: new Date().toISOString()
      }))
    );
  }
}
