// utils/formatters.js
export const formatTimeLimit = (timeLimit) => {
    const parts = [];
    if (timeLimit.hours) parts.push(`${timeLimit.hours} jam`);
    if (timeLimit.minutes) parts.push(`${timeLimit.minutes} menit`);
    if (timeLimit.seconds) parts.push(`${timeLimit.seconds} detik`);
    return parts.length > 0 ? parts.join(' ') : 'Tidak ada batas waktu';
  };
  
  export const normalizeQuizData = (data) => {
    return {
      title: data.title?.trim() || '',
      hasTimeLimit: Boolean(data.hasTimeLimit),
      timeLimit: {
        hours: Number(data.timeLimit?.hours) || 0,
        minutes: Number(data.timeLimit?.minutes) || 0,
        seconds: Number(data.timeLimit?.seconds) || 0
      },
      questions: Array.isArray(data.questions) ? data.questions.map((q, idx) => ({
        orderNumber: idx + 1,
        questionText: q.questionText?.trim() || '',
        questionType: q.questionType,
        image: q.image || null,
        options: Array.isArray(q.options) ? q.options.map(opt => ({
          text: opt.text?.trim() || '',
          isCorrect: Boolean(opt.isCorrect)
        })) : []
      })) : []
    };
  };