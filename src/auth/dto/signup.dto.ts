import { CreateUserDto } from "src/user/dto/create-user.dto";

export class SignupDto extends CreateUserDto {
  inviteCode: string;
}
