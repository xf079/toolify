import { createHashRouter } from 'react-router-dom';
import AppPage from '@/pages/app';
import PluginsPage from '@/pages/plugins';
import RecentlyPage from '@/pages/recently';
import PanelPage from '@/pages/panel';
import MinePage from '@/pages/mine';

const routes = [
  {
    path: '',
    element: <AppPage />,
    children: [
      {
        index: true,
        element: <RecentlyPage />
      },
      {
        path: 'mine',
        element: <MinePage />
      },
      {
        path: 'plugins',
        element: <PluginsPage />
      }
    ]
  },
  {
    path: 'panel',
    element: <PanelPage />
  }
];

const router = createHashRouter(routes);

export default router;
