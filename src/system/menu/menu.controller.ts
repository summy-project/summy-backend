import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";

import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";

import { NoAuthRequired } from "src/common/base/decorators/no-auth.decorator";
import { UsePermissionMenu } from "src/common/base/decorators/use-permission.decorator";
import { CheckAdminGuard } from "src/common/base/guards/check-admin.guard";

// 菜单管理控制器
@ApiTags("菜单管理")
@Controller("system/menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // 创建一个菜单
  @ApiOperation({ summary: "创建一个菜单" })
  @Post("create")
  @UseGuards(CheckAdminGuard)
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  // 获取菜单列表
  @ApiOperation({ summary: "获取菜单列表，返回树结构" })
  @UsePermissionMenu({ menuName: "menu_manage" })
  @Get("findAll")
  findAll() {
    return this.menuService.findAll();
  }

  // 返回我这个身份应该获得的菜单
  @ApiOperation({ summary: "返回我这个身份应该获得的菜单" })
  @Get("findMyMenu")
  @NoAuthRequired()
  findMyMenu(@Req() request: Record<string, any>) {
    const { userData } = request;
    return this.menuService.findMyMenu(userData);
  }

  // 根据输入的菜单名字，找出这个菜单的所有角色
  @ApiOperation({
    summary:
      "根据输入的菜单名字，找出这个菜单的所有角色，注意：不能使用菜单大类，要输入具体的菜单名字。"
  })
  @Get("findRolesByMenuName")
  @ApiQuery({ name: "name", description: "菜单名字" })
  @UsePermissionMenu({ menuName: "menu_manage" })
  findRolesByMenuName(@Query() query: { name: string }) {
    return this.menuService.findRolesByMenuName(query.name);
  }

  @ApiOperation({ summary: "获取单一菜单信息" })
  @ApiQuery({ name: "id", description: "菜单ID" })
  @Get("findOne")
  @UsePermissionMenu({ menuName: "menu_manage" })
  findOne(@Query() query: { id: string }) {
    return this.menuService.findOne(query.id);
  }

  // 更新菜单信息
  @ApiOperation({ summary: "更新菜单信息" })
  @Post("update")
  @UseGuards(CheckAdminGuard)
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto);
  }

  // 删除菜单
  @ApiOperation({ summary: "删除菜单" })
  @ApiQuery({ name: "id", description: "菜单ID" })
  @Delete("delete")
  @UseGuards(CheckAdminGuard)
  delete(@Query() query: { id: string }) {
    return this.menuService.delete(query.id);
  }
}
