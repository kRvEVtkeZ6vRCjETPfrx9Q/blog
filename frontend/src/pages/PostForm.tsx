import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Button } from '../components/ui/button';

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
    <form onSubmit={handleSubmit} className="space-y-2">
      <h2 className="text-xl font-bold">{id ? 'Edit' : 'New'} Post</h2>
      <input
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        className="border p-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        className="border p-2 w-full"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />
      <Button type="submit">Save</Button>
    </form>
  );
};

export default PostForm;
