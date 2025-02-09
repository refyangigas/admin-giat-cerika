import api from './api';

export const getAllQuizzes = () => api.get('/api/quiz');

export const getQuizById = (id) => api.get(`/api/quiz/${id}`);

export const createQuiz = (data) => {
    // Log data before sending
    console.log('Sending quiz data:', data);
    return api.post('/api/quiz', data);
  };

export const updateQuiz = (id, data) => api.put(`/api/quiz/${id}`, data);

export const deleteQuiz = (id) => api.delete(`/api/quiz/${id}`);

export const reorderQuestions = (quizId, questionOrders) => 
  api.post(`/api/quiz/${quizId}/reorder`, { questionOrders });

export const uploadQuestionImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/api/quiz/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};