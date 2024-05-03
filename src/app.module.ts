import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import config from "./config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { BaseGuard } from "./common/base/guards/base.guard";
import { BaseInterceptor } from "./common/base/interceptors/base.interceptor";
import { BaseFilter } from "./common/base/filters/base.filter";

import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { SystemModule } from "./system/system.module";
import { MenuModule } from "./system/menu/menu.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: config.database.host,
      username: config.database.user,
      password: config.database.password,
      database: config.database.dbName,
      entities: [__dirname + "/**/*.entity{.js,.ts}"],
      port: config.database.port,
      synchronize: true,
      logging: ["error", "warn", "query"]
    }),
    AuthModule,
    UserModule,
    MenuModule,
    SystemModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: BaseGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: BaseInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: BaseFilter
    }
  ]
})
export class AppModule {}
