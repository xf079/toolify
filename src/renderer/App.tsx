import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        algorithm: [
          // compactAlgorithm,
          // defaultAlgorithm
        ],
        token: {
          borderRadius: 8
        }
      }}
      variant='filled'
      componentSize='large'
    >
      <AntdApp style={{height:'100vh'}}>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
