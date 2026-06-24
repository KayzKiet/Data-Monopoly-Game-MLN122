import type { GameState, Player } from '../types/game';
import { calculateAssetValue, calculateMarketPower } from '../utils/scoring';

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
          <PlayerStatsCard currentPlayerId={currentPlayerId} key={player.id} player={player} players={gameState.players} />
        ))}
      </div>
    </section>
  );
}

function PlayerStatsCard({ currentPlayerId, player, players }: { currentPlayerId: string | null; player: Player; players: Player[] }) {
  const marketPower = calculateMarketPower(player, players);
  const assetValue = player.assets.reduce((sum, asset) => sum + calculateAssetValue(asset), 0);
  const isCurrent = player.id === currentPlayerId;

  return (
    <article className={`rounded-lg border p-3 ${isCurrent ? 'border-cyan/60 bg-cyan/10' : 'border-white/10 bg-oil/60'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-xl">{player.avatar}</span>
          <p className="truncate font-bold text-white">{player.name}</p>
        </div>
        <p className="text-sm font-black text-cyan">{marketPower} MP</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <Stat label="Money" value={`$${player.money}`} />
        <Stat label="Influence" value={player.influence} />
        <Stat label="Users" value={player.users} />
        <Stat label="Data" value={player.data} />
        <Stat label="Theory" value={player.theoryPoints} />
        <Stat label="Assets" value={`$${assetValue}`} />
      </div>

      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Owned assets</p>
        {player.assets.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {player.assets.map((asset) => (
              <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-semibold text-slate-200" key={asset.id}>
                {asset.name} L{asset.level}
              </span>
            ))}
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
