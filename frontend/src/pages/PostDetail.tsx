import { FormEvent, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

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
  const [post, setPost] = useState<Post | null>(null);
  const [text, setText] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => setPost(res.data));
  }, [id]);

  const addComment = async (e: FormEvent) => {
    e.preventDefault();
    const res = await api.post(`/posts/${id}/comments`, { text });
    setPost(res.data);
    setText('');
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <h3>Comments</h3>
      <ul>
        {post.comments.map((c, i) => (
          <li key={i}>{c.text}</li>
        ))}
      </ul>
      {token && (
        <form onSubmit={addComment}>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button type="submit">Add Comment</button>
        </form>
      )}
    </div>
  );
};

export default PostDetail;
