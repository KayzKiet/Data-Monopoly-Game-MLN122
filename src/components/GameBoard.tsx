import { useEffect, useMemo, useRef, useState } from 'react';
import { events } from '../data/events';
import { quizzes } from '../data/quizzes';
import type { GameState, Player, Tile } from '../types/game';
import { answerQuiz, applyDicePairRule, applyEvent, buyAsset, endTurn, handleTileLanding, movePlayer, upgradeAsset } from '../utils/gameLogic';
import { ActionPanel } from './ActionPanel';
import { BoardTile } from './BoardTile';
import { Dice } from './Dice';
import { EventModal } from './EventModal';
import { GameLog } from './GameLog';
import { PlayerAvatar } from './PlayerAvatar';
import { PlayerPanel } from './PlayerPanel';
import { QuizModal } from './QuizModal';

interface GameBoardProps {
  gameState: GameState | null;
  onGameStateChange: (gameState: GameState | null) => void;
  onFinish: () => void;
  onReset: () => void;
  onSetup: () => void;
  onToggleTheme: () => void;
  onTheory: () => void;
  themeMode: 'dark' | 'light';
}

const playerColors = ['bg-cyan', 'bg-gold', 'bg-emerald-400', 'bg-rose-400'];
type TurnAnimationPhase = 'idle' | 'rolling' | 'revealed' | 'moving';
const boardSize = 1180;
const boardCornerSize = 150;
const boardEdgeTileSize = 98;

const perimeterPositions = Array.from({ length: 40 }, (_, index) => {
  if (index <= 10) return { row: 11, col: 11 - index };
  if (index <= 20) return { row: 21 - index, col: 1 };
  if (index <= 30) return { row: 1, col: index - 19 };
  return { row: index - 29, col: 11 };
});

export function GameBoard({ gameState, onFinish, onGameStateChange, onReset, onSetup, onTheory, onToggleTheme, themeMode }: GameBoardProps) {
  const currentPlayer = gameState?.players[gameState.currentPlayerIndex] ?? null;
  const [diceFaces, setDiceFaces] = useState<[number, number] | null>(null);
  const [turnAnimationPhase, setTurnAnimationPhase] = useState<TurnAnimationPhase>('idle');
  const [movingPlayerId, setMovingPlayerId] = useState<string | null>(null);
  const [boardZoom, setBoardZoom] = useState(0.9);
  const [boardBrightness, setBoardBrightness] = useState(1);
  const [visualPositions, setVisualPositions] = useState<Record<string, number>>({});
  const timers = useRef<number[]>([]);
  const isRolling = turnAnimationPhase === 'rolling';
  const isMoving = turnAnimationPhase === 'moving';
  const isTurnBusy = turnAnimationPhase !== 'idle';
  const isLightTheme = themeMode === 'light';
  const canRollDice = Boolean(
    gameState &&
      currentPlayer &&
      !gameState.activeEventId &&
      !gameState.activeQuizId &&
      !isTurnBusy &&
      (gameState.rollsThisTurn === 0 || gameState.extraRollsAvailable > 0),
  );

  const ownerByTileId = useMemo(() => {
    const owners = new Map<string, Player>();

    gameState?.players.forEach((player) => {
      player.assets.forEach((asset) => {
        owners.set(asset.tileId, player);
      });
    });

    return owners;
  }, [gameState]);
  const activeEvent = gameState?.activeEventId ? events.find((event) => event.id === gameState.activeEventId) ?? null : null;
  const activeQuiz = gameState?.activeQuizId ? quizzes.find((quiz) => quiz.id === gameState.activeQuizId) ?? null : null;

  useEffect(() => {
    if (!gameState || isTurnBusy) return;

    setVisualPositions(
      Object.fromEntries(gameState.players.map((player) => [player.id, player.position])),
    );
  }, [gameState, isTurnBusy]);

  useEffect(() => {
    if (gameState?.diceValue === null && !isTurnBusy) {
      setDiceFaces(null);
    }
  }, [gameState?.currentPlayerIndex, gameState?.diceValue, isTurnBusy]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => {
        window.clearTimeout(timer);
        window.clearInterval(timer);
      });
      timers.current = [];
    };
  }, []);

  const commitGameState = (nextState: GameState) => {
    onGameStateChange(nextState);
    if (nextState.status === 'finished') {
      onFinish();
    }
  };

  const handleRoll = () => {
    if (!gameState || !currentPlayer || !canRollDice) return;

    const rolledFaces: [number, number] = [randomDieFace(), randomDieFace()];
    const diceValue = rolledFaces[0] + rolledFaces[1];
    const playerId = currentPlayer.id;
    const startPosition = currentPlayer.position;
    let previewTick = 0;

    setTurnAnimationPhase('rolling');

    const previewInterval = window.setInterval(() => {
      previewTick += 1;
      setDiceFaces([((previewTick + 1) % 6) + 1, ((previewTick + 4) % 6) + 1]);
    }, 80);
    timers.current.push(previewInterval);

    const revealTimer = window.setTimeout(() => {
      window.clearInterval(previewInterval);
      setDiceFaces(rolledFaces);
      setTurnAnimationPhase('revealed');

      const movementDelayTimer = window.setTimeout(() => {
        setTurnAnimationPhase('moving');
        setMovingPlayerId(playerId);

        let step = 0;
        const movementInterval = window.setInterval(() => {
          step += 1;
          const nextPosition = (startPosition + step) % gameState.tiles.length;
          setVisualPositions((current) => ({ ...current, [playerId]: nextPosition }));

          if (step >= diceValue) {
            window.clearInterval(movementInterval);

            const settleTimer = window.setTimeout(() => {
              const movedState = movePlayer(gameState, diceValue, playerId);
              const landedState = handleTileLanding(movedState, playerId);
              const nextState = applyDicePairRule(landedState, rolledFaces, playerId);
              setTurnAnimationPhase('idle');
              setMovingPlayerId(null);
              setDiceFaces(rolledFaces);
              commitGameState(nextState);
            }, 180);

            timers.current.push(settleTimer);
          }
        }, 240);
        timers.current.push(movementInterval);
      }, 420);

      timers.current.push(movementDelayTimer);
    }, 980);

    timers.current.push(revealTimer);
  };

  const handleBuyAsset = (tileId: string) => {
    if (!gameState || !currentPlayer) return;
    commitGameState(buyAsset(gameState, currentPlayer.id, tileId));
  };

  const handleUpgradeAsset = (assetId: string) => {
    if (!gameState || !currentPlayer) return;
    commitGameState(upgradeAsset(gameState, currentPlayer.id, assetId));
  };

  const handleApplyEvent = () => {
    if (!gameState?.activeEventId) return;
    commitGameState(applyEvent(gameState, gameState.activeEventId));
  };

  const handleEndTurn = () => {
    if (!gameState) return;
    commitGameState(endTurn(gameState));
  };

  const handleQuizAnswer = (answer: NonNullable<typeof activeQuiz>['correctAnswer']) => {
    if (!gameState || !currentPlayer || !gameState.activeQuizId) return;
    commitGameState(answerQuiz(gameState, currentPlayer.id, gameState.activeQuizId, answer));
  };

  if (!gameState) {
    return (
      <section className="screen-shell">
        <div className="panel mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">Chưa có game state</p>
          <h1 className="mt-3 text-3xl font-black text-white">Hãy thiết lập người chơi trước</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Bàn chơi cần trạng thái ban đầu từ màn Player Setup để hiển thị người chơi, vị trí và tài sản sở hữu.
          </p>
          <button className="primary-button mt-6" onClick={onSetup} type="button">
            Tới màn thiết lập
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-3 py-3 sm:px-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">
            Round {gameState.round} / {gameState.maxRounds}
          </p>
          <h1 className="section-title mt-2">Bàn chơi chiến lược</h1>
          {currentPlayer && (
            <p className="mt-2 text-sm font-semibold text-slate-300">
              Lượt hiện tại:{' '}
              <span className="rounded-md bg-cyan/10 px-2 py-1 font-black text-cyan">
                <PlayerAvatar
                  alt={currentPlayer.name}
                  className="mr-1 h-5 w-5 rounded"
                  imagePath={currentPlayer.avatar}
                  label={currentPlayer.name}
                />
                {currentPlayer.name}
              </span>
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button className="secondary-button" onClick={onTheory} type="button">
            Lý thuyết
          </button>
          <button className="primary-button" onClick={onFinish} type="button">
            Xem kết quả
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(960px,1fr)_minmax(420px,28vw)]">
        <div className="space-y-3">
          <div className="flex w-fit flex-wrap items-center gap-2 rounded-lg border border-white/20 bg-oil/80 p-2 shadow-lg backdrop-blur">
            <BoardControl
              label="Phóng bàn"
              onDecrease={() => setBoardZoom((current) => Math.max(0.65, Number((current - 0.1).toFixed(2))))}
              onIncrease={() => setBoardZoom((current) => Math.min(1.35, Number((current + 0.1).toFixed(2))))}
              value={`${Math.round(boardZoom * 100)}%`}
            />
            <div className="h-8 w-px bg-white/15" />
            <BoardControl
              label="Sáng nền"
              onDecrease={() => setBoardBrightness((current) => Math.max(0.65, Number((current - 0.1).toFixed(2))))}
              onIncrease={() => setBoardBrightness((current) => Math.min(1.35, Number((current + 0.1).toFixed(2))))}
              value={`${Math.round(boardBrightness * 100)}%`}
            />
            <div className="h-8 w-px bg-white/15" />
            <button
              className="secondary-button px-3 py-2 text-xs uppercase tracking-[0.14em]"
              onClick={onToggleTheme}
              type="button"
            >
              {isLightTheme ? 'Giao diện tối' : 'Giao diện sáng'}
            </button>
          </div>

          <div
            className={`relative isolate max-h-[calc(100vh-176px)] overflow-auto rounded-xl border p-5 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.16)] ${
              isLightTheme ? 'border-slate-900/10 bg-slate-200' : 'border-cyan/20 bg-[#162836]'
            }`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: 'url("/images/board/board-outer-blue.png")', filter: `brightness(${boardBrightness})` }}
            />
            <div className={`pointer-events-none absolute inset-0 z-0 ${isLightTheme ? 'bg-white/10' : 'bg-black/5'}`} />

          <div
            className="mx-auto shrink-0"
            style={{
              height: boardSize * boardZoom,
              width: boardSize * boardZoom,
            }}
          >
          <div
            className="relative isolate grid shrink-0 origin-top-left overflow-visible rounded-lg bg-[#223a3d] outline outline-4 outline-[#3e8f73] shadow-[0_0_0_6px_rgba(7,20,24,0.32)]"
            style={{
              gridTemplateColumns: `${boardCornerSize}px repeat(9, ${boardEdgeTileSize}px) ${boardCornerSize}px`,
              gridTemplateRows: `${boardCornerSize}px repeat(9, ${boardEdgeTileSize}px) ${boardCornerSize}px`,
              height: boardSize,
              transform: `scale(${boardZoom})`,
              width: boardSize,
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-cover bg-center"
              style={{ backgroundImage: 'url("/images/board/board-inner-orange.png")', filter: `brightness(${boardBrightness})` }}
            />
            <div className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-black/5" />
            {gameState.tiles.map((tile) => (
              <BoardTileAtPosition
                currentPlayerId={currentPlayer?.id ?? null}
                key={tile.id}
                owner={tile.asset ? ownerByTileId.get(tile.asset.tileId) ?? null : null}
                ownerColor={getOwnerColor(gameState.players, tile, ownerByTileId)}
                movingPlayerId={movingPlayerId}
                players={gameState.players}
                tile={tile}
                visualPositions={visualPositions}
              />
            ))}

            <div className="relative z-10 col-start-3 col-end-10 row-start-3 row-end-10 grid place-items-center p-4 text-center">
                <div className="w-full space-y-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-100">Data Monopoly</p>
                    <h2 className="mt-2 text-2xl font-black uppercase text-[#ffe66f] drop-shadow-[3px_3px_0_rgba(32,38,80,0.85)] min-[1360px]:text-3xl">
                      Cạnh tranh / Độc quyền
                    </h2>
                  </div>
                  {currentPlayer && (
                    <Dice
                      canRoll={canRollDice}
                      currentPlayerName={currentPlayer.name}
                      diceFaces={diceFaces}
                      gameState={gameState}
                      isBusy={isTurnBusy}
                      isMoving={isMoving}
                      isRolling={isRolling}
                      onRoll={handleRoll}
                    />
                  )}
                </div>
            </div>
          </div>
          </div>
          </div>
        </div>

        <aside className="max-h-[calc(100vh-116px)] space-y-4 overflow-y-auto rounded-xl border border-red-300/20 bg-[linear-gradient(180deg,rgba(127,29,29,0.42),rgba(67,20,7,0.28))] p-3 pr-2">
          <CurrentPlayersCard gameState={gameState} />
          {currentPlayer && (
            <ActionPanel
              currentPlayer={currentPlayer}
              gameState={gameState}
              isBusy={isTurnBusy}
              onApplyEvent={handleApplyEvent}
              onBuyAsset={handleBuyAsset}
              onEndTurn={handleEndTurn}
              onUpgradeAsset={handleUpgradeAsset}
            />
          )}
          <PlayerPanel currentPlayerId={currentPlayer?.id ?? null} gameState={gameState} />
          <GameLog entries={gameState.log} />
          <GameManagementCard isBusy={isTurnBusy} onFinish={onFinish} onReset={onReset} />
        </aside>
      </div>

      <EventModal event={activeEvent} onApply={handleApplyEvent} />
      <QuizModal quiz={activeQuiz} onAnswer={handleQuizAnswer} />
    </section>
  );
}

function randomDieFace(): number {
  return Math.floor(Math.random() * 6) + 1;
}

interface BoardTileAtPositionProps {
  currentPlayerId: string | null;
  movingPlayerId: string | null;
  owner: Player | null;
  ownerColor: string | null;
  players: Player[];
  tile: Tile;
  visualPositions: Record<string, number>;
}

function BoardTileAtPosition({ currentPlayerId, movingPlayerId, owner, ownerColor, players, tile, visualPositions }: BoardTileAtPositionProps) {
  const position = perimeterPositions[tile.index];
  const playersOnTile = players.filter((player) => (visualPositions[player.id] ?? player.position) === tile.index);

  return (
    <div className="relative z-10 min-h-0 min-w-0" style={{ gridColumn: position.col, gridRow: position.row }}>
      <BoardTile
        currentPlayerId={currentPlayerId}
        movingPlayerId={movingPlayerId}
        owner={owner}
        ownerColor={ownerColor}
        playersOnTile={playersOnTile}
        tile={tile}
      />
    </div>
  );
}

function BoardControl({
  label,
  onDecrease,
  onIncrease,
  value,
}: {
  label: string;
  onDecrease: () => void;
  onIncrease: () => void;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="px-2 text-xs font-black uppercase tracking-[0.14em] text-cyan">{label}</span>
      <button className="secondary-button px-3 py-1" onClick={onDecrease} type="button">
        -
      </button>
      <span className="w-14 text-center text-sm font-black text-white">{value}</span>
      <button className="secondary-button px-3 py-1" onClick={onIncrease} type="button">
        +
      </button>
    </div>
  );
}

function GameManagementCard({ isBusy, onFinish, onReset }: { isBusy: boolean; onFinish: () => void; onReset: () => void }) {
  return (
    <section className="rounded-lg border border-red-200/15 bg-oil/70 p-4 shadow-gold backdrop-blur">
      <h2 className="text-lg font-bold text-white">Quản lý ván</h2>
      <div className="mt-3 grid gap-2">
        <button className="primary-button" disabled={isBusy} onClick={onFinish} type="button">
          Kết thúc game sớm
        </button>
        <button
          className="rounded-md border border-red-300/30 bg-red-500/10 px-4 py-2 font-bold text-red-100 transition duration-200 hover:bg-red-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={isBusy}
          onClick={onReset}
          type="button"
        >
          Reset game
        </button>
      </div>
    </section>
  );
}

function CurrentPlayersCard({ gameState }: { gameState: GameState }) {
  return (
    <section className="rounded-lg border border-red-200/15 bg-oil/70 p-4 shadow-gold backdrop-blur">
      <h2 className="text-lg font-bold text-white">Người chơi</h2>
      <div className="mt-4 space-y-3">
        {gameState.players.map((player, index) => {
          const isCurrent = index === gameState.currentPlayerIndex;

          return (
            <div
              className={`rounded-lg border p-3 ${
                isCurrent ? 'border-cyan/60 bg-cyan/10 shadow-glow' : 'border-white/10 bg-oil/60'
              }`}
              key={player.id}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${playerColors[index] ?? 'bg-white'}`} />
                  <PlayerAvatar alt={player.name} className="h-7 w-7 rounded-md" imagePath={player.avatar} label={player.name} />
                  <p className="truncate font-bold text-white">{player.name}</p>
                </div>
                <span className="text-xs font-black text-cyan">Ô {player.position + 1}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-300">
                <span>${player.money}</span>
                <span>{player.assets.length} tài sản</span>
                <span>{player.theoryPoints} lý luận</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getOwnerColor(players: Player[], tile: Tile, ownerByTileId: Map<string, Player>): string | null {
  if (!tile.asset) return null;

  const owner = ownerByTileId.get(tile.asset.tileId);
  if (!owner) return null;

  const ownerIndex = players.findIndex((player) => player.id === owner.id);
  return playerColors[ownerIndex] ?? 'bg-white';
}
