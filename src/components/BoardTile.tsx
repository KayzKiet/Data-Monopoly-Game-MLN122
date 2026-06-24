import type { Player, Tile } from '../types/game';

interface BoardTileProps {
  currentPlayerId: string | null;
  owner: Player | null;
  ownerColor: string | null;
  playersOnTile: Player[];
  tile: Tile;
}

const tileIcons: Record<Tile['type'], string> = {
  start: '↻',
  'oil-field': '🛢️',
  refinery: '⚙️',
  pipeline: '⛓️',
  logistics: '🚚',
  'search-platform': '⌕',
  'social-network': '◎',
  'ecommerce-platform': '▣',
  'cloud-infrastructure': '☁',
  'ai-lab': 'AI',
  'tax-regulation': '§',
  crisis: '!',
  event: '?',
  'theory-quiz': 'Q',
  'antitrust-investigation': '⚖',
};

export function BoardTile({ currentPlayerId, owner, ownerColor, playersOnTile, tile }: BoardTileProps) {
  const eraAccent =
    tile.era === 'oil'
      ? 'border-gold/45 bg-gold/[0.08]'
      : tile.era === 'data'
        ? 'border-cyan/45 bg-cyan/[0.08]'
        : 'border-white/15 bg-white/[0.06]';
  const hasCurrentPlayer = playersOnTile.some((player) => player.id === currentPlayerId);
  const typeLabel = tile.type.replaceAll('-', ' ');

  return (
    <article
      className={`relative flex min-h-24 flex-col overflow-hidden rounded-md border p-2 transition sm:min-h-28 lg:min-h-32 ${eraAccent} ${
        hasCurrentPlayer ? 'ring-2 ring-cyan shadow-glow' : ''
      }`}
    >
      {ownerColor && <div className={`absolute inset-x-0 top-0 h-1.5 ${ownerColor}`} />}

      <div className="flex items-start justify-between gap-2 pt-1">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">#{tile.index + 1}</p>
          <h2 className="mt-1 line-clamp-2 text-xs font-black leading-4 text-white sm:text-sm">{tile.name}</h2>
        </div>
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-white/10 bg-oil/70 text-xs font-black text-cyan">
          {tileIcons[tile.type]}
        </div>
      </div>

      <div className="mt-auto space-y-2 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded bg-oil/70 px-1.5 py-1 text-[10px] font-bold capitalize text-slate-300">
            {typeLabel}
          </span>
          {tile.asset && (
            <span className="rounded bg-gold/15 px-1.5 py-1 text-[10px] font-black text-gold">
              ${tile.asset.purchasePrice}
            </span>
          )}
        </div>

        <div className="flex min-h-6 items-center justify-between gap-2">
          <div className="flex -space-x-1">
            {playersOnTile.map((player) => (
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border text-sm ${
                  player.id === currentPlayerId ? 'border-cyan bg-cyan text-oil' : 'border-white/30 bg-midnight text-white'
                }`}
                key={player.id}
                title={player.name}
              >
                {player.avatar}
              </span>
            ))}
          </div>
          {owner && <span className="truncate text-[10px] font-bold text-slate-400">{owner.name}</span>}
        </div>
      </div>
    </article>
  );
}
