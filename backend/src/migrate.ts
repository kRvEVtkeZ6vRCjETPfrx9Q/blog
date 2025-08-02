import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post';
import User from './models/User';

dotenv.config();

export async function migrate() {
  await Promise.all([Post.syncIndexes(), User.syncIndexes()]);
}

if (require.main === module) {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/blog';
  mongoose
    .connect(mongoUri)
    .then(async () => {
      await migrate();
      await mongoose.disconnect();
      console.log('Migration completed');
    })
    .catch((err) => {
      console.error('Migration failed', err);
      process.exit(1);
    });
}
