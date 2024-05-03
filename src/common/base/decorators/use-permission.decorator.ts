// 给路由添加权限验证修饰器

import { SetMetadata } from "@nestjs/common";

export interface PermissionMenu {
  menuName?: string;
}

export const UsePermissionMenu = (options: PermissionMenu = {}) => {
  const permissionMenuValue = options.menuName;
  return SetMetadata("PermissionMenuIs", permissionMenuValue);
};
