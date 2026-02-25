// server/middleware/auth.js
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    // 1. Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Нет токена доступа' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Сохраняем пользователя в request
    req.user = {
      userId: decoded.userId
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Неверный токен' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Токен истёк' });
    }
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};