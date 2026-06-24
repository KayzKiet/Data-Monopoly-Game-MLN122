import type { GameState } from '../types/game';

const storageKey = 'data-monopoly-progress';

export function saveGameState(gameState: GameState) {
  localStorage.setItem(storageKey, JSON.stringify(gameState));
}

export function loadGameState(): GameState | null {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as GameState;
  } catch {
    clearGameState();
    return null;
  }
}

export function clearGameState() {
  localStorage.removeItem(storageKey);
}
