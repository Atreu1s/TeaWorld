// server/models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Заголовок обязателен'],
    trim: true,
    minlength: [3, 'Заголовок должен содержать минимум 3 символа'],
    maxlength: [100, 'Заголовок не должен превышать 100 символов']
  },

  content: {
    type: String,
    required: [true, 'Текст поста обязателен'],
    trim: true,
    minlength: [10, 'Текст поста должен содержать минимум 10 символов']
  },

  tags: {
    type: [String],
    validate: {
      validator: (tags) => tags.length <= 10,
      message: 'Максимум 10 тегов'
    }
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  authorName: {
    type: String,
    required: true
  },

  likes: {
    type: Number,
    default: 0
  },

  commentsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Индексы для производительности
postSchema.index({ createdAt: -1 }); // Сортировка по дате создания
postSchema.index({ author: 1 });     // Поиск по автору
postSchema.index({ tags: 1 });       // Поиск по тегам

const Post = mongoose.model('Post', postSchema);

export default Post;