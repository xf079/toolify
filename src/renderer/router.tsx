import { createHashRouter, Outlet } from 'react-router-dom';

import AppPage from '@/pages/app';
import Panel from '@/pages/panel';
import Detach from '@/pages/detach';

import Mine from '@/pages/system/mine';
import Developer from '@/pages/system/developer';
import Plugins from '@/pages/system/plugins';

const router = createHashRouter([
  {
    path: '',
    element: <AppPage />
  },
  {
    path: 'panel',
    element: <Panel />
  },
  {
    path: 'detach',
    element: <Detach />
  },
  {
    path: 'system',
    element: <Outlet />,
    children: [
      {
        path: 'plugins',
        element: <Plugins />
      },
      {
        path: 'settings',
        element: <Mine />
      },
      {
        path: 'developer',
        element: <Developer />
      }
    ]
  }
]);

export default router;
