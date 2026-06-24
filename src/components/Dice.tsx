import type { GameState } from '../types/game';

interface DiceProps {
  currentPlayerName: string;
  gameState: GameState;
  onRoll: () => void;
}

export function Dice({ currentPlayerName, gameState, onRoll }: DiceProps) {
  const hasRolled = gameState.diceValue !== null;

  return (
    <section className="panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Xúc xắc</h2>
          <p className="muted-text">Người chơi hiện tại: {currentPlayerName}</p>
        </div>
        <div
          className={`grid h-16 w-16 place-items-center rounded-lg border text-3xl font-black ${
            hasRolled ? 'border-gold/50 bg-gold/10 text-gold' : 'border-cyan/40 bg-cyan/10 text-cyan'
          }`}
        >
          {gameState.diceValue ?? '-'}
        </div>
      </div>
      <button className="primary-button mt-4 w-full disabled:cursor-not-allowed disabled:opacity-45" disabled={hasRolled} onClick={onRoll} type="button">
        {hasRolled ? 'Đã tung trong lượt này' : 'Tung xúc xắc'}
      </button>
    </section>
  );
}
