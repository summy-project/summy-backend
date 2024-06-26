import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseGuards
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from "@nestjs/swagger";

import { DictService } from "./dict.service";

import { DictFilterDto } from "./dto/dict-filter.dto";
import { CreateDictDto } from "./dto/create-dict.dto";
import { UpdateDictDto } from "./dto/update-dict.dto";

import { UsePermissionMenu } from "src/common/base/decorators/use-permission.decorator";
import { CheckAdminGuard } from "src/common/base/guards/check-admin.guard";

// 字典管理控制器
@ApiTags("字典管理")
@Controller("system/dict")
export class DictController {
  constructor(private readonly dictService: DictService) {}

  // 创建一个字典
  @ApiOperation({ summary: "创建一个字典" })
  @Post("create")
  @UseGuards(CheckAdminGuard)
  create(@Body() createDictDto: CreateDictDto) {
    // 调用服务创建字典
    return this.dictService.create(createDictDto);
  }

  // 获取字典列表
  @ApiOperation({ summary: "获取字典列表" })
  @ApiBody({ type: DictFilterDto })
  @Post("findAll")
  @UsePermissionMenu({ menuName: "dict_manage" })
  findAll(@Body() dictFilterDto: DictFilterDto) {
    // 调用服务获取所有字典
    return this.dictService.findAll(dictFilterDto);
  }

  // 获取单一字典信息
  @ApiOperation({ summary: "获取单一字典信息" })
  @ApiQuery({ name: "id", description: "字典ID" })
  @Get("findOne")
  @UsePermissionMenu({ menuName: "dict_manage" })
  findOne(@Query() query: { id: string }) {
    // 根据ID调用服务获取单个字典信息
    return this.dictService.findOne(query.id);
  }

  // 更新字典信息
  @ApiOperation({ summary: "更新字典信息" })
  @Post("update")
  @UseGuards(CheckAdminGuard)
  update(@Body() updateDictDto: UpdateDictDto) {
    // 根据ID和更新数据调用服务更新字典信息
    return this.dictService.update(updateDictDto);
  }

  // 删除字典
  @ApiOperation({ summary: "删除字典" })
  @ApiQuery({ name: "id", description: "字典ID" })
  @Delete("delete")
  @UseGuards(CheckAdminGuard)
  remove(@Query() query: { id: string }) {
    // 根据ID调用服务删除字典
    return this.dictService.delete(query.id);
  }

  // 获取一类字典信息
  @ApiOperation({ summary: "获取一类字典信息" })
  @ApiQuery({ name: "type", description: "字典类型" })
  @Get("findDictValue")
  findDictValue(@Query() query: { type: string }) {
    // 查出所有 type 为 dictType 值的字典
    return this.dictService.findDictValue(query.type);
  }
}
