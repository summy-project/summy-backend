export default {
  // 模式：dev（开发环境）、test（测试环境）、prod（生产/正式环境）。prod 环境有些功能是禁用的，比如 swagger。
  mode: "dev",
  // 是否允许注册，代码级别的开关，如果这里配置为“禁用”，哪怕在系统设置里面允许注册都没用。
  allowSignup: true,
  // 注册时候是否要求有邀请码，代码级别的开关，如果这里配置为“禁用”，哪怕在系统设置里面允许注册都没用。
  signUpWithInviteCode: true,
  allowSignUpAdmin: true, // 是否允许注册管理员。初始化的时候用。
  allowSignUpRole: true, // 是否允许注册角色。初始化的时候用。
  about: {
    name: "",
    version: "0.0.1"
  },
  database: {
    host: "127.0.0.1",
    port: 3306,
    user: "",
    password: "",
    dbName: ""
  },
  jwt: {
    // openssl rand -hex 32
    secretKey: "",
    expiresIn: "7d" // 令牌过期时间
  }
};
