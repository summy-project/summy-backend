import { BaseDTO } from "src/common/base/dto/base.dto";

export class CreateSettingDto extends BaseDTO {
  productName: string;

  productVersion: string;

  productDescription: string;

  allowSignup: boolean;

  hasEnabled: boolean;
}
