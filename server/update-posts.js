// server/update-posts.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔗 MONGODB_URI:', process.env.MONGODB_URI);

const Post = mongoose.model('Post', new mongoose.Schema({
  title: String,
  content: String,
  author: mongoose.Schema.Types.ObjectId,
  authorName: String,
  likes: [mongoose.Schema.Types.ObjectId],
  likesCount: Number
}, { timestamps: true }));

async function updatePosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB подключена');

    const totalPosts = await Post.countDocuments();
    console.log('📊 Всего постов в базе:', totalPosts);

    // 🔑 Обновляем ВСЕ посты (без условий)
    const result = await Post.updateMany(
      {},  // ← Все посты
      { 
        $set: { 
          likes: [], 
          likesCount: 0 
        } 
      }
    );

    console.log('✅ Обновлено постов:', result.modifiedCount);
    console.log('✅ Всего затронуто:', result.matchedCount);

    await mongoose.connection.close();
    console.log('✅ Готово!');
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

updatePosts();