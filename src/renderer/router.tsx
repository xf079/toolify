import { createHashRouter, Outlet } from 'react-router-dom';

import Panel from '@/pages/panel';
import Detach from '@/pages/detach';

import Mine from '@/pages/system/mine';
import Developer from '@/pages/system/developer';
import Plugins from '@/pages/system/plugins';
import Search from '@/pages/search';

const router = createHashRouter([
  {
    path: '',
    element: <Search />
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
