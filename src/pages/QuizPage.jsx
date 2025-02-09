import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Clock } from 'lucide-react';
import { getAllQuizzes, deleteQuiz } from '../services/quizService';
import QuizForm from '../components/quiz/Form';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const response = await getAllQuizzes();
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleAdd = () => {
    setSelectedQuiz(null);
    setIsFormOpen(true);
  };

  const handleEdit = (quiz) => {
    setSelectedQuiz(quiz);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus quiz ini?')) {
      try {
        await deleteQuiz(id);
        fetchQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedQuiz(null);
    fetchQuizzes();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Quiz</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          Tambah Quiz
        </button>
      </div>

      {/* List Quiz */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
              <div className="text-gray-600 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} />
                  <span>{quiz.timeLimit}</span>
                </div>
                <div>Total Soal: {quiz.totalQuestions}</div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(quiz)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <QuizForm
          quiz={selectedQuiz}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default QuizPage;