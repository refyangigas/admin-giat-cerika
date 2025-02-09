import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createQuiz, updateQuiz } from '../../services/quizService';
import QuizBasicInfo from './QuizBasicInfo';
import QuizQuestions from './QuizQuestions';
import QuizPreview from './QuizPreview';

const STEPS = [
  { id: 1, title: 'Informasi Dasar' },
  { id: 2, title: 'Pertanyaan' },
  { id: 3, title: 'Preview' }
];

const QuizForm = ({ quiz, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: quiz?.title || '',
    hasTimeLimit: quiz?.hasTimeLimit || false,
    timeLimit: quiz?.timeLimit || { hours: 0, minutes: 0, seconds: 0 },
    questions: quiz?.questions || []
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'
  const [draftId, setDraftId] = useState(quiz?._id || null);

  // Autosave dengan debounce
  useEffect(() => {
    if (!formData.title) return; // Tidak save jika judul kosong

    const saveData = async () => {
      try {
        setSaving(true);
        setSaveStatus('saving');
        
        const saveFunction = draftId ? updateQuiz : createQuiz;
        const response = await saveFunction(draftId || '', formData);
        
        if (!draftId) {
          setDraftId(response.data._id);
        }
        
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000); // Hilangkan status setelah 2 detik
      } catch (error) {
        console.error('Error saving quiz:', error);
        setSaveStatus('error');
      } finally {
        setSaving(false);
      }
    };

    const timeoutId = setTimeout(saveData, 1000); // Debounce 1 detik
    return () => clearTimeout(timeoutId);
  }, [formData, draftId]);

  const handleDataChange = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuizBasicInfo
            data={formData}
            onChange={handleDataChange}
          />
        );
      case 2:
        return (
          <QuizQuestions
            data={formData}
            onChange={handleDataChange}
          />
        );
      case 3:
        return (
          <QuizPreview
            data={formData}
            onReorder={(newQuestions) => handleDataChange({ questions: newQuestions })}
          />
        );
      default:
        return null;
    }
  };

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return <span className="text-blue-500">Menyimpan...</span>;
      case 'saved':
        return <span className="text-green-500">✓ Tersimpan</span>;
      case 'error':
        return <span className="text-red-500">! Gagal menyimpan</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">
              {quiz ? 'Edit Quiz' : 'Tambah Quiz'}
            </h2>
            <div className="text-sm text-gray-500">{renderSaveStatus()}</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="px-4 py-2 border-b">
          <div className="flex justify-between">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  currentStep === step.id ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    currentStep === step.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {step.id}
                </div>
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            disabled={currentStep === 1}
          >
            Kembali
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Tutup
            </button>
            {currentStep < STEPS.length && (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={saving}
              >
                Lanjut
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;