import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  setUserSession: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'portal_session_v3';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as unknown;

      // Validate runtime properties against strict schema rules
      if (
        parsed &&
        typeof parsed === 'object' &&
        'id' in parsed &&
        'username' in parsed &&
        'name' in parsed &&
        'role' in parsed &&
        ((parsed as User).role === 'admin' || (parsed as User).role === 'member')
      ) {
        return parsed as User;
      }

      localStorage.removeItem(STORAGE_KEY);
      return null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const setUserSession = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, setUserSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be executed within an enclosed AuthProvider root');
  }
  return context;
}
