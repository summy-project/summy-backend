import { CreateUserDto } from "src/user/dto/create-user.dto";
import { CreateRoleDto } from "src/user/role/dto/create-role.dto";

export class SetupDto {
  userData: CreateUserDto;
  visitorData: CreateUserDto;
  roles: CreateRoleDto[];
}
