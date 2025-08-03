import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Button } from '../components/ui/button';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post('/auth/register', { email, password });
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h2 className="text-xl font-bold">Register</h2>
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
      <Button type="submit">Register</Button>
    </form>
  );
};

export default Register;
