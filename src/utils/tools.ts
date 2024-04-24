// 公共 TS 方法

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
>(
  menus: T[],
  allMenus: T[],
  parent?: T,
  parentKey: K = "parentId" as K
): T | undefined {
  const result: T | undefined = parent ?? undefined;

  // 遍历 menus 数组，构建树状结构
  menus.forEach((menu) => {
    // 如果存在父菜单，则将当前菜单添加到父菜单的 children 中
    if (result) {
      if (!result.children) {
        result.children = [];
      }
      result.children.push(menu);
    }
    // 寻找当前菜单项的所有子菜单项
    const childMenus = allMenus.filter((item) => item[parentKey] === menu.id);
    // 如果找到子菜单项，则递归构建子菜单
    if (childMenus.length > 0) {
      const childResult = buildTree(childMenus, allMenus, menu, parentKey);
      // 如果递归结果存在且当前菜单项尚未设置 children，则初始化 children 为递归结果
      if (childResult && !menu.children) {
        menu.children = [childResult];
      }
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
