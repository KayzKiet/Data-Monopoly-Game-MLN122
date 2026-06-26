import type { GameState } from '../types/game';

interface DiceProps {
  canRoll: boolean;
  currentPlayerName: string;
  diceFaces: [number, number] | null;
  gameState: GameState;
  isBusy: boolean;
  isMoving: boolean;
  isRolling: boolean;
  onRoll: () => void;
}

const dotPositions: Record<number, Array<[number, number]>> = {
  1: [[2, 2]],
  2: [
    [1, 1],
    [3, 3],
  ],
  3: [
    [1, 1],
    [2, 2],
    [3, 3],
  ],
  4: [
    [1, 1],
    [1, 3],
    [3, 1],
    [3, 3],
  ],
  5: [
    [1, 1],
    [1, 3],
    [2, 2],
    [3, 1],
    [3, 3],
  ],
  6: [
    [1, 1],
    [1, 3],
    [2, 1],
    [2, 3],
    [3, 1],
    [3, 3],
  ],
};

const cubeFaces = [
  { face: 1, className: 'dice-face-front' },
  { face: 2, className: 'dice-face-top' },
  { face: 3, className: 'dice-face-right' },
  { face: 4, className: 'dice-face-left' },
  { face: 5, className: 'dice-face-bottom' },
  { face: 6, className: 'dice-face-back' },
];

export function Dice({ canRoll, currentPlayerName, diceFaces, gameState, isBusy, isMoving, isRolling, onRoll }: DiceProps) {
  const hasRolled = gameState.diceValue !== null;
  const faces = diceFaces ?? (gameState.diceValue ? splitDiceValue(gameState.diceValue) : null);
  const total = faces ? faces[0] + faces[1] : gameState.diceValue;
  const isRevealing = isBusy && !isRolling && !isMoving;
  const statusLabel = isRolling ? 'Đang hất...' : isMoving ? 'Đang di chuyển...' : total ? `${total} bước` : 'Sẵn sàng';
  const buttonLabel = isRolling
    ? 'Xúc xắc đang rơi...'
    : isMoving
      ? 'Nhân vật đang đi...'
      : isRevealing
        ? 'Đã ra kết quả...'
      : hasRolled
        ? 'Đã tung trong lượt này'
        : canRoll
          ? 'Tung xúc xắc'
          : 'Chưa thể tung';

  return (
    <section className="mx-auto w-full max-w-[430px]">
      <div className="rounded-lg border border-white/25 bg-oil/70 p-3 shadow-[0_16px_34px_rgba(0,0,0,0.38)] backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between gap-3 text-white">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">Lượt tung</p>
            <p className="mt-1 text-base font-black">{currentPlayerName}</p>
          </div>
          <div className="rounded-md border border-white/15 bg-white/15 px-3 py-2 text-sm font-black">
            {statusLabel}
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 py-3 [perspective:760px]">
          <Die face={faces?.[0] ?? 1} isRolling={isRolling} />
          <Die face={faces?.[1] ?? 1} isRolling={isRolling} />
        </div>

        <button
          className="mt-3 w-full rounded-md border-2 border-cyan/40 bg-cyan px-4 py-3 text-base font-black text-oil shadow-[0_5px_0_rgba(8,47,73,0.85)] transition duration-200 hover:bg-cyan/90 active:translate-y-1 active:shadow-[0_3px_0_rgba(8,47,73,0.85)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canRoll || hasRolled || isBusy}
          onClick={onRoll}
          type="button"
        >
          {buttonLabel}
        </button>
      </div>
    </section>
  );
}

function Die({ face, isRolling }: { face: number; isRolling: boolean }) {
  return (
    <div className="dice-stage">
      <div className={`dice-cube dice-show-${face} ${isRolling ? 'dice-rolling' : ''}`}>
        {cubeFaces.map((item) => (
          <DiceFace className={item.className} face={item.face} key={item.face} />
        ))}
      </div>
    </div>
  );
}

function DiceFace({ className, face }: { className: string; face: number }) {
  return (
    <div className={`dice-face ${className}`}>
      {dotPositions[face].map(([row, column], index) => (
        <span
          className="dice-dot"
          key={`${face}-${row}-${column}-${index}`}
          style={{
            gridColumn: column,
            gridRow: row,
          }}
        />
      ))}
    </div>
  );
}

function splitDiceValue(value: number): [number, number] {
  const first = Math.min(6, Math.max(1, Math.floor(value / 2)));
  const second = Math.min(6, Math.max(1, value - first));
  return [first, second];
}
