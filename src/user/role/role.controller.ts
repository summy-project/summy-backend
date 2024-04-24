import { Controller, Get, Post, Body, Delete, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from "@nestjs/swagger";

import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { FindSomeRolesDto } from "./dto/find-some-roles.dto";

@Controller("user/role")
@ApiTags("角色管理")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 创建一个角色
   * @param createRoleDto 角色创建信息对象
   * @returns 创建的角色信息
   */
  @ApiOperation({ summary: "创建一个角色" })
  @Post("create")
  @ApiBody({ type: CreateRoleDto })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  /**
   * 获取角色列表
   * @returns 角色列表
   */
  @ApiOperation({ summary: "获取角色列表" })
  @Get("findAll")
  findAll() {
    return this.roleService.findAll();
  }

  /**
   * 获取单一角色信息
   * @param id 角色ID
   * @returns 找到的角色信息
   */
  @ApiOperation({ summary: "获取单一角色信息" })
  @ApiQuery({ name: "id", description: "角色ID" })
  @Get("findOne")
  findOne(@Query() query: { id: string }) {
    return this.roleService.findOne(query.id);
  }

  /**
   * 更新角色信息
   * @param updateRoleDto 更新的角色信息对象
   * @returns 更新后的角色信息
   */
  @ApiOperation({ summary: "更新角色信息" })
  @ApiBody({ type: UpdateRoleDto })
  @Post("update")
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  /**
   * 删除角色
   * @param id 角色ID
   * @returns 删除操作的结果
   */
  @ApiOperation({ summary: "删除角色" })
  @ApiQuery({ name: "id", description: "角色ID" })
  @Delete("delete")
  remove(@Query() query: { id: string }) {
    return this.roleService.delete(query.id);
  }

  /**
   * 根据 POST 的 roleIds 查出所有符合条件的角色信息
   */
  /**
   * 更新角色信息
   * @param updateRoleDto 更新的角色信息对象
   * @returns 更新后的角色信息
   */
  @ApiOperation({ summary: "更新角色信息" })
  @ApiBody({ type: FindSomeRolesDto })
  @Post("findSomeByIds")
  findSomeByIds(@Body() findSomeRolesDto: FindSomeRolesDto) {
    return this.roleService.findSomeByIds(findSomeRolesDto.roleIds);
  }
}
