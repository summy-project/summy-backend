import config from "src/config";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { RoleModule } from "src/user/role/role.module";
import { InviteCodeModule } from "src/user/invite-code/invite-code.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: config.jwt.secretKey,
        signOptions: { expiresIn: config.jwt.expiresIn }
      })
    }),
    InviteCodeModule,
    UserModule,
    RoleModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
