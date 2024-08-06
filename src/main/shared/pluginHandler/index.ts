import PluginsModal from '@main/modal/plugins';
/**
 * 查询指定插件信息
 * @param key
 * @private
 */
const queryPluginInfo = async (key: string) => {
  const value = await PluginsModal.findOne({
    where: {
      unique: key
    }
  });
  if (!value) return;
  return value.dataValues as unknown as IPlugin;
};

/**
 * 打开系统设置
 */
export const openSystemSettings = () => {};

/**
 * 打开插件中心
 */
export const openPluginCenter = () => {};

/**
 * 打开个人中心
 */
export const openPersonalCenter = () => {};



