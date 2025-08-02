import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const PostForm: React.FC = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.get(`/posts/${id}`).then((res) => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setTags((res.data.tags || []).join(','));
      });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { title, description, tags: tags.split(',').map((t) => t.trim()).filter(Boolean) };
    if (id) {
      await api.put(`/posts/${id}`, payload);
    } else {
      await api.post('/posts', payload);
    }
    navigate('/posts');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Edit' : 'New'} Post</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" />
      <button type="submit">Save</button>
    </form>
  );
};

export default PostForm;
