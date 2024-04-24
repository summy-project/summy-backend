import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { isArray } from "radash";
import * as argon2 from "argon2";

import { RESERVED_USERS } from "src/common/constants";

import { User } from "./entities/user.entity";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

import { RoleService } from "./role/role.service";

/**
 * 提供用户相关的服务，包括创建、查找、更新和删除用户。
 */
@Injectable()
export class UserService {
  /**
   * 构造函数，注入用户仓库以便于进行数据库操作。
   * @param userRepository 用户仓库，用于数据操作。
   */
  constructor(
    private roleService: RoleService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  /**
   * 创建一个新的用户。
   * @param createUserDto 创建用户的数据传输对象，包含用户信息。
   * @returns 返回新创建的用户实体。
   */
  async create(createUserDto: CreateUserDto) {
    // 新增和保存的逻辑就是分开的，因此要检测是否保存冲突。
    const hasUserExists = await this.checkUserExists(createUserDto.id);

    if (hasUserExists) {
      throw new HttpException("用户已经存在！", HttpStatus.CONFLICT);
    }

    const entityData = this.userRepository.create(createUserDto);

    if (
      !isArray(createUserDto.roleIds) ||
      !createUserDto.roleIds ||
      createUserDto.roleIds.length === 0
    ) {
      throw new HttpException(
        "用户角色不能为空！",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const rolesList = await this.roleService.findSomeByIds(
      createUserDto.roleIds
    );

    entityData.roles = rolesList;

    entityData.password = await argon2.hash(createUserDto.password);

    return await this.userRepository.save(entityData);
  }

  /**
   * 批量保存用户
   * @param createUserDtos 批量保存用户
   * @returns 返回保存后的用户
   */
  async batchCreate(createUserDtos: CreateUserDto[]) {
    const results = [];

    for (const item of createUserDtos) {
      const entityData = this.userRepository.create(item);

      if (
        !isArray(item.roleIds) ||
        !item.roleIds ||
        item.roleIds.length === 0
      ) {
        throw new HttpException(
          "用户角色不能为空！",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const rolesList = await this.roleService.findSomeByIds(item.roleIds);
      entityData.roles = rolesList;

      entityData.password = await argon2.hash(item.password);

      const savedUser = await this.userRepository.save(entityData);
      results.push(savedUser);
    }

    return results;
  }

  /**
   * 查找所有用户。
   * @param includeDisabledUsers 是否包含已删除的用户，默认为false。
   * @returns 返回用户列表。
   */
  async findAll() {
    // 使用QueryBuilder查询所有用户，只允许查出用户状态是启用或者禁用的用户（也就是说状态为“删除”的用户不会查出来）
    const query = this.userRepository
      .createQueryBuilder("user")
      .select([
        "id",
        "userName",
        "createdTime",
        "updatedTime",
        "gender",
        "userStatus",
        "realName",
        "phone",
        "remark"
      ])
      .where("user.hasDeleted = :hasDeleted", { hasDeleted: false });

    const userList = await query.getRawMany();

    return userList;
  }

  /**
   * 根据ID查找一个用户。
   * @param id 用户的ID。
   * @returns 返回找到的用户实体，如果没有找到则返回undefined。
   */
  async findOne(id: string) {
    const entityData = await this.userRepository.findOne({
      where: { id },
      relations: ["roles"]
    });
    if (!entityData) {
      throw new HttpException("用户不存在！", HttpStatus.NOT_FOUND);
    }
    const roleIds = [];
    entityData.roles.forEach((item) => {
      roleIds.push(item.id);
    });
    return { ...entityData, roleIds };
  }

  /**
   * 更新一个用户的信息。
   * @param id 用户的ID。
   * @param updateUserDto 更新用户的数据传输对象，包含更新的信息。
   * @returns 返回一个值。
   */
  async update(updateUserDto: UpdateUserDto) {
    // 当前密码校验
    if (
      updateUserDto.oldPassword === "" ||
      updateUserDto.oldPassword === null
    ) {
      throw new HttpException(
        "对用户信息进行更改操作需要输入当前密码。",
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      !isArray(updateUserDto.roleIds) ||
      !updateUserDto.roleIds ||
      updateUserDto.roleIds.length === 0
    ) {
      throw new HttpException(
        "用户角色不能为空！",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const userData = await this.findOne(updateUserDto.id);
    if (userData) {
      // 先校验旧密码
      const hasPasswordOK = await argon2.verify(
        userData.password,
        updateUserDto.oldPassword
      );
      // 如果没有输入新密码，则代表用户不想修改密码，所以密码保持原样。
      if (updateUserDto.password === "" || updateUserDto.password === null) {
        updateUserDto.password = updateUserDto.oldPassword;
      }
      if (hasPasswordOK) {
        const entityData = this.userRepository.create(updateUserDto);

        const rolesList = await this.roleService.findSomeByIds(
          updateUserDto.roleIds
        );

        entityData.password = await argon2.hash(updateUserDto.password);
        entityData.roles = rolesList;
        return await this.userRepository.save(entityData);
      } else {
        throw new HttpException("密码错误。", HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException("用户不存在。", HttpStatus.NOT_FOUND);
    }
  }

  /**
   * 删除一个用户。
   * @param id 用户的ID。
   * @returns 返回删除操作的结果。
   */
  async delete(id: string) {
    if (RESERVED_USERS.includes(id)) {
      throw new HttpException("禁止删除基础用户！", HttpStatus.FORBIDDEN);
    }
    return await this.userRepository.delete(id);
  }

  /**
   * 逻辑删除一个用户，即将 userStatus 改为 3，这样默认查不出来。
   * @param id 用户的ID。
   * @returns 返回删除操作的结果。
   */
  async logicalRemove(id: string) {
    return await this.userRepository.update(id, { hasDeleted: true });
  }

  /**
   * 统计用户和角色的数量。
   * @returns 返回一个包含用户ID和角色ID的列表。
   */
  async countUserAndRoles() {
    const userCount = await this.userRepository.count();
    const roleCount = await this.roleService.countRole();
    return { user: userCount, role: roleCount };
  }

  /**
   * 检查用户是否存在
   * 请注意：这个方法不能和 findOne() 混为一谈！
   * @return 存在就返回这个用户的信息，不存在就返回 null。
   */
  async checkUserExists(id: string) {
    const userData = await this.userRepository.findOne({
      where: { id }
    });
    if (userData) {
      return userData;
    } else {
      return null;
    }
  }
}
