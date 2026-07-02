import { type CSSProperties, type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { backgroundMusicTracks, defaultBackgroundMusicTrackId, type BackgroundMusicTrack } from '../data/backgroundMusic';
import { events } from '../data/events';
import { quizzes } from '../data/quizzes';
import type { GameState, Player, Tile } from '../types/game';
import { answerPurchaseQuiz, answerQuiz, applyDicePairRule, applyEvent, endTurn, handleTileLanding, movePlayer, startPurchaseQuiz, upgradeAsset } from '../utils/gameLogic';
import { ActionPanel } from './ActionPanel';
import { BoardTile, getTileDisplayName } from './BoardTile';
import { Dice } from './Dice';
import { EventModal } from './EventModal';
import { GameLog } from './GameLog';
import { PlayerAvatar } from './PlayerAvatar';
import { PlayerPanel } from './PlayerPanel';
import { QuizModal } from './QuizModal';
import { calculateTotalScore } from '../utils/scoring';

interface GameBoardProps {
  gameState: GameState | null;
  onGameStateChange: (gameState: GameState | null) => void;
  onFinish: () => void;
  onReset: () => void;
  onSetup: () => void;
  themeMode: 'dark' | 'light';
}

const playerColors = ['bg-cyan', 'bg-gold', 'bg-emerald-400', 'bg-rose-400'];
type TurnAnimationPhase = 'idle' | 'rolling' | 'revealed' | 'moving';
interface OffscreenPlayerGuide {
  direction: string;
  edge: 'top' | 'right' | 'bottom' | 'left';
  player: Player;
  tile: Tile;
}

const boardSize = 1180;
const boardCornerSize = 150;
const boardEdgeTileSize = 98;
const boardOuterGutter = 36;

const perimeterPositions = Array.from({ length: 40 }, (_, index) => {
  if (index <= 10) return { row: 11, col: 11 - index };
  if (index <= 20) return { row: 21 - index, col: 1 };
  if (index <= 30) return { row: 1, col: index - 19 };
  return { row: index - 29, col: 11 };
});

export function GameBoard({ gameState, onFinish, onGameStateChange, onReset, onSetup, themeMode }: GameBoardProps) {
  const currentPlayer = gameState?.players[gameState.currentPlayerIndex] ?? null;
  const [diceFaces, setDiceFaces] = useState<[number, number] | null>(null);
  const [turnAnimationPhase, setTurnAnimationPhase] = useState<TurnAnimationPhase>('idle');
  const [movingPlayerId, setMovingPlayerId] = useState<string | null>(null);
  const [boardZoom, setBoardZoom] = useState(0.9);
  const [boardBrightness, setBoardBrightness] = useState(1.35);
  const [visualPositions, setVisualPositions] = useState<Record<string, number>>({});
  const [offscreenPlayerGuides, setOffscreenPlayerGuides] = useState<OffscreenPlayerGuide[]>([]);
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isBackgroundMusicOn, setIsBackgroundMusicOn] = useState(true);
  const boardViewportRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const playersSectionRef = useRef<HTMLDivElement | null>(null);
  const actionSectionRef = useRef<HTMLDivElement | null>(null);
  const diceSectionRef = useRef<HTMLDivElement | null>(null);
  const diceRollSoundRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRetryPendingRef = useRef(false);
  const tileRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const timers = useRef<number[]>([]);
  const isRolling = turnAnimationPhase === 'rolling';
  const isMoving = turnAnimationPhase === 'moving';
  const isTurnBusy = turnAnimationPhase !== 'idle';
  const isLightTheme = themeMode === 'light';
  const selectedBackgroundMusicTrack = getBackgroundMusicTrack(gameState, currentPlayer);
  const canRollDice = Boolean(
    gameState &&
      currentPlayer &&
      !gameState.activeEventId &&
      !gameState.activeQuizId &&
      !gameState.activePurchaseQuiz &&
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
  const purchaseQuizState = gameState?.activePurchaseQuiz ?? null;
  const activeEvent = gameState?.activeEventId ? events.find((event) => event.id === gameState.activeEventId) ?? null : null;
  const activeTheoryQuiz = gameState?.activeQuizId ? quizzes.find((quiz) => quiz.id === gameState.activeQuizId) ?? null : null;
  const activePurchaseQuiz = purchaseQuizState ? quizzes.find((quiz) => quiz.id === purchaseQuizState.quizId) ?? null : null;
  const activeQuiz = activePurchaseQuiz ?? activeTheoryQuiz;
  const activeQuizMode = activePurchaseQuiz ? 'purchase' : 'theory';

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
    if (!gameState) {
      setOffscreenPlayerGuides([]);
      return;
    }

    let animationFrame = 0;
    const updateOffscreenGuides = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const viewport = boardViewportRef.current;
        if (!viewport) return;

        const viewportRect = viewport.getBoundingClientRect();
        const nextGuides = gameState.players.flatMap((player) => {
          const position = visualPositions[player.id] ?? player.position;
          const tileElement = tileRefs.current[position];
          const tile = gameState.tiles[position];
          if (!tileElement || !tile) return [];

          const tileRect = tileElement.getBoundingClientRect();
          const tokenX = tileRect.left + tileRect.width / 2;
          const tokenY = tileRect.top + tileRect.height * 0.78;
          const isVisible =
            tokenX >= viewportRect.left &&
            tokenX <= viewportRect.right &&
            tokenY >= viewportRect.top &&
            tokenY <= viewportRect.bottom;

          if (isVisible) return [];

          return [
            {
              direction: getOffscreenDirection(tokenX, tokenY, viewportRect),
              edge: getOffscreenEdge(tokenX, tokenY, viewportRect),
              player,
              tile,
            },
          ];
        });

        setOffscreenPlayerGuides(nextGuides);
      });
    };

    updateOffscreenGuides();
    const viewport = boardViewportRef.current;
    viewport?.addEventListener('scroll', updateOffscreenGuides, { passive: true });
    window.addEventListener('resize', updateOffscreenGuides);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      viewport?.removeEventListener('scroll', updateOffscreenGuides);
      window.removeEventListener('resize', updateOffscreenGuides);
    };
  }, [boardZoom, gameState, visualPositions]);

  useEffect(() => {
    if (!gameState || !isBackgroundMusicOn || !selectedBackgroundMusicTrack) return;

    playBackgroundMusicTrack(selectedBackgroundMusicTrack);
  }, [gameState, isBackgroundMusicOn, selectedBackgroundMusicTrack]);

  useEffect(() => {
    if (!gameState || !isBackgroundMusicOn) return;

    const retryBackgroundMusic = () => {
      if (!backgroundMusicRetryPendingRef.current) return;
      playBackgroundMusicTrack(selectedBackgroundMusicTrack);
    };

    window.addEventListener('pointerdown', retryBackgroundMusic);
    window.addEventListener('keydown', retryBackgroundMusic);

    return () => {
      window.removeEventListener('pointerdown', retryBackgroundMusic);
      window.removeEventListener('keydown', retryBackgroundMusic);
    };
  }, [gameState, isBackgroundMusicOn, selectedBackgroundMusicTrack]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => {
        window.clearTimeout(timer);
        window.clearInterval(timer);
      });
      timers.current = [];
      backgroundMusicRef.current?.pause();
    };
  }, []);

  const commitGameState = (nextState: GameState) => {
    onGameStateChange(nextState);
    if (nextState.status === 'finished') {
      onFinish();
    }
  };

  const scrollBoardToTile = (tileIndex: number, behavior: ScrollBehavior = 'smooth') => {
    const tileElement = tileRefs.current[tileIndex];
    if (!tileElement) return;

    tileElement.scrollIntoView({ behavior, block: 'center', inline: 'center' });
  };

  const scrollSidebarTo = (targetRef: RefObject<HTMLElement | HTMLDivElement | null>) => {
    const sidebar = sidebarRef.current;
    const target = targetRef.current;
    if (!sidebar || !target) return;

    const sidebarRect = sidebar.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const nextTop = sidebar.scrollTop + targetRect.top - sidebarRect.top - 12;
    sidebar.scrollTo({ behavior: 'smooth', top: Math.max(0, nextTop) });
  };

  const scrollBoardToDice = () => {
    const viewport = boardViewportRef.current;
    const diceSection = diceSectionRef.current;
    if (!viewport || !diceSection) return;

    const viewportRect = viewport.getBoundingClientRect();
    const diceRect = diceSection.getBoundingClientRect();
    const nextLeft = viewport.scrollLeft + diceRect.left - viewportRect.left - viewport.clientWidth / 2 + diceRect.width / 2;
    const nextTop = viewport.scrollTop + diceRect.top - viewportRect.top - viewport.clientHeight / 2 + diceRect.height / 2;

    viewport.scrollTo({
      behavior: 'smooth',
      left: Math.max(0, nextLeft),
      top: Math.max(0, nextTop),
    });
  };

  const playDiceRollSound = () => {
    if (!diceRollSoundRef.current) {
      diceRollSoundRef.current = new Audio('/sounds/dice-roll.mp3');
      diceRollSoundRef.current.volume = 0.75;
    }

    diceRollSoundRef.current.currentTime = 0;
    diceRollSoundRef.current.play().catch(() => {
      // Browser may block audio or the file may be missing; gameplay should continue.
    });
  };

  const playBackgroundMusicTrack = (track: BackgroundMusicTrack) => {
    if (backgroundMusicRef.current?.src.endsWith(track.filePath)) {
      backgroundMusicRef.current.play()
        .then(() => {
          backgroundMusicRetryPendingRef.current = false;
          setIsBackgroundMusicOn(true);
        })
        .catch(() => {
          backgroundMusicRetryPendingRef.current = true;
        });
      return;
    }

    backgroundMusicRef.current?.pause();
    backgroundMusicRef.current = new Audio(track.filePath);
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.35;
    backgroundMusicRef.current.play()
      .then(() => {
        backgroundMusicRetryPendingRef.current = false;
        setIsBackgroundMusicOn(true);
      })
      .catch(() => {
        backgroundMusicRetryPendingRef.current = true;
      });
  };

  const toggleBackgroundMusic = () => {
    if (isBackgroundMusicOn) {
      backgroundMusicRef.current?.pause();
      backgroundMusicRetryPendingRef.current = false;
      setIsBackgroundMusicOn(false);
      return;
    }

    playBackgroundMusicTrack(selectedBackgroundMusicTrack);
  };

  const updateBackgroundMusicMode = (mode: 'shared' | 'per-player') => {
    if (!gameState) return;
    commitGameState({
      ...gameState,
      backgroundMusic: {
        ...gameState.backgroundMusic,
        mode,
      },
    });
  };

  const updateSharedBackgroundMusic = (trackId: string) => {
    if (!gameState) return;
    commitGameState({
      ...gameState,
      backgroundMusic: {
        ...gameState.backgroundMusic,
        sharedTrackId: trackId,
      },
    });
  };

  const updateCurrentPlayerBackgroundMusic = (trackId: string) => {
    if (!gameState || !currentPlayer) return;
    commitGameState({
      ...gameState,
      players: gameState.players.map((player) => (player.id === currentPlayer.id ? { ...player, backgroundMusicTrackId: trackId } : player)),
    });
  };

  const handleRoll = () => {
    if (!gameState || !currentPlayer || !canRollDice) return;

    playDiceRollSound();

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
          scrollBoardToTile(nextPosition, 'smooth');

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
              scrollBoardToTile(nextPosition);
              window.setTimeout(() => scrollSidebarTo(actionSectionRef), 80);
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
    commitGameState(startPurchaseQuiz(gameState, currentPlayer.id, tileId));
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
    window.setTimeout(() => {
      scrollSidebarTo(actionSectionRef);
      scrollBoardToDice();
    }, 80);
  };

  const handleFinishEarly = () => {
    if (!gameState || isTurnBusy) return;
    const confirmed = window.confirm('Kết thúc ván hiện tại và chuyển sang màn kết quả?');
    if (!confirmed) return;

    const winner = [...gameState.players].sort((left, right) => calculateTotalScore(right) - calculateTotalScore(left))[0] ?? null;
    commitGameState({
      ...gameState,
      winnerId: winner?.id ?? null,
      status: 'finished',
      log: [
        ...gameState.log,
        {
          id: `log-${Date.now()}`,
          round: gameState.round,
          playerId: winner?.id,
          message: winner ? `Ván chơi kết thúc sớm. ${winner.name} đang dẫn đầu tổng điểm.` : 'Ván chơi kết thúc sớm.',
          type: 'win',
          createdAt: new Date().toISOString(),
        },
      ],
    });
  };

  const handleQuizAnswer = (answer: NonNullable<typeof activeQuiz>['correctAnswer']) => {
    if (!gameState || !currentPlayer) return;

    if (gameState.activePurchaseQuiz) {
      commitGameState(answerPurchaseQuiz(gameState, currentPlayer.id, answer));
      return;
    }

    if (!gameState.activeQuizId) return;
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
        <div className="flex flex-wrap gap-3">
          <details className="relative">
            <summary className="cursor-pointer rounded-md border border-white/15 bg-white/10 px-4 py-2 font-bold text-white transition hover:border-cyan/50 hover:bg-white/15">
              {isBackgroundMusicOn ? 'Nhạc nền đang bật' : 'Nhạc nền'}
            </summary>
            <div className="absolute right-0 z-30 mt-2 w-80 rounded-lg border border-white/15 bg-oil p-4 shadow-gold">
              <BackgroundMusicControls
                currentPlayerName={currentPlayer?.name ?? 'Người chơi'}
                mode={gameState.backgroundMusic.mode}
                onModeChange={updateBackgroundMusicMode}
                onPlayerTrackChange={updateCurrentPlayerBackgroundMusic}
                onSharedTrackChange={updateSharedBackgroundMusic}
                onToggle={toggleBackgroundMusic}
                playerTrackId={currentPlayer?.backgroundMusicTrackId ?? defaultBackgroundMusicTrackId}
                sharedTrackId={gameState.backgroundMusic.sharedTrackId}
                tracks={backgroundMusicTracks}
                isOn={isBackgroundMusicOn}
              />
            </div>
          </details>
          <button className="secondary-button" onClick={() => setIsTheoryOpen(true)} type="button">
            Lý thuyết
          </button>
          <button className="secondary-button" onClick={() => setIsRulesOpen(true)} type="button">
            Luật chơi
          </button>
          <button className="primary-button" disabled={gameState.status !== 'finished'} onClick={onFinish} type="button">
            Xem kết quả
          </button>
          <details className="relative">
            <summary className="cursor-pointer rounded-md border border-red-300/30 bg-red-500/10 px-4 py-2 font-bold text-red-100 transition hover:bg-red-500/20">
              Quản lý ván
            </summary>
            <div className="absolute right-0 z-30 mt-2 w-72 rounded-lg border border-red-200/20 bg-oil p-4 shadow-gold">
              <GameManagementCard isBusy={isTurnBusy} onFinish={handleFinishEarly} onReset={onReset} />
            </div>
          </details>
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
          </div>

          <div className="relative">
            <div
              className={`relative isolate max-h-[calc(100vh-176px)] overflow-auto rounded-xl border shadow-[inset_0_0_0_2px_rgba(255,255,255,0.16)] ${
                isLightTheme ? 'border-slate-900/10 bg-slate-200' : 'border-cyan/20 bg-[#162836]'
              }`}
              ref={boardViewportRef}
            >
              <div
                className="relative min-h-full min-w-full p-5"
                style={{
                  minHeight: boardSize * boardZoom + boardOuterGutter * 2 + 40,
                  minWidth: boardSize * boardZoom + boardOuterGutter * 2 + 40,
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: 'url("/images/board/board-outer-blue.png")', filter: `brightness(${boardBrightness})` }}
                />
                <div className={`pointer-events-none absolute inset-0 z-0 ${isLightTheme ? 'bg-white/10' : 'bg-black/5'}`} />
                <div
                  className="relative z-10 mx-auto shrink-0"
                  style={{
                    height: boardSize * boardZoom + boardOuterGutter * 2,
                    width: boardSize * boardZoom + boardOuterGutter * 2,
                  }}
                >
                  <div
                    className="absolute isolate z-10 grid shrink-0 origin-top-left overflow-visible rounded-lg bg-[#223a3d] outline outline-4 outline-[#3e8f73] shadow-[0_0_0_6px_rgba(7,20,24,0.32)]"
                    style={{
                      gridTemplateColumns: `${boardCornerSize}px repeat(9, ${boardEdgeTileSize}px) ${boardCornerSize}px`,
                      gridTemplateRows: `${boardCornerSize}px repeat(9, ${boardEdgeTileSize}px) ${boardCornerSize}px`,
                      height: boardSize,
                      left: boardOuterGutter,
                      top: boardOuterGutter,
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
                        registerTileRef={(element) => {
                          tileRefs.current[tile.index] = element;
                        }}
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
                          <div ref={diceSectionRef}>
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <OffscreenPlayerGuidePanel guides={offscreenPlayerGuides} />
          </div>
        </div>

        <aside
          className="max-h-[calc(100vh-116px)] space-y-4 overflow-y-auto rounded-xl border border-red-300/20 bg-[linear-gradient(180deg,rgba(127,29,29,0.42),rgba(67,20,7,0.28))] p-3 pr-2"
          ref={sidebarRef}
        >
          <div ref={playersSectionRef}>
            <CurrentPlayersCard gameState={gameState} />
          </div>
          {currentPlayer && (
            <div ref={actionSectionRef}>
              <ActionPanel
                currentPlayer={currentPlayer}
                gameState={gameState}
                isBusy={isTurnBusy}
                onApplyEvent={handleApplyEvent}
                onBuyAsset={handleBuyAsset}
                onEndTurn={handleEndTurn}
                onUpgradeAsset={handleUpgradeAsset}
              />
            </div>
          )}
          <PlayerPanel currentPlayerId={currentPlayer?.id ?? null} gameState={gameState} />
          <GameLog entries={gameState.log} />
        </aside>
      </div>

      <EventModal event={activeEvent} onApply={handleApplyEvent} />
      <QuizModal mode={activeQuizMode} quiz={activeQuiz} onAnswer={handleQuizAnswer} />
      <GameTheoryModal isOpen={isTheoryOpen} onClose={() => setIsTheoryOpen(false)} />
      <GameRulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </section>
  );
}

function randomDieFace(): number {
  return Math.floor(Math.random() * 6) + 1;
}

function getBackgroundMusicTrack(gameState: GameState | null, currentPlayer: Player | null): BackgroundMusicTrack {
  const settings = gameState?.backgroundMusic;
  const trackId =
    settings?.mode === 'per-player'
      ? currentPlayer?.backgroundMusicTrackId ?? settings.sharedTrackId
      : settings?.sharedTrackId;

  return backgroundMusicTracks.find((track) => track.id === trackId) ?? backgroundMusicTracks[0];
}

interface BackgroundMusicControlsProps {
  currentPlayerName: string;
  mode: 'shared' | 'per-player';
  sharedTrackId: string;
  playerTrackId: string;
  tracks: BackgroundMusicTrack[];
  isOn: boolean;
  onModeChange: (mode: 'shared' | 'per-player') => void;
  onSharedTrackChange: (trackId: string) => void;
  onPlayerTrackChange: (trackId: string) => void;
  onToggle: () => void;
}

function BackgroundMusicControls({
  currentPlayerName,
  mode,
  sharedTrackId,
  playerTrackId,
  tracks,
  isOn,
  onModeChange,
  onSharedTrackChange,
  onPlayerTrackChange,
  onToggle,
}: BackgroundMusicControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">Nhạc nền</p>
          <p className="mt-1 text-sm font-bold text-slate-200">{isOn ? 'Đang phát' : 'Đang tắt'}</p>
        </div>
        <button className="secondary-button px-3 py-2" onClick={onToggle} type="button">
          {isOn ? 'Tắt' : 'Bật'}
        </button>
      </div>

      <div className="grid gap-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <input checked={mode === 'shared'} name="game-background-music-mode" onChange={() => onModeChange('shared')} type="radio" />
          Dùng chung
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <input checked={mode === 'per-player'} name="game-background-music-mode" onChange={() => onModeChange('per-player')} type="radio" />
          Đổi theo lượt
        </label>
      </div>

      <label className="block text-sm font-bold text-slate-200" htmlFor="shared-background-music">
        Bài dùng chung
      </label>
      <select
        className="w-full rounded-md border border-white/10 bg-midnight px-3 py-2 text-sm font-bold text-white outline-none focus:border-cyan disabled:opacity-50"
        disabled={mode !== 'shared'}
        id="shared-background-music"
        onChange={(event) => onSharedTrackChange(event.target.value)}
        value={sharedTrackId}
      >
        {tracks.map((track) => (
          <option key={track.id} value={track.id}>
            {track.title}
          </option>
        ))}
      </select>

      <label className="block text-sm font-bold text-slate-200" htmlFor="player-background-music">
        Bài của {currentPlayerName}
      </label>
      <select
        className="w-full rounded-md border border-white/10 bg-midnight px-3 py-2 text-sm font-bold text-white outline-none focus:border-cyan disabled:opacity-50"
        disabled={mode !== 'per-player'}
        id="player-background-music"
        onChange={(event) => onPlayerTrackChange(event.target.value)}
        value={playerTrackId}
      >
        {tracks.map((track) => (
          <option key={track.id} value={track.id}>
            {track.title}
          </option>
        ))}
      </select>
    </div>
  );
}

interface BoardTileAtPositionProps {
  currentPlayerId: string | null;
  movingPlayerId: string | null;
  owner: Player | null;
  ownerColor: string | null;
  players: Player[];
  registerTileRef: (element: HTMLDivElement | null) => void;
  tile: Tile;
  visualPositions: Record<string, number>;
}

function BoardTileAtPosition({ currentPlayerId, movingPlayerId, owner, ownerColor, players, registerTileRef, tile, visualPositions }: BoardTileAtPositionProps) {
  const position = perimeterPositions[tile.index];
  const playersOnTile = players.filter((player) => (visualPositions[player.id] ?? player.position) === tile.index);

  return (
    <div className="relative z-10 min-h-0 min-w-0" ref={registerTileRef} style={{ gridColumn: position.col, gridRow: position.row }}>
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

function OffscreenPlayerGuidePanel({ guides }: { guides: OffscreenPlayerGuide[] }) {
  if (guides.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {guides.map(({ direction, edge, player, tile }, index) => {
        const edgeStyle = getGuideEdgeStyle(edge, index);

        return (
          <div
            aria-label={`${direction} tới ${player.name}, ô ${tile.index + 1}: ${getTileDisplayName(tile)}`}
            className="absolute flex h-12 w-12 items-center justify-center rounded-full border border-cyan/50 bg-oil/88 text-cyan shadow-[0_12px_28px_rgba(0,0,0,0.38)] backdrop-blur"
            key={player.id}
            style={edgeStyle}
            title={`${direction} tới ${player.name} - ô ${tile.index + 1}: ${getTileDisplayName(tile)}`}
          >
            <span aria-hidden="true" className="absolute grid h-5 w-5 place-items-center rounded-full bg-cyan text-[13px] font-black leading-none text-oil shadow-glow">
              {getGuideArrow(edge)}
            </span>
            <PlayerAvatar alt={player.name} className="h-8 w-8 rounded-full ring-2 ring-white/80" imagePath={player.avatar} label={player.name} />
          </div>
        );
      })}
    </div>
  );
}

function getGuideArrow(edge: OffscreenPlayerGuide['edge']): string {
  if (edge === 'top') return '^';
  if (edge === 'right') return '>';
  if (edge === 'bottom') return 'v';
  return '<';
}

function getGuideEdgeStyle(edge: OffscreenPlayerGuide['edge'], index: number): CSSProperties {
  const offset = 14 + index * 54;

  if (edge === 'top') return { left: offset, top: 12 };
  if (edge === 'right') return { right: 12, top: offset };
  if (edge === 'bottom') return { bottom: 12, left: offset };
  return { left: 12, top: offset };
}

function getOffscreenDirection(x: number, y: number, viewportRect: DOMRect): string {
  const vertical = y < viewportRect.top ? 'lên' : y > viewportRect.bottom ? 'xuống' : '';
  const horizontal = x < viewportRect.left ? 'trái' : x > viewportRect.right ? 'phải' : '';

  if (vertical && horizontal) return `Cuộn ${vertical} ${horizontal}`;
  if (vertical) return `Cuộn ${vertical}`;
  if (horizontal) return `Cuộn sang ${horizontal}`;

  return 'Cuộn tới';
}

function getOffscreenEdge(x: number, y: number, viewportRect: DOMRect): OffscreenPlayerGuide['edge'] {
  const distances = [
    { edge: 'top' as const, value: Math.max(0, viewportRect.top - y) },
    { edge: 'right' as const, value: Math.max(0, x - viewportRect.right) },
    { edge: 'bottom' as const, value: Math.max(0, y - viewportRect.bottom) },
    { edge: 'left' as const, value: Math.max(0, viewportRect.left - x) },
  ];

  return distances.sort((left, right) => right.value - left.value)[0]?.edge ?? 'bottom';
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

function GameTheoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const rows = [
    {
      criterion: 'Cơ sở phân tích lý thuyết',
      oil: 'Tích tụ, tập trung tư bản; kiểm soát tư liệu và khâu sản xuất - lưu thông quan trọng.',
      data: 'Vận dụng hiện đại: nền tảng lớn có thể tích lũy dữ liệu, người dùng và hạ tầng số.',
    },
    {
      criterion: 'Nguồn lực trong game',
      oil: 'Mỏ dầu, nhà máy lọc dầu, đường ống, cảng và logistics.',
      data: 'Nền tảng số, hạ tầng đám mây, dữ liệu, thuật toán, AI và người dùng.',
    },
    {
      criterion: 'Rào cản cạnh tranh',
      oil: 'Vốn lớn, hạ tầng vật chất, quyền tiếp cận tài nguyên.',
      data: 'Hiệu ứng mạng lưới, dữ liệu tích lũy, chi phí hạ tầng đám mây, vị trí trung gian.',
    },
    {
      criterion: 'Điều cần nhớ',
      oil: 'Đây là ví dụ mô phỏng độc quyền dựa trên tài nguyên vật chất.',
      data: 'Đây là phần liên hệ kinh tế số, không phải khái niệm nguyên văn trong giáo trình.',
    },
  ];

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-oil/80 px-4 py-5 backdrop-blur-md">
      <section className="flex max-h-[calc(100vh-2.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-cyan/30 bg-midnight shadow-gold">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan">Lý thuyết nhanh</p>
            <h2 className="mt-2 text-2xl font-black text-white">Độc quyền dầu mỏ và độc quyền dữ liệu</h2>
          </div>
          <button className="secondary-button px-3 py-2" onClick={onClose} type="button">
            Đóng
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-oil/60 p-4">
              <h3 className="text-lg font-black text-white">Ý chính lý thuyết</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Game tập trung vào xu hướng tích tụ, tập trung tư bản và khả năng hình thành quyền lực độc quyền. Các nội dung về dữ liệu, AI và nền tảng là phần vận dụng vào kinh tế số để hỗ trợ thảo luận.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-oil/60 p-4">
              <h3 className="text-lg font-black text-white">Cách đọc gameplay</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Mua tài sản, thu phí, nâng cấp và gặp điều tiết là các cơ chế mô phỏng quyền lực thị trường. Kết quả game không thay thế giáo trình, mà giúp người học minh họa và phản biện chủ đề.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full min-w-[780px] border-separate border-spacing-0 text-left text-sm">
              <thead className="text-cyan">
                <tr>
                  <th className="border-b border-white/10 bg-oil/80 px-4 py-3">Tiêu chí</th>
                  <th className="border-b border-white/10 bg-oil/80 px-4 py-3">Dầu mỏ</th>
                  <th className="border-b border-white/10 bg-oil/80 px-4 py-3">Dữ liệu</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {rows.map((row) => (
                  <tr key={row.criterion}>
                    <td className="border-b border-white/10 px-4 py-4 font-bold text-white">{row.criterion}</td>
                    <td className="border-b border-white/10 px-4 py-4 leading-6">{row.oil}</td>
                    <td className="border-b border-white/10 px-4 py-4 leading-6">{row.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function GameRulesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const ruleSections = [
    {
      title: '1. Mục tiêu của trò chơi',
      content: [
        'Data Monopoly mô phỏng quá trình cạnh tranh, tích lũy tài sản và hình thành quyền lực thị trường.',
        'Người chơi bắt đầu với vốn khởi nghiệp; ảnh hưởng, người dùng, dữ liệu, điểm lý luận và tài sản đều bắt đầu từ 0.',
        'Thông điệp chính: hình thức độc quyền có thể chuyển từ tài nguyên vật chất sang dữ liệu/nền tảng, nhưng xu hướng tập trung tư bản và quyền lực thị trường vẫn cần được phân tích.',
        'Lưu ý học thuật: Big Tech, gatekeeper, behavioral surplus, walled garden, DMA và Cambridge Analytica là phần vận dụng hiện đại, không phải thuật ngữ gốc của giáo trình Mác - Lênin.',
      ],
    },
    {
      title: '2. Tóm tắt nhanh cho người mới chơi',
      content: [
        'Mỗi người chơi là một chủ thể cạnh tranh trên thị trường.',
        'Mục tiêu là mua tài sản, nâng cấp tài sản và tích lũy quyền lực thị trường.',
        'Muốn mua tài sản, người chơi thường phải trả lời đúng câu hỏi lý luận.',
        'Tài sản dầu mỏ giúp tạo vốn và ảnh hưởng; tài sản dữ liệu giúp tạo người dùng, dữ liệu và lợi thế nền tảng.',
        'Một lượt chơi: tung xúc xắc -> di chuyển -> xử lý ô đang đứng -> mua/nâng cấp/trả phí/trả lời câu hỏi nếu có -> kết thúc lượt.',
      ],
    },
    {
      title: '3. Sau khi chơi, người chơi hiểu được gì?',
      content: [
        'Giải thích được nguyên nhân hình thành độc quyền qua quá trình tích lũy tài sản và quyền lực thị trường.',
        'Phân biệt được tích tụ tư bản với tập trung tư bản qua nâng cấp, tái đầu tư và sự dồn quyền lực về người chơi mạnh.',
        'Nhận diện rào cản gia nhập trong độc quyền dầu mỏ và độc quyền dữ liệu.',
        'Phân tích hiệu ứng mạng lưới và vòng lặp người dùng - dữ liệu - AI.',
        'Đánh giá tác động hai mặt của độc quyền và biết tách lý luận Mác - Lênin với phần vận dụng hiện đại về Big Tech.',
      ],
    },
    {
      title: '4. Mỗi lượt chơi',
      content: [
        'Bấm Tung xúc xắc để di chuyển theo tổng 2 xúc xắc.',
        'Khung bàn cờ tự đi theo nhân vật. Khi di chuyển xong, bảng bên phải tự chuyển đến phần Hành động.',
        'Xử lý ô đang đứng: mua tài sản bằng quiz, trả phí, rút thẻ, trả lời quiz hoặc chịu điều tiết/khủng hoảng.',
        'Sau khi xử lý xong, bấm Kết thúc lượt. Bảng bên phải sẽ quay về phần Người chơi.',
      ],
    },
    {
      title: '5. Hiệu ứng khi di chuyển',
      content: [
        'Nếu tung tổng từ 10 trở lên: tài sản dữ liệu có thể tạo thêm người dùng/dữ liệu; hạ tầng dầu mỏ, logistics hoặc đám mây có thể tăng ảnh hưởng.',
        'Nếu tung tổng từ 3 trở xuống và đã có tài sản: phát sinh chi phí vận hành nhỏ.',
        'Nếu tung cặp 1:1 hoặc 6:6: được tung thêm một lần sau khi xử lý xong lượt di chuyển hiện tại.',
      ],
    },
    {
      title: '6. Mua và nâng cấp tài sản',
      content: [
        'Nếu dừng ở tài sản chưa có chủ và đủ vốn, người chơi bấm mua để nhận 1 câu hỏi lý luận ngẫu nhiên.',
        'Trả lời đúng thì mua được tài sản, nhận thêm một ít điểm lý luận và ảnh hưởng; trả lời sai thì mất quyền mua ô đó trong lượt hiện tại.',
        'Tài sản dầu mỏ thường tạo vốn và ảnh hưởng. Tài sản dữ liệu tạo người dùng, dữ liệu và ảnh hưởng.',
        'Tài sản mới mua chưa nâng cấp ngay; phải đi qua Khởi nghiệp ít nhất 1 vòng sau khi mua.',
        'Nâng cấp làm tăng giá trị tài sản, tiền thuê và quyền lực thị trường.',
      ],
    },
    {
      title: '7. Người dùng, dữ liệu và vòng lặp nền tảng',
      content: [
        'Cuối lượt, nếu người chơi có tài sản dữ liệu và có người dùng, người dùng sẽ tạo thêm dữ liệu hành vi.',
        'Nhiều người dùng -> nhiều dữ liệu; dữ liệu có thể làm thuật toán/AI mạnh hơn; AI và nền tảng mạnh hơn có thể tiếp tục hút người dùng.',
        'Đây là phần mô phỏng độc quyền dữ liệu hiện đại, không phải khái niệm nguyên văn trong giáo trình.',
      ],
    },
    {
      title: '8. Khí vận và Cơ hội',
      content: [
        'Khí vận thiên về biến động cá nhân: trúng vốn, thua lỗ, KOL đánh giá, tín dụng cloud, sự cố cáp, bão lũ, chi phí vận hành.',
        'Cơ hội thiên về biến động thị trường: hiệu ứng mạng lưới, vòng lặp người dùng - dữ liệu, dữ liệu mở, tẩy chay nền tảng, thử nghiệm chính sách, khóa nhà cung ứng, phạt chống độc quyền.',
        'Thẻ thường được đưa xuống đáy xấp sau khi dùng; thẻ giữ lại không quay lại xấp ngay.',
      ],
    },
    {
      title: '9. Quiz, điều tiết và khủng hoảng',
      content: [
        'Quiz lý luận: trả lời đúng nhận điểm lý luận và tăng nhẹ ảnh hưởng; trả lời sai vẫn hiện giải thích để học lại.',
        'Điểm lý luận là chỉ số học tập trong game; tăng ảnh hưởng khi trả lời đúng là cơ chế game hóa năng lực nhận diện lý thuyết, không phải quy luật kinh tế trực tiếp.',
        'Quiz mua tài sản dùng cùng bộ câu hỏi nhưng có mục tiêu khác: đúng mới được mua, sai thì thử lại khi quay lại ô ở lượt sau.',
        'Thuế/Quy định: người đứng trên ô trả phí và mất ảnh hưởng; sở hữu cloud có thể giảm phí.',
        'Điều trần/Chống độc quyền: người dẫn đầu quyền lực thị trường bị nhắm đến.',
        'Khủng hoảng: mất chi phí vận hành, dữ liệu và ảnh hưởng.',
      ],
    },
    {
      title: '10. Điều kiện thắng',
      content: [
        'Từ vòng 5 trở đi, nếu một người chơi có ít nhất 4 tài sản và kiểm soát ít nhất 60% tổng quyền lực thị trường, người đó thắng.',
        'Hoặc đạt 100 điểm lý luận và dẫn đầu kinh tế.',
        'Hoặc sau 25 vòng, người có tổng điểm cao nhất thắng.',
        'Người thắng là người đạt ưu thế trong mô phỏng, không có nghĩa kết quả đó tốt nhất cho xã hội.',
        'Nút Xem kết quả chỉ mở sau khi game thật sự kết thúc.',
      ],
    },
    {
      title: '11. Cách đọc bài học từ game',
      content: [
        'Dầu mỏ: quyền lực đến từ tài nguyên vật chất và hạ tầng sản xuất - lưu thông.',
        'Dữ liệu: quyền lực đến từ người dùng, dữ liệu, nền tảng, thuật toán, AI và hiệu ứng mạng lưới.',
        'Điểm lý luận là chỉ số học tập; quyền lực thị trường trong game dựa trên vốn, tài sản, người dùng, dữ liệu và ảnh hưởng.',
        'Điều tiết, khủng hoảng, tẩy chay và dữ liệu mở cho thấy độc quyền không phải sức mạnh tuyệt đối; nó luôn gặp giới hạn xã hội, chính sách và kỹ thuật.',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-oil/80 px-4 py-5 backdrop-blur-md">
      <section className="flex max-h-[calc(100vh-2.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-gold/30 bg-midnight shadow-gold">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Luật chơi đầy đủ</p>
            <h2 className="mt-2 text-2xl font-black text-white">Data Monopoly</h2>
          </div>
          <button className="secondary-button px-3 py-2" onClick={onClose} type="button">
            Đóng
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {ruleSections.map((section) => (
              <article className="rounded-lg border border-white/10 bg-oil/60 p-4" key={section.title}>
                <h3 className="text-lg font-black text-white">{section.title}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                  {section.content.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-5 overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
              <thead className="text-cyan">
                <tr>
                  <th className="border-b border-white/10 bg-oil/80 px-4 py-3">Chỉ số</th>
                  <th className="border-b border-white/10 bg-oil/80 px-4 py-3">Bắt đầu</th>
                  <th className="border-b border-white/10 bg-oil/80 px-4 py-3">Loại</th>
                  <th className="border-b border-white/10 bg-oil/80 px-4 py-3">Ý nghĩa</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[
                  ['Vốn', '$500', 'Kinh tế', 'Mua tài sản, nâng cấp, trả phí; liên hệ tích lũy tư bản và tái đầu tư.'],
                  ['Ảnh hưởng', '0', 'Xã hội/thị trường', 'Sức nặng xã hội/thị trường; liên hệ vị thế và tác động xã hội.'],
                  ['Người dùng', '0', 'Kinh tế số/xã hội', 'Nguồn tạo dữ liệu; liên hệ hiệu ứng mạng lưới.'],
                  ['Dữ liệu', '0', 'Kinh tế số', 'Tài nguyên chiến lược trong kinh tế số, gắn với thuật toán/AI.'],
                  ['Điểm lý luận', '0', 'Game hóa/học tập', 'Đo mức trả lời đúng quiz; không phải quyền lực thị trường trực tiếp.'],
                  ['Quyền lực thị trường', 'Tính theo ván', 'Tổng hợp mô phỏng', 'Tổng hợp vốn, tài sản, người dùng, dữ liệu và ảnh hưởng để ước lượng mức chi phối.'],
                  ['Điểm tổng', 'Tính theo ván', 'Game hóa', 'Xếp hạng cuối game, kết hợp thành tích kinh tế và kết quả học tập.'],
                ].map(([metric, start, type, meaning]) => (
                  <tr key={metric}>
                    <td className="border-b border-white/10 px-4 py-4 font-bold text-white">{metric}</td>
                    <td className="border-b border-white/10 px-4 py-4">{start}</td>
                    <td className="border-b border-white/10 px-4 py-4 font-semibold text-gold">{type}</td>
                    <td className="border-b border-white/10 px-4 py-4 leading-6">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
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
