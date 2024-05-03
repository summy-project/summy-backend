import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { intersects } from "radash";

import { AuthService } from "src/auth/auth.service";
import { MenuService } from "src/system/menu/menu.service";

@Injectable()
export class BaseGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly menuService: MenuService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    // 检查当前请求是否标记为公开（无需认证），公开则直接通过。
    // 用了 @NoAuthRequired 标记的接口，且里面没有传递参数的话，就是这个。
    const noAuthRequired = this.reflector.get<string>(
      "noAuthRequired",
      context.getHandler()
    );

    // 检测是否有使用 @UsePermissionMenu 标记的接口。
    const usePermissionMenu = this.reflector.get<string>(
      "PermissionMenuIs",
      context.getHandler()
    );

    // 公开访问，且不需要游客身份（用于项目初始化或者其他不需要游客身份的地方）
    if (noAuthRequired === "allowNoVisitor") {
      return true;
    }

    // 设置用户数据
    let userData: Record<string, any>;

    // 没有认证头，并且标记为公开或者使用权限菜单控制的接口，赋予游客身份
    if (!authorizationHeader) {
      if (noAuthRequired && usePermissionMenu) {
        throw new HttpException(
          "公开接口和权限菜单接口不允许同时存在，请检查后端代码。",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else if (noAuthRequired || usePermissionMenu) {
        // 缺少认证头的时候，就说明是游客。
        userData = await this.authService.getVisitorUserInfo();

        if (userData) {
          request.userData = userData;
        } else {
          throw new HttpException(
            "游客信息不存在。",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      } else {
        throw new HttpException("缺少认证头。", HttpStatus.UNAUTHORIZED);
      }
    } else {
      const [type, token] = authorizationHeader.split(" ");

      if (type !== "Bearer" || !token) {
        throw new HttpException("认证头格式错误。", HttpStatus.UNAUTHORIZED);
      }

      try {
        userData = await this.authService.validateToken(token);

        if (userData) {
          request.userData = userData; // 假设 validateToken 方法用于验证并返回用户信息
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

    if (usePermissionMenu) {
      // 解码用户角色以获取权限列表
      const userRolesArray = userData.roleIds;

      if (!userRolesArray || userRolesArray.length === 0) {
        throw new HttpException(
          "用户角色没有被定义。",
          HttpStatus.UNAUTHORIZED
        );
      }

      const menuRolesArray =
        await this.menuService.findRolesByMenuName(usePermissionMenu);

      // 寻找用户和菜单权限的交集
      const intersectionBetweenUserAndMenu = intersects(
        userRolesArray,
        menuRolesArray
      );

      // 如果用户权限和菜单权限之间没有就报错。
      if (!intersectionBetweenUserAndMenu) {
        throw new HttpException(
          "用户没有权限访问该菜单.",
          HttpStatus.UNAUTHORIZED
        );
      }
    }

    return true;
  }
}
