import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany
} from "typeorm";
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

  // 父菜单，只能有一个父菜单
  @ManyToOne(() => Menu, (menu) => menu.childMenu, { nullable: true })
  @JoinColumn()
  parentMenu: Menu | null;

  // 子菜单，可以有多个子菜单
  @OneToMany(() => Menu, (menu) => menu.parentMenu, { nullable: true })
  // @JoinColumn()
  childMenu: Menu[] | null;

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
