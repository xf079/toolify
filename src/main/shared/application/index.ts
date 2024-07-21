import { createFolderIfNotExists, getDataPath } from '@main/utils/os';
import PluginsModal from '@main/shared/modal/plugins';
import device from '@main/utils/device';
import { MacosApplication } from './mac';
import { WindowsApplication } from './windows';

export default async function initApplication() {
  createFolderIfNotExists(getDataPath('/resources/image'));

  let application: IPlugin[];
  if (device.windows()) {
    const window = new WindowsApplication();
    application = await window.init();
  } else if (device.macOS()) {
    const macos = new MacosApplication();
    application = await macos.init();
  }

  await PluginsModal.destroy({
    where: {
      type: 'app'
    }
  });
  await PluginsModal.bulkCreate(application);
}
