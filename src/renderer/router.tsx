import { createMemoryRouter } from 'react-router-dom';
import AppPage from '@/pages/app';
import PluginsPage from '@/pages/plugins';
import RecentlyPage from '@/pages/recently';

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
        path: '/plugins',
        element: <PluginsPage />
      }
    ]
  }
];

const router = createMemoryRouter(routes, {
  initialIndex: 0
});

export default router;
