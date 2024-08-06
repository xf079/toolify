import {
  ConfigProvider as AntdConfigProvider,
  App as AntdApp,
  theme
} from 'antd';
import { RouterProvider } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import useSystemTheme from '@/hooks/useSyetemTheme';
import showInsetEffect from '@/design/antd/insetWare';
import useSettings from '@/store';
import router from '@/router';

const App = () => {
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
    <AntdConfigProvider
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
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </AntdConfigProvider>
  );
};

export default App;
