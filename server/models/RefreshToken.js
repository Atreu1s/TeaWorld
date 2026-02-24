// server/models/RefreshToken.js
import mongoose from 'mongoose';

// Создаём схему (структуру документа в MongoDB)
const refreshTokenSchema = new mongoose.Schema({
  // Сам токен (уникальная строка)
  token: {
    type: String,
    required: true,      // Обязательное поле
    unique: true         // Не может повторяться
  },
  
  // Ссылка на пользователя (кто владеет токеном)
  user: {
    type: mongoose.Schema.Types.ObjectId,  // Тип данных MongoDB
    ref: 'User',                           // Ссылка на модель User
    required: true
  },
  
  // Когда токен истекает (дата и время)
  expiresAt: {
    type: Date,
    required: true
  },
  
  // Когда токен создан (для статистики)
  createdAt: {
    type: Date,
    default: Date.now  // Автоматически ставит текущее время
  }
}, {
  timestamps: true  // Автоматически добавляет updatedAt
});

// 🔑 ИНДЕКС ДЛЯ АВТОУДАЛЕНИЯ
// MongoDB будет сама удалять документы, где expiresAt < текущего времени
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Экспортируем модель для использования в других файлах
export default mongoose.model('RefreshToken', refreshTokenSchema);