import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface PortalPreferencesContextValue {
  compactList: boolean;
  setCompactList: (next: boolean) => void;
}

const STORAGE_KEY = 'portal_compact_list';
const PortalPreferencesContext = createContext<PortalPreferencesContextValue | undefined>(undefined);

function readCompactListFromStorage(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return false;
    }
    return raw === 'true';
  } catch {
    return false;
  }
}

export function PortalPreferencesProvider({ children }: { children: ReactNode }) {
  const [compactList, setCompactListState] = useState<boolean>(() => readCompactListFromStorage());

  const setCompactList = (next: boolean) => {
    setCompactListState(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore localStorage write failures.
    }
  };

  const value = useMemo(
    () => ({
      compactList,
      setCompactList,
    }),
    [compactList],
  );

  return (
    <PortalPreferencesContext.Provider value={value}>
      {children}
    </PortalPreferencesContext.Provider>
  );
}

export function usePortalPreferences() {
  const context = useContext(PortalPreferencesContext);
  if (!context) {
    throw new Error('usePortalPreferences must be used within PortalPreferencesProvider');
  }
  return context;
}
