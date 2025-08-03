import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '../components/ui/button';

const PostForm: React.FC = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  useQuery(['post', id], async () => {
    const res = await api.get(`/posts/${id}`);
    setTitle(res.data.title);
    setDescription(res.data.description);
    setTags((res.data.tags || []).join(','));
    return res.data;
  }, { enabled: !!id });

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      id ? api.put(`/posts/${id}`, payload) : api.post('/posts', payload),
    onSuccess: () => navigate('/posts'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Edit' : 'New'} Post</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" />
      <Button type="submit">Save</Button>
    </form>
  );
};

export default PostForm;
