// 公共 TS 方法
import { SelectDataType } from "src/types";

/**
 * 构建树结构函数
 * 使用例：const tree = buildTree(menuItems, allMenuItems, undefined, 'customParentId');
 * @param menus 菜单列表，包含各个菜单项及其属性
 * @param allMenus 所有菜单项列表，用于查找子菜单
 * @param parent 当前处理的父菜单项，初始调用时可选
 * @param parentKey 父菜单项标识的属性名，默认为"parentId"
 * @returns 返回构建好的树结构菜单项，如果没有传入 parent，则返回根菜单项；如果不存在匹配的菜单项，则返回 undefined
 */
export function buildTree<
  T extends { id: string; children?: T[] },
  K extends keyof T
>(menus: T[], allMenus: T[], parent?: T, parentKey: K = "parentId" as K): T[] {
  // 如果没有传入 parent 参数，创建一个新的顶层节点
  const result: T[] = parent ? [parent] : [];

  // 遍历 menus 数组，构建树状结构
  menus.forEach((menu) => {
    // 如果存在父菜单，则将当前菜单添加到父菜单的 children 中
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(menu);
    } else {
      // 如果没有父菜单，将当前菜单添加到结果中
      result.push(menu);
    }
    // 寻找当前菜单项的所有子菜单项
    const childMenus = allMenus.filter((item) => item[parentKey] === menu.id);
    // 如果找到子菜单项，则递归构建子菜单
    if (childMenus.length > 0) {
      buildTree(childMenus, allMenus, menu, parentKey);
    }
  });

  return result; // 返回构建好的菜单项
}

/**
 * SHA256 加密
 * @param message 要加密的内容
 * @returns 加密之后的字符串
 */
export async function sha256(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.prototype.map
    .call(new Uint8Array(hashBuffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

/**
 * 根据提供的选择数据数组和输入值，获取对应的标签字符串。
 * @param arr 一个包含多个记录的对象数组，每个记录有一个 `value` 和 `label` 属性。
 * @param input 需要查找的值，用于匹配数组中某个记录的 `value` 属性。
 * @returns 如果找到匹配的记录，则返回该记录的`label`属性值；如果没有找到，则返回空字符串。
 */
export function getValueBySelectData(
  arr: SelectDataType[],
  input: string | number
): string {
  const resultValue = arr.find((item) => item.value === input);
  return resultValue ? resultValue.label : "未指定";
}
