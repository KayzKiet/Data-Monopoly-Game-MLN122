import type { Asset, Player } from '../types/game';

const normalize = (value: number, max: number) => {
  if (max <= 0) return 0;
  return value / max;
};

export function calculateAssetValue(asset: Asset): number {
  const upgradeValue = asset.upgradeCost * (asset.level - 1);
  const aiBonus = asset.type === 'ai-lab' ? 1.2 : 1;
  return Math.round((asset.purchasePrice + upgradeValue) * aiBonus);
}

export function calculateTotalScore(player: Player): number {
  const assetValue = player.assets.reduce((sum, asset) => sum + calculateAssetValue(asset), 0);
  return Math.round(player.money + assetValue + player.users * 2 + player.data * 2 + player.influence * 5 + player.theoryPoints * 8);
}

export function calculateMarketPower(player: Player, allPlayers: Player[]): number {
  const assetValue = calculatePlayerAssetValue(player);
  const maxMoney = Math.max(...allPlayers.map((item) => item.money), 0);
  const maxAssets = Math.max(...allPlayers.map(calculatePlayerAssetValue), 0);
  const maxUsers = Math.max(...allPlayers.map((item) => item.users), 0);
  const maxData = Math.max(...allPlayers.map((item) => item.data), 0);
  const maxTheory = Math.max(...allPlayers.map((item) => item.theoryPoints), 0);

  const score =
    normalize(player.money, maxMoney) * 0.2 +
    normalize(assetValue, maxAssets) * 0.3 +
    normalize(player.users, maxUsers) * 0.2 +
    normalize(player.data, maxData) * 0.2 +
    normalize(player.theoryPoints, maxTheory) * 0.1;

  return Math.round(score * 100);
}

export function getLeadingPlayer(players: Player[]): Player | null {
  return getRankedPlayers(players)[0] ?? null;
}

export function getLastPlacePlayer(players: Player[]): Player | null {
  const rankedPlayers = getRankedPlayers(players);
  return rankedPlayers[rankedPlayers.length - 1] ?? null;
}

function calculatePlayerAssetValue(player: Player): number {
  const hasAiLab = player.assets.some((asset) => asset.type === 'ai-lab');

  return player.assets.reduce((sum, asset) => {
    const dataAssetBonus = hasAiLab && asset.era === 'data' && asset.type !== 'ai-lab' ? 1.15 : 1;
    return sum + Math.round(calculateAssetValue(asset) * dataAssetBonus);
  }, 0);
}

function getRankedPlayers(players: Player[]): Player[] {
  return [...players].sort((left, right) => calculateTotalScore(right) - calculateTotalScore(left));
}
