import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

function useSystemTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    // 设置初始皮肤
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    // 监听系统颜色切换
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        if (event.matches) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
      });
  }, []);
  return {
    theme,
    isDarkMode: theme === 'dark',
    isLightMode: theme === 'light'
  };
}

export default useSystemTheme;
