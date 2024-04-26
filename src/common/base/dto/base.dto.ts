import { IsNotEmpty, IsString } from "class-validator";

export abstract class BaseDTO {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  createdTime: Date;

  updatedTime: Date;
  createdBy: string;
  updatedBy: string;
  status: string;
  hasDeleted: boolean;
  remark: string;
}
