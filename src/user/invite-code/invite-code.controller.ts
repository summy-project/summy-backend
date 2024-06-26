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

import { InviteCodeService } from "./invite-code.service";

import { InviteCodeFilterDto } from "./dto/invite-code-filter.dto";
import { CreateInviteCodeDto } from "./dto/create-invite-code.dto";
import { UpdateInviteCodeDto } from "./dto/update-invite-code.dto";

import { UsePermissionMenu } from "src/common/base/decorators/use-permission.decorator";
import { CheckAdminGuard } from "src/common/base/guards/check-admin.guard";

@Controller("user/invite-code")
@ApiTags("邀请码管理")
export class InviteCodeController {
  constructor(private readonly inviteCodeService: InviteCodeService) {}

  /**
   * 创建一个邀请码
   * @param createInviteCodeDto 邀请码创建信息对象
   * @returns 创建的邀请码信息
   */
  @ApiOperation({ summary: "创建一个邀请码" })
  @Post("create")
  @UsePermissionMenu({ menuName: "invite_code" })
  create(@Body() createInviteCodeDto: CreateInviteCodeDto) {
    return this.inviteCodeService.create(createInviteCodeDto);
  }

  /**
   * 获取邀请码列表
   * @returns 邀请码列表
   */
  @ApiOperation({ summary: "获取邀请码列表" })
  @ApiBody({ type: InviteCodeFilterDto })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("findAll")
  @UsePermissionMenu({ menuName: "invite_code" })
  findAll(@Body() inviteCodeFilterDto: InviteCodeFilterDto) {
    return this.inviteCodeService.findAll(inviteCodeFilterDto);
  }

  /**
   * 获取单一邀请码信息
   * @param id 邀请码ID
   * @returns 找到的邀请码信息
   */
  @ApiOperation({ summary: "获取单一邀请码信息" })
  @ApiQuery({ name: "id", description: "邀请码ID" })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("findOne")
  @UsePermissionMenu({ menuName: "invite_code" })
  findOne(@Query() query: { id: string }) {
    return this.inviteCodeService.findOne(query.id);
  }

  /**
   * 更新邀请码信息
   * @param updateInviteCodeDto 更新的邀请码信息对象
   * @returns 更新后的邀请码信息
   */
  @ApiOperation({ summary: "更新邀请码信息" })
  @Post("update")
  @UseGuards(CheckAdminGuard)
  update(@Body() updateInviteCodeDto: UpdateInviteCodeDto) {
    return this.inviteCodeService.update(updateInviteCodeDto);
  }

  /**
   * 删除邀请码
   * @param id 邀请码ID
   * @returns 删除操作的结果
   */
  @ApiOperation({ summary: "删除邀请码" })
  @ApiQuery({ name: "id", description: "邀请码ID" })
  @Delete("delete")
  @UseGuards(CheckAdminGuard)
  remove(@Query() query: { id: string }) {
    return this.inviteCodeService.delete(query.id);
  }
}
