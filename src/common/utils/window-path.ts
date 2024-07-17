import path from 'node:path';
import { WebContents } from 'electron';

export const setContentsUrl = (source: WebContents, hash?: string) => {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void source.loadURL(
      `${MAIN_WINDOW_VITE_DEV_SERVER_URL}${hash ? '#' + hash : ''}`
    );
  } else {
    void source.loadFile(
      `${path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)}${hash ? '#' + hash : ''}`
    );
  }
};
