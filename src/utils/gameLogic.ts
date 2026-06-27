import { events } from '../data/events';
import { quizzes } from '../data/quizzes';
import { tiles } from '../data/tiles';
import type { Asset, EventDeckType, GameLogEntry, GameState, Player, QuizQuestion, Tile } from '../types/game';
import { calculateMarketPower, calculateTotalScore, getLastPlacePlayer, getLeadingPlayer } from './scoring';

const START_BONUS = 100;
const INITIAL_MONEY = 500;
const INITIAL_INFLUENCE = 0;
const INITIAL_USERS = 0;
const INITIAL_DATA = 0;
const THEORY_REWARD = 10;
const MONOPOLY_WIN_MIN_ROUND = 5;
const MONOPOLY_WIN_MIN_ASSETS = 4;

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
    heldEventCards: [],
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
      rollsThisTurn: 0,
      extraRollsAvailable: 0,
      selectedTileId: null,
      activeEventId: null,
      activeEventDeck: null,
      activeQuizId: null,
      eventDecks: createEventDecks(),
      winnerId: null,
      status: 'playing',
      log: [],
    },
    'system',
    'Game bắt đầu. Mỗi người chơi có vốn ban đầu, nhưng ảnh hưởng, người dùng, dữ liệu và tài sản đều bắt đầu từ 0.',
  );
}

export function rollDice(seed?: number): number {
  if (seed !== undefined) {
    return (Math.abs(seed) % 11) + 2;
  }

  return Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
}

export function movePlayer(state: GameState, diceValue: number, playerId = getCurrentPlayer(state).id): GameState {
  const player = findPlayer(state, playerId);
  if (!player || state.status !== 'playing') return state;

  const boardSize = state.tiles.length;
  const nextPosition = (player.position + diceValue) % boardSize;
  const passedStart = player.position + diceValue >= boardSize;
  const movementGain = getMovementGain(player, diceValue);

  const updatedPlayers = state.players.map((item) => {
    if (item.id !== playerId) return item;

    return {
      ...item,
      position: nextPosition,
      money: item.money + (passedStart ? START_BONUS : 0) + movementGain.money,
      users: item.users + movementGain.users,
      data: item.data + movementGain.data,
      influence: item.influence + movementGain.influence,
      assets: passedStart ? item.assets.map((asset) => ({ ...asset, lapsHeld: asset.lapsHeld + 1 })) : item.assets,
    };
  });

  const movedState = {
    ...state,
    players: updatedPlayers,
    diceValue,
    rollsThisTurn: state.rollsThisTurn + 1,
    selectedTileId: state.tiles[nextPosition]?.id ?? null,
  };

  const startMessage = passedStart ? ` và nhận ${START_BONUS} vốn khi đi qua Khởi nghiệp` : '';
  const movementMessage = movementGain.message ? ` ${movementGain.message}` : '';
  return addLog(movedState, 'movement', `${player.name} tung ${diceValue}, di chuyển đến ô ${nextPosition + 1}${startMessage}.${movementMessage}`, playerId);
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
    return drawEventCard(state, tile.eventDeck ?? 'chance', player);
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
      assets: [...item.assets, { ...cloneAsset(tileAsset), lapsHeld: 0 }],
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
  if (ownedAsset.lapsHeld < 1) {
    return addLog(state, 'purchase', `${player.name} cần đi đủ 1 vòng sau khi mua ${ownedAsset.name} mới được nâng cấp.`, playerId);
  }

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

  return addLog({ ...state, players: updatedPlayers }, 'rent', `${payer.name} trả ${paid} tiền thuê cho ${owner.name} tại ${asset.name}.`, payerId);
}

export function applyEvent(state: GameState, eventId: string): GameState {
  const event = events.find((item) => item.id === eventId);
  if (!event || state.status !== 'playing') return state;

  const currentPlayer = getCurrentPlayer(state);
  const leadingPlayer = getLeadingPlayer(state.players);
  const lastPlacePlayer = getLastPlacePlayer(state.players);
  const mostDataPlayer = getPlayerWithMostData(state.players);

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
    case 'fortune-lottery-win':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({ ...player, money: player.money + 120 }));
      break;
    case 'fortune-stock-profit':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({
        ...player,
        money: player.money + 90,
        influence: player.influence + 2,
      }));
      break;
    case 'fortune-stock-loss':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({ ...player, money: Math.max(0, player.money - 80) }));
      break;
    case 'fortune-cable-shark':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => {
        const ownsDataAsset = player.assets.some((asset) => asset.era === 'data');
        return {
          ...player,
          money: Math.max(0, player.money - (ownsDataAsset ? 60 : 20)),
          data: Math.max(0, player.data - (ownsDataAsset ? 10 : 0)),
        };
      });
      break;
    case 'fortune-flood':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({
        ...player,
        money: Math.max(0, player.money - player.assets.filter((asset) => asset.era === 'oil' || asset.type === 'logistics').length * 25),
      }));
      break;
    case 'fortune-tax-refund':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({
        ...player,
        money: player.money + 70,
        data: player.data + (player.assets.some((asset) => asset.type === 'ai-lab') ? 8 : 0),
      }));
      break;
    case 'fortune-public-backlash':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({
        ...player,
        influence: Math.max(0, player.influence - 4),
        users: Math.max(0, player.users - 8),
      }));
      break;
    case 'fortune-get-out-free':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({
        ...player,
        heldEventCards: player.heldEventCards.includes(event.id) ? player.heldEventCards : [...player.heldEventCards, event.id],
      }));
      break;
    case 'fortune-data-grant':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({ ...player, data: player.data + 18 }));
      break;
    case 'fortune-oil-maintenance':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({
        ...player,
        money: Math.max(0, player.money - player.assets.filter((asset) => asset.era === 'oil').length * 15),
      }));
      break;
    case 'fortune-viral-campaign':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({
        ...player,
        users: player.users + 20,
        data: player.data + 8,
      }));
      break;
    case 'fortune-influencer-review':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => {
        const ownsDataAsset = player.assets.some((asset) => asset.era === 'data');
        return {
          ...player,
          users: player.users + 12,
          data: player.data + (ownsDataAsset ? 5 : 0),
        };
      });
      break;
    case 'fortune-server-credit':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => {
        const ownsCloud = player.assets.some((asset) => asset.type === 'cloud-infrastructure');
        return {
          ...player,
          money: player.money + (ownsCloud ? 0 : 45),
          data: player.data + (ownsCloud ? 14 : 0),
        };
      });
      break;
    case 'fortune-operating-cost':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({ ...player, money: Math.max(0, player.money - 40) }));
      break;
    case 'chance-extra-turn':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({ ...player, influence: player.influence + 5 }));
      break;
    case 'chance-move-startup':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({
        ...player,
        position: 0,
        money: player.money + START_BONUS,
      }));
      break;
    case 'chance-antitrust-fine':
      updatedPlayers = updatePlayer(state.players, leadingPlayer?.id, (player) => ({
        ...player,
        money: Math.max(0, player.money - 100),
        influence: Math.max(0, player.influence - 5),
        underInvestigation: true,
      }));
      break;
    case 'chance-oil-price-shock':
      updatedPlayers = state.players.map((player) => ({
        ...player,
        money: player.money + player.assets.filter((asset) => asset.era === 'oil').length * 25,
      }));
      break;
    case 'chance-data-leak':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => ({
        ...player,
        data: Math.floor(player.data * 0.75),
        influence: Math.max(0, player.influence - 3),
      }));
      break;
    case 'chance-network-effect':
      updatedPlayers = updatePlayer(state.players, getPlayerWithMostUsers(state.players)?.id, (player) => ({
        ...player,
        users: player.users + 18,
        data: player.data + 8,
      }));
      break;
    case 'chance-user-data-flywheel':
      updatedPlayers = updatePlayer(state.players, getPlayerWithMostUsers(state.players)?.id, (player) => {
        const userGain = Math.max(4, Math.ceil(player.users * 0.2));
        return {
          ...player,
          users: player.users + userGain,
          data: player.data + Math.ceil(userGain * 0.75),
        };
      });
      break;
    case 'chance-platform-boycott':
      updatedPlayers = updatePlayer(state.players, mostDataPlayer?.id, (player) => ({
        ...player,
        users: Math.max(0, player.users - Math.ceil(player.users * 0.2)),
        influence: Math.max(0, player.influence - 5),
      }));
      break;
    case 'chance-open-data':
      updatedPlayers = state.players.map((player) => ({ ...player, data: player.data + 12 }));
      break;
    case 'chance-ai-breakthrough':
      updatedPlayers = state.players.map((player) => ({
        ...player,
        data: player.data + player.assets.filter((asset) => asset.type === 'ai-lab').length * 25,
      }));
      break;
    case 'chance-startup-innovation':
      updatedPlayers = updatePlayer(state.players, lastPlacePlayer?.id, (player) => ({
        ...player,
        money: player.money + 120,
        theoryPoints: player.theoryPoints + 5,
      }));
      break;
    case 'chance-regulatory-sandbox':
      updatedPlayers = updatePlayer(state.players, lastPlacePlayer?.id, (player) => ({
        ...player,
        users: player.users + 10,
        data: player.data + 8,
        theoryPoints: player.theoryPoints + 5,
      }));
      break;
    case 'chance-supplier-lock-in':
      updatedPlayers = state.players.map((player) => {
        if (player.id === leadingPlayer?.id) {
          return { ...player, influence: player.influence + 4 };
        }

        return { ...player, money: Math.max(0, player.money - 20) };
      });
      break;
    case 'chance-merger-wave':
      updatedPlayers = state.players.map((player) => ({
        ...player,
        influence: player.influence + Math.floor(player.assets.length / 2),
      }));
      break;
    case 'chance-labor-protest':
      updatedPlayers = state.players.map((player) => ({ ...player, money: Math.max(0, player.money - 30) }));
      break;
    case 'chance-cloud-outage':
      updatedPlayers = updatePlayer(state.players, currentPlayer.id, (player) => {
        const ownsCloud = player.assets.some((asset) => asset.type === 'cloud-infrastructure');
        return {
          ...player,
          money: Math.max(0, player.money - (ownsCloud ? 50 : 0)),
          data: Math.max(0, player.data - (ownsCloud ? 0 : 5)),
        };
      });
      break;
    case 'chance-privacy-movement':
      updatedPlayers = state.players.map((player) => ({
        ...player,
        data: Math.max(0, player.data - player.assets.filter((asset) => asset.era === 'data').length * 4),
      }));
      break;
  }

  return addLog({ ...state, players: updatedPlayers, activeEventId: null, activeEventDeck: null }, 'event', message, currentPlayer.id);
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
  const currentPlayer = getCurrentPlayer(state);

  if (state.rollsThisTurn <= 0) {
    return addLog(state, 'system', `${currentPlayer.name} cần tung xúc xắc ít nhất 1 lần trước khi kết thúc lượt.`, currentPlayer.id);
  }

  const feedbackState = applyUserDataFeedback(state, currentPlayer.id);
  const winner = checkWinner(feedbackState);
  if (winner) {
    return addLog({ ...feedbackState, winnerId: winner.id, status: 'finished' }, 'win', `${winner.name} thắng với quyền lực thị trường vượt trội.`, winner.id);
  }

  const nextPlayerIndex = (feedbackState.currentPlayerIndex + 1) % feedbackState.players.length;
  const nextRound = nextPlayerIndex === 0 ? feedbackState.round + 1 : feedbackState.round;
  const nextPlayer = feedbackState.players[nextPlayerIndex];

  return addLog({
    ...feedbackState,
    currentPlayerIndex: nextPlayerIndex,
    round: nextRound,
    diceValue: null,
    rollsThisTurn: 0,
    extraRollsAvailable: 0,
    selectedTileId: null,
    activeEventId: null,
    activeEventDeck: null,
    activeQuizId: null,
  }, 'system', `Chuyển lượt sang ${nextPlayer?.name ?? 'người chơi tiếp theo'}.`, nextPlayer?.id);
}

export function applyDicePairRule(state: GameState, diceFaces: [number, number], playerId = getCurrentPlayer(state).id): GameState {
  const player = findPlayer(state, playerId);
  if (!player) return state;

  const isExtraRollPair = (diceFaces[0] === 1 && diceFaces[1] === 1) || (diceFaces[0] === 6 && diceFaces[1] === 6);
  if (!isExtraRollPair) {
    return { ...state, extraRollsAvailable: 0 };
  }

  return addLog(
    {
      ...state,
      diceValue: null,
      extraRollsAvailable: 1,
    },
    'movement',
    `${player.name} tung cặp ${diceFaces[0]}:${diceFaces[1]} nên được tung thêm 1 lần.`,
    playerId,
  );
}

export function checkWinner(state: GameState): Player | null {
  if (state.players.length === 0) return null;

  const marketPowers = state.players.map((player) => ({
    player,
    marketPower: calculateMarketPower(player, state.players),
  }));
  const totalMarketPower = marketPowers.reduce((sum, item) => sum + item.marketPower, 0);
  const monopolyWinner = marketPowers.find(
    (item) =>
      state.round >= MONOPOLY_WIN_MIN_ROUND &&
      item.player.assets.length >= MONOPOLY_WIN_MIN_ASSETS &&
      totalMarketPower > 0 &&
      item.marketPower / totalMarketPower >= 0.6,
  );
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

function applyUserDataFeedback(state: GameState, playerId: string): GameState {
  const player = findPlayer(state, playerId);
  if (!player || player.users <= 0) return state;

  const ownsDataAsset = player.assets.some((asset) => asset.era === 'data');
  if (!ownsDataAsset) return state;

  const hasAiLab = player.assets.some((asset) => asset.type === 'ai-lab');
  const dataGain = Math.min(18, Math.floor(player.users / 10) + (hasAiLab ? Math.floor(player.users / 25) : 0));
  if (dataGain <= 0) return state;

  const updatedState = {
    ...state,
    players: updatePlayer(state.players, playerId, (item) => ({
      ...item,
      data: item.data + dataGain,
    })),
  };

  return addLog(
    updatedState,
    'system',
    `${player.name} có ${player.users} người dùng nên tạo thêm ${dataGain} dữ liệu hành vi trước khi kết thúc lượt.`,
    playerId,
  );
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

function getMovementGain(player: Player, diceValue: number) {
  const hasDataAsset = player.assets.some((asset) => asset.era === 'data');
  const hasInfrastructureAsset = player.assets.some((asset) => asset.era === 'oil' || asset.type === 'logistics' || asset.type === 'cloud-infrastructure');

  if (diceValue >= 10) {
    return {
      money: 0,
      users: hasDataAsset ? 3 : 0,
      data: hasDataAsset ? 2 : 0,
      influence: hasInfrastructureAsset ? 1 : 0,
      message: hasDataAsset || hasInfrastructureAsset ? 'Di chuyển xa tạo độ phủ thị trường: nền tảng có thêm users/data, hạ tầng có thêm ảnh hưởng.' : '',
    };
  }

  if (diceValue <= 3 && player.assets.length > 0) {
    return {
      money: -10,
      users: 0,
      data: 0,
      influence: 0,
      message: 'Di chuyển chậm làm phát sinh $10 chi phí vận hành tài sản.',
    };
  }

  return { money: 0, users: 0, data: 0, influence: 0, message: '' };
}

function createEventDecks(): Record<EventDeckType, string[]> {
  return {
    fortune: shuffleDeck(events.filter((event) => event.deck === 'fortune').map((event) => event.id)),
    chance: shuffleDeck(events.filter((event) => event.deck === 'chance').map((event) => event.id)),
  };
}

function shuffleDeck(cardIds: string[]): string[] {
  const shuffled = [...cardIds];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function drawEventCard(state: GameState, deckType: EventDeckType, player: Player): GameState {
  const rebuiltDeck = events.filter((event) => event.deck === deckType).map((event) => event.id);
  const currentDeck = state.eventDecks?.[deckType]?.length ? state.eventDecks[deckType] : shuffleDeck(rebuiltDeck);
  const [drawnCardId, ...remainingDeck] = currentDeck;
  const event = events.find((item) => item.id === drawnCardId) ?? events.find((item) => item.deck === deckType);

  if (!event) return state;

  // Normal cards go to the bottom of the deck. Held cards stay out until a later gameplay rule uses them.
  const nextDeck = event.keepWhenDrawn ? remainingDeck : [...remainingDeck, event.id];
  const deckLabel = deckType === 'fortune' ? 'Khí vận' : 'Cơ hội';

  return addLog(
    {
      ...state,
      activeEventId: event.id,
      activeEventDeck: deckType,
      eventDecks: {
        ...(state.eventDecks ?? createEventDecks()),
        [deckType]: nextDeck,
      },
    },
    'event',
    `${player.name} rút thẻ ${deckLabel}: ${event.title}.`,
    player.id,
  );
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

function getPlayerWithMostData(players: Player[]): Player | null {
  return [...players].sort((left, right) => right.data - left.data)[0] ?? null;
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
    players: sanitizePlayers(state.players),
    log: [...state.log, logEntry],
  };
}

export function sanitizeGameState(state: GameState): GameState {
  return {
    ...state,
    players: sanitizePlayers(state.players),
  };
}

function sanitizePlayers(players: Player[]): Player[] {
  return players.map((player) => ({
    ...player,
    money: Math.max(0, Math.round(player.money)),
    influence: Math.max(0, Math.round(player.influence)),
    users: Math.max(0, Math.round(player.users)),
    data: Math.max(0, Math.round(player.data)),
    theoryPoints: Math.max(0, Math.round(player.theoryPoints)),
  }));
}
