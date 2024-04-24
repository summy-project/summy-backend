import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { NoAuthRequired } from "src/common/no-auth.decorator";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { SetupDto } from "./dto/setup.dto";

// import { CreateRoleDto } from "src/user/role/dto/create-role.dto";

@ApiTags("登录鉴权")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "登录系统" })
  @NoAuthRequired() // 允许公开访问
  @Post("login")
  @UseInterceptors(ClassSerializerInterceptor) // 响应数据脱敏
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @ApiOperation({ summary: "注册系统" })
  @NoAuthRequired() // 允许公开访问
  @Post("signup")
  @UseInterceptors(ClassSerializerInterceptor) // 响应数据脱敏
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @ApiOperation({
    summary: "初始化用户和角色",
    description:
      "只有项目新创建及配置文件中允许初始化的时候才可以用，如果要重置项目，请删除重建数据库，然后再使用这个接口。"
  })
  @NoAuthRequired({ allowNoVisitor: true }) // 允许公开访问，且不赋予游客身份。
  @Post("setupProject")
  setupProject(@Body() setupDto: SetupDto) {
    return this.authService.setupProject(setupDto);
  }
}
