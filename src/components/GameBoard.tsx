import { useEffect, useMemo, useRef, useState } from 'react';
import { events } from '../data/events';
import { quizzes } from '../data/quizzes';
import type { GameState, Player, Tile } from '../types/game';
import { answerQuiz, applyEvent, buyAsset, endTurn, handleTileLanding, movePlayer, upgradeAsset } from '../utils/gameLogic';
import { ActionPanel } from './ActionPanel';
import { BoardTile } from './BoardTile';
import { Dice } from './Dice';
import { EventModal } from './EventModal';
import { GameLog } from './GameLog';
import { PlayerPanel } from './PlayerPanel';
import { QuizModal } from './QuizModal';

interface GameBoardProps {
  gameState: GameState | null;
  onGameStateChange: (gameState: GameState | null) => void;
  onFinish: () => void;
  onReset: () => void;
  onSetup: () => void;
  onTheory: () => void;
}

const playerColors = ['bg-cyan', 'bg-gold', 'bg-emerald-400', 'bg-rose-400'];

const perimeterPositions = Array.from({ length: 32 }, (_, index) => {
  if (index <= 8) return { row: 9, col: 9 - index };
  if (index <= 16) return { row: 17 - index, col: 1 };
  if (index <= 24) return { row: 1, col: index - 15 };
  return { row: index - 23, col: 9 };
});

export function GameBoard({ gameState, onFinish, onGameStateChange, onReset, onSetup, onTheory }: GameBoardProps) {
  const currentPlayer = gameState?.players[gameState.currentPlayerIndex] ?? null;
  const [diceFaces, setDiceFaces] = useState<[number, number] | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [movingPlayerId, setMovingPlayerId] = useState<string | null>(null);
  const [visualPositions, setVisualPositions] = useState<Record<string, number>>({});
  const timers = useRef<number[]>([]);

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
    if (!gameState || isRolling) return;

    setVisualPositions(
      Object.fromEntries(gameState.players.map((player) => [player.id, player.position])),
    );
  }, [gameState, isRolling]);

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
    if (!gameState || !currentPlayer || gameState.diceValue !== null || isRolling) return;

    const rolledFaces: [number, number] = [randomDieFace(), randomDieFace()];
    const diceValue = rolledFaces[0] + rolledFaces[1];
    const playerId = currentPlayer.id;
    const startPosition = currentPlayer.position;
    let previewTick = 0;

    setIsRolling(true);
    setMovingPlayerId(playerId);

    const previewInterval = window.setInterval(() => {
      previewTick += 1;
      setDiceFaces([((previewTick + 1) % 6) + 1, ((previewTick + 4) % 6) + 1]);
    }, 90);
    timers.current.push(previewInterval);

    const revealTimer = window.setTimeout(() => {
      window.clearInterval(previewInterval);
      setDiceFaces(rolledFaces);

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
            setIsRolling(false);
            setMovingPlayerId(null);
            setDiceFaces(null);
            commitGameState(landedState);
          }, 160);

          timers.current.push(settleTimer);
        }
      }, 180);
      timers.current.push(movementInterval);
    }, 700);

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
                {currentPlayer.avatar} {currentPlayer.name}
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

      <div className="grid min-h-[calc(100vh-116px)] gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,28vw)]">
        <div className="rounded-xl border border-cyan/20 bg-[#75bceb] p-3 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.22)]">
          <div className="mx-auto grid aspect-square h-auto max-h-[calc(100vh-150px)] w-full max-w-[calc(100vh-150px)] grid-cols-9 grid-rows-9 gap-1.5 rounded-lg border-4 border-[#5c9e1c] bg-[#ff914d] p-1.5 shadow-[0_0_0_6px_rgba(22,75,42,0.35)]">
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

            <div className="col-start-3 col-end-8 row-start-3 row-end-8 overflow-hidden rounded-md border-4 border-[#2b7f62] bg-[linear-gradient(135deg,#31c7d0_0%,#4fc294_48%,#275a91_100%)] p-4 text-center">
              <div className="grid h-full place-items-center rounded-md bg-[radial-gradient(circle_at_center,rgba(255,244,170,0.22),transparent_32%),linear-gradient(135deg,rgba(10,34,58,0.16),rgba(10,34,58,0.5))]">
                <div className="w-full space-y-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-100">Data Monopoly</p>
                    <h2 className="mt-2 text-2xl font-black uppercase text-[#ffe66f] drop-shadow-[3px_3px_0_rgba(32,38,80,0.85)] min-[1360px]:text-3xl">
                      Cạnh tranh / Độc quyền
                    </h2>
                    <p className="mx-auto mt-2 max-w-xl text-xs font-semibold leading-5 text-white/85 min-[1360px]:text-sm">
                      Trung tâm mô phỏng thị trường: tung xúc xắc, di chuyển token và quan sát quyền lực thị trường tăng dần.
                    </p>
                  </div>
                  {currentPlayer && (
                    <Dice
                      currentPlayerName={currentPlayer.name}
                      diceFaces={diceFaces}
                      gameState={gameState}
                      isRolling={isRolling}
                      onRoll={handleRoll}
                    />
                  )}
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
              isBusy={isRolling}
              onApplyEvent={handleApplyEvent}
              onBuyAsset={handleBuyAsset}
              onEndTurn={handleEndTurn}
              onReset={onReset}
              onUpgradeAsset={handleUpgradeAsset}
            />
          )}
          <PlayerPanel currentPlayerId={currentPlayer?.id ?? null} gameState={gameState} />
          <GameLog entries={gameState.log} />
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
    <div style={{ gridColumn: position.col, gridRow: position.row }}>
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
                  <span className="text-xl">{player.avatar}</span>
                  <p className="truncate font-bold text-white">{player.name}</p>
                </div>
                <span className="text-xs font-black text-cyan">Ô {player.position + 1}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-300">
                <span>${player.money}</span>
                <span>{player.assets.length} assets</span>
                <span>{player.theoryPoints} theory</span>
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
