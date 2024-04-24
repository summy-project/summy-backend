# 后端

基于 NestJS + TypeORM + TypeScript 开发的管理系统的后端项目。

## 如何配置

### 安装依赖

```bash
pnpm i
```

### 进行配置

1. 安装 MySQL，配置好端口号、用户名、密码，然后创建一个空白的数据库。
2. 复制 `src/config-example.ts` 文件，重命名为 `config.ts`，然后配置好里面的内容。
3. 将 `src/config.ts` 中的下面两个字段配置为 `true`，然后打开前端页面 `/auth/setup`，进行管理员和角色的初始化：

```json
{
  allowSignUpAdmin: true
  allowSignUpRole: true
}
```
4. 初始化完成之后，为了确保安全，请将上面两个字段改成 `false`，后端将不再允许用户在不登录的情况下注册管理员和角色。
5. 现在可以使用了。

## 内容

公共部分：

- 鉴权、注册、登录
- 非生产环境下默认开启 swagger
- 基本的类、拦截器、过滤器、守卫、管道

用户管理：

- 用户的增添
- 用户角色管理
- 邀请码功能

系统管理：

- 字典管理
- 菜单管理
- 系统设置管理
