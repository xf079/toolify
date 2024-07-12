import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useReducer
} from 'react';
import { defaultConfig } from '@common/config/default-config';

export interface IAppContext {
  start: boolean;
  theme: string;
  language: string;
  primaryColor: string;
  placeholder: string;
}

export interface IAppContextAction<T = any> {
  type: 'CHANGE';
  payload: T;
}

export interface IAppContextType {
  store: IAppContext | undefined;
  dispatch: Dispatch<IAppContextAction>;
}

const AppContext = createContext<IAppContextType>({
  store: undefined,
  dispatch: () => {}
});

const reducer = (
  state: IAppContext,
  action: IAppContextAction
): IAppContext => {
  switch (action.type) {
    case 'CHANGE':
      void window.apeak?.trigger('setConfig', action.payload);
      console.log(action.payload);
      return { ...state, [action.payload.type]: action.payload.value };
    default:
      return state;
  }
};

export function useAppContext<T = any>() {
  const context = useContext<IAppContextType>(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
}

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, defaultConfig as IAppContext);
  const _value = useMemo(() => ({ store, dispatch }), [store]);

  return <AppContext.Provider value={_value}>{children}</AppContext.Provider>;
};
