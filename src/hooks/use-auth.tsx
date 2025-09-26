"use client";

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

// Define a user object structure
interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

const FAKE_USER_SESSION_KEY = 'fake_user_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem(FAKE_USER_SESSION_KEY);
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch (error) {
      console.error("Failed to parse user session from localStorage", error);
    }
    setLoading(false);
  }, []);

  const login = useCallback((email: string) => {
    const userToStore: User = { email };
    localStorage.setItem(FAKE_USER_SESSION_KEY, JSON.stringify(userToStore));
    setUser(userToStore);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(FAKE_USER_SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
