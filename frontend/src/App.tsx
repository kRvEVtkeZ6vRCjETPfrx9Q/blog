import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

interface Post {
  _id: string;
  title: string;
  description: string;
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    api.get('/posts').then((res) => setPosts(res.data));
  }, []);

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await api.post(
      '/posts',
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPosts([...posts, res.data]);
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <h1>Blog Posts</h1>
      <form onSubmit={createPost}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Create</button>
      </form>
      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            <strong>{p.title}</strong>: {p.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
