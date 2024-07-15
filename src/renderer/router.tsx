import { createHashRouter } from 'react-router-dom';

import AppPage from '@/pages/app';

import Panel from '@/pages/panel';

import Detach from '@/pages/detach';

import Mine from '@/pages/system/mine';
import Developer from '@/pages/system/developer';
import Plugins from '@/pages/system/plugins';

const routes = [
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
    children: [
      {
        path: 'plugins',
        element: <Plugins />
      },
      {
        path: 'mine',
        element: <Mine />
      },
      {
        path: 'developer',
        element: <Developer />
      }
    ]
  }
];

const router = createHashRouter(routes);

export default router;
