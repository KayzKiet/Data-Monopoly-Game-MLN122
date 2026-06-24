import type { Player, Tile } from '../types/game';
import { PlayerAvatar } from './PlayerAvatar';

interface BoardTileProps {
  currentPlayerId: string | null;
  movingPlayerId: string | null;
  owner: Player | null;
  ownerColor: string | null;
  playersOnTile: Player[];
  tile: Tile;
}

export function BoardTile({ currentPlayerId, movingPlayerId, owner, ownerColor, playersOnTile, tile }: BoardTileProps) {
  const eraAccent =
    tile.era === 'oil'
      ? 'border-[#d96f2f] bg-[linear-gradient(135deg,#ffc55f,#f07b35)]'
      : tile.era === 'data'
        ? 'border-[#d96f2f] bg-[linear-gradient(135deg,#7fe8f0,#3da0d5)]'
        : 'border-[#d96f2f] bg-[linear-gradient(135deg,#ffe07c,#f5a53f)]';
  const hasCurrentPlayer = playersOnTile.some((player) => player.id === currentPlayerId);
  const displayName = getTileDisplayName(tile);
  const typeLabel = getTileTypeLabel(tile);
  const imagePath = `/images/tiles/${tile.id}.png`;

  return (
    <article className={`relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-sm border-2 p-1 text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.22)] transition ${eraAccent}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-75"
        style={{ backgroundImage: `url("${imagePath}")` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(30,20,10,0.18))]" />
      <div className="absolute inset-0 bg-black/10" />
      {ownerColor && <div className={`absolute inset-x-0 bottom-0 h-2 ${ownerColor}`} />}

      <div className="relative flex min-w-0 items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.08em] text-white/75">#{tile.index}</p>
          <h2
            className="mt-0.5 text-[11px] font-black leading-[12px] text-white drop-shadow-[1px_1px_0_rgba(50,31,17,0.85)] min-[1360px]:text-[12px] min-[1360px]:leading-[13px]"
            title={tile.name}
          >
            {displayName}
          </h2>
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

        <div className="flex min-h-6 min-w-0 items-center justify-between gap-1">
          <div className="flex -space-x-1">
            {playersOnTile.map((player) => (
              <PlayerAvatar
                alt={player.name}
                className={`h-6 w-6 rounded-full border shadow-lg transition ${
                  player.id === currentPlayerId
                    ? 'border-white shadow-[0_0_18px_rgba(34,211,238,0.75)]'
                    : 'border-white/80'
                } ${player.id === movingPlayerId ? 'animate-[tokenHop_220ms_ease-in-out]' : ''}`}
                imagePath={player.avatar}
                key={player.id}
                label={player.name}
                title={`${player.name} đang đứng ở ô ${tile.index}`}
              />
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

function getTileDisplayName(tile: Tile): string {
  const shortNames: Record<string, string> = {
    'startup-start': 'Khởi nghiệp',
    'black-river-oil-field': 'Black River',
    'fortune-1': 'Khí vận',
    'fortune-2': 'Khí vận',
    'fortune-3': 'Khí vận',
    'iron-pump-refinery': 'Iron Pump',
    'nova-search': 'Nova Search',
    'antitrust-office': 'Điều tra',
    socialsphere: 'SocialSphere',
    'chance-1': 'Cơ hội',
    'chance-2': 'Cơ hội',
    'chance-3': 'Cơ hội',
    'continental-pipeline': 'Pipeline',
    'theory-quiz-1': 'Quiz',
    'steel-port-logistics': 'Steel Port',
    shopgrid: 'ShopGrid',
    'platform-tax': 'Thuế',
    cloudnest: 'CloudNest',
    'petrorail-network': 'PetroRail',
    'market-shift-event': 'Sự kiện',
    adsignal: 'AdSignal',
    'northern-drill-site': 'Northern Drill',
    'supply-chain-crisis': 'Khủng hoảng',
    'visionai-lab': 'VisionAI',
    'oceanic-fuel-harbor': 'Ocean Harbor',
    'theory-quiz-2': 'Quiz',
    mapstream: 'MapStream',
    'golden-barrel-depot': 'Golden Barrel',
    datavault: 'DataVault',
    'technology-policy-event': 'Chính sách',
    streamloop: 'StreamLoop',
    'open-data-regulation': 'Data mở',
    'marketmind-ai': 'MarketMind',
    'pipeline-gate': 'Pipe Gate',
    'trust-crisis': 'Niềm tin',
    'data-union-hub': 'Data Union',
    'green-fuel-grid': 'Green Fuel',
    'algorithm-exchange': 'Algo Market',
    'deep-sea-terminal': 'Deep Sea',
    'cloud-tollway': 'Cloud Toll',
    'theory-quiz-3': 'Quiz',
    'platform-court': 'Điều trần',
  };

  return shortNames[tile.id] ?? tile.name;
}

function getTileTypeLabel(tile: Tile): string {
  if (tile.type === 'event') return tile.eventDeck === 'fortune' ? 'Khí vận' : 'Cơ hội';

  const labels: Record<Tile['type'], string> = {
    start: 'Start',
    'oil-field': 'Mỏ dầu',
    refinery: 'Lọc dầu',
    pipeline: 'Ống dẫn',
    logistics: 'Vận tải',
    'search-platform': 'Search',
    'social-network': 'Social',
    'ecommerce-platform': 'TMĐT',
    'cloud-infrastructure': 'Cloud',
    'ai-lab': 'AI Lab',
    'tax-regulation': 'Thuế',
    crisis: 'Khủng hoảng',
    event: 'Sự kiện',
    'theory-quiz': 'Quiz',
    'antitrust-investigation': 'Điều tra',
  };

  return labels[tile.type];
}
