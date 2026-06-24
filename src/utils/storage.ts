import type { GameState } from '../types/game';

const storageKey = 'data-monopoly-progress';

export function saveGameState(gameState: GameState) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(gameState));
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
    return JSON.parse(raw) as GameState;
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
