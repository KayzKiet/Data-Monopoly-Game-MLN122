import { useState } from 'react';
import type { QuizQuestion } from '../types/game';

interface QuizModalProps {
  quiz: QuizQuestion | null;
  onAnswer: (answer: QuizQuestion['correctAnswer']) => void;
}

export function QuizModal({ quiz, onAnswer }: QuizModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<QuizQuestion['correctAnswer'] | null>(null);

  if (!quiz) return null;

  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === quiz.correctAnswer;

  const handleAnswer = (answer: QuizQuestion['correctAnswer']) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleContinue = () => {
    if (!selectedAnswer) return;
    onAnswer(selectedAnswer);
    setSelectedAnswer(null);
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-oil/80 px-4 py-8 backdrop-blur-md">
      <section className="w-full max-w-3xl rounded-lg border border-gold/30 bg-midnight p-6 shadow-gold">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Quiz lý luận</p>
            <h2 className="mt-3 text-2xl font-black leading-9 text-white">{quiz.question}</h2>
          </div>
          <span className="rounded-md border border-cyan/40 bg-cyan/10 px-3 py-2 text-sm font-black text-cyan">
            +10 lý luận
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          {quiz.options.map((option) => {
            const answerKey = option.slice(0, 1) as QuizQuestion['correctAnswer'];
            const isSelected = selectedAnswer === answerKey;
            const isCorrectOption = quiz.correctAnswer === answerKey;

            return (
              <button
                className={`rounded-lg border p-4 text-left text-sm font-semibold leading-6 transition ${
                  isAnswered && isCorrectOption
                    ? 'border-emerald-300/60 bg-emerald-500/15 text-emerald-100'
                    : isAnswered && isSelected && !isCorrect
                      ? 'border-rose-300/60 bg-rose-500/15 text-rose-100'
                      : 'border-white/10 bg-oil/60 text-slate-200 hover:border-cyan/50'
                }`}
                disabled={isAnswered}
                key={option}
                onClick={() => handleAnswer(answerKey)}
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`mt-5 rounded-lg border p-4 ${isCorrect ? 'border-emerald-300/40 bg-emerald-500/10' : 'border-rose-300/40 bg-rose-500/10'}`}>
            <p className={`text-lg font-black ${isCorrect ? 'text-emerald-200' : 'text-rose-200'}`}>
              {isCorrect ? 'Chính xác. Nhận thêm điểm lý luận.' : 'Chưa đúng. Không nhận điểm thưởng.'}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{quiz.explanation}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button className="primary-button disabled:cursor-not-allowed disabled:opacity-45" disabled={!isAnswered} onClick={handleContinue} type="button">
            Tiếp tục
          </button>
        </div>
      </section>
    </div>
  );
}
