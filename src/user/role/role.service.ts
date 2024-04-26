import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RESERVED_ROLES } from "src/common/constants";

import { Role } from "./entities/role.entity";

import { RoleFilterDto } from "./dto/role-filter.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

/**
 * 提供角色相关的服务，包括创建、查找、更新和删除角色。
 */
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {}

  /**
   * 创建一个新的角色。
   * @param createRoleDto 创建角色的数据传输对象，包含新角色的信息。
   * @returns 创建的角色实体。
   */
  async create(createRoleDto: CreateRoleDto) {
    // 新增和保存的逻辑就是分开的，因此要检测是否保存冲突。
    const findData = await this.findOne(createRoleDto.id);

    if (findData) {
      throw new HttpException("角色代号已经被使用。", HttpStatus.CONFLICT);
    }

    return await this.roleRepository.save(
      this.roleRepository.create(createRoleDto)
    );
  }

  /**
   * 批量保存角色
   * @param createRoleDto 批量保存角色
   * @returns 返回保存后的角色
   */
  async batchCreate(createRoleDto: CreateRoleDto[]) {
    const entityDatas: Record<string, any> = createRoleDto.map((item) => {
      return this.roleRepository.create(item);
    });
    return await this.roleRepository.save(entityDatas);
  }

  /**
   * 查找所有角色。
   * @returns 所有角色的列表。
   */
  async findAll(roleFilterDto: RoleFilterDto) {
    let query = this.roleRepository.createQueryBuilder("role");

    // 根据 DTO 中的属性进行模糊搜索条件构建
    Object.entries(roleFilterDto).forEach(([key, value]) => {
      // console.log("query", key, value);
      if (value) {
        query = query.andWhere(`role.${key} LIKE :${key}`, {
          [key]: `%${value}%`
        });
      }
    });

    const roleList = await query.getMany();
    return roleList;
  }

  /**
   * 根据ID列表查找一些角色。
   * @param ids 要查找的角色的ID列表。
   * @returns 找到的角色实体列表。
   */
  async findSomeByIds(ids: string[]) {
    // 使用 QueryBuilder 构建查询
    const queryBuilder = this.roleRepository.createQueryBuilder("role");

    // 添加 WHERE 子句，筛选出具有指定 ID 的角色
    queryBuilder.where("role.id IN (:...ids)", { ids });

    // 执行查询并返回结果
    return await queryBuilder.getMany();
  }

  /**
   * 根据ID查找一个角色。
   * @param id 要查找的角色的ID。
   * @returns 找到的角色实体，如果未找到则为undefined。
   */
  async findOne(id: string) {
    return await this.roleRepository.findOne({ where: { id } });
  }

  /**
   * 根据ID更新一个角色。
   * @param id 要更新的角色的ID。
   * @param updateRoleDto 更新角色的数据传输对象，包含更新后的信息。
   * @returns 更新后的角色实体。
   */
  async update(updateRoleDto: UpdateRoleDto) {
    return await this.roleRepository.save(
      this.roleRepository.create(updateRoleDto)
    );
  }

  /**
   * 根据ID删除一个角色。
   * @param id 要删除的角色的ID。
   * @returns 删除的角色实体，或者如果未找到角色则为 undefined。
   */
  async delete(id: string) {
    if (RESERVED_ROLES.includes(id)) {
      throw new HttpException("禁止删除基础角色！", HttpStatus.FORBIDDEN);
    }
    const roleWithUsers = await this.roleRepository.findOne({
      where: { id },
      relations: ["users"]
    });

    if (roleWithUsers.users.length !== 0) {
      throw new HttpException(
        "该角色下有用户，禁止删除！",
        HttpStatus.FORBIDDEN
      );
    }

    const data = await this.findOne(id);
    return this.roleRepository.remove(data);
  }

  /**
   * 查询角色总数和每个角色的用户数量。
   * @returns 返回角色总数和每个角色的用户数量。
   */
  async countRole() {
    // 1. 查询角色总数
    const roleCount = await this.roleRepository.count();

    // 2. 查询每个角色的用户数量
    const roleWithUsers = await this.roleRepository.find({
      relations: ["users"]
    });

    const roleWithUsersCount = roleWithUsers.map((item) => {
      return {
        roleId: item.id,
        roleName: item.roleName,
        userCount: item.users.length
      };
    });

    return {
      roleCount,
      roleWithUsersCount
    };
  }
}
