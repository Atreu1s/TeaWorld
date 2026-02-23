import api from './api';

export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  toggleBlockUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/block`);
    return response.data;
  }
};

export default userAPI;