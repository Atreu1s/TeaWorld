// src/pages/blog/Blog.jsx
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../services/blogApi';
import PostSearchFilters from '../../components/postSearch/PostSearch';
import './blog.scss';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 🔍 Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogAPI.getAllPosts(page, 10);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('Не удалось загрузить посты');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

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

  if (loading) {
    return <div className="blog-container"><div className="loading">Загрузка постов...</div></div>;
  }

  if (error) {
    return <div className="blog-container"><div className="error">{error}</div></div>;
  }

  return (
    <div className="body-area">
      <div>
        <h1>Блог</h1>
      </div>

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

      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <p>Посты не найдены</p>
            {searchQuery && (
              <button onClick={handleClearFilters} className="btn-clear-search">
                Сбросить поиск
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post._id} className="BlogCard">
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <div className="post-meta">
                  <span className="post-author">Автор: {post.authorName}</span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              
              <div className="post-content">
                <p>{post.content.substring(0, 300)}{post.content.length > 300 ? '...' : ''}</p>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
              
              <Link to={`/blog/${post._id}`} className="ReadFullPost">
                Читать далее
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            className="paginationBtn"
          >
            Предыдущая
          </button>
          
          <span className="page-info">
            Страница {page} из {totalPages}
          </span>
          
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages}
            className="paginationBtn"
          >
            Следующая
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;