// services/quizService.js
import api from './api';

export const quizService = {
  // Get all quizzes
  getAll: () => api.get('/quiz'),
  
  // Get quiz by ID
  getById: (id) => api.get(`/quiz/${id}`),
  
  // Create new quiz
  create: (data) => api.post('/quiz', data),
  
  // Update quiz
  update: (id, data) => api.put(`/quiz/${id}`, data),
  
  // Delete quiz
  delete: (id) => api.delete(`/quiz/${id}`),
  
  // Upload image
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/quiz/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};