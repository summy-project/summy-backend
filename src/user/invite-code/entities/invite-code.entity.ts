import { Column, Entity } from "typeorm";
import { BaseEntity } from "src/common/base/entities/base.entity";

@Entity()
export class InviteCode extends BaseEntity {
  @Column()
  usedUserId: string;
}
