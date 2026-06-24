import type { GameState, Player, Tile } from '../types/game';
import { PlayerAvatar } from './PlayerAvatar';

interface ActionPanelProps {
  currentPlayer: Player;
  gameState: GameState;
  isBusy: boolean;
  onApplyEvent: () => void;
  onBuyAsset: (tileId: string) => void;
  onEndTurn: () => void;
  onReset: () => void;
  onUpgradeAsset: (assetId: string) => void;
}

export function ActionPanel({
  currentPlayer,
  gameState,
  isBusy,
  onApplyEvent,
  onBuyAsset,
  onEndTurn,
  onReset,
  onUpgradeAsset,
}: ActionPanelProps) {
  const currentTile = gameState.tiles[currentPlayer.position];
  const owner = currentTile?.asset ? findAssetOwner(gameState, currentTile.asset.tileId) : null;
  const canBuy = Boolean(currentTile?.asset && !owner && currentPlayer.money >= currentTile.asset.purchasePrice);
  const rentPreview = currentTile?.asset && owner && owner.id !== currentPlayer.id ? currentTile.asset.baseRent * currentTile.asset.level : null;
  const upgradableAssets = currentPlayer.assets.filter((asset) => asset.level < asset.maxLevel);
  const buyLabel = getBuyLabel(currentTile, owner, currentPlayer.money);

  return (
    <section className="rounded-lg border border-red-200/15 bg-oil/70 p-4 shadow-gold backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Hành động</h2>
          <p className="muted-text mt-1">{currentTile ? describeTile(currentTile) : 'Chưa có ô hiện tại.'}</p>
        </div>
        <span className="rounded-md bg-cyan/10 px-2 py-1 text-xs font-black text-cyan">Turn</span>
      </div>

      {currentTile?.asset && (
        <div className="mt-4 rounded-lg border border-white/10 bg-oil/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold text-white">{currentTile.asset.name}</p>
            <p className="text-sm font-black text-gold">${currentTile.asset.purchasePrice}</p>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-400">{currentTile.asset.theoryConnection}</p>
          {owner && (
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-cyan">
              <PlayerAvatar alt={owner.name} className="h-5 w-5 rounded" imagePath={owner.avatar} label={owner.name} />
              <span>Chủ sở hữu: {owner.name}</span>
            </div>
          )}
        </div>
      )}

      {rentPreview !== null && (
        <div className="mt-3 rounded-md border border-rose-300/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          Tiền thuê đã được xử lý khi dừng ở ô này: khoảng ${rentPreview} cho {owner?.name}.
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

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <label className="text-sm font-bold text-slate-200" htmlFor="asset-upgrade">
            Nâng cấp tài sản
          </label>
          <div className="mt-2 grid gap-2">
            {upgradableAssets.length > 0 ? (
              upgradableAssets.map((asset) => (
                <button
                  className="rounded-md border border-white/10 bg-oil/70 px-3 py-2 text-left text-sm font-semibold text-slate-200 transition hover:border-gold hover:text-gold"
                  disabled={isBusy}
                  key={asset.id}
                  onClick={() => onUpgradeAsset(asset.id)}
                  type="button"
                >
                  {asset.name} L{asset.level} → L{asset.level + 1} · ${asset.upgradeCost}
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">Chưa có tài sản có thể nâng cấp.</p>
            )}
          </div>
        </div>

        <button className="secondary-button" disabled={isBusy} onClick={onEndTurn} type="button">
          Kết thúc lượt
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
  if (tile.type === 'event') return 'Ô sự kiện: áp dụng biến động thị trường.';
  if (tile.type === 'theory-quiz') return 'Ô quiz: câu hỏi lý luận sẽ được xử lý ở modal sau.';
  if (tile.type === 'tax-regulation') return 'Ô quy định: tác động tới chi phí và ảnh hưởng.';
  if (tile.type === 'crisis') return 'Ô khủng hoảng: tác động tới tiền, dữ liệu hoặc ảnh hưởng.';
  return tile.description;
}
