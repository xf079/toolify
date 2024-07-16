import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from 'react';
import { MAIN_SYNC_FORM_DATA } from '@common/constants/event-main';
import {
  SettingsConfigType,
  ThemeConfigType
} from '@common/config/default-config';

interface IStoreType {
  theme: ThemeConfigType;
  settings: SettingsConfigType;
  plugins:IPlugin[]
}

const StoreContext = createContext<IStoreType>(null);

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<IStoreType>();

  useEffect(() => {
    apeak.on(MAIN_SYNC_FORM_DATA, (event, formData) => {
      setValue(formData);
    });
    return () => {
      apeak.off(MAIN_SYNC_FORM_DATA, () => {
        console.log('off MAIN_SYNC_FORM_DATA');
      });
    };
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
