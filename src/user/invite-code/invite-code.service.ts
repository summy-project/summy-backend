import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { InviteCodeFilterDto } from "./dto/invite-code-filter.dto";
import { CreateInviteCodeDto } from "./dto/create-invite-code.dto";
import { UpdateInviteCodeDto } from "./dto/update-invite-code.dto";

import { InviteCode } from "./entities/invite-code.entity";

import { UserService } from "../user.service";
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
    private userService: UserService,
    @InjectRepository(InviteCode)
    private readonly inviteCodeRepository: Repository<InviteCode>
  ) {}

  /**
   * 创建一个新的邀请码。
   * @param createRoleDto 创建邀请码的DTO，包含所需信息。
   * @returns 返回创建的邀请码实体。
   */
  async create(createRoleDto: CreateInviteCodeDto) {
    // 不支持创建邀请码的时候直接赋予对应用户。
    return await this.inviteCodeRepository.save(
      this.inviteCodeRepository.create(createRoleDto)
    );
  }

  /**
   * 查询所有邀请码。
   * @returns 返回邀请码实体数组。
   */
  async findAll(inviteCodeFilterDto: InviteCodeFilterDto) {
    // return await this.inviteCodeRepository.find();
    let query = this.inviteCodeRepository
      .createQueryBuilder("invite_code")
      .leftJoinAndSelect("invite_code.usedUser", "usedUser");

    // 根据 DTO 中的属性进行模糊搜索条件构建
    Object.entries(inviteCodeFilterDto).forEach(([key, value]) => {
      // console.log("query", key, value);
      if (value) {
        query = query.andWhere(`invite_code.${key} LIKE :${key}`, {
          [key]: `%${value}%`
        });
      }
    });

    const queryList = await query.getMany();
    return queryList.map((item) => {
      return {
        ...item,
        usedUserId: item.usedUser?.id || "",
        usedUserName: item.usedUser?.userName || ""
      };
    });
  }

  /**
   * 根据ID查询一个邀请码。
   * @param id 邀请码的ID。
   * @returns 返回找到的邀请码实体。
   */
  async findOne(id: string) {
    const entityData = await this.inviteCodeRepository.findOne({
      where: { id },
      relations: ["usedUser"]
    });
    return {
      ...entityData,
      usedUserId: entityData.usedUser?.id || "",
      usedUserName: entityData.usedUser?.userName || ""
    };
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
    if (!data.usedUser) {
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
    const userData = await this.userService.findUserDataPure(usedUserId);
    if (!userData) {
      throw new HttpException("用户不存在", HttpStatus.NOT_FOUND);
    }
    return await this.inviteCodeRepository.update(id, { usedUser: userData });
  }
}
