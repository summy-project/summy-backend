import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InviteCodeService } from "./invite-code.service";
import { InviteCodeController } from "./invite-code.controller";
import { InviteCode } from "./entities/invite-code.entity";
import { UserModule } from "../user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([InviteCode]),
    forwardRef(() => UserModule)
  ],
  controllers: [InviteCodeController],
  providers: [InviteCodeService],
  exports: [InviteCodeService]
})
export class InviteCodeModule {}
