import React, { useState } from 'react';
import { Plus, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import { uploadQuestionImage } from '../../services/quizService';

const QuizQuestions = ({ data, onChange }) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(data.questions.length > 0 ? 0 : -1);

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

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...data.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    onChange({ questions: newQuestions });
  };

  const handleImageUpload = async (index, file) => {
    try {
      const response = await uploadQuestionImage(file);
      handleQuestionChange(index, 'image', response.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengupload gambar');
    }
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...data.questions];
    const question = newQuestions[questionIndex];
    
    if (field === 'isCorrect' && question.questionType === 'boolean') {
      // Untuk tipe boolean, hanya satu opsi yang bisa benar
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

  const removeQuestion = (index) => {
    const newQuestions = data.questions.filter((_, i) => i !== index);
    onChange({ questions: newQuestions });
    if (selectedQuestionIndex === index) {
      setSelectedQuestionIndex(Math.max(0, index - 1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Tombol Tambah Pertanyaan */}
      <div className="flex gap-2">
        <button
          onClick={() => addNewQuestion('boolean')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Soal Benar/Salah
        </button>
        <button
          onClick={() => addNewQuestion('multiple')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Soal Pilihan Ganda
        </button>
      </div>

      {/* List Pertanyaan */}
      <div className="flex gap-4">
        {/* Sidebar Pertanyaan */}
        <div className="w-1/4 space-y-2">
          {data.questions.map((question, index) => (
            <button
              key={index}
              onClick={() => setSelectedQuestionIndex(index)}
              className={`w-full p-3 rounded-lg text-left ${
                selectedQuestionIndex === index
                  ? 'bg-blue-50 border-blue-500 border-2'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">Soal {index + 1}</div>
              <div className="text-sm text-gray-500 truncate">
                {question.questionText || 'Pertanyaan baru'}
              </div>
            </button>
          ))}
        </div>

        {/* Form Pertanyaan */}
        {selectedQuestionIndex !== -1 && (
          <div className="flex-1 bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">
                Soal {selectedQuestionIndex + 1}
              </h3>
              <button
                onClick={() => removeQuestion(selectedQuestionIndex)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Teks Pertanyaan */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Pertanyaan
              </label>
              <textarea
                value={data.questions[selectedQuestionIndex].questionText}
                onChange={(e) => handleQuestionChange(selectedQuestionIndex, 'questionText', e.target.value)}
                className="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="Ketik pertanyaan di sini..."
              />
            </div>

            {/* Upload Gambar */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Gambar (Opsional)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                  <ImageIcon size={20} />
                  <span>Upload Gambar</span>
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(selectedQuestionIndex, e.target.files[0])}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {data.questions[selectedQuestionIndex].image && (
                  <div className="relative">
                    <img
                      src={data.questions[selectedQuestionIndex].image}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleQuestionChange(selectedQuestionIndex, 'image', null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Opsi Jawaban */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Opsi Jawaban
              </label>
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
              </div>

              {data.questions[selectedQuestionIndex].questionType === 'multiple' && (
                <button
                  onClick={() => addOption(selectedQuestionIndex)}
                  className="mt-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                >
                  <Plus size={20} />
                  Tambah Opsi
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Panduan */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Panduan Pengisian:</h3>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
          <li>Pilih jenis soal: Benar/Salah atau Pilihan Ganda</li>
          <li>Tulis pertanyaan dengan jelas</li>
          <li>Gambar bersifat opsional</li>
          <li>Untuk pilihan ganda, tambahkan opsi sesuai kebutuhan</li>
          <li>Tandai jawaban yang benar dengan checkbox/radio button</li>
        </ul>
      </div>
    </div>
  );
};

export default QuizQuestions;