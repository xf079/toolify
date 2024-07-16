import { createHashRouter, Outlet } from 'react-router-dom';

import AppPage from '@/pages/app';

import Panel from '@/pages/panel';

import Detach from '@/pages/detach';

import Mine from '@/pages/system/mine';
import Developer from '@/pages/system/developer';
import Plugins from '@/pages/system/plugins';

function Layout(){
  return <div>123<Outlet /></div>
}

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
    element: <Layout />,
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
