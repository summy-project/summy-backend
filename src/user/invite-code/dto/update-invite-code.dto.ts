import { PartialType } from "@nestjs/swagger";
import { CreateInviteCodeDto } from "./create-invite-code.dto";

export class UpdateInviteCodeDto extends PartialType(CreateInviteCodeDto) {}
