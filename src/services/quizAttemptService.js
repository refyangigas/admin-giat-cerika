import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const getQuizAttempts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/quiz-attempt/admin/all`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    throw error;
  }
};