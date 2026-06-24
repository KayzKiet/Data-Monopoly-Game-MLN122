import { useState } from 'react';

interface LandingPageProps {
  hasSavedGame: boolean;
  onContinue: () => void;
  onStart: () => void;
  onLearnTheory: () => void;
  onHowToPlay: () => void;
}

const learningPoints = [
  'Độc quyền dầu mỏ hình thành qua tài nguyên khan hiếm, nhà máy lọc dầu, đường ống và logistics.',
  'Độc quyền dữ liệu hình thành qua nền tảng số, người dùng, thuật toán, AI và hiệu ứng mạng lưới.',
  'Hình thức thay đổi, nhưng xu hướng tập trung tư bản và quyền lực thị trường vẫn tiếp tục tồn tại.',
];

const howToPlaySteps = [
  'Chọn 2-4 người chơi, đặt tên và avatar.',
  'Tung xúc xắc để di chuyển trên bàn 32 ô.',
  'Mua tài sản, trả phí, xử lý sự kiện và trả lời quiz lý luận.',
  'Chiến thắng bằng quyền lực thị trường, điểm lý luận hoặc tổng điểm sau 25 vòng.',
];

export function LandingPage({ hasSavedGame, onContinue, onStart, onLearnTheory, onHowToPlay }: LandingPageProps) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleHowToPlay = () => {
    setShowHowToPlay((value) => !value);
    onHowToPlay();
  };

  return (
    <section className="screen-shell grid min-h-[calc(100vh-74px)] items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="space-y-7">
        <div className="inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan">
          MLN122 - Web game giáo dục
        </div>

        <div className="space-y-5">
          <h1 className="max-w-4xl text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            Data Monopoly
          </h1>
          <p className="max-w-3xl text-xl font-semibold leading-8 text-gold sm:text-2xl">
            Từ độc quyền dầu mỏ đến độc quyền dữ liệu
          </p>
          <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Trò chơi giúp người học nhìn thấy cách cạnh tranh trong CNTB hiện đại có thể dẫn
            tới tích tụ tư bản, tập trung tư bản, độc quyền và rào cản gia nhập thị trường.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {hasSavedGame && (
            <button className="primary-button" onClick={onContinue} type="button">
              Continue Game
            </button>
          )}
          <button className="primary-button" onClick={onStart} type="button">
            New Game
          </button>
          <button className="secondary-button" onClick={onLearnTheory} type="button">
            Learn Theory
          </button>
          <button
            className="rounded-md border border-white/15 bg-white/5 px-4 py-2 font-bold text-slate-100 transition hover:border-cyan hover:text-cyan"
            onClick={handleHowToPlay}
            type="button"
          >
            How to Play
          </button>
        </div>

        {showHowToPlay && (
          <div className="panel max-w-3xl animate-[fadeIn_180ms_ease-out]">
            <h2 className="text-lg font-bold text-white">Cách chơi nhanh</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {howToPlaySteps.map((step, index) => (
                <div className="flex gap-3 rounded-lg border border-white/10 bg-oil/60 p-3" key={step}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gold text-sm font-black text-oil">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div className="panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">Mục tiêu học tập</p>
              <h2 className="mt-3 text-2xl font-black text-white">Hiểu độc quyền qua hành động</h2>
            </div>
            <div className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm font-black text-gold">
              32 ô
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {learningPoints.map((point) => (
              <div className="rounded-lg border border-white/10 bg-oil/60 p-4" key={point}>
                <p className="text-sm leading-6 text-slate-300">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Oil Age', value: 'Tài nguyên + hạ tầng', color: 'border-gold/40 text-gold' },
            { label: 'Data Age', value: 'Dữ liệu + nền tảng', color: 'border-cyan/40 text-cyan' },
          ].map((item) => (
            <div className={`rounded-lg border bg-white/[0.06] p-4 ${item.color}`} key={item.label}>
              <p className="text-xs font-bold uppercase tracking-[0.18em]">{item.label}</p>
              <p className="mt-3 text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
