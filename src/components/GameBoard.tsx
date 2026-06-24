import { useMemo } from 'react';
import { events } from '../data/events';
import { quizzes } from '../data/quizzes';
import type { GameState, Player, Tile } from '../types/game';
import { answerQuiz, applyEvent, buyAsset, endTurn, handleTileLanding, movePlayer, rollDice, upgradeAsset } from '../utils/gameLogic';
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

  const commitGameState = (nextState: GameState) => {
    onGameStateChange(nextState);
    if (nextState.status === 'finished') {
      onFinish();
    }
  };

  const handleRoll = () => {
    if (!gameState || !currentPlayer || gameState.diceValue !== null) return;

    const diceValue = rollDice();
    const movedState = movePlayer(gameState, diceValue, currentPlayer.id);
    const landedState = handleTileLanding(movedState, currentPlayer.id);
    commitGameState(landedState);
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
    <section className="screen-shell space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="panel overflow-x-auto">
          <div className="mx-auto grid min-w-[760px] max-w-[980px] grid-cols-9 grid-rows-9 gap-2">
            {gameState.tiles.map((tile) => (
              <BoardTileAtPosition
                currentPlayerId={currentPlayer?.id ?? null}
                key={tile.id}
                owner={tile.asset ? ownerByTileId.get(tile.asset.tileId) ?? null : null}
                ownerColor={getOwnerColor(gameState.players, tile, ownerByTileId)}
                players={gameState.players}
                tile={tile}
              />
            ))}

            <div className="col-start-3 col-end-8 row-start-3 row-end-8 grid place-items-center rounded-lg border border-white/10 bg-oil/70 p-6 text-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Data Monopoly</p>
                <h2 className="mt-3 text-2xl font-black text-white">Oil Power vs Data Power</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Tài sản dầu mỏ tạo sức mạnh vật chất. Tài sản dữ liệu tạo sức mạnh nền tảng, người dùng và AI.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <CurrentPlayersCard gameState={gameState} />
          {currentPlayer && <Dice currentPlayerName={currentPlayer.name} gameState={gameState} onRoll={handleRoll} />}
          {currentPlayer && (
            <ActionPanel
              currentPlayer={currentPlayer}
              gameState={gameState}
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

interface BoardTileAtPositionProps {
  currentPlayerId: string | null;
  owner: Player | null;
  ownerColor: string | null;
  players: Player[];
  tile: Tile;
}

function BoardTileAtPosition({ currentPlayerId, owner, ownerColor, players, tile }: BoardTileAtPositionProps) {
  const position = perimeterPositions[tile.index];
  const playersOnTile = players.filter((player) => player.position === tile.index);

  return (
    <div style={{ gridColumn: position.col, gridRow: position.row }}>
      <BoardTile
        currentPlayerId={currentPlayerId}
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
    <section className="panel">
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
