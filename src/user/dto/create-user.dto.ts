import { BaseDTO } from "src/common/base/dto/base.dto";

export class CreateUserDto extends BaseDTO {
  // 用户名
  userName: string;

  // 密码
  password: string;

  // 电话号码
  phone: string;

  // 电子邮件
  mail: string;

  // 实名
  realName: string;

  // 性别，1 为男性，2为女性，0为未知
  gender: string;

  // 生日
  birthDay: Date;

  // 状态值，1 为正常，2 为禁用，3 为删除。
  userStatus: string;

  // 头像
  avatarUrl: string;

  // 权限
  roleIds: string[];
}
