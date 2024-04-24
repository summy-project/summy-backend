import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from "@nestjs/common";

/**
 * CheckAdminGuard 类用于激活请求的守卫，确保只有系统管理员可以访问特定接口。
 */
@Injectable()
export class CheckAdminGuard implements CanActivate {
  /**
   * canActivate方法用于判断当前请求是否可以被激活。
   * @param context 执行上下文，用于获取当前请求等信息。
   * @returns 返回一个布尔值，true 表示请求可以继续，false表示请求应该被终止。
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userData = request.userData;

    // 检查用户信息是否存在
    if (!userData) {
      throw new HttpException(
        "用户信息缺失.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // 解码用户角色以获取权限列表
    const { roleIds } = userData;

    if (roleIds && roleIds.length > 0) {
      // 检查用户是否有管理员权限
      if (roleIds.includes("admin") || roleIds.includes("root")) {
        return true;
      } else {
        throw new HttpException(
          "仅系统管理员可以访问这个接口！",
          HttpStatus.FORBIDDEN
        );
      }
    } else {
      throw new HttpException(
        "用户角色没有被定义。",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // return true;
  }
}
