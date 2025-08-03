import { FormEvent, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';

interface Comment {
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
  const [text, setText] = useState('');
  const { authenticated } = useContext(AuthContext);

  const { data: post, isLoading, refetch } = useQuery(['post', id], async () => {
    const res = await api.get(`/posts/${id}`);
    return res.data as Post;
  });

  const addCommentMutation = useMutation(
    (content: string) => api.post(`/posts/${id}/comments`, { text: content }),
    { onSuccess: () => refetch() }
  );

  const addComment = (e: FormEvent) => {
    e.preventDefault();
    addCommentMutation.mutate(text);
    setText('');
  };

  if (isLoading || !post) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p>{post.description}</p>
      <h3 className="font-semibold">Comments</h3>
      <ul className="space-y-1">
        {post.comments.map((c, i) => (
          <li key={i}>{c.text}</li>
        ))}
      </ul>
      {authenticated && (
        <form onSubmit={addComment} className="mt-2 space-y-2">
          <input
            className="border p-2 w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit">Add Comment</Button>
        </form>
      )}
    </div>
  );
};

export default PostDetail;
