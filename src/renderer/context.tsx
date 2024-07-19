import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from 'react';
import { MAIN_SYNC_CONFIG } from '@main/config/constants';

const StoreContext = createContext<GlobalConfigs>(null);

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState();
  useEffect(() => {
    apeak.on(MAIN_SYNC_CONFIG, (_,data) => {
      setValue(data);
    });
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
