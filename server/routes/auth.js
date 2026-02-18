// server/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ========== РЕГИСТРАЦИЯ ==========
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }
    // закидывает переменную на наличие пользователей с таки логином и почтой
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    // проверяет че там с этой переменной
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Пользователь с таким email или именем уже существует' 
      });
    }

    const user = new User({ username, email, password }); // создание записи
    await user.save(); // сохранение записи в БД

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ========== ЛОГИН ==========
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    // 🔑 КРИТИЧЕСКИ ВАЖНО: загружаем пароль явно!
    const user = await User.findOne({ email }).select('+password'); // создаем переменную которая ищет по почте и провяет соответствие пароля... +password принудительно включить поле, исключённое по умолчанию
    
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Неверный email или пароль' }); // берем ту переменную и если не соответствует пароль или почта не найдена, то выводим ошибку
    }

    // Используем метод модели для сравнения паролей
    const isPasswordValid = await user.comparePassword(password); // сравнение пароля, который в БД и который ввел пользователь и вызывает метод в схемах
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Успешный вход',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        registeredAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Ошибка логина:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ========== ПРОФИЛЬ ==========
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(401).json({ message: 'Неверный или просроченный токен' });
  }
});

// 🔑 КРИТИЧЕСКИ ВАЖНО: экспорт по умолчанию
export default router;