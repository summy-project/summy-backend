import { BaseEntity } from "src/common/base/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Setting extends BaseEntity {
  @Column()
  productName: string;

  @Column()
  productVersion: string;

  @Column()
  productDescription: string;

  @Column()
  allowSignup: boolean;

  @Column()
  hasEnabled: boolean;
}
