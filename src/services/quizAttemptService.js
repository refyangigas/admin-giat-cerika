import api from './api';

const getQuizAttempts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/quiz-attempt/admin/all', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    throw error;
  }
};

export { getQuizAttempts };