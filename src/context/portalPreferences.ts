import { createContext, useContext } from 'react';

export interface PortalPreferencesContextValue {
  compactList: boolean;
  setCompactList: (next: boolean) => void;
}

export const PortalPreferencesContext = createContext<PortalPreferencesContextValue | undefined>(undefined);

export function usePortalPreferences() {
  const context = useContext(PortalPreferencesContext);
  if (!context) {
    throw new Error('usePortalPreferences must be used within PortalPreferencesProvider');
  }
  return context;
}
