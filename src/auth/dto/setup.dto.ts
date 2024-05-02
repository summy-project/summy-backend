import { CreateUserDto } from "src/user/dto/create-user.dto";
import { CreateRoleDto } from "src/user/role/dto/create-role.dto";
import { CreateMenuDto } from "src/system/menu/dto/create-menu.dto";
export class SetupDto {
  userData: CreateUserDto;
  visitorData: CreateUserDto;
  roles: CreateRoleDto[];
  menus: CreateMenuDto[];
}
