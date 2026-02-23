import './UserSearch.scss';

const UserSearchFilters = ({
  searchQuery,
  setSearchQuery,
  searchField,
  setSearchField,
  statusFilter,
  setStatusFilter,
  totalUsers,
  filteredUsersCount,
  onClearFilters
}) => {
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const getPlaceholderText = () => {
    const fieldNames = {
      all: 'всем полям',
      username: 'нику',
      email: 'email',
      role: 'роли',
      id: 'ID'
    };
    return `Поиск по ${fieldNames[searchField]}...`;
  };

  return (
    <div className="filters-container">

      <div className="filter-group">
        <label htmlFor="status-filter">Статус:</label>
        <select 
          id="status-filter"
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Все</option>
          <option value="active">Активные</option>
          <option value="blocked">Заблокированные</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="search-field">Поиск по:</label>
        <select 
          id="search-field"
          value={searchField} 
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="all">Всем полям</option>
          <option value="username">Нику</option>
          <option value="email">Email</option>
          <option value="role">Роли</option>
          <option value="id">ID</option>
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
        Найдено: <strong>{filteredUsersCount}</strong> из {totalUsers}
      </div>
      
      {(searchQuery || statusFilter !== 'all') && (
        <button onClick={onClearFilters} className="btn-reset-filters">
          Сбросить фильтры
        </button>
      )}
    </div>
  );
};

export default UserSearchFilters;