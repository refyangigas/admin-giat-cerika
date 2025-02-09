import React, { useState } from 'react';
import { GripVertical, ArrowUp, ArrowDown, Clock } from 'lucide-react';

const QuizPreview = ({ data, onReorder }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Handle drag and drop
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('questionIndex', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = e.dataTransfer.getData('questionIndex');
    reorderQuestions(parseInt(sourceIndex), targetIndex);
  };

  // Handle manual reordering
  const moveQuestion = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < data.questions.length) {
      reorderQuestions(index, newIndex);
    }
  };

  const reorderQuestions = (oldIndex, newIndex) => {
    const newQuestions = [...data.questions];
    const [movedQuestion] = newQuestions.splice(oldIndex, 1);
    newQuestions.splice(newIndex, 0, movedQuestion);
    
    // Update order numbers
    const reorderedQuestions = newQuestions.map((q, index) => ({
      ...q,
      orderNumber: index + 1
    }));
    
    onReorder(reorderedQuestions);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="text-xl font-bold mb-2">{data.title}</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={20} />
          <span>
            {data.hasTimeLimit 
              ? `Waktu: ${data.timeLimit.hours} jam ${data.timeLimit.minutes} menit ${data.timeLimit.seconds} detik`
              : 'Tidak ada batas waktu'
            }
          </span>
        </div>
        <div className="mt-1 text-gray-600">
          Total Soal: {data.questions.length}
        </div>
      </div>

      {/* Questions Preview */}
      <div className="space-y-4">
        {data.questions.map((question, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`bg-white p-4 rounded-lg border ${
              selectedQuestion === index ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {/* Question Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <GripVertical className="cursor-move text-gray-400" size={20} />
                <span className="text-lg font-medium">Soal {index + 1}</span>
              </div>
              <div className="flex-1" />
              <div className="flex gap-2">
                <button
                  onClick={() => moveQuestion(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ArrowUp size={20} />
                </button>
                <button
                  onClick={() => moveQuestion(index, 'down')}
                  disabled={index === data.questions.length - 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ArrowDown size={20} />
                </button>
              </div>
            </div>

            {/* Question Content */}
            <div className="space-y-4">
              {question.image && (
                <img
                  src={question.image}
                  alt="Question"
                  className="max-h-48 object-contain rounded-lg"
                />
              )}
              <p>{question.questionText}</p>

              {/* Options */}
              <div className="ml-4 space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`flex items-center gap-2 p-2 rounded ${
                      option.isCorrect ? 'bg-green-50' : ''
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
                      <span className="text-green-600 text-sm">(Jawaban Benar)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Panduan */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Panduan Pengaturan Urutan:</h3>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
          <li>Drag & drop soal untuk mengubah urutan</li>
          <li>Gunakan tombol panah untuk memindahkan soal ke atas/bawah</li>
          <li>Preview menampilkan tampilan sesuai dengan yang akan dilihat user</li>
          <li>Jawaban yang benar ditandai dengan warna hijau</li>
        </ul>
      </div>
    </div>
  );
};

export default QuizPreview;