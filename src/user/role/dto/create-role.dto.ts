import { BaseDTO } from "src/common/base/dto/base.dto";

export class CreateRoleDto extends BaseDTO {
  roleName: string;
  codeType: string;
}
