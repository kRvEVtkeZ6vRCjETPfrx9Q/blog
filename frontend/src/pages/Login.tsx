import { FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post('/auth/login', { email, password });
    login();
    navigate('/posts');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h2 className="text-xl font-bold">Login</h2>
      <input
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="border p-2 w-full"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default Login;
