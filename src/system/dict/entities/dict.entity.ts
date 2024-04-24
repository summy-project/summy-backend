import { BaseEntity } from "src/common/base/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Dict extends BaseEntity {
  // 字典类型
  @Column()
  dictType: string;

  // 名称
  @Column()
  name: string;

  // 值
  @Column()
  value: string;
}
