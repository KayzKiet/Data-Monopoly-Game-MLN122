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
  const hasPlayers = playersOnTile.length > 0;
  const eraAccent =
    tile.era === 'oil'
      ? 'border-[#d96f2f] bg-[linear-gradient(135deg,#ffc55f,#f07b35)]'
      : tile.era === 'data'
        ? 'border-[#d96f2f] bg-[linear-gradient(135deg,#7fe8f0,#3da0d5)]'
        : 'border-[#d96f2f] bg-[linear-gradient(135deg,#ffe07c,#f5a53f)]';
  const hasCurrentPlayer = playersOnTile.some((player) => player.id === currentPlayerId);
  const displayName = getTileDisplayName(tile);
  const typeLabel = getTileTypeLabel(tile);
  const metaLabel = getTileMetaLabel(tile);
  const shouldShowTypeLabel = typeLabel.toLocaleLowerCase() !== displayName.toLocaleLowerCase();
  const imagePath = `/images/tiles/${tile.id}.png`;

  return (
    <article
      className={`relative flex h-full min-h-0 min-w-0 flex-col rounded-sm border-2 p-1.5 text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.22)] transition ${
        hasPlayers ? 'z-20 scale-[1.02] shadow-[0_0_0_2px_rgba(255,255,255,0.36),0_10px_18px_rgba(0,0,0,0.28)]' : 'z-0'
      } ${eraAccent}`}
      title={`${tile.index}. ${tile.name}\n${tile.description}`}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url("${imagePath}")` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.26),rgba(20,15,8,0.22))]" />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      {ownerColor && <div className={`absolute inset-x-1 bottom-1 h-1.5 rounded-full ${ownerColor}`} />}

      <div className="relative flex min-w-0 items-start justify-between gap-1">
        <div className="min-w-0 pr-1">
          <p className="text-[10px] font-black uppercase leading-none tracking-[0.08em] text-white/80">#{tile.index}</p>
          <h2
            className="mt-1 line-clamp-2 text-[13px] font-black leading-[15px] text-white drop-shadow-[1px_1px_0_rgba(50,31,17,0.85)]"
            title={tile.name}
          >
            {displayName}
          </h2>
        </div>
      </div>

      <div className="relative mt-auto space-y-1 pb-7 pt-1">
        <div className="flex flex-wrap items-center gap-1">
          {shouldShowTypeLabel && (
            <span className="max-w-full truncate rounded bg-black/42 px-1.5 py-0.5 text-[10px] font-bold capitalize leading-4 text-white">
              {typeLabel}
            </span>
          )}
          <span className="max-w-full truncate rounded bg-black/42 px-1.5 py-0.5 text-[10px] font-black leading-4 text-yellow-100">
            {metaLabel}
          </span>
        </div>

        {owner && <p className="truncate rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-bold leading-4 text-white/90">Chủ: {owner.name}</p>}
      </div>

      {hasPlayers && (
        <div className="absolute inset-x-1 bottom-2 z-30 flex min-h-8 items-end justify-center">
          <div className="flex max-w-full items-center justify-center -space-x-1 rounded-full bg-black/45 px-1.5 py-1 shadow-[0_8px_16px_rgba(0,0,0,0.35)] ring-1 ring-white/30 backdrop-blur">
            {playersOnTile.map((player) => (
              <PlayerAvatar
                alt={player.name}
                className={`h-7 w-7 rounded-full border-2 shadow-lg transition min-[1360px]:h-8 min-[1360px]:w-8 ${
                  player.id === currentPlayerId
                    ? 'border-white shadow-[0_0_18px_rgba(34,211,238,0.85)]'
                    : 'border-white/80'
                } ${player.id === movingPlayerId ? 'animate-[tokenHop_220ms_ease-in-out]' : ''}`}
                imagePath={player.avatar}
                key={player.id}
                label={player.name}
                title={`${player.name} đang đứng ở ô ${tile.index}`}
              />
            ))}
          </div>
          {hasCurrentPlayer && <span className="sr-only">Người chơi hiện tại đang đứng ở ô này</span>}
        </div>
      )}
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
    start: 'Khởi nghiệp',
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

function getTileMetaLabel(tile: Tile): string {
  if (tile.asset) return `$${tile.asset.purchasePrice}`;
  if ('fee' in tile && typeof tile.fee === 'number') return `Phí $${tile.fee}`;
  if (tile.type === 'event') return 'Rút thẻ';
  if (tile.type === 'theory-quiz') return 'MLN122';
  if (tile.type === 'start') return '+$100';
  if (tile.type === 'crisis') return 'Biến động';

  return 'Hệ thống';
}
