// src/components/quiz/QuizAttemptDetail.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Check, X } from 'lucide-react';

const QuizAttemptDetail = ({ attempt, isOpen, onClose }) => {
  if (!isOpen || !attempt) return null;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{attempt.quizTitle || 'Detail Quiz'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Summary */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <p><strong>Siswa:</strong> {attempt.userName || 'Unknown'}</p>
            <p><strong>Tanggal:</strong> {formatDate(attempt.date)}</p>
            <p><strong>Skor Akhir:</strong> {attempt.score || 0}</p>
            <p>
              <strong>Total Benar:</strong> {attempt.correctAnswers || 0} dari {attempt.totalQuestions || 0} soal
              ({Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100) || 0}%)
            </p>
          </div>

          {/* Answer List */}
          {attempt.answers && attempt.answers.length > 0 ? (
            <div className="space-y-4">
              {attempt.answers.map((answer, index) => (
                <Card key={index} className="border-l-4 border-l-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                        answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {answer.isCorrect ? '✓' : '✕'}
                      </span>
                      <span className="font-medium">Soal {index + 1}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Tidak ada data jawaban tersedia
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t">
          <button 
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptDetail;