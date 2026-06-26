import { useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { LandingPage } from './components/LandingPage';
import { PlayerSetup } from './components/PlayerSetup';
import { ResultScreen } from './components/ResultScreen';
import { TheoryPage } from './components/TheoryPage';
import type { GameState } from './types/game';
import { clearGameState, loadGameState, saveGameState } from './utils/storage';

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
  const [gameState, setGameState] = useState<GameState | null>(() => loadGameState());
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const isLightTheme = themeMode === 'light';

  const commitGameState = (nextGameState: GameState | null) => {
    setGameState(nextGameState);

    if (nextGameState) {
      saveGameState(nextGameState);
    } else {
      clearGameState();
    }
  };

  const handleGameStart = (initialGameState: GameState) => {
    commitGameState(initialGameState);
    setPage('game');
  };

  const handleContinueGame = () => {
    if (!gameState) return;
    setPage(gameState.status === 'finished' ? 'result' : 'game');
  };

  const handleResetGame = () => {
    const confirmed = window.confirm('Bạn có chắc muốn reset game hiện tại? Tiến trình đã lưu sẽ bị xóa.');
    if (!confirmed) return;

    commitGameState(null);
    setPage('setup');
  };

  const handlePlayAgain = () => {
    commitGameState(null);
    setPage('setup');
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isLightTheme ? 'bg-slate-100 text-slate-950' : 'bg-oil text-slate-100'}`}>
      <div
        className={`fixed inset-0 -z-10 transition-colors duration-300 ${
          isLightTheme
            ? 'bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_30%),linear-gradient(135deg,#f8fafc_0%,#dbeafe_55%,#e0f2fe_100%)]'
            : 'bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#07090d_0%,#0b1733_55%,#10234f_100%)]'
        }`}
      />
      <nav className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isLightTheme ? 'border-slate-900/10 bg-white/80' : 'border-cyan/10 bg-oil/80'}`}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            className={`text-left text-lg font-bold tracking-wide ${isLightTheme ? 'text-slate-950' : 'text-white'}`}
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
                    : isLightTheme
                      ? 'border border-slate-900/10 bg-white/70 text-slate-700 hover:border-cyan/50 hover:text-cyan'
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
          hasSavedGame={Boolean(gameState)}
          onContinue={handleContinueGame}
          onHowToPlay={() => undefined}
          onLearnTheory={() => setPage('theory')}
          onStart={() => setPage('setup')}
        />
      )}
      {page === 'setup' && <PlayerSetup onBack={() => setPage('landing')} onStart={handleGameStart} />}
      {page === 'game' && (
        <GameBoard
          gameState={gameState}
          onGameStateChange={commitGameState}
          onFinish={() => setPage('result')}
          onReset={handleResetGame}
          onSetup={() => setPage('setup')}
          onToggleTheme={() => setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'))}
          onTheory={() => setPage('theory')}
          themeMode={themeMode}
        />
      )}
      {page === 'theory' && <TheoryPage onBack={() => setPage('landing')} />}
      {page === 'result' && (
        <ResultScreen
          gameState={gameState}
          onHome={() => setPage('landing')}
          onRestart={handlePlayAgain}
          onTheory={() => setPage('theory')}
        />
      )}
    </main>
  );
}

export default App;
