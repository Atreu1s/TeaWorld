import { Link } from 'react-router-dom';
import './PostGeneration.scss';

const PostGeneration = ({ posts = [], onDelete, userRole, currentUserId }) => {
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

  return (
    <div className="profile-section">
      <h2>Посты</h2>
      
      {posts.length === 0 ? (
        <div className="no-posts">
          <p className="no-posts-message">У вас пока нет опубликованных постов</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map(post => (
            <div key={post._id} className="post-card">

              <div className="post-header">
                <h3>{post.title}</h3>
                <span className="post-date">
                  {formatDate(post.createdAt)}
                </span>

                  

              </div>
              
              <div className="post-content">
                <p>
                  {post.content.length > 50 
                    ? `${post.content.substring(0, 50)}...` 
                    : post.content}
                </p>
                   
                <strong><span className="post-author">Автор: {post.authorName}</span></strong>

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
          ))}
        </div>
      )}
    </div>
  );
};

export default PostGeneration;