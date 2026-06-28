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
      className={`relative flex h-full min-h-0 min-w-0 overflow-hidden rounded-sm border-2 text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.22)] transition ${
        hasPlayers ? 'z-20 scale-[1.02] shadow-[0_0_0_2px_rgba(255,255,255,0.36),0_10px_18px_rgba(0,0,0,0.28)]' : 'z-0'
      } ${eraAccent}`}
      title={`${tile.index}. ${tile.name}\n${tile.description}`}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${imagePath}")` }}
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      {ownerColor && <div className={`absolute inset-x-1 bottom-1 z-20 h-1.5 rounded-full ${ownerColor}`} />}

      <div className={`relative z-10 mt-auto space-y-1 p-1.5 ${hasPlayers ? 'pb-10' : 'pb-2'}`}>
        <h2
          className="line-clamp-2 text-[12px] font-black leading-[14px] text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.95)] min-[1360px]:text-[13px] min-[1360px]:leading-[15px]"
          title={tile.name}
        >
          {displayName}
        </h2>
        <div className="flex flex-wrap items-center gap-1">
          {shouldShowTypeLabel && (
            <span className="max-w-full truncate rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-bold capitalize leading-4 text-white shadow-sm">
              {typeLabel}
            </span>
          )}
          <span className="max-w-full truncate rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-black leading-4 text-yellow-100 shadow-sm">
            {metaLabel}
          </span>
        </div>

        {owner && <p className="truncate rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-bold leading-4 text-white/90">Chủ: {owner.name}</p>}
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

export function getTileDisplayName(tile: Tile): string {
  const shortNames: Record<string, string> = {
    'startup-start': 'Khởi nghiệp',
    'black-river-oil-field': 'Black River',
    'fortune-1': 'Khí vận',
    'fortune-2': 'Khí vận',
    'fortune-3': 'Khí vận',
    'iron-pump-refinery': 'Iron Pump',
    'nova-search': 'Tìm kiếm',
    'antitrust-office': 'Điều tra',
    socialsphere: 'SocialSphere',
    'chance-1': 'Cơ hội',
    'chance-2': 'Cơ hội',
    'chance-3': 'Cơ hội',
    'continental-pipeline': 'Đường ống',
    'theory-quiz-1': 'Câu hỏi',
    'steel-port-logistics': 'Steel Port',
    shopgrid: 'ShopGrid',
    'platform-tax': 'Thuế',
    cloudnest: 'Đám mây',
    'petrorail-network': 'PetroRail',
    'market-shift-event': 'Sự kiện',
    adsignal: 'AdSignal',
    'northern-drill-site': 'Northern Drill',
    'supply-chain-crisis': 'Khủng hoảng',
    'visionai-lab': 'VisionAI',
    'oceanic-fuel-harbor': 'Ocean Harbor',
    'theory-quiz-2': 'Câu hỏi',
    mapstream: 'MapStream',
    'golden-barrel-depot': 'Golden Barrel',
    datavault: 'Kho dữ liệu',
    'technology-policy-event': 'Chính sách',
    streamloop: 'StreamLoop',
    'open-data-regulation': 'Dữ liệu mở',
    'marketmind-ai': 'MarketMind',
    'pipeline-gate': 'Cửa ống',
    'trust-crisis': 'Niềm tin',
    'data-union-hub': 'Liên minh dữ liệu',
    'green-fuel-grid': 'Nhiên liệu xanh',
    'algorithm-exchange': 'Chợ thuật toán',
    'deep-sea-terminal': 'Cảng biển sâu',
    'cloud-tollway': 'Phí đám mây',
    'theory-quiz-3': 'Câu hỏi',
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
    'search-platform': 'Tìm kiếm',
    'social-network': 'Mạng XH',
    'ecommerce-platform': 'TMĐT',
    'cloud-infrastructure': 'Đám mây',
    'ai-lab': 'Phòng AI',
    'tax-regulation': 'Thuế',
    crisis: 'Khủng hoảng',
    event: 'Sự kiện',
    'theory-quiz': 'Câu hỏi',
    'antitrust-investigation': 'Điều tra',
  };

  return labels[tile.type];
}

function getTileMetaLabel(tile: Tile): string {
  if (tile.asset) return `$${tile.asset.purchasePrice}`;
  if ('fee' in tile && typeof tile.fee === 'number') return `Phí $${tile.fee}`;
  if (tile.type === 'event') return 'Rút thẻ';
  if (tile.type === 'theory-quiz') return 'Lý luận';
  if (tile.type === 'start') return '+$100';
  if (tile.type === 'crisis') return 'Biến động';

  return 'Hệ thống';
}
