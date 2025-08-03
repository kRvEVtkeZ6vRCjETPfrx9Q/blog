import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post';
import Comment from '../models/Comment';
import auth, { AuthRequest } from '../middleware/auth';

const router = Router();

// Create post
router.post(
  '/',
  auth,
  [body('title').notEmpty(), body('description').notEmpty()],
  async (req: AuthRequest, res) => {
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

// Get posts with filtering/search/sorting
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

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update post
router.put(
  '/:id',
  auth,
  [body('title').notEmpty(), body('description').notEmpty()],
  async (req: AuthRequest, res) => {
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

// Delete post
router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Add comment
router.post(
  '/:id/comments',
  auth,
  [body('text').notEmpty()],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      const comment = new Comment({
        post: post._id,
        user: req.user.userId,
        text: req.body.text,
      });
      await comment.save();
      post.comments.push({ user: comment.user, text: comment.text, createdAt: comment.createdAt } as any);
      if (post.comments.length > 20) {
        post.comments = post.comments.slice(-20);
      }
      await post.save();
      res.json(comment);
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

// Get comments with fallback to collection
router.get('/:id/comments', async (req, res) => {
  const { skip = 0, limit = 20 } = req.query as any;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const s = parseInt(skip, 10);
    const l = parseInt(limit, 10);
    if (s < post.comments.length) {
      return res.json(post.comments.slice(s, s + l));
    }
    const comments = await Comment.find({ post: post._id })
      .sort({ createdAt: 1 })
      .skip(s - post.comments.length)
      .limit(l);
    res.json(comments);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;
