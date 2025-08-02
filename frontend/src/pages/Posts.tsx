import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

interface Post {
  _id: string;
  title: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    api.get('/posts').then((res) => setPosts(res.data));
  }, []);

  const deletePost = async (id: string) => {
    await api.delete(`/posts/${id}`);
    setPosts(posts.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            <Link to={`/posts/${p._id}`}>{p.title}</Link>
            {token && (
              <>
                {' '}| <Link to={`/posts/${p._id}/edit`}>Edit</Link> |{' '}
                <button onClick={() => deletePost(p._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
