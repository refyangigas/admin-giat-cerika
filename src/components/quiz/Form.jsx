// components/quiz/Form.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { quizService } from '../../services/quizService';
import BasicInfo from './BasicInfo';
import Questions from './Questions';
import Preview from './Preview';

const STEPS = [
  { id: 1, title: 'Informasi Dasar' },
  { id: 2, title: 'Pertanyaan' },
  { id: 3, title: 'Preview' }
];

const Form = ({ quiz = null, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: quiz?.title || '',
    hasTimeLimit: quiz?.hasTimeLimit || false,
    timeLimit: quiz?.timeLimit || { hours: 0, minutes: 0, seconds: 0 },
    questions: quiz?.questions || []
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validasi data
      if (!formData.title.trim()) {
        throw new Error('Judul quiz wajib diisi');
      }

      if (formData.hasTimeLimit) {
        const totalSeconds = (formData.timeLimit.hours * 3600) + 
                           (formData.timeLimit.minutes * 60) + 
                           formData.timeLimit.seconds;
        if (totalSeconds === 0) {
          throw new Error('Jika menggunakan batas waktu, minimal isi salah satu field waktu');
        }
      }

      // Simpan quiz
      const saveFunction = quiz ? quizService.update : quizService.create;
      const response = await saveFunction(quiz?._id, formData);

      onSuccess?.(response.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfo data={formData} onChange={setFormData} />;
      case 2:
        return <Questions data={formData} onChange={setFormData} />;
      case 3:
        return <Preview data={formData} />;
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
            {error && (
              <div className="text-sm text-red-500 mt-1">{error}</div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Steps */}
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
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            Kembali
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            {currentStep === STEPS.length ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(prev => Math.min(prev + 1, STEPS.length))}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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

export default Form;