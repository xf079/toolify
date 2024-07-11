import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useEffect, useState } from 'react';
import { AppProvider, IAppContext, useAppContext } from '@/context';

function Container() {
  const { store } = useAppContext();
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        algorithm: store.theme === 'dark' ? [theme.darkAlgorithm] : null,
        token: {
          borderRadius: 16
        }
      }}
      variant='filled'
      componentSize='large'
    >
      <AntdApp style={{ height: '100vh' }}>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}

function App() {
  const [value, setValue] = useState<IAppContext>();
  const getConfig = async () => {
    const result = await window.apeak?.sync('getConfig');
    console.log(result);
    const _value: Recordable = {};

    result.forEach((item: any) => {
      _value[item.type] = item.value;
    });

    console.log(_value);
    setValue(_value as IAppContext);
  };

  useEffect(() => {
    getConfig();
  }, []);

  if (!value) {
    return null;
  }
  return (
    <AppProvider value={value}>
      <Container />
    </AppProvider>
  );
}

export default App;
