import PluginsModal from '@main/modal/plugins';
import { isWindows, isMac } from '@main/utils/is';
import { createFolderIfNotExists, getDataPath } from '@main/utils/fs';
import { MacosApplication } from './mac';
import { WindowsApplication } from './windows';

export default async function initApplication() {
  createFolderIfNotExists(getDataPath('/resources/image'));

  let application: IPlugin[];
  if (isWindows) {
    const window = new WindowsApplication();
    application = await window.init();
  } else if (isMac) {
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
