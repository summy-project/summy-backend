import config from "src/config";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";

import { UserService } from "../user/user.service";
import { InviteCodeService } from "src/user/invite-code/invite-code.service";
import { RoleService } from "src/user/role/role.service";

// import { ClassTransformer } from "class-transformer";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { SetupDto } from "./dto/setup.dto";
import { MenuService } from "src/system/menu/menu.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private menuService: MenuService,
    private roleService: RoleService,
    private jwtService: JwtService,
    private inviteCodeService: InviteCodeService
  ) {}

  /**
   * 用户登录。
   * @param loginDto 包含用户ID和密码的对象。
   * @returns 返回经过 JWT 签名的用户令牌。
   * @throws 当用户不存在或密码错误时，抛出 HTTP 异常。
   */
  async signIn(loginDto: LoginDto) {
    if (loginDto.userId === "visitor") {
      throw new HttpException("游客用户不能登录", HttpStatus.BAD_REQUEST);
    }

    const userData = await this.userService.findOne(loginDto.userId);

    if (userData) {
      const hasPasswordOK = await argon2.verify(
        userData.password,
        loginDto.password
      );

      if (hasPasswordOK) {
        if (userData.status === "2") {
          throw new HttpException("用户已被禁用。", HttpStatus.FORBIDDEN);
        }

        // 被标记为逻辑删除的用户也是不能登录的。
        if (userData.hasDeleted) {
          throw new HttpException("用户名或密码错误。", HttpStatus.FORBIDDEN);
        }

        const token = await this.jwtService.signAsync({
          userId: userData.id,
          createdTime: userData.createdTime
        });

        const menuData = await this.menuService.findMyMenu(userData);

        return {
          token,
          userData,
          menuData
        };
      } else {
        throw new HttpException("用户名或密码错误。", HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException("用户名或密码错误。", HttpStatus.FORBIDDEN);
    }
  }

  /**
   * 注册用户
   * @param signupDto 注册 DTO
   * @returns 注册结果
   * @throws 抛出 HTTP 异常。
   */
  async signUp(signupDto: SignupDto) {
    if (!config.allowSignup) {
      throw new HttpException("当前配置不允许注册。", HttpStatus.FORBIDDEN);
    }

    if (!config.allowSignUpAdmin) {
      if (
        signupDto.roleIds.includes("root") ||
        signupDto.roleIds.includes("admin")
      ) {
        throw new HttpException(
          "当前配置不允许直接注册管理员。",
          HttpStatus.FORBIDDEN
        );
      }
    }

    // 检查用户是否已存在
    const userExists = await this.userService.checkUserExists(signupDto.id);
    if (userExists) {
      throw new HttpException("用户已存在。", HttpStatus.CONFLICT);
    }

    const userData = await this.userService.create(signupDto);
    let inviteData = null;

    // 配置了邀请码注册的情况下，验证邀请码是否存在并使用
    if (config.signUpWithInviteCode) {
      const inviteCodeExists = await this.inviteCodeService.findOne(
        signupDto.inviteCode
      );
      if (!inviteCodeExists) {
        throw new HttpException("邀请码不存在", HttpStatus.BAD_REQUEST);
      }
      inviteData = await this.inviteCodeService.useInviteCode(
        signupDto.inviteCode,
        signupDto.id
      );
    }

    return { userData, inviteData };
  }

  async setupProject(setupDto: SetupDto) {
    if (!config.allowSignUpRole) {
      throw new HttpException("当前配置不允许注册角色。", HttpStatus.FORBIDDEN);
    }
    if (!config.allowSignUpAdmin) {
      throw new HttpException(
        "当前配置不允许直接注册管理员。",
        HttpStatus.FORBIDDEN
      );
    }
    const roles = await this.roleService.batchCreate(setupDto.roles);

    const createUsers = [setupDto.userData, setupDto.visitorData];
    const userData = await this.userService.batchCreate(createUsers);
    const menus = await this.menuService.batchCreate(setupDto.menus);

    return {
      userData,
      roles,
      menus
    };
  }

  /**
   * 获取游客的登录信息，以便在未认证的状态下使用。
   * @returns 游客用户登录信息。
   */
  async getVisitorUserInfo() {
    const visitor = await this.userService.findOne("visitor");
    return visitor;
  }

  /**
   * 验证令牌的有效性。
   * @param token 用户的令牌。
   * @returns 通过验证的用户信息。
   * @throws 当 JWT 密钥配置不正确时，抛出内部服务器错误。
   * @throws 当令牌无效或已过期时，抛出未授权错误。
   * @throws 当没有找到对应用户时，抛出未找到错误。
   */
  async validateToken(token: string) {
    try {
      const secretKey = config.jwt.secretKey;

      if (!secretKey || secretKey === "") {
        throw new HttpException(
          "JWT 密钥配置不正确",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const decodedToken = this.jwtService.verify(token, { secret: secretKey });

      if (!decodedToken) {
        throw new HttpException("令牌无效或已过期。", HttpStatus.UNAUTHORIZED);
      }

      const { userId } = decodedToken;

      const userData = await this.userService.findOne(userId);

      if (!userData) {
        throw new HttpException("没有该用户。", HttpStatus.NOT_FOUND);
      }

      return userData;
    } catch (error) {
      throw new HttpException("令牌无效。", HttpStatus.UNAUTHORIZED);
    }
  }
}
