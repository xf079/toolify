import { create } from 'zustand';
import defaultSettings from '@config/settings';

interface IConfigStore {
  setting: IConfig;
  initSetting: () => void;
  updateSetting: (key: keyof IConfig, value: string) => void;
}

const useSettings = create<IConfigStore>((set, get) => ({
  setting: defaultSettings,
  initSetting: async () => {
    const setting = await eventApi.sync('main:getSetting');
    set({ setting });
  },
  updateSetting: (key, value) => {
    const newSetting = { ...get().setting, [key]: value };
    eventApi.send('main:setSetting', newSetting);
    set({ setting: newSetting });
  }
}));

export default useSettings;
