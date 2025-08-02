import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const router = Router();

router.post(
  '/register',
  [body('username').notEmpty(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (user) return res.status(400).json({ message: 'User already exists' });
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user = new User({ username, password: hashed });
      await user.save();
      res.json({ message: 'Registered successfully' });
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/login',
  [body('username').notEmpty(), body('password').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const payload = { userId: user.id };
      const secret = process.env.JWT_SECRET || 'secret';
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

export default router;
