import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { AuthService } from "src/auth/auth.service";

@Injectable()
export class BaseGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    // 检查当前请求是否标记为公开（无需认证），公开则直接通过。
    // 用了 @NoAuthRequired 标记的接口，且里面没有传递参数的话，就是这个。
    const noAuthRequired = this.reflector.get<boolean>(
      "noAuthRequired",
      context.getHandler()
    );

    // 当 @NoAuthRequired 参数是 { allowNoVisitor:true } 的时候，metadata 是这个，
    // 也就是说，不需要认证游客身份。
    const noAuthAndNoVisitorRequired = this.reflector.get<boolean>(
      "noAuthAndNoVisitorRequired",
      context.getHandler()
    );

    // 公开访问，且不需要游客身份（用于项目初始化或者其他不需要游客身份的地方）
    if (noAuthAndNoVisitorRequired) {
      return true;
    }

    // 没有认证头并且标记为公开，则赋予一个游客的用户信息。
    if (noAuthRequired && !authorizationHeader) {
      // 缺少认证头的时候，就说明是游客。
      const visitorData = await this.authService.getVisitorUserInfo();
      if (visitorData) {
        request.userData = visitorData;
        return true;
      } else {
        throw new HttpException(
          "游客信息不存在。",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    if (!authorizationHeader) {
      throw new HttpException("缺少认证头。", HttpStatus.UNAUTHORIZED);
    }

    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer" || !token) {
      throw new HttpException("认证头格式错误。", HttpStatus.UNAUTHORIZED);
    }

    try {
      const userData = await this.authService.validateToken(token);
      if (userData) {
        request.userData = userData; // 假设 validateToken 方法用于验证并返回用户信息
        return true;
      } else {
        throw new HttpException(
          "用户信息不存在。",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      throw new HttpException("无效或过期的令牌。", HttpStatus.UNAUTHORIZED);
    }
  }
}
