import { useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';

interface Post {
  _id: string;
  title: string;
}

const Posts: React.FC = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { data: posts = [] } = useQuery<Post[]>(['posts'], async () => {
    const res = await api.get('/posts');
    return res.data;
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/posts/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  });

  const deletePost = (id: string) => deleteMutation.mutate(id);

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            <Link to={`/posts/${p._id}`}>{p.title}</Link>
            {user && (
              <>
                {' '}| <Link to={`/posts/${p._id}/edit`}>Edit</Link> |{' '}
                <Button onClick={() => deletePost(p._id)}>Delete</Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
