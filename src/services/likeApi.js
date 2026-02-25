import api from './api';

export const likeAPI = {
  // Лайкнуть/Убрать лайк
  toggleLike: async (postId) => {
    const response = await api.post(`/likes/post/${postId}`);
    return response.data;
  },

  // Получить кто лайкнул
  getPostLikes: async (postId) => {
    const response = await api.get(`/likes/post/${postId}`);
    return response.data;
  }
};