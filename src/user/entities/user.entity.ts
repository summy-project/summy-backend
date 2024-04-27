import { BaseEntity } from "src/common/base/entities/base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToOne } from "typeorm";
import { Role } from "../role/entities/role.entity";
import { Exclude } from "class-transformer";
import { InviteCode } from "../invite-code/entities/invite-code.entity";

@Entity()
export class User extends BaseEntity {
  // 用户名
  @Column()
  userName: string;

  // 密码
  @Column()
  @Exclude() // 排除字段
  password: string;

  // 电话号码
  @Column({ nullable: true })
  phone: string;

  // 电子邮件
  @Column({ nullable: true })
  mail: string;

  // 实名
  @Column({ nullable: true })
  realName: string;

  // 性别，1 为男性，2 为女性，0 为未知
  @Column({ nullable: true })
  gender: string;

  // 生日
  @Column({ nullable: true })
  birthDay: Date;

  // 是否已经被逻辑删除，如果有则不显示
  @Column({ nullable: true })
  hasDeleted: boolean;

  // 头像 URL
  @Column({ nullable: true })
  avatarUrl: string;

  // 权限
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: "users_roles" })
  roles: Role[];

  @OneToOne(() => InviteCode, (inviteCode) => inviteCode.usedUser)
  inviteCode: InviteCode;
}
