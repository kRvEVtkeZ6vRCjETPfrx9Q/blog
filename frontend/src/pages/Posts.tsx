import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';

interface Post {
  _id: string;
  title: string;
}

const fetchPosts = async () => (await api.get('/posts')).data as Post[];

const Posts: React.FC = () => {
  const { authenticated } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { data: posts } = useQuery(['posts'], fetchPosts);
  const deleteMutation = useMutation(
    (id: string) => api.delete(`/posts/${id}`),
    { onSuccess: () => queryClient.invalidateQueries(['posts']) }
  );

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts?.map((p) => (
          <li key={p._id}>
            <Link to={`/posts/${p._id}`} className="underline">{p.title}</Link>
            {authenticated && (
              <>
                {' '}| <Link to={`/posts/${p._id}/edit`} className="underline">Edit</Link> |{' '}
                <Button variant="outline" onClick={() => deleteMutation.mutate(p._id)}>Delete</Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
