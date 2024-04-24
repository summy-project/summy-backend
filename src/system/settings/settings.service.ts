import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Setting } from "./entities/setting.entity";

import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";

/**
 * 提供对设置信息的增删改查服务
 */
@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>
  ) {}

  /**
   * 创建一个新的设置项
   * @param createSettingDto 创建设置项的数据传输对象
   * @returns 创建的设置项实体
   */
  async create(createSettingDto: CreateSettingDto) {
    // 新增和保存的逻辑就是分开的，因此要检测是否保存冲突。
    const findData = await this.findOne(createSettingDto.id);

    if (findData) {
      throw new HttpException("内容已经存在。", HttpStatus.CONFLICT);
    }

    return await this.settingRepository.save(
      this.settingRepository.create(createSettingDto)
    );
  }

  /**
   * 查找所有设置项
   * @returns 所有设置项的列表
   */
  async findAll() {
    return await this.settingRepository.find();
  }

  /**
   * 根据ID查找一个设置项
   * @param id 设置项的唯一标识
   * @returns 找到的设置项实体
   */
  async findOne(id: string) {
    return await this.settingRepository.findOne({ where: { id } });
  }

  /**
   * 更新一个设置项的信息
   * @param updateSettingDto 更新设置项的数据传输对象
   * @returns 更新后的设置项实体
   */
  async update(updateSettingDto: UpdateSettingDto) {
    return await this.settingRepository.save(
      this.settingRepository.create(updateSettingDto)
    );
  }

  /**
   * 根据ID删除一个设置项
   * @param id 设置项的唯一标识
   * @returns 删除操作的结果
   */
  async delete(id: string) {
    const data = await this.findOne(id);
    return this.settingRepository.remove(data);
  }

  /**
   * 设置默认的设置项
   * @param id 设置项的唯一标识，表示要设为默认的设置项
   * @returns 更新后的设置项实体
   */
  async setDefault(id: string) {
    // 将指定 ID 的 hasEnabled 设置为 true，其他的 hasEnabled 设置为 false
    // 先找出已经启用的，将已经启用的禁用
    const enabledSetting = await this.findEnabled();

    if (enabledSetting) {
      await this.settingRepository.update(
        { id: enabledSetting.id },
        { hasEnabled: false }
      );
    }

    return await this.settingRepository.update({ id }, { hasEnabled: true });
  }

  /**
   * 查找已启用的设置项
   * @returns 已启用的设置项实体
   */
  async findEnabled() {
    return await this.settingRepository.findOne({
      where: { hasEnabled: true }
    });
  }
}
