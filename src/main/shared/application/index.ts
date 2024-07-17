import device from '@common/utils/device';
import { createFolderIfNotExists, getDataPath } from '@common/utils/os';
import PluginsModal from '@main/shared/db/modal/plugins';
import { MacosApplication } from './mac';
import { WindowsApplication } from './windows';

export default async function initApplication() {
  createFolderIfNotExists(getDataPath('/image'));

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
