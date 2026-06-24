import { useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { LandingPage } from './components/LandingPage';
import { PlayerSetup } from './components/PlayerSetup';
import { ResultScreen } from './components/ResultScreen';
import { TheoryPage } from './components/TheoryPage';
import type { GameState } from './types/game';

export type Page = 'landing' | 'setup' | 'game' | 'theory' | 'result';

const navItems: Array<{ label: string; page: Page }> = [
  { label: 'Trang chủ', page: 'landing' },
  { label: 'Thiết lập', page: 'setup' },
  { label: 'Bàn chơi', page: 'game' },
  { label: 'Lý thuyết', page: 'theory' },
  { label: 'Kết quả', page: 'result' },
];

function App() {
  const [page, setPage] = useState<Page>('landing');
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleGameStart = (initialGameState: GameState) => {
    setGameState(initialGameState);
    setPage('game');
  };

  return (
    <main className="min-h-screen bg-oil text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#07090d_0%,#0b1733_55%,#10234f_100%)]" />
      <nav className="sticky top-0 z-20 border-b border-cyan/10 bg-oil/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            className="text-left text-lg font-bold tracking-wide text-white"
            onClick={() => setPage('landing')}
            type="button"
          >
            Data Monopoly
          </button>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <button
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  page === item.page
                    ? 'bg-cyan text-oil shadow-glow'
                    : 'border border-white/10 bg-white/5 text-slate-200 hover:border-cyan/50 hover:text-cyan'
                }`}
                key={item.page}
                onClick={() => setPage(item.page)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {page === 'landing' && (
        <LandingPage
          onHowToPlay={() => undefined}
          onLearnTheory={() => setPage('theory')}
          onStart={() => setPage('setup')}
        />
      )}
      {page === 'setup' && <PlayerSetup onBack={() => setPage('landing')} onStart={handleGameStart} />}
      {page === 'game' && (
        <GameBoard
          gameState={gameState}
          onGameStateChange={setGameState}
          onFinish={() => setPage('result')}
          onReset={() => {
            setGameState(null);
            setPage('setup');
          }}
          onSetup={() => setPage('setup')}
          onTheory={() => setPage('theory')}
        />
      )}
      {page === 'theory' && <TheoryPage onBack={() => setPage('landing')} />}
      {page === 'result' && (
        <ResultScreen
          gameState={gameState}
          onHome={() => setPage('landing')}
          onRestart={() => setPage('setup')}
          onTheory={() => setPage('theory')}
        />
      )}
    </main>
  );
}

export default App;
