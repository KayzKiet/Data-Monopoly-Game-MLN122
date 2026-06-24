import { events } from '../data/events';
import { quizzes } from '../data/quizzes';
import { tiles } from '../data/tiles';
import type { Asset, EventCard, GameLogEntry, GameState, Player, QuizQuestion, Tile } from '../types/game';
import { calculateMarketPower, calculateTotalScore, getLastPlacePlayer, getLeadingPlayer } from './scoring';

const START_BONUS = 100;
const INITIAL_MONEY = 500;
const INITIAL_INFLUENCE = 10;
const INITIAL_USERS = 20;
const INITIAL_DATA = 20;
const THEORY_REWARD = 10;
const BOARD_SIZE = 32;

type PlayerSetupInput = Pick<Player, 'name' | 'avatar'> & Partial<Pick<Player, 'id'>>;

export function createInitialPlayer(id: number, name: string, avatar: string): Player {
  return {
    id: `player-${id}`,
    name,
    avatar,
    money: INITIAL_MONEY,
    influence: INITIAL_INFLUENCE,
    users: INITIAL_USERS,
    data: INITIAL_DATA,
    theoryPoints: 0,
    assets: [],
    position: 0,
    isInJail: false,
    underInvestigation: false,
  };
}

export function createInitialGameState(players: PlayerSetupInput[]): GameState {
  const normalizedPlayers = players.map((player, index) => ({
    ...createInitialPlayer(index + 1, player.name, player.avatar),
    id: player.id ?? `player-${index + 1}`,
  }));

  return addLog(
    {
      players: normalizedPlayers,
      tiles,
      currentPlayerIndex: 0,
      round: 1,
      maxRounds: 25,
      diceValue: null,
      selectedTileId: null,
      activeEventId: null,
      activeQuizId: null,
      winnerId: null,
      status: 'playing',
      log: [],
    },
    'system',
    'Game bắt đầu. Mỗi người chơi khởi đầu với vốn, ảnh hưởng, người dùng, dữ liệu và 0 tài sản.',
  );
}

export function rollDice(seed?: number): number {
  if (seed !== undefined) {
    return (Math.abs(seed) % 6) + 1;
  }

  return Math.floor(Math.random() * 6) + 1;
}

export function movePlayer(state: GameState, diceValue: number, playerId = getCurrentPlayer(state).id): GameState {
  const player = findPlayer(state, playerId);
  if (!player || state.status !== 'playing') return state;

  const nextPosition = (player.position + diceValue) % BOARD_SIZE;
  const passedStart = player.position + diceValue >= BOARD_SIZE;

  const updatedPlayers = state.players.map((item) => {
    if (item.id !== playerId) return item;

    return {
      ...item,
      position: nextPosition,
      money: item.money + (passedStart ? START_BONUS : 0),
    };
  });

  const movedState = {
    ...state,
    players: updatedPlayers,
    diceValue,
    selectedTileId: state.tiles[nextPosition]?.id ?? null,
  };

  const startMessage = passedStart ? ` và nhận ${START_BONUS} vốn khi đi qua Start` : '';
  return addLog(movedState, 'movement', `${player.name} tung ${diceValue}, di chuyển đến ô ${nextPosition + 1}${startMessage}.`, playerId);
}

export function handleTileLanding(state: GameState, playerId = getCurrentPlayer(state).id): GameState {
  const player = findPlayer(state, playerId);
  if (!player || state.status !== 'playing') return state;

  const tile = state.tiles[player.position];
  if (!tile) return state;

  if (tile.asset) {
    const owner = findAssetOwner(state, tile.asset.tileId);
    if (!owner) {
      return addLog({ ...state, selectedTileId: tile.id }, 'system', `${tile.name} chưa có chủ. ${player.name} có thể mua tài sản này.`, playerId);
    }

    if (owner.id === playerId) {
      return applyOwnedAssetYield(state, player, tile);
    }

    return payRent(state, playerId, owner.id, tile.asset.tileId);
  }

  if (tile.type === 'tax-regulation') {
    return applyRegulationTile(state, player, tile);
  }

  if (tile.type === 'crisis') {
    return applyCrisisTile(state, player, tile);
  }

  if (tile.type === 'event') {
    const event = pickEvent(state, tile.index);
    return addLog({ ...state, activeEventId: event.id }, 'event', `${player.name} rút sự kiện: ${event.title}.`, playerId);
  }

  if (tile.type === 'theory-quiz') {
    const quizId = tile.quizId ?? quizzes[0]?.id ?? null;
    return addLog({ ...state, activeQuizId: quizId }, 'quiz', `${player.name} nhận câu hỏi lý luận MLN122.`, playerId);
  }

  if (tile.type === 'antitrust-investigation') {
    return applyAntitrustTile(state, player, tile);
  }

  return addLog(state, 'system', `${player.name} dừng ở ${tile.name}.`, playerId);
}

export function buyAsset(state: GameState, playerId: string, tileId: string): GameState {
  const tile = state.tiles.find((item) => item.id === tileId);
  const player = findPlayer(state, playerId);
  const tileAsset = tile?.asset;

  if (!tileAsset || !player || findAssetOwner(state, tileAsset.tileId)) return state;
  if (player.money < tileAsset.purchasePrice) {
    return addLog(state, 'purchase', `${player.name} chưa đủ vốn để mua ${tileAsset.name}.`, playerId);
  }

  const updatedPlayers = state.players.map((item) => {
    if (item.id !== playerId) return item;

    const resourceGain = getAssetResourceGain(tileAsset);
    return {
      ...item,
      money: item.money - tileAsset.purchasePrice + resourceGain.money,
      users: item.users + resourceGain.users,
      data: item.data + resourceGain.data,
      influence: item.influence + resourceGain.influence,
      assets: [...item.assets, cloneAsset(tileAsset)],
    };
  });

  return addLog(
    { ...state, players: updatedPlayers, selectedTileId: null },
    'purchase',
    `${player.name} mua ${tileAsset.name}.`,
    playerId,
  );
}

export function upgradeAsset(state: GameState, playerId: string, assetId: string): GameState {
  const player = findPlayer(state, playerId);
  const ownedAsset = player?.assets.find((asset) => asset.id === assetId);
  if (!player || !ownedAsset || ownedAsset.level >= ownedAsset.maxLevel) return state;

  const cloudDiscount = player.assets.some((asset) => asset.type === 'cloud-infrastructure') ? 0.85 : 1;
  const upgradeCost = Math.round(ownedAsset.upgradeCost * cloudDiscount);
  if (player.money < upgradeCost) {
    return addLog(state, 'purchase', `${player.name} chưa đủ vốn để nâng cấp ${ownedAsset.name}.`, playerId);
  }

  const updatedPlayers = state.players.map((item) => {
    if (item.id !== playerId) return item;

    return {
      ...item,
      money: item.money - upgradeCost,
      influence: item.influence + 2,
      assets: item.assets.map((asset) => (asset.id === assetId ? { ...asset, level: asset.level + 1 } : asset)),
    };
  });

  return addLog({ ...state, players: updatedPlayers }, 'purchase', `${player.name} nâng cấp ${ownedAsset.name}.`, playerId);
}

export function payRent(state: GameState, payerId: string, ownerId: string, tileId: string): GameState {
  const payer = findPlayer(state, payerId);
  const owner = findPlayer(state, ownerId);
  const asset = owner?.assets.find((item) => item.tileId === tileId);
  if (!payer || !owner || !asset || payerId === ownerId) return state;

  const rent = calculateRent(asset, owner);
  const paid = Math.min(payer.money, rent);
  const dataRent = asset.era === 'data' ? Math.min(payer.data, Math.ceil(asset.level * 2)) : 0;
  const userRent = asset.era === 'data' ? Math.min(payer.users, asset.level) : 0;

  const updatedPlayers = state.players.map((item) => {
    if (item.id === payerId) {
      return {
        ...item,
        money: item.money - paid,
        data: item.data - dataRent,
        users: item.users - userRent,
        influence: Math.max(0, item.influence - 1),
      };
    }

    if (item.id === ownerId) {
      return {
        ...item,
        money: item.money + paid,
        data: item.data + dataRent,
        users: item.users + userRent,
        influence: item.influence + 1,
      };
    }

    return item;
  });

  return addLog({ ...state, players: updatedPlayers }, 'rent', `${payer.name} trả ${paid} rent cho ${owner.name} tại ${asset.name}.`, payerId);
}

export function applyEvent(state: GameState, eventId: string): GameState {
  const event = events.find((item) => item.id === eventId);
  if (!event || state.status !== 'playing') return state;

  const currentPlayer = getCurrentPlayer(state);
  const leadingPlayer = getLeadingPlayer(state.players);
  const lastPlacePlayer = getLastPlacePlayer(state.players);

  let updatedPlayers = state.players;
  let message = event.effect;

  switch (event.id) {
    case 'oil-price-shock':
      updatedPlayers = state.players.map((player) => ({
        ...player,
        money: player.money + player.assets.filter((asset) => asset.era === 'oil').length * 20,
      }));
      break;
    case 'antitrust-investigation':
      updatedPlayers = updatePlayer(state.players, leadingPlayer?.id, (player) => ({
        ...player,
        money: Math.max(0, player.money - 80),
        influence: Math.max(0, player.influence - 4),
        underInvestigation: true,
      }));
      message = `${leadingPlayer?.name ?? 'Người dẫn đầu'} bị phạt vì quyền lực thị trường quá lớn.`;
      break;
    case 'data-leak':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({
        ...player,
        data: Math.floor(player.data * 0.75),
        influence: Math.max(0, player.influence - 2),
      }));
      break;
    case 'network-effect':
      updatedPlayers = updatePlayer(state.players, getPlayerWithMostUsers(state.players)?.id, (player) => ({
        ...player,
        users: player.users + 15,
        data: player.data + 8,
      }));
      break;
    case 'open-data-regulation':
      updatedPlayers = state.players.map((player) => ({ ...player, data: player.data + 10 }));
      break;
    case 'ai-breakthrough':
      updatedPlayers = state.players.map((player) => ({
        ...player,
        data: player.data + player.assets.filter((asset) => asset.type === 'ai-lab').length * 20,
      }));
      break;
    case 'startup-innovation':
      updatedPlayers = updatePlayer(state.players, lastPlacePlayer?.id, (player) => ({
        ...player,
        money: player.money + 120,
        theoryPoints: player.theoryPoints + 5,
      }));
      break;
    case 'public-backlash':
      updatedPlayers = updatePlayer(state.players, leadingPlayer?.id, (player) => ({
        ...player,
        influence: Math.max(0, player.influence - 6),
      }));
      break;
    case 'infrastructure-expansion':
      updatedPlayers = state.players.map((player) => ({
        ...player,
        money: player.money + player.assets.filter((asset) => asset.type === 'logistics' || asset.type === 'cloud-infrastructure').length * 25,
      }));
      break;
    case 'privacy-movement':
      updatedPlayers = state.players.map((player) => ({
        ...player,
        data: Math.max(0, player.data - player.assets.filter((asset) => asset.era === 'data').length * 4),
      }));
      break;
    case 'merger-wave':
      updatedPlayers = state.players.map((player) => ({
        ...player,
        influence: player.influence + Math.floor(player.assets.length / 2),
      }));
      break;
    case 'labor-protest':
      updatedPlayers = state.players.map((player) => ({
        ...player,
        money: Math.max(0, player.money - 30),
      }));
      break;
  }

  return addLog({ ...state, players: updatedPlayers, activeEventId: null }, 'event', message, currentPlayer.id);
}

export function answerQuiz(state: GameState, playerId: string, quizId: string, answer: QuizQuestion['correctAnswer']): GameState {
  const player = findPlayer(state, playerId);
  const quiz = quizzes.find((item) => item.id === quizId);
  if (!player || !quiz) return state;

  const isCorrect = quiz.correctAnswer === answer;
  const updatedPlayers = updatePlayer(state.players, playerId, (item) => ({
    ...item,
    theoryPoints: item.theoryPoints + (isCorrect ? THEORY_REWARD : 0),
    influence: item.influence + (isCorrect ? 1 : 0),
  }));

  return addLog(
    { ...state, players: updatedPlayers, activeQuizId: null },
    'quiz',
    isCorrect ? `${player.name} trả lời đúng và nhận ${THEORY_REWARD} điểm lý luận.` : `${player.name} trả lời chưa đúng. ${quiz.explanation}`,
    playerId,
  );
}

export function endTurn(state: GameState): GameState {
  if (state.status !== 'playing') return state;

  const winner = checkWinner(state);
  if (winner) {
    return addLog({ ...state, winnerId: winner.id, status: 'finished' }, 'win', `${winner.name} thắng với quyền lực thị trường vượt trội.`, winner.id);
  }

  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  const nextRound = nextPlayerIndex === 0 ? state.round + 1 : state.round;
  const nextPlayer = state.players[nextPlayerIndex];

  return addLog({
    ...state,
    currentPlayerIndex: nextPlayerIndex,
    round: nextRound,
    diceValue: null,
    selectedTileId: null,
    activeEventId: null,
    activeQuizId: null,
  }, 'system', `Chuyển lượt sang ${nextPlayer?.name ?? 'người chơi tiếp theo'}.`, nextPlayer?.id);
}

export function checkWinner(state: GameState): Player | null {
  if (state.players.length === 0) return null;

  const marketPowers = state.players.map((player) => ({
    player,
    marketPower: calculateMarketPower(player, state.players),
  }));
  const totalMarketPower = marketPowers.reduce((sum, item) => sum + item.marketPower, 0);
  const monopolyWinner = marketPowers.find((item) => totalMarketPower > 0 && item.marketPower / totalMarketPower >= 0.6);
  if (monopolyWinner) return monopolyWinner.player;

  const leadingPlayer = getLeadingPlayer(state.players);
  if (leadingPlayer && leadingPlayer.theoryPoints >= 100) return leadingPlayer;

  if (state.round > state.maxRounds) return leadingPlayer;

  return null;
}

function applyOwnedAssetYield(state: GameState, player: Player, tile: Tile): GameState {
  if (!tile.asset) return state;

  const gain = getAssetResourceGain(tile.asset);
  const updatedPlayers = updatePlayer(state.players, player.id, (item) => ({
    ...item,
    money: item.money + gain.money,
    users: item.users + gain.users,
    data: item.data + gain.data,
    influence: item.influence + gain.influence,
  }));

  return addLog({ ...state, players: updatedPlayers }, 'system', `${player.name} khai thác ${tile.asset.name} và nhận lợi ích theo loại tài sản.`, player.id);
}

function applyRegulationTile(state: GameState, player: Player, tile: Tile): GameState {
  const hasCloud = player.assets.some((asset) => asset.type === 'cloud-infrastructure');
  const fee = Math.round((tile.fee ?? 30) * (hasCloud ? 0.8 : 1));

  const updatedPlayers = updatePlayer(state.players, player.id, (item) => ({
    ...item,
    money: Math.max(0, item.money - fee),
    influence: Math.max(0, item.influence - 2),
  }));

  return addLog({ ...state, players: updatedPlayers }, 'regulation', `${player.name} trả ${fee} chi phí quy định tại ${tile.name}.`, player.id);
}

function applyCrisisTile(state: GameState, player: Player, tile: Tile): GameState {
  const dataLoss = tile.id === 'trust-crisis' ? Math.ceil(player.data * 0.15) : 5;
  const operatingCost = player.assets.length * 10;

  const updatedPlayers = updatePlayer(state.players, player.id, (item) => ({
    ...item,
    money: Math.max(0, item.money - operatingCost),
    data: Math.max(0, item.data - dataLoss),
    influence: Math.max(0, item.influence - 2),
  }));

  return addLog({ ...state, players: updatedPlayers }, 'event', `${player.name} gặp ${tile.name}, mất chi phí vận hành và một phần dữ liệu/ảnh hưởng.`, player.id);
}

function applyAntitrustTile(state: GameState, player: Player, tile: Tile): GameState {
  const leadingPlayer = getLeadingPlayer(state.players);
  const targetId = leadingPlayer?.id ?? player.id;
  const fee = tile.fee ?? 50;

  const updatedPlayers = updatePlayer(state.players, targetId, (item) => ({
    ...item,
    money: Math.max(0, item.money - fee),
    influence: Math.max(0, item.influence - 3),
    underInvestigation: true,
  }));
  const target = findPlayer({ ...state, players: updatedPlayers }, targetId);

  return addLog({ ...state, players: updatedPlayers }, 'regulation', `${target?.name ?? player.name} bị điều tra chống độc quyền và trả ${fee}.`, targetId);
}

function calculateRent(asset: Asset, owner: Player): number {
  const levelMultiplier = 1 + (asset.level - 1) * 0.5;
  const aiBonus = owner.assets.some((item) => item.type === 'ai-lab') && asset.era === 'data' && asset.type !== 'ai-lab' ? 1.2 : 1;
  return Math.round(asset.baseRent * levelMultiplier * aiBonus);
}

function getAssetResourceGain(asset: Asset) {
  if (asset.era === 'oil') {
    return { money: Math.round(asset.baseRent * 0.5), users: 0, data: 0, influence: 1 };
  }

  if (asset.type === 'ai-lab') {
    return { money: 0, users: 2, data: 10, influence: 2 };
  }

  return { money: 0, users: 5, data: 6, influence: 1 };
}

function pickEvent(state: GameState, tileIndex: number): EventCard {
  return events[(state.round + state.currentPlayerIndex + tileIndex) % events.length];
}

function getCurrentPlayer(state: GameState): Player {
  return state.players[state.currentPlayerIndex] ?? state.players[0];
}

function findPlayer(state: GameState, playerId: string): Player | undefined {
  return state.players.find((player) => player.id === playerId);
}

function findAssetOwner(state: GameState, tileId: string): Player | undefined {
  return state.players.find((player) => player.assets.some((asset) => asset.tileId === tileId));
}

function updatePlayer(players: Player[], playerId: string | undefined, update: (player: Player) => Player): Player[] {
  if (!playerId) return players;
  return players.map((player) => (player.id === playerId ? update(player) : player));
}

function getPlayerWithMostUsers(players: Player[]): Player | null {
  return [...players].sort((left, right) => right.users - left.users)[0] ?? null;
}

function cloneAsset(asset: Asset): Asset {
  return { ...asset };
}

function addLog(state: GameState, type: GameLogEntry['type'], message: string, playerId?: string): GameState {
  const logEntry: GameLogEntry = {
    id: `log-${state.round}-${state.log.length + 1}`,
    round: state.round,
    playerId,
    message,
    type,
    createdAt: `round-${state.round}-entry-${state.log.length + 1}`,
  };

  return {
    ...state,
    log: [...state.log, logEntry],
  };
}
