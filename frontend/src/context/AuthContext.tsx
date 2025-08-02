import { createContext, useEffect, useState } from 'react';
import { setAuthToken } from '../api';

interface AuthContextType {
  token?: string;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>(() => localStorage.getItem('token') || undefined);

  useEffect(() => {
    setAuthToken(token || null);
  }, [token]);

  const login = (t: string) => {
    setToken(t);
    localStorage.setItem('token', t);
  };

  const logout = () => {
    setToken(undefined);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
