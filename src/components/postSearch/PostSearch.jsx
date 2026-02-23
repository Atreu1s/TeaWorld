import './PostSearch.scss';

const PostSearchFilters = ({
  searchQuery,
  setSearchQuery,
  searchField,
  setSearchField,
  totalPosts,
  filteredPostsCount,
  onClearFilters
}) => {
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const getPlaceholderText = () => {
    const fieldNames = {
      all: 'всем полям',
      title: 'заголовку',
      content: 'тексту',
      tags: 'тегам',
      author: 'автору'
    };
    return `Поиск по ${fieldNames[searchField]}...`;
  };

  return (
    <div className="post-filters-container">
      <div className="filter-group">
        <label htmlFor="post-search-field">Поиск по:</label>
        <select 
          id="post-search-field"
          value={searchField} 
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="all">Всем полям</option>
          <option value="title">Заголовку</option>
          <option value="content">Тексту</option>
          <option value="tags">Тегам</option>
          <option value="author">Автору</option>
        </select>
      </div>
      
      <div className="filter-group search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder={getPlaceholderText()}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="search-clear-btn" 
            onClick={handleClearSearch}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="search-results-info">
        Найдено: <strong>{filteredPostsCount}</strong> из {totalPosts}
      </div>
      
      {(searchQuery) && (
        <button onClick={onClearFilters} className="btn-reset-filters">
          Сбросить
        </button>
      )}
    </div>
  );
};

export default PostSearchFilters;