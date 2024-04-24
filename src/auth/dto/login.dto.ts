import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  password: string;
}
