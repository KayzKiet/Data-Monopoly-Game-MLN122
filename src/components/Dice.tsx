import type { GameState } from '../types/game';

interface DiceProps {
  currentPlayerName: string;
  diceFaces: [number, number] | null;
  gameState: GameState;
  isRolling: boolean;
  onRoll: () => void;
}

const dotPositions: Record<number, string[]> = {
  1: ['place-self-center'],
  2: ['place-self-start', 'place-self-end'],
  3: ['place-self-start', 'place-self-center', 'place-self-end'],
  4: ['place-self-start', 'place-self-start justify-self-end', 'place-self-end justify-self-start', 'place-self-end'],
  5: ['place-self-start', 'place-self-start justify-self-end', 'place-self-center', 'place-self-end justify-self-start', 'place-self-end'],
  6: [
    'place-self-start',
    'place-self-start justify-self-end',
    'place-self-center justify-self-start',
    'place-self-center justify-self-end',
    'place-self-end justify-self-start',
    'place-self-end',
  ],
};

export function Dice({ currentPlayerName, diceFaces, gameState, isRolling, onRoll }: DiceProps) {
  const hasRolled = gameState.diceValue !== null;
  const faces = diceFaces ?? (gameState.diceValue ? splitDiceValue(gameState.diceValue) : null);
  const total = faces ? faces[0] + faces[1] : gameState.diceValue;

  return (
    <section className="mx-auto w-full max-w-[430px]">
      <div className="rounded-lg border-4 border-[#b45128] bg-[#ff7a3d] p-3 shadow-[0_8px_0_rgba(91,45,23,0.65)]">
        <div className="mb-2 flex items-center justify-between gap-3 text-white">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-100">Lượt tung</p>
            <p className="mt-1 text-base font-black">{currentPlayerName}</p>
          </div>
          <div className="rounded-md bg-white/20 px-3 py-2 text-sm font-black">
            {isRolling ? 'Đang quay...' : total ? `${total} bước` : 'Sẵn sàng'}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 py-1">
          <Die face={faces?.[0] ?? 1} isRolling={isRolling} />
          <Die face={faces?.[1] ?? 1} isRolling={isRolling} />
        </div>

        <button
          className="mt-3 w-full rounded-md border-2 border-[#9f421f] bg-[#ff6b32] px-4 py-3 text-base font-black text-white shadow-[0_5px_0_#8b3619] transition duration-200 hover:bg-[#ff7f4b] active:translate-y-1 active:shadow-[0_3px_0_#8b3619] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={hasRolled || isRolling}
          onClick={onRoll}
          type="button"
        >
          {isRolling ? 'Đang chờ kết quả...' : hasRolled ? 'Đã tung trong lượt này' : '🎲 Tung xúc xắc'}
        </button>
      </div>
    </section>
  );
}

function Die({ face, isRolling }: { face: number; isRolling: boolean }) {
  return (
    <div
      className={`grid h-16 w-16 grid-cols-3 grid-rows-3 rounded-xl border-4 border-orange-200 bg-[#fff7e8] p-3 shadow-[6px_8px_0_rgba(91,45,23,0.35)] min-[1360px]:h-20 min-[1360px]:w-20 ${
        isRolling ? 'animate-[dicePulse_180ms_ease-in-out_infinite]' : 'rotate-[-8deg]'
      }`}
    >
      {dotPositions[face].map((position, index) => (
        <span className={`h-3 w-3 rounded-full bg-[#b86b1e] min-[1360px]:h-3.5 min-[1360px]:w-3.5 ${position}`} key={`${face}-${index}`} />
      ))}
    </div>
  );
}

function splitDiceValue(value: number): [number, number] {
  const first = Math.min(6, Math.max(1, Math.floor(value / 2)));
  const second = Math.min(6, Math.max(1, value - first));
  return [first, second];
}
