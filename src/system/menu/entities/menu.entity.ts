import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "src/common/base/entities/base.entity";
import { Role } from "src/user/role/entities/role.entity";

@Entity()
export class Menu extends BaseEntity {
  // 名称
  @Column()
  name: string;

  // 代号
  @Column()
  code: string;

  // 电脑端图标
  @Column()
  pcIcon: string;

  // 移动端图标
  @Column()
  mobileIcon: string;

  // 排序
  @Column()
  sort: number;

  // 状态，1 启用，2 禁用
  @Column()
  menuStatus: string;

  // 父级
  @Column({ nullable: true })
  parentId: string;

  // 路由地址（电脑端）
  @Column({ nullable: true })
  pcRoute: string;

  // 路由地址（移动端）
  @Column({ nullable: true })
  mobileRoute: string;

  // 权限
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: "menus_roles" })
  roles: Role[];
}
