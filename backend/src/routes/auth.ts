import { Router } from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }).matches(/^[A-Za-z0-9]+$/)
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user = new User({ email, password: hashed });
      await user.save();
      res.json({ message: 'Registered successfully' });
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').exists()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      (req.session as any).userId = user.id;
      res.json({ message: 'Logged in' });
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

router.post('/logout', (req: Request, res: Response) => {
  req.session?.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

router.get('/me', (req: Request, res: Response) => {
  if (!req.session?.userId) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ userId: req.session.userId });
});

export default router;
