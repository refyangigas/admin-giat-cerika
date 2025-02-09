import React from 'react';
import { Clock } from 'lucide-react';

const QuizBasicInfo = ({ data, onChange }) => {
  const handleTimeChange = (field, value) => {
    const newValue = Math.max(0, parseInt(value) || 0);
    onChange({
      timeLimit: {
        ...data.timeLimit,
        [field]: newValue
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Judul Quiz */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Judul Quiz
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full p-2 border rounded-lg"
          placeholder="Masukkan judul quiz"
          required
        />
      </div>

      {/* Waktu Pengerjaan */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clock size={20} />
          <label className="text-sm font-medium">
            Waktu Pengerjaan
          </label>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={data.hasTimeLimit}
            onChange={(e) => onChange({ hasTimeLimit: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Gunakan batas waktu</span>
        </div>

        {data.hasTimeLimit && (
          <div className="flex gap-4 items-center">
            {/* Jam */}
            <div>
              <label className="block text-sm mb-1">Jam</label>
              <input
                type="number"
                min="0"
                value={data.timeLimit.hours}
                onChange={(e) => handleTimeChange('hours', e.target.value)}
                className="w-20 p-2 border rounded-lg"
              />
            </div>

            {/* Menit */}
            <div>
              <label className="block text-sm mb-1">Menit</label>
              <input
                type="number"
                min="0"
                max="59"
                value={data.timeLimit.minutes}
                onChange={(e) => handleTimeChange('minutes', e.target.value)}
                className="w-20 p-2 border rounded-lg"
              />
            </div>

            {/* Detik */}
            <div>
              <label className="block text-sm mb-1">Detik</label>
              <input
                type="number"
                min="0"
                max="59"
                value={data.timeLimit.seconds}
                onChange={(e) => handleTimeChange('seconds', e.target.value)}
                className="w-20 p-2 border rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Preview Format Waktu */}
        {data.hasTimeLimit && (
          <div className="mt-2 text-sm text-gray-600">
            Format: {data.timeLimit.hours} jam {data.timeLimit.minutes} menit {data.timeLimit.seconds} detik
          </div>
        )}
      </div>

      {/* Panduan */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Panduan Pengisian:</h3>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
          <li>Judul quiz wajib diisi</li>
          <li>Waktu pengerjaan bersifat opsional</li>
          <li>Jika menggunakan batas waktu, minimal isi salah satu field (jam/menit/detik)</li>
          <li>Klik "Lanjut" untuk menambahkan pertanyaan</li>
        </ul>
      </div>
    </div>
  );
};

export default QuizBasicInfo;