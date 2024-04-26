import { BaseDTO } from "src/common/base/dto/base.dto";

export class CreateMenuDto extends BaseDTO {
  // 名称
  name: string;

  // 代号
  code: string;

  // 电脑端图标
  pcIcon: string;

  // 移动端图标
  mobileIcon: string;

  // 排序
  sort: number;

  // 父级
  parentId: string;

  // 路由地址（电脑端）
  pcRoute: string;

  // 路由地址（移动端）
  mobileRoute: string;

  // 权限
  roleIds: string[];
}
