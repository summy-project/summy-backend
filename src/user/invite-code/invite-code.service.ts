import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateInviteCodeDto } from "./dto/create-invite-code.dto";
import { UpdateInviteCodeDto } from "./dto/update-invite-code.dto";

import { InviteCode } from "./entities/invite-code.entity";

/**
 * 邀请码服务类，提供创建、查询、更新和删除邀请码的功能。
 */
@Injectable()
export class InviteCodeService {
  /**
   * 构造函数，注入邀请码实体的仓库。
   * @param inviteCodeRepository 邀请码的TypeORM仓库，用于数据操作。
   */
  constructor(
    @InjectRepository(InviteCode)
    private readonly inviteCodeRepository: Repository<InviteCode>
  ) {}

  /**
   * 创建一个新的邀请码。
   * @param createRoleDto 创建邀请码的DTO，包含所需信息。
   * @returns 返回创建的邀请码实体。
   */
  async create(createRoleDto: CreateInviteCodeDto) {
    return await this.inviteCodeRepository.save(
      this.inviteCodeRepository.create(createRoleDto)
    );
  }

  /**
   * 查询所有邀请码。
   * @returns 返回邀请码实体数组。
   */
  async findAll() {
    return await this.inviteCodeRepository.find();
  }

  /**
   * 根据ID查询一个邀请码。
   * @param id 邀请码的ID。
   * @returns 返回找到的邀请码实体。
   */
  async findOne(id: string) {
    return await this.inviteCodeRepository.findOne({ where: { id } });
  }

  /**
   * 根据ID更新一个邀请码。
   * @param updateRoleDto 更新邀请码的DTO，包含更新信息。
   * @returns 返回更新操作的结果。
   */
  async update(updateRoleDto: UpdateInviteCodeDto) {
    return await this.inviteCodeRepository.save(
      this.inviteCodeRepository.create(updateRoleDto)
    );
  }

  /**
   * 根据ID删除一个邀请码。
   * @param id 邀请码的ID。
   * @returns 返回删除操作的结果。
   */
  async delete(id: string) {
    const data = await this.findOne(id); // 先查找确保邀请码存在
    return this.inviteCodeRepository.remove(data);
  }

  /**
   * 检查邀请码有没有被用过。
   * @param id 邀请码的ID。
   * @returns 使用过则返回 true，否则 false。
   */
  async checkIfInviteCodeUsed(id: string) {
    // 检查这个 ID 对应的数据里面 usedUserId 是否为 null 或者空字符串，如果是，则没有被使用。
    const data = await this.findOne(id);
    if (
      !data.usedUserId ||
      data.usedUserId === null ||
      data.usedUserId === ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 使用邀请码
   * @param id 邀请码的唯一标识符
   * @param userId 使用邀请码的用户ID
   * @returns 返回更新后的邀请码信息
   */
  async useInviteCode(id: string, usedUserId: string) {
    return await this.inviteCodeRepository.update(id, { usedUserId });
  }
}
