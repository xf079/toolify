import { ConfigProvider, theme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import useSystemTheme from '@/hooks/useSyetemTheme';
import { AppProvider, IAppContext, useAppContext } from '@/context';
import router from './router';

function AppContainer() {
  const { store } = useAppContext();
  const { theme: systemTheme } = useSystemTheme();
  const themeVal = useMemo(
    () => (store.theme === 'system' ? systemTheme : store.theme),
    [store.theme, systemTheme]
  );
  const themeAlgorithm = useMemo(
    () => (themeVal === 'dark' ? [theme.darkAlgorithm] : null),
    [themeVal]
  );

  return (
    <ConfigProvider
      prefixCls='apeak'
      theme={{
        cssVar: true,
        algorithm: themeAlgorithm,
        token: {
          colorPrimary: store.primaryColor,
          borderRadius: 16
        }
      }}
      variant='filled'
      componentSize='large'
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

function App() {
  const [value, setValue] = useState<IAppContext>();
  const getConfig = async () => {
    const result = await window.apeak?.sync('getConfig');
    const configList = Object.fromEntries(
      result.map((item: any) => [item.type, item.value])
    );
    setValue(configList as IAppContext);
  };

  useEffect(() => {
    void getConfig();
  }, []);

  if (!value) {
    return null;
  }
  return (
    <AppProvider value={value}>
      <AppContainer />
    </AppProvider>
  );
}

export default App;
