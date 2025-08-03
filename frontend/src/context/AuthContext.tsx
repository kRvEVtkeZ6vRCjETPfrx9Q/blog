import { createContext, useEffect, useState } from 'react';
import api from '../api';

interface AuthContextType {
  authenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    api
      .get('/auth/me')
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false));
  }, []);

  const login = () => setAuthenticated(true);

  const logout = async () => {
    await api.post('/auth/logout');
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
