// server/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';

const router = express.Router();

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },                    
    process.env.JWT_SECRET,        
    { expiresIn: '30m' }          
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,  
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, refreshToken) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
  
  await RefreshToken.create({
    token: refreshToken,
    user: userId,
    expiresAt
  });
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Ваш аккаунт заблокирован. Обратитесь к администрации.' });
    } 

    const isValid = await bcrypt.compare(String(password), String(user.password));
    if (!isValid) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    
    await saveRefreshToken(user._id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,                    
      secure: process.env.NODE_ENV === 'production',  
      sameSite: 'strict',               
      maxAge: 7 * 24 * 60 * 60 * 1000    
    });

    res.json({
      message: 'Вход выполнен',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      },
      accessToken
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/refresh', async (req, res) => {

  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh токен не найден' });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res.status(401).json({ message: 'Неверный refresh токен' });
    }

    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ token: refreshToken });
      return res.status(401).json({ message: 'Refresh токен истёк' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user || user.isBlocked) {
      await RefreshToken.deleteOne({ token: refreshToken });
      return res.status(403).json({ message: 'Доступ запрещён' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    await RefreshToken.deleteOne({ token: refreshToken });
    await saveRefreshToken(user._id, newRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    res.status(401).json({ message: 'Неверный refresh токен' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.clearCookie('refreshToken');
    
    res.json({ message: 'Выход выполнен' });
  } catch (error) {
    console.error('Ошибка выхода:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user'
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await saveRefreshToken(user._id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'Пользователь создан',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;