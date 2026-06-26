import type { Asset, GameState, Player, Tile } from '../types/game';
import { calculateMarketPower } from '../utils/scoring';
import { PlayerAvatar } from './PlayerAvatar';

interface ActionPanelProps {
  currentPlayer: Player;
  gameState: GameState;
  isBusy: boolean;
  onApplyEvent: () => void;
  onBuyAsset: (tileId: string) => void;
  onEndTurn: () => void;
  onUpgradeAsset: (assetId: string) => void;
}

export function ActionPanel({
  currentPlayer,
  gameState,
  isBusy,
  onApplyEvent,
  onBuyAsset,
  onEndTurn,
  onUpgradeAsset,
}: ActionPanelProps) {
  const currentTile = gameState.tiles[currentPlayer.position];
  const owner = currentTile?.asset ? findAssetOwner(gameState, currentTile.asset.tileId) : null;
  const currentOwnedAsset = currentTile?.asset && owner ? owner.assets.find((asset) => asset.tileId === currentTile.asset?.tileId) ?? null : null;
  const canBuy = Boolean(currentTile?.asset && !owner && currentPlayer.money >= currentTile.asset.purchasePrice);
  const rentPreview = currentOwnedAsset && owner && owner.id !== currentPlayer.id ? getRentBreakdown(currentOwnedAsset, owner) : null;
  const ownedAssetOnCurrentTile = owner?.id === currentPlayer.id ? currentOwnedAsset : null;
  const canEndTurn = gameState.rollsThisTurn > 0 && !gameState.activeEventId && !gameState.activeQuizId;
  const buyLabel = getBuyLabel(currentTile, owner, currentPlayer.money);

  return (
    <section className="rounded-lg border border-red-200/15 bg-oil/70 p-4 shadow-gold backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Hành động</h2>
          <p className="muted-text mt-1">{currentTile ? describeTile(currentTile) : 'Chưa có ô hiện tại.'}</p>
        </div>
        <span className="rounded-md bg-cyan/10 px-2 py-1 text-xs font-black text-cyan">Lượt</span>
      </div>

      {gameState.extraRollsAvailable > 0 && (
        <div className="mt-3 rounded-md border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm font-semibold text-cyan">
          Bạn vừa tung cặp 1:1 hoặc 6:6, được tung thêm 1 lần.
        </div>
      )}

      {currentTile && !currentTile.asset && <TileImpactPreview tile={currentTile} currentPlayer={currentPlayer} gameState={gameState} />}

      {currentTile?.asset && (
        <div className="mt-4 rounded-lg border border-white/10 bg-oil/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold text-white">{currentTile.asset.name}</p>
            <p className="shrink-0 text-sm font-black text-gold">${currentTile.asset.purchasePrice}</p>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-400">{currentTile.asset.theoryConnection}</p>

          {!owner && <AssetEconomyPreview asset={currentTile.asset} canBuy={canBuy} money={currentPlayer.money} />}

          {owner && (
            <>
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-cyan">
                <PlayerAvatar alt={owner.name} className="h-5 w-5 rounded" imagePath={owner.avatar} label={owner.name} />
                <span>Chủ sở hữu: {owner.name}</span>
              </div>
              {currentOwnedAsset && (
                <div className="mt-3 rounded-md border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-slate-300">
                  <p className="font-black text-white">Cấp {currentOwnedAsset.level}/{currentOwnedAsset.maxLevel}</p>
                  <p>Người khác vào ô này trả: {formatRentLoss(getRentBreakdown(currentOwnedAsset, owner))}.</p>
                  {owner.id === currentPlayer.id && currentOwnedAsset.level < currentOwnedAsset.maxLevel && (
                    <p className="mt-1 text-gold">Nâng cấp tiếp: {getUpgradeBenefitText(currentOwnedAsset, owner)}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {rentPreview !== null && (
        <div className="mt-3 rounded-md border border-rose-300/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          Đã xử lý khi dừng ở ô này: bạn mất {formatRentLoss(rentPreview)} cho {owner?.name}.
        </div>
      )}

      {gameState.activeEventId && (
        <button className="secondary-button mt-4 w-full" disabled={isBusy} onClick={onApplyEvent} type="button">
          Áp dụng sự kiện
        </button>
      )}

      <div className="mt-4 grid gap-2">
        <button
          className="primary-button disabled:cursor-not-allowed disabled:opacity-45"
          disabled={isBusy || !currentTile?.asset || !canBuy}
          onClick={() => currentTile?.asset && onBuyAsset(currentTile.id)}
          type="button"
        >
          {buyLabel}
        </button>

        {ownedAssetOnCurrentTile && ownedAssetOnCurrentTile.level < ownedAssetOnCurrentTile.maxLevel && (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <label className="text-sm font-bold text-slate-200" htmlFor="asset-upgrade">
            Nâng cấp ô đang đứng
          </label>
          <div className="mt-2 grid gap-2">
            {ownedAssetOnCurrentTile.lapsHeld >= 1 ? (
              <button
                className="rounded-md border border-white/10 bg-oil/70 px-3 py-2 text-left text-sm font-semibold text-slate-200 transition hover:border-gold hover:text-gold"
                disabled={isBusy || currentPlayer.money < getUpgradeCost(ownedAssetOnCurrentTile, currentPlayer)}
                onClick={() => onUpgradeAsset(ownedAssetOnCurrentTile.id)}
                type="button"
              >
                <span className="block text-white">
                  {ownedAssetOnCurrentTile.name} L{ownedAssetOnCurrentTile.level} {'->'} L{ownedAssetOnCurrentTile.level + 1} · $
                  {getUpgradeCost(ownedAssetOnCurrentTile, currentPlayer)}
                </span>
                <span className="mt-1 block text-xs font-medium text-slate-400">{getUpgradeBenefitText(ownedAssetOnCurrentTile, currentPlayer)}</span>
                {currentPlayer.money < getUpgradeCost(ownedAssetOnCurrentTile, currentPlayer) && (
                  <span className="mt-1 block text-xs font-bold text-rose-200">Chưa đủ vốn để nâng cấp.</span>
                )}
              </button>
            ) : (
              <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-400">
                <p className="font-semibold text-slate-300">{ownedAssetOnCurrentTile.name} L{ownedAssetOnCurrentTile.level}</p>
                <p className="mt-1 text-xs">Cần đi đủ 1 vòng sau khi mua mới được nâng cấp.</p>
              </div>
            )}
          </div>
        </div>
        )}

        <button className="secondary-button" disabled={isBusy || !canEndTurn} onClick={onEndTurn} type="button">
          {gameState.rollsThisTurn <= 0 ? 'Tung xúc xắc trước' : gameState.activeEventId || gameState.activeQuizId ? 'Xử lý ô hiện tại trước' : 'Kết thúc lượt'}
        </button>
      </div>
    </section>
  );
}

function AssetEconomyPreview({ asset, canBuy, money }: { asset: Asset; canBuy: boolean; money: number }) {
  const gain = getAssetResourceGain(asset);
  const missingMoney = Math.max(0, asset.purchasePrice - money);

  return (
    <div className="mt-3 grid gap-2 text-xs leading-5 text-slate-300">
      <div className="rounded-md border border-cyan/20 bg-cyan/10 p-2">
        <p className="font-black text-cyan">Khi mua</p>
        <p>Trả ${asset.purchasePrice}; nhận ngay {formatGain(gain)}.</p>
        <p>Sau khi mua phải đi đủ 1 vòng mới được nâng cấp.</p>
      </div>
      <div className="rounded-md border border-gold/20 bg-gold/10 p-2">
        <p className="font-black text-gold">Người khác vào ô này</p>
        <p>Trả tối thiểu ${asset.baseRent}{asset.era === 'data' ? ', mất thêm dữ liệu/người dùng theo cấp.' : '.'}</p>
      </div>
      {!canBuy && missingMoney > 0 && <p className="font-semibold text-rose-200">Bạn còn thiếu ${missingMoney} để mua.</p>}
    </div>
  );
}

function TileImpactPreview({ tile, currentPlayer, gameState }: { tile: Tile; currentPlayer: Player; gameState: GameState }) {
  const leadingPlayer = [...gameState.players].sort((left, right) => calculateMarketPower(right, gameState.players) - calculateMarketPower(left, gameState.players))[0];
  const regulationFee = tile.fee ?? 30;
  const hasCloud = currentPlayer.assets.some((asset) => asset.type === 'cloud-infrastructure');
  const effectiveFee = Math.round(regulationFee * (hasCloud ? 0.8 : 1));
  const crisisImpact = getCrisisImpact(tile, currentPlayer);

  if (tile.type === 'tax-regulation') {
    return (
      <div className="mt-4 rounded-lg border border-gold/20 bg-gold/10 p-3 text-sm leading-6 text-slate-200">
        <p className="font-black text-gold">Tác động của ô Thuế / Quy định</p>
        <p>Bạn trả ${effectiveFee} và mất 2 điểm ảnh hưởng. Nếu sở hữu hạ tầng đám mây, phí được giảm 20%.</p>
      </div>
    );
  }

  if (tile.type === 'antitrust-investigation') {
    return (
      <div className="mt-4 rounded-lg border border-rose-300/20 bg-rose-500/10 p-3 text-sm leading-6 text-rose-100">
        <p className="font-black text-rose-100">Tác động của ô Điều trần</p>
        <p>Người đang dẫn đầu quyền lực thị trường bị điều tra, trả ${tile.fee ?? 50}, mất 3 điểm ảnh hưởng và bị đánh dấu đang bị điều tra.</p>
        {leadingPlayer && (
          <p className="mt-1 text-xs text-rose-200/80">
            Mục tiêu dự kiến: {leadingPlayer.name} ({calculateMarketPower(leadingPlayer, gameState.players)} quyền lực thị trường).
          </p>
        )}
      </div>
    );
  }

  if (tile.type === 'crisis') {
    return (
      <div className="mt-4 rounded-lg border border-rose-300/20 bg-rose-500/10 p-3 text-sm leading-6 text-rose-100">
        <p className="font-black text-rose-100">Tác động của ô Khủng hoảng</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Mất ${crisisImpact.operatingCost} chi phí vận hành (${crisisImpact.assetCount} tài sản x $10).</li>
          <li>Mất {crisisImpact.dataLossLabel} dữ liệu.</li>
          <li>Mất 2 điểm ảnh hưởng.</li>
        </ul>
      </div>
    );
  }

  if (tile.type === 'start') {
    return (
      <div className="mt-4 rounded-lg border border-cyan/20 bg-cyan/10 p-3 text-sm leading-6 text-slate-200">
        <p className="font-black text-cyan">Khởi nghiệp</p>
        <p>Khi đi qua ô này, bạn nhận $100 và các tài sản đã mua được tính thêm 1 vòng sở hữu để mở nâng cấp.</p>
      </div>
    );
  }

  if (tile.type === 'event') {
    return (
      <div className="mt-4 rounded-lg border border-cyan/20 bg-cyan/10 p-3 text-sm leading-6 text-slate-200">
        <p className="font-black text-cyan">Ô sự kiện</p>
        <p>Rút thẻ {tile.eventDeck === 'fortune' ? 'Khí vận' : 'Cơ hội'} và xử lý hiệu ứng trước khi kết thúc lượt.</p>
      </div>
    );
  }

  if (tile.type === 'theory-quiz') {
    return (
      <div className="mt-4 rounded-lg border border-cyan/20 bg-cyan/10 p-3 text-sm leading-6 text-slate-200">
        <p className="font-black text-cyan">Quiz MLN122</p>
        <p>Trả lời đúng để nhận điểm lý luận và tăng điểm ảnh hưởng.</p>
      </div>
    );
  }

  return null;
}

function getBuyLabel(tile: Tile | undefined, owner: Player | null, money: number): string {
  if (!tile?.asset) return 'Không có tài sản để mua';
  if (owner) return 'Tài sản đã có chủ';
  if (money < tile.asset.purchasePrice) return 'Chưa đủ vốn để mua';
  return 'Mua tài sản';
}

function findAssetOwner(gameState: GameState, tileId: string): Player | null {
  return gameState.players.find((player) => player.assets.some((asset) => asset.tileId === tileId)) ?? null;
}

function describeTile(tile: Tile): string {
  if (tile.asset) return `Bạn đang ở ${tile.name}, một tài sản ${tile.era === 'oil' ? 'dầu mỏ' : 'dữ liệu'}.`;
  if (tile.type === 'event') return 'Ô sự kiện: rút thẻ và xử lý hiệu ứng.';
  if (tile.type === 'theory-quiz') return 'Quiz MLN122: trả lời câu hỏi để nhận điểm.';
  if (tile.type === 'tax-regulation') return 'Ô Thuế / Quy định: trả phí và giảm ảnh hưởng.';
  if (tile.type === 'crisis') return 'Ô Khủng hoảng: mất chi phí vận hành, dữ liệu và ảnh hưởng.';
  if (tile.type === 'antitrust-investigation') return 'Ô Điều trần: người dẫn đầu bị phạt để giảm độc quyền.';
  return tile.description;
}

function getCrisisImpact(tile: Tile, player: Player) {
  const assetCount = player.assets.length;
  const operatingCost = assetCount * 10;
  const dataLoss = tile.id === 'trust-crisis' ? Math.ceil(player.data * 0.15) : 5;
  const dataLossLabel = tile.id === 'trust-crisis' ? `${dataLoss} (15% dữ liệu hiện có, làm tròn lên)` : `${dataLoss}`;

  return { assetCount, dataLossLabel, operatingCost };
}

function getRentBreakdown(asset: Asset, owner: Player) {
  const levelMultiplier = 1 + (asset.level - 1) * 0.5;
  const aiBonus = owner.assets.some((item) => item.type === 'ai-lab') && asset.era === 'data' && asset.type !== 'ai-lab' ? 1.2 : 1;

  return {
    money: Math.round(asset.baseRent * levelMultiplier * aiBonus),
    data: asset.era === 'data' ? Math.ceil(asset.level * 2) : 0,
    users: asset.era === 'data' ? asset.level : 0,
    influence: 1,
  };
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

function getUpgradeBenefitText(asset: Asset, owner: Player): string {
  const nextAsset = { ...asset, level: asset.level + 1 };
  const currentRent = getRentBreakdown(asset, owner);
  const nextRent = getRentBreakdown(nextAsset, owner);

  return `Tiền thuê tăng $${currentRent.money} -> $${nextRent.money}${
    asset.era === 'data' ? `; thu thêm ${nextRent.data} dữ liệu và ${nextRent.users} người dùng từ người ghé ô.` : ''
  }`;
}

function getUpgradeCost(asset: Asset, owner: Player): number {
  const cloudDiscount = owner.assets.some((item) => item.type === 'cloud-infrastructure') ? 0.85 : 1;
  return Math.round(asset.upgradeCost * cloudDiscount);
}

function formatGain(gain: ReturnType<typeof getAssetResourceGain>): string {
  return [
    gain.money ? `$${gain.money}` : null,
    gain.users ? `${gain.users} người dùng` : null,
    gain.data ? `${gain.data} dữ liệu` : null,
    gain.influence ? `${gain.influence} ảnh hưởng` : null,
  ]
    .filter(Boolean)
    .join(', ');
}

function formatRentLoss(loss: ReturnType<typeof getRentBreakdown>): string {
  return [
    `$${loss.money}`,
    loss.data ? `${loss.data} dữ liệu` : null,
    loss.users ? `${loss.users} người dùng` : null,
    `${loss.influence} ảnh hưởng`,
  ]
    .filter(Boolean)
    .join(', ');
}
