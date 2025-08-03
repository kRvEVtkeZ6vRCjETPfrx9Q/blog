import { FormEvent, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '../components/ui/button';

interface Comment {
  _id: string;
  text: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  comments: Comment[];
}

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const { data: post } = useQuery<Post>(['post', id], async () => {
    const res = await api.get(`/posts/${id}`);
    setComments(res.data.comments || []);
    return res.data;
  });

  const commentMutation = useMutation({
    mutationFn: () => api.post(`/posts/${id}/comments`, { text }),
    onSuccess: (res) => {
      setComments((prev) => [...prev, res.data]);
      setText('');
    },
  });

  const loadMore = async () => {
    const res = await api.get(`/posts/${id}/comments`, {
      params: { skip: comments.length },
    });
    setComments((prev) => {
      const ids = new Set(prev.map((c) => c._id));
      const next = res.data.filter((c: Comment) => !ids.has(c._id));
      return [...prev, ...next];
    });
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <h3>Comments</h3>
      <ul>
        {comments.map((c, i) => (
          <li key={i}>{c.text}</li>
        ))}
      </ul>
      <Button onClick={loadMore}>Load more</Button>
      {user && (
        <form onSubmit={(e: FormEvent) => { e.preventDefault(); commentMutation.mutate(); }}>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <Button type="submit">Add Comment</Button>
        </form>
      )}
    </div>
  );
};

export default PostDetail;
