import { Plugin } from 'vite';
import fs from 'fs';
const viteImagePlugin = (): Plugin => {
  return {
    name: 'vite-image-plugin',
    async transform(_, id: string) {
      const [url, queryParams] = id.split('?');
      // 只处理图片文件
      if (!/\.png|\.jpg|\.jpeg|\.gif/.test(id) || !queryParams) return null;
      if (queryParams === 'base64') {
        // 读取文件并转换为 base64
        const buffer = await fs.promises.readFile(url);
        const base64 = buffer.toString('base64');
        // 返回转换后的代码
        const dataUrl = `data:image/${url.split('.').pop()};base64,${base64}`;
        return {
          code: `export default ${JSON.stringify(dataUrl)}`
        };
      }
      return null;
    }
  };
};

export default viteImagePlugin;
