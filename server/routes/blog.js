import express from 'express';
import jwt from 'jsonwebtoken';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Неверный или просроченный токен' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещён. Требуются права администратора.' });
  }
  next();
};

const isExpertOrAdmin = (req, res, next) => {
  if (req.user.role !== 'expert' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещён. Требуются права эксперта или администратора.' });
  }
  next();
};

const checkPostOwnership = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'У вас нет прав для редактирования этого поста' });
    }
    
    req.post = post; 
    next();
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    
    let query = {};
    if (tag) {
      query.tags = tag;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username')
      .lean(); 

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPosts: count
    });
  } catch (error) {
    console.error('Ошибка получения постов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .lean();
    
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    res.json(post);
  } catch (error) {
    console.error('Ошибка получения поста:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/posts', protect, isExpertOrAdmin, async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Заголовок и текст поста обязательны' });
    }

    if (tags.length > 10) {
      return res.status(400).json({ message: 'Максимум 10 тегов' });
    }

    const post = await Post.create({
      title,
      content,
      tags,
      author: req.user._id,
      authorName: req.user.username
    });

    res.status(201).json({
      message: 'Пост успешно создан',
      post
    });
  } catch (error) {
    console.error('Ошибка создания поста:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/my-posts', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? {} 
      : { author: req.user._id };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .lean();

    res.json({ posts });
  } catch (error) {
    console.error('Ошибка получения постов пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/posts/:id', protect, isExpertOrAdmin, checkPostOwnership, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    req.post.title = title || req.post.title;
    req.post.content = content || req.post.content;
    if (tags) req.post.tags = tags;

    await req.post.save();

    res.json({
      message: 'Пост успешно обновлён',
      post: req.post
    });
  } catch (error) {
    console.error('Ошибка обновления поста:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.delete('/posts/:id', protect, isExpertOrAdmin, checkPostOwnership, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Пост успешно удалён' });
  } catch (error) {
    console.error('Ошибка удаления поста:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;