import { useState } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { createQuiz, updateQuiz } from '../../services/quizService';

const QuizForm = ({ initialData = null, onSuccess }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [questions, setQuestions] = useState(
    initialData?.questions.map(q => ({
      ...q,
      // Jika ada image, gunakan data yang ada
      image: q.image || null
    })) || []
  );
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'multiple',
        image: null,
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }
    ]);
  };

  const handleTypeChange = (questionIndex, newType) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    question.type = newType;
    
    if (newType === 'boolean') {
      question.options = [
        { text: 'Benar', isCorrect: false },
        { text: 'Salah', isCorrect: false }
      ];
    } else if (newType === 'multiple' && question.options.length < 4) {
      question.options = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ];
    }
    
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleImageUpload = (questionIndex, file) => {
    if (file) {
      // Create local preview URL
      const previewUrl = URL.createObjectURL(file);
      
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].image = {
        file, // Store the file object for upload
        previewUrl, // Store preview URL for display
        // If updating, keep the existing public_id if any
        public_id: questions[questionIndex]?.image?.public_id
      };
      setQuestions(updatedQuestions);
    }
  };

  const handleImageRemove = (questionIndex) => {
    const updatedQuestions = [...questions];
    
    // If there's a preview URL, revoke it to free up memory
    if (updatedQuestions[questionIndex].image?.previewUrl) {
      URL.revokeObjectURL(updatedQuestions[questionIndex].image.previewUrl);
    }
    
    updatedQuestions[questionIndex].image = null;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      alert('Tambahkan minimal satu pertanyaan');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      // Prepare questions data without file objects
      const questionsForSubmit = questions.map(q => ({
        ...q,
        image: q.image?.file ? null : q.image // Keep existing image data if no new file
      }));
      formData.append('questions', JSON.stringify(questionsForSubmit));

      // Append new image files
      questions.forEach((question, index) => {
        if (question.image?.file instanceof File) {
          formData.append(`image_${index}`, question.image.file);
        }
      });

      if (initialData?._id) {
        await updateQuiz(initialData._id, formData);
      } else {
        await createQuiz(formData);
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Terjadi kesalahan saat menyimpan quiz');
    } finally {
      setLoading(false);
    }
  };

  const getImageDisplayUrl = (questionImage) => {
    if (!questionImage) return null;
    return questionImage.previewUrl || questionImage.url;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title and Description fields remain the same */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul Quiz
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-6">
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="p-4 border border-gray-200 rounded-lg">
            {/* Question Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">Pertanyaan {questionIndex + 1}</h3>
              <button
                type="button"
                onClick={() => removeQuestion(questionIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Question Content */}
            <div className="space-y-4 mb-4">
              {/* Question Text */}
              <div>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                  placeholder="Masukkan pertanyaan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Question Type and Image Upload */}
              <div className="flex items-center gap-4">
                <select
                  value={question.type}
                  onChange={(e) => handleTypeChange(questionIndex, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="multiple">Pilihan Ganda</option>
                  <option value="boolean">Benar/Salah</option>
                </select>
                
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id={`image-${questionIndex}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(questionIndex, e.target.files[0])}
                  />
                  <label
                    htmlFor={`image-${questionIndex}`}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <ImageIcon size={20} />
                    <span>Upload Gambar</span>
                  </label>
                </div>
              </div>
              
              {/* Image Preview */}
              {getImageDisplayUrl(question.image) && (
                <div className="relative inline-block">
                  <img
                    src={getImageDisplayUrl(question.image)}
                    alt="Preview"
                    className="max-h-40 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(questionIndex)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct-${questionIndex}`}
                      checked={option.isCorrect}
                      onChange={() => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[questionIndex].options.forEach((opt, i) => {
                          opt.isCorrect = i === optionIndex;
                        });
                        setQuestions(updatedQuestions);
                      }}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'text', e.target.value)}
                      placeholder={`Opsi ${optionIndex + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      required
                      readOnly={question.type === 'boolean'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Plus size={20} />
          <span>Tambah Pertanyaan</span>
        </button>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading || questions.length === 0}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Menyimpan...' : 'Simpan Quiz'}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;