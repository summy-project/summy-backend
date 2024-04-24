// 这里的常量有一部分是前端和 Nest 后端公用的，如果要改前后端要同时改。

// 项目里不可删的用户。
// 游客是最基本的角色，因此不能删除。
export const RESERVED_USERS = ["visitor"];

// 项目里不可删的用户角色。
// 这些是最基本的角色，用于系统里最基本的权限判断，因此不可删除。
export const RESERVED_ROLES = ["root", "admin", "user", "visitor"];
