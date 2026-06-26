import type { GameState, Player, Tile } from '../types/game';
import { calculateAssetValue, calculateMarketPower } from '../utils/scoring';
import { PlayerAvatar } from './PlayerAvatar';

interface PlayerPanelProps {
  currentPlayerId: string | null;
  gameState: GameState;
}

export function PlayerPanel({ currentPlayerId, gameState }: PlayerPanelProps) {
  return (
    <section className="rounded-lg border border-red-200/15 bg-oil/70 p-4 shadow-gold backdrop-blur">
      <h2 className="text-lg font-bold text-white">Thống kê người chơi</h2>
      <div className="mt-4 space-y-3">
        {gameState.players.map((player) => (
          <PlayerStatsCard currentPlayerId={currentPlayerId} key={player.id} player={player} players={gameState.players} tiles={gameState.tiles} />
        ))}
      </div>
    </section>
  );
}

function PlayerStatsCard({ currentPlayerId, player, players, tiles }: { currentPlayerId: string | null; player: Player; players: Player[]; tiles: Tile[] }) {
  const marketPower = calculateMarketPower(player, players);
  const assetValue = player.assets.reduce((sum, asset) => sum + calculateAssetValue(asset), 0);
  const isCurrent = player.id === currentPlayerId;

  return (
    <article className={`rounded-lg border p-3 ${isCurrent ? 'border-cyan/60 bg-cyan/10' : 'border-white/10 bg-oil/60'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <PlayerAvatar alt={player.name} className="h-8 w-8 rounded-md" imagePath={player.avatar} label={player.name} />
          <p className="truncate font-bold text-white">{player.name}</p>
        </div>
        <p className="text-sm font-black text-cyan">{marketPower} QLTT</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <Stat label="Vốn" value={`$${player.money}`} />
        <Stat label="Ảnh hưởng" value={player.influence} />
        <Stat label="Người dùng" value={player.users} />
        <Stat label="Dữ liệu" value={player.data} />
        <Stat label="Lý luận" value={player.theoryPoints} />
        <Stat label="Giá trị TS" value={`$${assetValue}`} />
      </div>

      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Ô đất / tài sản sở hữu</p>
        {player.assets.length > 0 ? (
          <div className="mt-2 overflow-hidden rounded-md border border-white/10">
            {player.assets.map((asset) => {
              const tile = tiles.find((item) => item.id === asset.tileId);

              return (
                <div className="grid grid-cols-[44px_1fr_auto] gap-2 border-b border-white/10 px-2 py-2 text-[11px] last:border-b-0" key={asset.id}>
                  <span className="font-black text-cyan">#{tile?.index ?? '-'}</span>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">{asset.name}</p>
                    <p className="text-slate-500">{asset.lapsHeld >= 1 ? 'Đã mở nâng cấp' : 'Chưa đủ 1 vòng'}</p>
                  </div>
                  <div className="text-right font-semibold text-slate-300">
                    <p>L{asset.level}</p>
                    <p className="text-gold">Thuê ${asset.baseRent}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-500">Chưa sở hữu tài sản.</p>
        )}
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-white/10 bg-oil/50 px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  );
}
