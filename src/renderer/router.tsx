import { createHashRouter } from 'react-router-dom';
import AppPage from '@/pages/app';
import PluginsPage from '@/pages/plugins';
import RecentlyPage from '@/pages/recently';
import ToolbarPage from '@/pages/toolbar';

const routes = [
  {
    path: '',
    element: <ToolbarPage />,
    children: [
      {
        index: true,
        element: <RecentlyPage />
      },
      {
        path: '/plugins',
        element: <PluginsPage />
      }
    ]
  },
  {
    path: 'toolbar',
    element: <ToolbarPage />
  }
];

const router = createHashRouter(routes);

export default router;
