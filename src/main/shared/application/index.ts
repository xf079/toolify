import device from '@common/utils/device';
import { WindowsApplication } from './windows';
import { MacosApplication } from './mac';
import { createFolderIfNotExists, getDataPath } from '@common/utils/os';
import ApplicationModal from '@main/shared/db/modal/application';
import { IApplication } from '@common/types';

export default async function initApplication() {
  createFolderIfNotExists(getDataPath('/image'));

  let application: IApplication[];
  if (device.windows()) {
    const window = new WindowsApplication();
    application = await window.init();
  } else if (device.macOS()) {
    const macos = new MacosApplication();
    application = await macos.init();
  }

  await ApplicationModal.destroy({ where: {}, truncate: true });
  await ApplicationModal.bulkCreate(application);
}
