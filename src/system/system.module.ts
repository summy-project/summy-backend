import { Module } from "@nestjs/common";
import { MenuModule } from "./menu/menu.module";
import { DictModule } from "./dict/dict.module";
import { SettingsModule } from "./settings/settings.module";

@Module({
  imports: [MenuModule, DictModule, SettingsModule]
})
export class SystemModule {}
