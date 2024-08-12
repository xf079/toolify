import { ipcRenderer } from 'electron';
import { EVENT_MESSENGER } from '@config/constants';
import { genCommonToolify } from './common';

function sync(type: string, data?: any) {
  const returnValue = ipcRenderer.invoke(EVENT_MESSENGER, {
    type,
    data
  });
  if (returnValue instanceof Error) throw returnValue;
  return returnValue;
}

function send(type: string, data: any) {
  ipcRenderer.send(EVENT_MESSENGER, {
    type,
    data
  });
}

(function () {
  const commonToolify = genCommonToolify(sync, send);
  const _toolify: Toolify = {
    ...commonToolify,
    onSearch(value) {
      return sync('search', value);
    }
  };
  Object.defineProperty(window, 'toolify', {
    value: _toolify,
    configurable: false,
    writable: false
  });
})();
