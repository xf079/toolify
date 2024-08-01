import { ConfigProvider as AntdConfigProvider, theme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { useMemo } from 'react';
import { ConfigProvider, useConfig } from '@/context';
import useSystemTheme from '@/hooks/useSyetemTheme';
import showInsetEffect from '@/design/antd/insetWare';
import router from './router';

const AppContainer = () => {
  const config = useConfig();
  const { theme: systemTheme } = useSystemTheme();

  const themeVal = useMemo(
    () => (config.theme === 'system' ? systemTheme : config.theme),
    [config.theme, systemTheme]
  );
  const themeAlgorithm = useMemo(
    () =>
      themeVal === 'dark' ? [theme.darkAlgorithm] : [theme.defaultAlgorithm],
    [themeVal]
  );

  return (
    <AntdConfigProvider
      prefixCls='apeak'
      theme={{
        cssVar: true,
        algorithm: themeAlgorithm,
        token: {
          colorPrimary: config.colorPrimary,
          borderRadius: 8
        }
      }}
      wave={{ showEffect: showInsetEffect }}
      variant='filled'
      componentSize='middle'
    >
      <RouterProvider router={router} />
    </AntdConfigProvider>
  );
};

const App = () => {
  return (
    <ConfigProvider>
      <AppContainer />
    </ConfigProvider>
  );
};

export default App;
