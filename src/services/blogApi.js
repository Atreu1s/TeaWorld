import api from './api';

export const blogAPI = {
  // Получить все посты (публично)
  getAllPosts: async (page = 1, limit = 10, tag = null) => {
    const params = { page, limit };
    if (tag) params.tag = tag;
    
    const response = await api.get('/blog/posts', { params });
    return response.data;
  },

  // Получить пост по ID (публично)
  getPostById: async (id) => {
    const response = await api.get(`/blog/posts/${id}`);
    return response.data;
  },

  // Создать пост (требуется авторизация + роль эксперт/админ)
  createPost: async (postData) => {
    const response = await api.post('/blog/posts', postData);
    return response.data;
  },

  // Получить свои посты (для профиля)
  getMyPosts: async () => {
    const response = await api.get('/blog/my-posts');
    return response.data;
  },

  // Обновить пост
  updatePost: async (id, postData) => {
    const response = await api.put(`/blog/posts/${id}`, postData);
    return response.data;
  },

  // Удалить пост
  deletePost: async (id) => {
    const response = await api.delete(`/blog/posts/${id}`);
    return response.data;
  }
};

export default blogAPI;