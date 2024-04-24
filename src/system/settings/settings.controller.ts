import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseGuards
} from "@nestjs/common";

import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";

import { CheckAdminGuard } from "src/common/base/guards/check-admin.guard";
import { SettingsService } from "./settings.service";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";

@ApiTags("系统设置")
@Controller("system/settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: "创建一个设置" })
  @Post("create")
  @UseGuards(CheckAdminGuard)
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @ApiOperation({ summary: "获取设置列表" })
  @Get("findAll")
  // @UseGuards(CheckAdminGuard)
  findAll() {
    return this.settingsService.findAll();
  }

  @ApiOperation({ summary: "获取单一设置信息" })
  @ApiQuery({ name: "id", description: "设置ID" })
  @Get("findOne")
  findOne(@Query() query: { id: string }) {
    return this.settingsService.findOne(query.id);
  }

  @ApiOperation({ summary: "更新设置信息" })
  @UseGuards(CheckAdminGuard)
  @Post("update")
  update(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(updateSettingDto);
  }

  @ApiOperation({ summary: "删除设置" })
  @ApiQuery({ name: "id", description: "设置ID" })
  @UseGuards(CheckAdminGuard)
  @Delete("delete")
  remove(@Query() query: { id: string }) {
    return this.settingsService.delete(query.id);
  }

  @ApiOperation({ summary: "获得默认被启用的设置" })
  @Get("getDefault")
  getDefault() {
    return this.settingsService.findEnabled();
  }

  @ApiOperation({ summary: "启用一个设置，并且禁用掉现有的" })
  @ApiQuery({ name: "id", description: "设置ID" })
  @Post("setDefault")
  @UseGuards(CheckAdminGuard)
  setDefault(@Query() query: { id: string }) {
    return this.settingsService.setDefault(query.id);
  }
}
