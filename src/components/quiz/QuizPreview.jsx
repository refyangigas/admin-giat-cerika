import React from 'react';

const QuizPreview = ({ quiz }) => {
  // Tidak perlu modifikasi URL lagi karena Cloudinary sudah memberikan URL lengkap
  const getImageUrl = (image) => {
    if (!image || !image.url) return null;
    return image.url;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">{quiz.title}</h3>
        <p className="text-gray-600">{quiz.description}</p>
      </div>
  
      <div className="space-y-8">
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="border-b pb-6">
            <div className="mb-4">
              <h4 className="font-medium mb-2">
                Pertanyaan {qIndex + 1}: {question.text}
              </h4>
              {question.image?.url && (
                <img 
                  src={getImageUrl(question.image)} 
                  alt={`Question ${qIndex + 1}`}
                  className="max-w-full h-auto mb-4 rounded"
                />
              )}
            </div>
  
            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <div 
                  key={oIndex}
                  className={`p-3 border rounded-lg 
                    ${option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                >
                  {option.text}
                  {option.isCorrect && (
                    <span className="ml-2 text-green-500 text-sm">(Jawaban Benar)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizPreview;