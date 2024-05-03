import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from "@nestjs/swagger";

import { UsePermissionMenu } from "src/common/base/decorators/use-permission.decorator";

import { CheckAdminGuard } from "src/common/base/guards/check-admin.guard";

import { UserService } from "./user.service";

import { UserFilterDto } from "./dto/user-filter.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
@ApiTags("用户管理")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 新增用户
   * @param createUserDto 用户创建信息对象
   * @returns 创建的用户信息
   */
  @ApiOperation({ summary: "新增用户" })
  @Post("create")
  @ApiBody({ type: CreateUserDto })
  @UseGuards(CheckAdminGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * 查询所有用户信息
   * @returns 所有用户信息列表
   */

  @UsePermissionMenu({ menuName: "user_manage" })
  @Post("findAll")
  findAll(@Body() userFilterDto: UserFilterDto = {}) {
    return this.userService.findAll(userFilterDto);
  }

  /**
   * 获取单一用户信息（不包含密码）
   * @param id 用户ID
   * @returns 指定ID的用户信息
   */
  @ApiOperation({ summary: "获取单一用户信息" })
  @ApiQuery({ name: "id", description: "用户ID" })
  @Get("findOne")
  @UseGuards(CheckAdminGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Query() query: { id: string }) {
    return this.userService.findOne(query.id);
  }

  /**
   * 更新用户信息
   * @param updateUserDto 用户更新信息对象
   * @returns 更新后的用户信息
   */
  @Post("update")
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(CheckAdminGuard)
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除操作的结果
   */
  @ApiOperation({ summary: "删除用户" })
  @ApiQuery({ name: "id", description: "用户ID" })
  @Delete("delete")
  @UseGuards(CheckAdminGuard)
  delete(@Query() query: { id: string }) {
    return this.userService.delete(query.id);
  }

  /**
   * 逻辑删除一个用户，即将 status 改为 3，这样默认查不出来。
   * @param id
   * @returns 删除操作的结果
   */
  @ApiOperation({
    summary: "逻辑删除一个用户，即将 status 改为 3，这样默认查不出来。"
  })
  @ApiQuery({ name: "id", description: "用户ID" })
  @Post("remove")
  @UseGuards(CheckAdminGuard)
  logicalRemove(@Query() query: { id: string }) {
    return this.userService.logicalRemove(query.id);
  }

  /**
   * 统计用户总数及每个角色对应的用户数量
   * @returns 用户总数及每个角色的用户数量统计结果
   */
  @ApiOperation({ summary: "统计用户总数及每个角色对应的用户数量" })
  @Get("countUserAndRoles")
  count() {
    return this.userService.countUserAndRoles();
  }
}
