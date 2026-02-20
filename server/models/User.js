import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Имя пользователя обязательно'],
    unique: true, 
    trim: true,
    minlength: [3, 'Имя должно содержать минимум 3 символа'],
    maxlength: [30, 'Имя не должно превышать 30 символов'],
    validate: {
      validator: (v) => /^[a-zA-Z0-9_-]+$/.test(v),
      message: 'Имя пользователя может содержать только буквы, цифры, дефис и подчёркивание'
    }
  },
    isBlocked: {
    type: Boolean,
    default: false
  },

  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Неверный формат email']
  },

  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [8, 'Пароль должен содержать минимум 8 символов'],
    select: false 
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ['user', 'expert', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});


userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  this.password = await bcrypt.hash(this.password, 12);
  
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}; 

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;