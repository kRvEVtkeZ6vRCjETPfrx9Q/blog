import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post';
import auth, { AuthRequest } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  auth,
  [body('title').notEmpty(), body('description').notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { title, description, tags } = req.body;
      const post = new Post({ title, description, tags });
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

router.get('/', async (req, res) => {
  const { search, tags, sort = 'createdAt', order = 'desc' } = req.query as any;
  const query: any = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (tags) {
    query.tags = { $in: (tags as string).split(',') };
  }
  try {
    const posts = await Post.find(query).sort({ [sort]: order === 'desc' ? -1 : 1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.put(
  '/:id',
  auth,
  [body('title').notEmpty(), body('description').notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { title, description, tags } = req.body;
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { title, description, tags },
        { new: true }
      );
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json(post);
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post(
  '/:id/comments',
  auth,
  [body('text').notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      const comment = { user: req.user.userId, text: req.body.text };
      post.comments.push(comment as any);
      await post.save();
      res.json(post);
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

export default router;
