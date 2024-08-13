export const delayTime = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));


export function url2Base64(url:string, type = 'image/jpeg') {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas');
    img.crossOrigin = '*';
    img.onload = function () {
      const width = img.width, height = img.height;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      const base64 = canvas.toDataURL(type);
      resolve(base64);
    };
    img.onerror = function () {
      reject(new Error('message'));
    };
    img.src = url;
  });
}