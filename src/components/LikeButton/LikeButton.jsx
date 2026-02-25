// src/components/LikeButton/LikeButton.jsx
import { useState } from 'react';
import { likeAPI } from '../../services/likeApi';
import './LikeButton.scss';

export default function LikeButton({ postId, initialLikesCount, initialIsLiked }) {
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;  // Защита от двойного клика
    
    setLoading(true);
    
    // Оптимистичное обновление (сразу меняем UI)
    const previousState = { likesCount, isLiked };
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(prev => !prev);

    try {
      const data = await likeAPI.toggleLike(postId);
      // Синхронизируем с сервером
      setLikesCount(data.likesCount);
      setIsLiked(data.isLiked);
    } catch (error) {
      // Откат при ошибке
      setLikesCount(previousState.likesCount);
      setIsLiked(previousState.isLiked);
      console.error('Ошибка лайка:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`like-button ${isLiked ? 'liked' : ''} ${loading ? 'loading' : ''}`}
      onClick={handleLike}
      disabled={loading}
    >
      <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
      <span className="like-count">{likesCount}</span>
    </button>
  );
}