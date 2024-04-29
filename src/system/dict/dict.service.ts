import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Dict } from "./entities/dict.entity";

import { DictFilterDto } from "./dto/dict-filter.dto";
import { CreateDictDto } from "./dto/create-dict.dto";
import { UpdateDictDto } from "./dto/update-dict.dto";

/**
 * 字典服务类，提供对字典实体的增删改查等操作
 */
@Injectable()
export class DictService {
  constructor(
    @InjectRepository(Dict) private readonly dictRepository: Repository<Dict>
  ) {}

  /**
   * 创建一个新的字典项
   * @param createDictDto 创建字典项的数据传输对象
   * @returns 创建的字典项实体
   */
  async create(createDictDto: CreateDictDto | UpdateDictDto) {
    return await this.dictRepository.save(
      this.dictRepository.create(createDictDto)
    );
  }

  /**
   * 查找所有字典项
   * @returns 所有字典项的数组
   */
  async findAll(dictFilterDto: DictFilterDto) {
    let query = this.dictRepository.createQueryBuilder("dict");

    // 根据 DTO 中的属性进行模糊搜索条件构建
    Object.entries(dictFilterDto).forEach(([key, value]) => {
      // console.log("query", key, value);
      if (value) {
        query = query.andWhere(`dict.${key} LIKE :${key}`, {
          [key]: `%${value}%`
        });
      }
    });

    const queryList = await query.getMany();
    return queryList;
  }

  /**
   * 根据ID查找一个字典项
   * @param id 要查找的字典项的ID
   * @returns 找到的字典项实体，如果没有找到则为undefined
   */
  async findOne(id: string) {
    return await this.dictRepository.findOne({ where: { id } });
  }

  /**
   * 根据ID更新一个字典项
   * @param updateDictDto 更新字典项的数据传输对象
   * @returns 更新后的字典项实体
   */
  async update(updateDictDto: UpdateDictDto) {
    return await this.dictRepository.save(updateDictDto);
  }

  /**
   * 根据ID删除一个字典项
   * @param id 要删除的字典项的ID
   * @returns 删除操作的结果，通常为影响的行数
   */
  async delete(id: string) {
    const data = await this.findOne(id);
    return this.dictRepository.remove(data);
  }

  /**
   * 查找字典值
   * @param dictType 字典类型，作为查询条件
   * @returns 返回通过指定字典类型查询到的字典值列表
   */
  async findDictValue(dictType: string) {
    return await this.dictRepository.find({ where: { dictType } });
  }
}
