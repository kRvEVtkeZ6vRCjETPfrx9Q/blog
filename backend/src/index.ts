import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import { migrate } from './migrate';

dotenv.config();

const app = express();
app.use(
  cors({ origin: process.env.CLIENT_URL || true, credentials: true })
);
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/blog';

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoUri }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log('MongoDB connected');
    await migrate();
  })
  .catch((err) => console.error('MongoDB connection error', err));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
