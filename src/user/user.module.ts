import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./entities/user.entity";
import { RoleModule } from "./role/role.module";
import { InviteCodeModule } from "./invite-code/invite-code.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, InviteCodeModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
