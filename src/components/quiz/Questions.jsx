// components/quiz/Questions.jsx
import React, { useState } from 'react';
import { Plus, Image as ImageIcon, X, ArrowUp, ArrowDown } from 'lucide-react';
import ImageUploadModal from './ImageUploadModal';

const Questions = ({ data, onChange }) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(data.questions.length > 0 ? 0 : -1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const addNewQuestion = (type) => {
    const newQuestion = {
      orderNumber: data.questions.length + 1,
      questionText: '',
      questionType: type,
      image: null,
      options: type === 'boolean' ? [
        { text: 'Benar', isCorrect: true },
        { text: 'Salah', isCorrect: false }
      ] : []
    };

    const newQuestions = [...data.questions, newQuestion];
    onChange({ questions: newQuestions });
    setSelectedQuestionIndex(newQuestions.length - 1);
  };

  // Fungsi untuk memindahkan pertanyaan ke atas/bawah
  const moveQuestion = (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === data.questions.length - 1)) {
      return;
    }

    const newQuestions = [...data.questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[newIndex];
    newQuestions[newIndex] = temp;

    // Update orderNumber
    newQuestions.forEach((q, idx) => {
      q.orderNumber = idx + 1;
    });

    onChange({ questions: newQuestions });
    setSelectedQuestionIndex(newIndex);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...data.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    onChange({ questions: newQuestions });
  };

  const handleImageUpload = async (croppedImage) => {
    if (selectedQuestionIndex === -1) return;
    
    try {
      // Convert cropped image URL to File object
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

      // Upload image
      const formData = new FormData();
      formData.append('image', file);
      const uploadResponse = await quizService.uploadImage(formData);

      // Update question with image URL
      handleQuestionChange(selectedQuestionIndex, 'image', uploadResponse.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengupload gambar');
    }
  };

  const removeImage = (index) => {
    handleQuestionChange(index, 'image', null);
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...data.questions];
    const question = newQuestions[questionIndex];
    
    if (field === 'isCorrect' && question.questionType === 'boolean') {
      // For boolean, only one option can be correct
      question.options = question.options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === optionIndex
      }));
    } else {
      question.options[optionIndex] = {
        ...question.options[optionIndex],
        [field]: value
      };
    }

    onChange({ questions: newQuestions });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...data.questions];
    newQuestions[questionIndex].options.push({
      text: '',
      isCorrect: false
    });
    onChange({ questions: newQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...data.questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    onChange({ questions: newQuestions });
  };

  return (
    <div className="space-y-6">
      {/* Tombol tambah pertanyaan */}
      <div className="flex gap-2">
        <button
          onClick={() => addNewQuestion('boolean')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Plus className="inline-block mr-2" size={20} />
          Tambah Soal Benar/Salah
        </button>
        <button
          onClick={() => addNewQuestion('multiple')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="inline-block mr-2" size={20} />
          Tambah Soal Pilihan Ganda
        </button>
      </div>

      {/* List pertanyaan dan form edit */}
      <div className="flex gap-4">
        {/* List pertanyaan */}
        <div className="w-1/3">
          {data.questions.map((question, index) => (
            <div
              key={index}
              className={`p-4 mb-2 rounded-lg border cursor-pointer ${
                selectedQuestionIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedQuestionIndex(index)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Soal {index + 1}</span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveQuestion(index, 'up');
                    }}
                    disabled={index === 0}
                    className="p-1 hover:bg-blue-100 rounded"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveQuestion(index, 'down');
                    }}
                    disabled={index === data.questions.length - 1}
                    className="p-1 hover:bg-blue-100 rounded"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 truncate">{question.questionText || 'Pertanyaan baru'}</p>
            </div>
          ))}
        </div>

        {/* Form edit pertanyaan */}
        {selectedQuestionIndex !== -1 && (
          <div className="flex-1 p-4 border rounded-lg">
            <textarea
              value={data.questions[selectedQuestionIndex].questionText}
              onChange={(e) => handleQuestionChange(selectedQuestionIndex, 'questionText', e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
              rows="3"
              placeholder="Ketik pertanyaan di sini..."
            />

            {/* Image upload */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon size={20} />
                <span className="text-sm font-medium">Gambar (Opsional)</span>
              </div>
              
              {data.questions[selectedQuestionIndex].image ? (
                <div className="relative inline-block">
                  <img
                    src={data.questions[selectedQuestionIndex].image}
                    alt="Question"
                    className="max-h-48 rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(selectedQuestionIndex)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Upload Gambar
                </button>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2">
              {data.questions[selectedQuestionIndex].options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type={data.questions[selectedQuestionIndex].questionType === 'boolean' ? 'radio' : 'checkbox'}
                    checked={option.isCorrect}
                    onChange={(e) => handleOptionChange(selectedQuestionIndex, optionIndex, 'isCorrect', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(selectedQuestionIndex, optionIndex, 'text', e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder={`Opsi ${optionIndex + 1}`}
                  />
                  {data.questions[selectedQuestionIndex].questionType !== 'boolean' && (
                    <button
                      onClick={() => removeOption(selectedQuestionIndex, optionIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}

              {data.questions[selectedQuestionIndex].questionType === 'multiple' && (
                <button
                  onClick={() => addOption(selectedQuestionIndex)}
                  className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                >
                  <Plus className="inline-block mr-2" size={20} />
                  Tambah Opsi
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onUpload={handleImageUpload}
      />
    </div>
  );
};

export default Questions;