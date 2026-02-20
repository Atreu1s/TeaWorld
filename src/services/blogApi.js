import api from './api'; 

export const blogAPI = {
  getAllPosts: async (page = 1, limit = 10, tag = null) => {
    const params = { page, limit };
    if (tag) params.tag = tag;
    
    const response = await api.get('/blog/posts', { params });
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/blog/posts/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    console.log('Отправка поста на сервер:', postData);
    
    const response = await api.post('/blog/posts', postData);
    return response.data;
  },

  getMyPosts: async () => {
    const response = await api.get('/blog/my-posts');
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/blog/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/blog/posts/${id}`);
    return response.data;
  }
};

export default blogAPI;