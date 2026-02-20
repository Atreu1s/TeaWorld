// src/services/userAPI.js
import api from './api';

export const userAPI = {
  // Получить всех пользователей (только для админа)
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Заблокировать/разблокировать пользователя
  toggleBlockUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/block`);
    return response.data;
  }
};

export default userAPI;