// 这里的常量有一部分是前端和 Nest 后端公用的，如果要改前后端要同时改。
import type { SelectDataType } from "src/types";

// 项目里不可删的用户。
// 游客是最基本的角色，因此不能删除。
export const RESERVED_USERS = ["visitor"];

// 项目里不可删的用户角色。
// 这些是最基本的角色，用于系统里最基本的权限判断，因此不可删除。
export const RESERVED_ROLES = ["root", "admin", "user", "visitor"];

export const GENDER_DATA: SelectDataType[] = [
  {
    label: "男",
    value: "1"
  },
  {
    label: "女",
    value: "2"
  },
  {
    label: "保密",
    value: "3"
  }
];

// 常规状态列表
export const STATUS_DATA: SelectDataType[] = [
  {
    label: "启用",
    value: "1"
  },
  {
    label: "禁用",
    value: "2"
  }
];

// 角色类型列表
export const ROLE_CODE_TYPE_DATA: SelectDataType[] = [
  { label: "超级管理员", value: "root" },
  { label: "常规管理员", value: "admin" },
  { label: "常规用户", value: "user" },
  { label: "游客", value: "visitor" },
  { label: "自定义", value: "custom" }
];

// 正则：含有大小写字母和数字
export const LETTER_NUMBER_PASS: RegExp =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]+$/;
