import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../services/blogApi';
import './blog.scss';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  if (loading) {
    return <div className="blog-container"><div className="loading">Загрузка постов...</div></div>;
  }

  if (error) {
    return <div className="blog-container"><div className="error">{error}</div></div>;
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Блог</h1>
      </div>

      <div className="posts-grid">
        {posts.map(post => (
          <div key={post._id} className="blog-post-card">
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
            
            <Link to={`/blog/${post._id}`} className="read-more">
              Читать далее →
            </Link>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            className="pagination-btn"
          >
            ← Предыдущая
          </button>
          
          <span className="page-info">
            Страница {page} из {totalPages}
          </span>
          
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Следующая →
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;