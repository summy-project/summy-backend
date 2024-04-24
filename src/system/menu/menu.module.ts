import { Module } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menu } from "./entities/menu.entity";

import { RoleModule } from "src/user/role/role.module";
@Module({
  imports: [TypeOrmModule.forFeature([Menu]), RoleModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService]
})
export class MenuModule {}
