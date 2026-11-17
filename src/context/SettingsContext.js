import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@keep_clone/settings';
const DEFAULTS = {
  layout: 'grid', // 'grid' (duas colunas) | 'list' (uma coluna)
  sortBy: 'custom', // 'custom' | 'created' | 'modified'
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => json && setSettings({ ...DEFAULTS, ...JSON.parse(json) }))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, loaded]);

  const toggleLayout = () =>
    setSettings((s) => ({ ...s, layout: s.layout === 'grid' ? 'list' : 'grid' }));

  const setSortBy = (sortBy) => setSettings((s) => ({ ...s, sortBy }));

  return (
    <SettingsContext.Provider
      value={{ ...settings, columns: settings.layout === 'grid' ? 2 : 1, toggleLayout, setSortBy }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
