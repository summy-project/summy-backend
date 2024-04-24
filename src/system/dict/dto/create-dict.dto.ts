import { BaseDTO } from "src/common/base/dto/base.dto";

export class CreateDictDto extends BaseDTO {
  dictType: string;
  name: string;
  value: string;
}
