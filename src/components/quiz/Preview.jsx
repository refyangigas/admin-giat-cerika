// components/quiz/Preview.jsx
import React from 'react';
import { Clock } from 'lucide-react';
import { formatTimeLimit } from '../../utils/formatters';

const Preview = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="text-xl font-bold mb-2">{data.title}</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={20} />
          <span>
            {data.hasTimeLimit ? formatTimeLimit(data.timeLimit) : 'Tidak ada batas waktu'}
          </span>
        </div>
        <div className="mt-1 text-gray-600">
          Total Soal: {data.questions.length}
        </div>
      </div>

      {/* Questions Preview */}
      <div className="space-y-6">
        {data.questions.map((question, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border">
            <div className="text-lg font-medium mb-4">
              Soal {index + 1}
            </div>

            {/* Question Content */}
            <div className="space-y-4">
              {/* Question Image */}
              {question.image && (
                <div className="mb-4">
                  <img
                    src={question.image}
                    alt={`Gambar untuk soal ${index + 1}`}
                    className="max-h-48 object-contain rounded-lg"
                  />
                </div>
              )}

              {/* Question Text */}
              <p className="text-lg mb-4">{question.questionText}</p>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, optIndex) => (
                  <div 
                    key={optIndex}
                    className={`p-3 rounded-lg flex items-center gap-3 ${
                      option.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <input
                      type={question.questionType === 'boolean' ? 'radio' : 'checkbox'}
                      checked={option.isCorrect}
                      readOnly
                      className="w-4 h-4"
                    />
                    <span className={option.isCorrect ? 'font-medium' : ''}>
                      {option.text}
                    </span>
                    {option.isCorrect && (
                      <span className="text-green-600 text-sm ml-auto">
                        (Jawaban Benar)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Informasi Quiz:</h3>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
          <li>Total pertanyaan: {data.questions.length}</li>
          <li>Waktu pengerjaan: {data.hasTimeLimit ? formatTimeLimit(data.timeLimit) : 'Tidak ada batas waktu'}</li>
          <li>Tipe soal: {data.questions.some(q => q.questionType === 'multiple') ? 'Campuran (Pilihan Ganda & Benar/Salah)' : 'Benar/Salah'}</li>
        </ul>
      </div>
    </div>
  );
};

export default Preview;