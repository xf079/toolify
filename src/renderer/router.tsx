import { createHashRouter } from 'react-router-dom';
import AppPage from '@/pages/app';
import TranslationPage from '@/pages/plugins/translation';
import CalendarPage from '@/pages/plugins/calendar';
import CipherPage from '@/pages/plugins/cipher';
import PluginsPage from '@/pages/plugins';

const router = createHashRouter([
  {
    path: '',
    element: <AppPage />,
    children:[
      {
        index: true,
      },
      {
        path: '/plugins',
        element: <PluginsPage />
      },
      {
        path: '/plugins/translation',
        element: <TranslationPage />
      },
      {
        path: '/plugins/calendar',
        element: <CalendarPage />
      },
      {
        path: '/plugins/cipher',
        element: <CipherPage />
      }
    ]
  },
]);

export default router;
