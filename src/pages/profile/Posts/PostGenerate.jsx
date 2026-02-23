// src/components/blog/PostGeneration.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PostSearchFilters from '../../../components/postSearch/PostSearch';
import './PostGeneration.scss';

const PostGeneration = ({ posts = [], onDelete, userRole, currentUserId }) => {
  // 🔍 Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');

  const canDeletePost = (post) => {
    return userRole === 'admin' || post.author?.toString() === currentUserId;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 🔍 Фильтрация постов
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase().trim();

    return posts.filter(post => {
      if (searchField === 'all') {
        return (
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.authorName?.toLowerCase().includes(query) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }
      
      if (searchField === 'title') {
        return post.title.toLowerCase().includes(query);
      }
      
      if (searchField === 'content') {
        return post.content.toLowerCase().includes(query);
      }
      
      if (searchField === 'tags') {
        return post.tags && post.tags.some(tag => tag.toLowerCase().includes(query));
      }
      
      if (searchField === 'author') {
        return post.authorName?.toLowerCase().includes(query);
      }

      return false;
    });
  }, [posts, searchQuery, searchField]);

  // Очистка всех фильтров
  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchField('all');
  };

  return (
    <div className="profile-section">
      <h2>Посты</h2>
      
      {/* 🔍 Компонент поиска */}
      <PostSearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchField={searchField}
        setSearchField={setSearchField}
        totalPosts={posts.length}
        filteredPostsCount={filteredPosts.length}
        onClearFilters={handleClearFilters}
      />
      
      {filteredPosts.length === 0 ? (
        <div className="no-posts">
          <p className="no-posts-message">
            {posts.length === 0 ? 'У вас пока нет опубликованных постов' : 'Посты не найдены'}
          </p>
          {searchQuery && (
            <button onClick={handleClearFilters} className="btn-clear-search">
              Сбросить поиск
            </button>
          )}
        </div>
      ) : (
        <div className="posts-list">
          {filteredPosts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <strong><span className="post-date">
                  {formatDate(post.createdAt)}
                </span></strong>
                <strong><span className="post-author">Автор: {post.authorName}</span></strong>
              </div>

              <div className='post-area'>
                <div className="post-content">
                  <p>
                    {post.content.length > 50 
                      ? `${post.content.substring(0, 50)}...` 
                      : post.content}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="post-footer">
                  {canDeletePost(post) && (
                    <div className="post-actions">
                      <button 
                        onClick={() => onDelete(post._id)} 
                        className="btn-delete"
                        aria-label={`Удалить пост "${post.title}"`}
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                  <Link to={`/blog/${post._id}`} className="read-more-btn">
                    Читать
                  </Link>
                  <Link 
                    to={`/blog/edit/${post._id}`} 
                    className="btn-edit"
                    aria-label={`Редактировать пост "${post.title}"`}
                  >
                    Редактировать
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostGeneration;