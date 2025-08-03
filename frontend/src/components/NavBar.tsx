import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from './ui/button';

const NavBar: React.FC = () => {
  const { authenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="space-x-2">
      <Link to="/">Home</Link> | <Link to="/posts">Posts</Link>
      {authenticated ? (
        <>
          {' '}| <Link to="/posts/new">New Post</Link> |{' '}
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <>
          {' '}| <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
