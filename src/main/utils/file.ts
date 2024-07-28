export function isJsonFilePath(path:string) {
  const regex = /\.json$/i;
  return regex.test(path);
}

export function removeFileNameFromPath(path:string) {
  const regex = /[\\/][^\\/]+$|\\[^\\]+$/;
  return path.replace(regex, '');
}