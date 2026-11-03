import React, { useState } from 'react';
import type { User } from '../types';
import { AuthContext } from './auth';

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
