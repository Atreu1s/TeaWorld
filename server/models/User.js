// server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ========== СХЕМА ПОЛЬЗОВАТЕЛЯ ==========
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Имя пользователя обязательно'],
    unique: true, // ← Уникальный индекс создаётся АВТОМАТИЧЕСКИ
    trim: true,
    minlength: [3, 'Имя должно содержать минимум 3 символа'],
    maxlength: [30, 'Имя не должно превышать 30 символов'],
    validate: {
      validator: (v) => /^[a-zA-Z0-9_-]+$/.test(v),
      message: 'Имя пользователя может содержать только буквы, цифры, дефис и подчёркивание'
    }
  },

  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true, // ← Уникальный индекс создаётся АВТОМАТИЧЕСКИ
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Неверный формат email']
  },

  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [8, 'Пароль должен содержать минимум 8 символов'],
    select: false // ← По умолчанию НЕ возвращается в запросах
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// ======================================================
// ========== MIDDLEWARE: ХЕШИРОВАНИЕ ПАРОЛЯ ==========
// ======================================================

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  this.password = await bcrypt.hash(this.password, 12);
  
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
});

// ======================================================
// ========== МЕТОДЫ СХЕМЫ ==========
// ======================================================

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}; // метод для сравнения паролья который сравнивет хешированный пароль с вводимым

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// ======================================================
// ✅ УДАЛИЛИ ДУБЛИРУЮЩИЕ ИНДЕКСЫ:
// userSchema.index({ email: 1 });   ← УДАЛЕНО (уже есть через unique: true)
// userSchema.index({ username: 1 }); ← УДАЛЕНО (уже есть через unique: true)
// ======================================================

const User = mongoose.model('User', userSchema);

export default User;