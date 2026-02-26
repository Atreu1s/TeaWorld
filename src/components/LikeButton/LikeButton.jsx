// src/components/LikeButton/LikeButton.jsx
import { useState } from 'react';
import { likeAPI } from '../../services/likeApi';
import { authAPI } from '../../services/api';
import './LikeButton.scss';

export default function LikeButton({ postId, initialLikesCount, initialIsLiked }) {
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleLike = async () => {
    if (loading) return;


    const user = authAPI.getUser();
    if (!user) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return; 
    }
    
    setLoading(true);
    
    const previousState = { likesCount, isLiked };
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(prev => !prev);

    try {
      const data = await likeAPI.toggleLike(postId);
      setLikesCount(data.likesCount);
      setIsLiked(data.isLiked);
    } catch (error) {
      setLikesCount(previousState.likesCount);
      setIsLiked(previousState.isLiked);
      console.error('Ошибка лайка:', error);
    } finally {
      setLoading(false);
    }
  };

    const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowWarning(false);
    }
  };

  return (
    <div className={`like-button-container`}>
      <button
        className={`like-button ${isLiked ? 'liked' : ''} ${loading ? 'loading' : ''}`}
        onClick={handleLike}
        disabled={loading}
      >
        <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
        <span className="like-count">{likesCount}</span>
      </button>

      {showWarning && (
        <div className="like-warning-overlay" onClick={handleOverlayClick}>
          <div className="like-warning" onClick={(e) => e.stopPropagation()}>
            <span className="warning-text">
              Пожалуйста, войдите в аккаунт, чтобы ставить лайки
            </span>
          </div>
        </div>
      )}
    </div>
  );
  
}