import { ConfigProvider, theme } from 'antd';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import useSystemTheme from '@/hooks/useSyetemTheme';
import showInsetEffect from '@/design/antd/insetWare';
import useSettings from '@/store';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { setting, initSetting } = useSettings();
  const { theme: systemTheme } = useSystemTheme();

  const themeVal = useMemo(
    () => (setting.theme === 'system' ? systemTheme : setting.theme),
    [setting.theme, systemTheme]
  );
  const themeAlgorithm = useMemo(
    () =>
      themeVal === 'dark' ? [theme.darkAlgorithm] : [theme.defaultAlgorithm],
    [themeVal]
  );
  useEffect(() => {
    initSetting();
  }, []);

  return (
    <ConfigProvider
      prefixCls='tl'
      theme={{
        cssVar: true,
        algorithm: themeAlgorithm,
        token: {
          colorPrimary: setting.colorPrimary,
          borderRadius: 8
        },
        components: {
          Button: {
            boxShadow: 'none'
          }
        }
      }}
      wave={{ showEffect: showInsetEffect }}
      variant='filled'
      componentSize='middle'
    >
      {children}
    </ConfigProvider>
  );
};

export default Layout;
