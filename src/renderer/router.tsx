import { createHashRouter, Outlet } from 'react-router-dom';

import Search from '@/pages/search';
import Detach from '@/pages/detach';
import Panel from '@/pages/panel';

import Mine from '@/pages/system/mine';
import Plugins from '@/pages/system/plugins';
import Developer from '@/pages/system/developer';

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
