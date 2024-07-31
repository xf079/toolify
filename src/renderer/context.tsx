import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState
} from 'react';
import { useAsyncEffect } from 'ahooks';
import { MAIN_SYNC_CONFIG } from '@main/config/constants';

const StoreContext = createContext<IConfig>(null);

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState();
  useAsyncEffect(async () => {
    const data = await apeak.sendSync(MAIN_SYNC_CONFIG);
    setValue(data);
  }, []);
  return (
    <StoreContext.Provider value={value}>
      {value ? children : null}
    </StoreContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(StoreContext);

  if (context === null) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }

  return context;
};
