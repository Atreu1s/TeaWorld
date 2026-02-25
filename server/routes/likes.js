import express from 'express';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/post/:postId', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }


    const isLiked = post.likes.includes(userId);

    if (isLiked) {

      post.likes = post.likes.filter(id => id.toString() !== userId);
      post.likesCount = post.likes.length;
      await post.save();
      
      return res.json({ 
        message: 'Лайк удалён', 
        isLiked: false,
        likesCount: post.likesCount 
      });
    } else {

      post.likes.push(userId);
      post.likesCount = post.likes.length;
      await post.save();
      
      return res.json({ 
        message: 'Лайк добавлен', 
        isLiked: true,
        likesCount: post.likesCount 
      });
    }
  } catch (error) {
    console.error('Ошибка лайка:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findById(postId)
      .populate('likes', 'username avatar');
    
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }
    
    res.json({
      likesCount: post.likesCount,
      likes: post.likes
    });
  } catch (error) {
    console.error('Ошибка получения лайков:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;