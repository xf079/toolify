import { ConfigProvider as AntdConfigProvider, theme as antdTheme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { useMemo } from 'react';
import useSystemTheme from '@/hooks/useSyetemTheme';
import router from './router';
import { ConfigProvider, useConfig } from '@/context';

const AppContainer = () => {
  const { theme } = useConfig();
  const { theme: systemTheme } = useSystemTheme();

  const themeVal = useMemo(
    () => (theme.theme === 'system' ? systemTheme : theme.theme),
    [theme.theme, systemTheme]
  );
  const themeAlgorithm = useMemo(
    () => (themeVal === 'dark' ? [antdTheme.darkAlgorithm] : null),
    [themeVal]
  );

  return (
    <AntdConfigProvider
      prefixCls='apeak'
      theme={{
        cssVar: true,
        algorithm: themeAlgorithm,
        token: {
          colorPrimary: theme.colorPrimary,
          borderRadius: 12
        }
      }}
      wave={{ disabled: true }}
      variant='filled'
      componentSize='large'
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
