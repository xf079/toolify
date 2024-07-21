import PluginsModal from '@main/shared/modal/plugins';
import { defaultConfig } from '@main/config/defaultConfig';

export default async function createBuilt() {
  const plugins = await PluginsModal.findOne({
    where: {
      type: 'built'
    }
  });
  if (!plugins) {
    await PluginsModal.bulkCreate(defaultConfig.plugins);
  }
}
