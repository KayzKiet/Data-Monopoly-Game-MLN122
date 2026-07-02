import { avatars } from '../data/avatars';
import { defaultBackgroundMusicTrackId } from '../data/backgroundMusic';
import { events } from '../data/events';
import { tiles } from '../data/tiles';
import type { GameState } from '../types/game';
import { sanitizeGameState } from './gameLogic';

const storageKey = 'data-monopoly-progress';

export function saveGameState(gameState: GameState) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(sanitizeGameState(gameState)));
  } catch {
    // localStorage can fail in private browsing or full storage; gameplay should continue in memory.
  }
}

export function loadGameState(): GameState | null {
  let raw: string | null = null;

  try {
    raw = localStorage.getItem(storageKey);
  } catch {
    return null;
  }

  if (!raw) return null;

  try {
    return migrateGameState(JSON.parse(raw) as GameState);
  } catch {
    clearGameState();
    return null;
  }
}

export function clearGameState() {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage failures; the in-memory state will still reset.
  }
}

function migrateGameState(gameState: GameState): GameState {
  const eventDecks = gameState.eventDecks ?? {
    fortune: events.filter((event) => event.deck === 'fortune').map((event) => event.id),
    chance: events.filter((event) => event.deck === 'chance').map((event) => event.id),
  };

  return sanitizeGameState({
    ...gameState,
    tiles,
    activeEventDeck: gameState.activeEventDeck ?? null,
    activePurchaseQuiz: gameState.activePurchaseQuiz ?? null,
    purchaseQuizFailedTileIds: gameState.purchaseQuizFailedTileIds ?? [],
    rollsThisTurn: gameState.rollsThisTurn ?? (gameState.diceValue !== null ? 1 : 0),
    extraRollsAvailable: gameState.extraRollsAvailable ?? 0,
    backgroundMusic: gameState.backgroundMusic ?? {
      mode: 'shared',
      sharedTrackId: defaultBackgroundMusicTrackId,
    },
    eventDecks,
    players: gameState.players.map((player) => ({
      ...player,
      avatar: normalizeAvatar(player.avatar, Number(player.id.replace('player-', '')) - 1),
      backgroundMusicTrackId: player.backgroundMusicTrackId ?? defaultBackgroundMusicTrackId,
      heldEventCards: player.heldEventCards ?? [],
      position: player.position % tiles.length,
      assets: player.assets.map((asset) => ({ ...asset, lapsHeld: asset.lapsHeld ?? 1 })),
    })),
  });
}

function normalizeAvatar(avatar: string, index: number): string {
  if (avatar.startsWith('/images/players/')) return avatar;
  return avatars[index]?.imagePath ?? avatars[0].imagePath;
}
