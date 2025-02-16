// src/pages/QuizAttemptsPage.jsx
import React, { useState, useEffect } from 'react';
import { getQuizAttempts } from '../services/quizAttemptService';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import QuizAttemptDetail from '../components/quiz/QuizAttemptDetail';

const QuizAttemptsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const loadAttempts = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getQuizAttempts(page);
      setAttempts(data.attempts);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttempts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hasil Quiz Siswa</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {attempts.map((attempt) => (
          <Card key={attempt.id}>
            <CardHeader>
              <CardTitle>{attempt.quizTitle}</CardTitle>
              <p className="text-sm text-gray-500">
                {new Date(attempt.date).toLocaleDateString('id-ID')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Siswa:</strong> {attempt.userName}</p>
                <p><strong>Skor:</strong> {attempt.score}</p>
                <p>
                  <strong>Hasil:</strong> {attempt.correctAnswers} benar dari {attempt.totalQuestions} soal
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setSelectedAttempt(attempt)}
              >
                Lihat Detail
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={pagination.page === 1}
          onClick={() => loadAttempts(pagination.page - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={pagination.page === pagination.totalPages}
          onClick={() => loadAttempts(pagination.page + 1)}
        >
          Next
        </button>
      </div>

      {/* Detail Modal */}
      <QuizAttemptDetail
        attempt={selectedAttempt}
        isOpen={!!selectedAttempt}
        onClose={() => setSelectedAttempt(null)}
      />
    </div>
  );
};

export default QuizAttemptsPage;