// 这是一个抽象基类，用于定义实体对象的基本属性

import { Column, PrimaryColumn } from "typeorm";

export abstract class BaseEntity {
  // 主键列，设置为唯一标识符
  @PrimaryColumn({ unique: true })
  id: string;

  // 记录创建日期
  @Column()
  createdTime: Date;

  // 记录更新日期，允许为空
  @Column({ nullable: true })
  updatedTime: Date;

  // 记录创建者信息，允许为空
  @Column({ nullable: true })
  createdBy: string;

  // 记录更新者信息，允许为空
  @Column({ nullable: true })
  updatedBy: string;

  // 常规状态值，一般 1 为启用，2 为禁用
  @Column({ nullable: true })
  status: string;

  // 是否被逻辑删除（有些数据需要）
  @Column({ default: false })
  hasDeleted: boolean;

  // 记录实体的备注信息，允许为空
  @Column({ nullable: true })
  remark: string;
}
