// server/routes/admin.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Middleware: проверка администратора
const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещён. Требуются права администратора.' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Неверный или просроченный токен' });
  }
};

// Получить всех пользователей
router.get('/users', protectAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error) {
    console.error('Ошибка получения списка пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Заблокировать/разблокировать пользователя
router.patch('/users/:id/block', protectAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    // Инвертируем статус блокировки
    user.isBlocked = !user.isBlocked;
    await user.save();
    
    res.json({
      message: user.isBlocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    console.error('Ошибка блокировки пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;