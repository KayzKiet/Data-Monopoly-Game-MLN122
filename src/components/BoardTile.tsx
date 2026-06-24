import type { Player, Tile } from '../types/game';

interface BoardTileProps {
  currentPlayerId: string | null;
  movingPlayerId: string | null;
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

export function BoardTile({ currentPlayerId, movingPlayerId, owner, ownerColor, playersOnTile, tile }: BoardTileProps) {
  const eraAccent =
    tile.era === 'oil'
      ? 'border-[#d96f2f] bg-[linear-gradient(135deg,#ffc55f,#f07b35)]'
      : tile.era === 'data'
        ? 'border-[#d96f2f] bg-[linear-gradient(135deg,#7fe8f0,#3da0d5)]'
        : 'border-[#d96f2f] bg-[linear-gradient(135deg,#ffe07c,#f5a53f)]';
  const hasCurrentPlayer = playersOnTile.some((player) => player.id === currentPlayerId);
  const typeLabel = tile.type.replaceAll('-', ' ');

  return (
    <article className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-sm border-2 p-1.5 text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.22)] transition ${eraAccent}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(30,20,10,0.18))]" />
      {ownerColor && <div className={`absolute inset-x-0 bottom-0 h-2 ${ownerColor}`} />}

      <div className="relative flex items-start justify-between gap-2 pt-1">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/70">#{tile.index + 1}</p>
          <h2 className="mt-0.5 line-clamp-2 text-[11px] font-black leading-3 text-white drop-shadow-[1px_1px_0_rgba(50,31,17,0.75)] min-[1360px]:text-xs min-[1360px]:leading-4">{tile.name}</h2>
        </div>
        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/40 bg-white/25 text-xs font-black text-white shadow min-[1360px]:h-7 min-[1360px]:w-7">
          {tileIcons[tile.type]}
        </div>
      </div>

      <div className="relative mt-auto space-y-1 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded bg-black/35 px-1.5 py-1 text-[10px] font-bold capitalize text-white">
            {typeLabel}
          </span>
          {tile.asset && (
            <span className="rounded bg-black/35 px-1.5 py-1 text-[10px] font-black text-yellow-100">
              ${tile.asset.purchasePrice}
            </span>
          )}
        </div>

        <div className="flex min-h-6 items-center justify-between gap-1">
          <div className="flex -space-x-1">
            {playersOnTile.map((player) => (
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border text-xs shadow-lg transition min-[1360px]:h-7 min-[1360px]:w-7 min-[1360px]:text-sm ${
                  player.id === currentPlayerId
                    ? 'border-white bg-cyan text-oil shadow-[0_0_18px_rgba(34,211,238,0.75)]'
                    : 'border-white/80 bg-midnight text-white'
                } ${player.id === movingPlayerId ? 'animate-[tokenHop_220ms_ease-in-out]' : ''}`}
                key={player.id}
                title={`${player.name} đang đứng ở ô ${tile.index + 1}`}
              >
                {player.avatar}
              </span>
            ))}
          </div>
          {hasCurrentPlayer ? (
            <span className="rounded bg-black/35 px-1 py-0.5 text-[9px] font-black text-white">Đang đứng</span>
          ) : (
            owner && <span className="truncate text-[10px] font-bold text-white/80">{owner.name}</span>
          )}
        </div>
      </div>
    </article>
  );
}
