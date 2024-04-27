import { Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "src/common/base/entities/base.entity";
import { User } from "src/user/entities/user.entity";

@Entity()
export class InviteCode extends BaseEntity {
  @OneToOne(() => User, (user) => user.inviteCode)
  @JoinColumn()
  usedUser: User;
}
