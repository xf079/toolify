export const useOs = () => {
  const agent = navigator.userAgent.toLowerCase();
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  const isWindows = /win32|wow32|wow64|win64/.test(agent);

  return {
    isMac,
    isWindows,
    isLinux: !isMac && !isWindows
  };
};
