import { BaseEntity } from "src/common/base/entities/base.entity";
import { Menu } from "src/system/menu/entities/menu.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class Role extends BaseEntity {
  @Column()
  roleName: string;

  @Column()
  codeType: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Menu, (menu) => menu.roles)
  menus: User[];
}
