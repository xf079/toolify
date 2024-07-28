import { RouterProvider } from 'react-router-dom';
import useSystemTheme from '@/hooks/useSyetemTheme';
import router from './router';
import { ThemeProvider } from '@/context';
import { Toaster } from "@/components/ui/toaster"


const AppContainer = () => {
  const { theme: systemTheme } = useSystemTheme();

  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContainer />
      <Toaster />
    </ThemeProvider>
    // <RouterProvider router={router} />
  );
};

export default App;
