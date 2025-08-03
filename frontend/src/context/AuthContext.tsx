import { createContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

interface User {
  _id: string;
  username: string;
}

interface AuthContextType {
  user?: User;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { data: user } = useQuery<User | undefined>(['me'], async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }, { retry: false });

  const loginMutation = useMutation({
    mutationFn: (vars: { username: string; password: string }) =>
      api.post('/auth/login', vars),
    onSuccess: () => queryClient.invalidateQueries(['me']),
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => queryClient.invalidateQueries(['me']),
  });

  const login = (username: string, password: string) =>
    loginMutation.mutate({ username, password });
  const logout = () => logoutMutation.mutate();

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
