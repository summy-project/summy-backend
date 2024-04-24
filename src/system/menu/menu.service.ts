import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { isArray } from "radash";

import { buildTree } from "src/utils/tools";

import { RoleService } from "src/user/role/role.service";

import { Menu } from "./entities/menu.entity";

import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";

/**
 * 提供菜单管理的服务。
 */
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    private roleService: RoleService
  ) {}

  /**
   * 创建新的菜单项。
   * @param createMenuDto 创建菜单项的数据传输对象。
   * @returns 创建的菜单项实体。
   */
  async create(createMenuDto: CreateMenuDto) {
    // 新增和保存的逻辑就是分开的，因此要检测是否保存冲突。
    const entityData = await this.findOne(createMenuDto.id);

    if (entityData) {
      throw new HttpException("内容已经存在。", HttpStatus.CONFLICT);
    }

    if (
      !isArray(createMenuDto.roleIds) ||
      !createMenuDto.roleIds ||
      createMenuDto.roleIds.length === 0
    ) {
      throw new HttpException(
        "用户角色不能为空！",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const rolesList = await this.roleService.findSomeByIds(
      createMenuDto.roleIds
    );

    entityData.roles = rolesList;

    return await this.menuRepository.save(
      this.menuRepository.create(entityData)
    );
  }

  /**
   * 查找所有菜单项。
   * @returns 菜单项的数组。
   */
  async findAll() {
    // 如果存在父级（parentId 不为 null 或者空字符串），则把对应的项目存放到 children 数组中。
    const allMenus = await this.menuRepository.find();
    const rootMenus = allMenus.filter(
      (menu) => menu.parentId === null || menu.parentId === ""
    );

    return buildTree(rootMenus, allMenus, undefined, "parentId");
  }

  /**
   * 查找当前用户的菜单项。
   * @returns 菜单项的数组。
   */
  async findMyMenu() {
    // 获取当前登录的用户
  }

  /**
   * 根据ID查找一个菜单项。
   * @param id 要查找的菜单项的ID。
   * @returns 找到的菜单项实体。
   */
  async findOne(id: string) {
    return await this.menuRepository.findOne({ where: { id } });
  }

  /**
   * 更新一个菜单项。
   * @param updateDictDto 更新菜单项的数据传输对象。
   * @returns 更新操作的结果。
   */
  async update(updateMenuDto: UpdateMenuDto) {
    const entityData = await this.findOne(updateMenuDto.id);

    if (
      !isArray(updateMenuDto.roleIds) ||
      !updateMenuDto.roleIds ||
      updateMenuDto.roleIds.length === 0
    ) {
      throw new HttpException(
        "用户角色不能为空！",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const rolesList = await this.roleService.findSomeByIds(
      updateMenuDto.roleIds
    );

    entityData.roles = rolesList;

    return await this.menuRepository.save(
      this.menuRepository.create(entityData)
    );
  }

  /**
   * 删除一个菜单项。
   * @param id 要删除的菜单项的ID。
   * @returns 删除操作的结果。
   */
  async delete(id: string) {
    const data = await this.findOne(id); // 先查找菜单项确保其存在
    return this.menuRepository.remove(data);
  }
}
