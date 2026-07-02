import type { GameState, Player } from '../types/game';
import { calculateAssetValue, calculateMarketPower, calculateTotalScore } from '../utils/scoring';
import { PlayerAvatar } from './PlayerAvatar';

interface ResultScreenProps {
  gameState: GameState | null;
  onHome: () => void;
  onRestart: () => void;
  onTheory: () => void;
}

const endingPoints = [
  'Các tài sản dầu mỏ trong game mô phỏng quyền lực từ tài nguyên vật chất và hạ tầng.',
  'Các tài sản dữ liệu là phần vận dụng hiện đại về nền tảng, dữ liệu, thuật toán và AI.',
  'Điểm lý luận là chỉ số học tập trong game, không phải thước đo trực tiếp của quyền lực thị trường ngoài đời thực.',
  'Kết quả thắng nên được đọc như một mô phỏng để phản tư, không phải sự khẳng định rằng độc quyền luôn có lợi cho xã hội.',
];

export function ResultScreen({ gameState, onHome, onRestart, onTheory }: ResultScreenProps) {
  if (!gameState || gameState.players.length === 0) {
    return (
      <section className="screen-shell">
        <div className="panel mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Kết quả</p>
          <h1 className="mt-3 text-3xl font-black text-white">Chưa có dữ liệu kết quả</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">Hãy bắt đầu một ván chơi để tạo bảng điểm cuối cùng.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button className="primary-button" onClick={onRestart} type="button">
              Chơi lại
            </button>
            <button className="secondary-button" onClick={onHome} type="button">
              Về trang chủ
            </button>
          </div>
        </div>
      </section>
    );
  }

  const ranking = [...gameState.players].sort((left, right) => calculateTotalScore(right) - calculateTotalScore(left));
  const winner = gameState.winnerId ? gameState.players.find((player) => player.id === gameState.winnerId) ?? ranking[0] : ranking[0];
  const winnerBreakdown = getScoreBreakdown(winner, gameState.players);
  const postGameSummary = getPostGameSummary(gameState, winner);
  const socialIndicators = getSocialIndicators(gameState, winner);
  const chartRows = ranking.map((player) => ({ player, breakdown: getScoreBreakdown(player, gameState.players) }));

  return (
    <section className="screen-shell space-y-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Người thắng</p>
          <div className="mt-4 flex items-center gap-4">
            <PlayerAvatar alt={winner.name} className="h-20 w-20 rounded-lg border border-gold/40" imagePath={winner.avatar} label={winner.name} />
            <div>
              <h1 className="text-4xl font-black text-white">{winner.name}</h1>
              <p className="mt-1 text-lg font-bold text-cyan">{winnerBreakdown.finalScore} điểm tổng</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <ScoreCard label="Vốn" value={`$${winnerBreakdown.money}`} />
            <ScoreCard label="Giá trị tài sản" value={`$${winnerBreakdown.assetValue}`} />
            <ScoreCard label="Ảnh hưởng" value={winnerBreakdown.influence} />
            <ScoreCard label="Người dùng" value={winnerBreakdown.users} />
            <ScoreCard label="Dữ liệu" value={winnerBreakdown.data} />
            <ScoreCard label="Điểm lý luận" value={winnerBreakdown.theoryPoints} />
            <ScoreCard label="Quyền lực thị trường" value={`${winnerBreakdown.marketPower} QLTT`} highlight />
          </div>

          <p className="mt-6 rounded-lg border border-cyan/30 bg-cyan/10 p-4 text-xl font-black leading-8 text-cyan">
            Bạn đã thắng thị trường. Nhưng xã hội có thật sự tốt hơn không?
          </p>
        </div>

        <div className="panel">
          <h2 className="text-xl font-black text-white">Diễn giải lý luận</h2>
          <div className="mt-4 space-y-3">
            {endingPoints.map((point) => (
              <p className="rounded-lg border border-white/10 bg-oil/60 p-4 text-sm leading-6 text-slate-300" key={point}>
                {point}
              </p>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-gold/30 bg-gold/10 p-4">
            <PostGameSummary summary={postGameSummary} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="primary-button" onClick={onRestart} type="button">
              Chơi lại
            </button>
            <button className="secondary-button" onClick={onTheory} type="button">
              Xem lý thuyết
            </button>
            <button className="rounded-md border border-white/15 bg-white/5 px-4 py-2 font-bold text-slate-100 transition hover:border-cyan hover:text-cyan" onClick={onHome} type="button">
              Về trang chủ
            </button>
          </div>
        </div>
      </div>

      <SocialIndicatorsPanel indicators={socialIndicators} />

      <ComparisonChart rows={chartRows} />

      <div className="panel overflow-x-auto">
        <h2 className="text-xl font-black text-white">Bảng xếp hạng</h2>
        <table className="mt-4 w-full min-w-[780px] text-left text-sm">
          <thead className="text-cyan">
            <tr>
              <th className="border-b border-white/10 py-3 pr-4">Hạng</th>
              <th className="border-b border-white/10 py-3 pr-4">Người chơi</th>
              <th className="border-b border-white/10 py-3 pr-4">Vốn</th>
              <th className="border-b border-white/10 py-3 pr-4">Tài sản</th>
              <th className="border-b border-white/10 py-3 pr-4">Người dùng</th>
              <th className="border-b border-white/10 py-3 pr-4">Dữ liệu</th>
              <th className="border-b border-white/10 py-3 pr-4">Lý luận</th>
              <th className="border-b border-white/10 py-3 pr-4">Quyền lực thị trường</th>
              <th className="border-b border-white/10 py-3">Điểm tổng</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {ranking.map((player, index) => {
              const breakdown = getScoreBreakdown(player, gameState.players);
              const isWinner = player.id === winner.id;

              return (
                <tr className={isWinner ? 'text-white' : ''} key={player.id}>
                  <td className="border-b border-white/10 py-3 pr-4 font-black text-gold">#{index + 1}</td>
                  <td className="border-b border-white/10 py-3 pr-4">
                    <PlayerAvatar alt={player.name} className="mr-2 h-7 w-7 rounded-md align-middle" imagePath={player.avatar} label={player.name} />
                    <span className="font-bold">{player.name}</span>
                  </td>
                  <td className="border-b border-white/10 py-3 pr-4">${breakdown.money}</td>
                  <td className="border-b border-white/10 py-3 pr-4">${breakdown.assetValue}</td>
                  <td className="border-b border-white/10 py-3 pr-4">{breakdown.users}</td>
                  <td className="border-b border-white/10 py-3 pr-4">{breakdown.data}</td>
                  <td className="border-b border-white/10 py-3 pr-4">{breakdown.theoryPoints}</td>
                  <td className="border-b border-white/10 py-3 pr-4">{breakdown.marketPower}</td>
                  <td className="border-b border-white/10 py-3 font-black text-cyan">{breakdown.finalScore}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PostGameSummary({ summary }: { summary: ReturnType<typeof getPostGameSummary> }) {
  const rows = [
    ['Dạng độc quyền', summary.monopolyType],
    ['Vì sao thắng theo dạng này', summary.monopolyReason],
    ['Nguồn lực then chốt', summary.keyResource],
    ['Mức phụ thuộc của người chơi khác', summary.dependence],
    ['Điều tiết/chống độc quyền', summary.regulation],
    ['Khái niệm lý luận minh họa', summary.theoryLink],
  ];

  return (
    <div>
      <h3 className="text-lg font-black text-gold">Tổng kết sau ván chơi</h3>
      <p className="mt-2 rounded-md border border-cyan/20 bg-cyan/10 p-3 text-sm font-semibold leading-6 text-slate-100">
        {summary.learningConclusion}
      </p>
      <div className="mt-3 grid gap-3">
        {rows.map(([label, value]) => (
          <div className="rounded-md border border-white/10 bg-oil/50 p-3" key={label}>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-100">{value}</p>
          </div>
        ))}
      </div>
      <ComparisonAfterGamePanel summary={summary} />
      <p className="mt-3 text-sm leading-6 text-slate-200">
        Câu hỏi học thuật: quyền lực này giúp mở rộng sản xuất/dịch vụ, hay làm người chơi khác phụ thuộc nhiều hơn vào một chủ thể?
      </p>
    </div>
  );
}

function ComparisonAfterGamePanel({ summary }: { summary: ReturnType<typeof getPostGameSummary> }) {
  const rows = [
    ['Nguồn lực chính', 'Dầu mỏ, nhà máy lọc dầu, đường ống, logistics.', 'Người dùng, dữ liệu, nền tảng, cloud, thuật toán và AI.'],
    ['Rào cản gia nhập', 'Vốn lớn, tài nguyên khan hiếm và hạ tầng vật chất khó thay thế.', 'Hiệu ứng mạng lưới, dữ liệu lớn, chi phí chuyển đổi và hệ sinh thái khép kín.'],
    ['Biểu hiện trong ván này', summary.oilReading, summary.dataReading],
    ['Vấn đề xã hội cần hỏi', 'Ai kiểm soát hạ tầng và giá tiếp cận tài nguyên?', 'Ai kiểm soát dữ liệu do người dùng và xã hội tạo ra?'],
  ];

  return (
    <div className="mt-4 rounded-md border border-white/10 bg-slate-950/40 p-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan">So sánh sau ván</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-xs">
          <thead className="text-slate-300">
            <tr>
              <th className="border-b border-white/10 py-2 pr-3">Tiêu chí</th>
              <th className="border-b border-white/10 py-2 pr-3">Độc quyền tài nguyên</th>
              <th className="border-b border-white/10 py-2">Độc quyền dữ liệu</th>
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {rows.map(([label, oilValue, dataValue]) => (
              <tr key={label}>
                <td className="border-b border-white/10 py-2 pr-3 font-black text-gold">{label}</td>
                <td className="border-b border-white/10 py-2 pr-3 leading-5">{oilValue}</td>
                <td className="border-b border-white/10 py-2 leading-5">{dataValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SocialIndicatorsPanel({ indicators }: { indicators: ReturnType<typeof getSocialIndicators> }) {
  const rows = [
    ['Mức cạnh tranh còn lại', indicators.remainingCompetition],
    ['Mức tập trung thị trường', indicators.marketConcentration],
    ['Tổn hại người chơi nhỏ/người tiêu dùng', indicators.consumerHarm],
    ['Mức điều tiết cần thiết', indicators.regulationNeed],
  ];

  return (
    <section className="panel">
      <h2 className="text-xl font-black text-white">Chỉ số xã hội trong mô phỏng</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Các chỉ số này không phải đo lường kinh tế học chính thức, mà là công cụ phản tư để người chơi thảo luận tác động xã hội của độc quyền.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {rows.map(([label, value]) => (
          <article className="rounded-lg border border-white/10 bg-oil/60 p-4" key={label}>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan">{label}</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-100">{value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComparisonChart({ rows }: { rows: Array<{ player: Player; breakdown: ReturnType<typeof getScoreBreakdown> }> }) {
  const metrics = [
    { key: 'finalScore', label: 'Điểm tổng', color: 'bg-cyan' },
    { key: 'marketPower', label: 'Quyền lực thị trường', color: 'bg-gold' },
    { key: 'assetValue', label: 'Giá trị tài sản', color: 'bg-emerald-400' },
    { key: 'influence', label: 'Ảnh hưởng', color: 'bg-orange-300' },
    { key: 'users', label: 'Người dùng', color: 'bg-sky-400' },
    { key: 'data', label: 'Dữ liệu', color: 'bg-violet-400' },
    { key: 'theoryPoints', label: 'Điểm lý luận', color: 'bg-rose-400' },
  ] as const;

  return (
    <section className="panel">
      <h2 className="text-xl font-black text-white">Biểu đồ so sánh người chơi</h2>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {metrics.map((metric) => {
          const maxValue = Math.max(...rows.map((row) => row.breakdown[metric.key]), 1);

          return (
            <div className="rounded-lg border border-white/10 bg-oil/60 p-4" key={metric.key}>
              <p className="text-sm font-black text-white">{metric.label}</p>
              <div className="mt-4 space-y-3">
                {rows.map(({ breakdown, player }) => {
                  const value = breakdown[metric.key];
                  const width = Math.max(4, Math.round((value / maxValue) * 100));

                  return (
                    <div className="grid grid-cols-[110px_1fr_72px] items-center gap-3 text-xs" key={`${metric.key}-${player.id}`}>
                      <div className="flex min-w-0 items-center gap-2">
                        <PlayerAvatar alt={player.name} className="h-6 w-6 rounded" imagePath={player.avatar} label={player.name} />
                        <span className="truncate font-bold text-slate-200">{player.name}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${width}%` }} />
                      </div>
                      <span className="text-right font-black text-white">{metric.key === 'assetValue' ? `$${value}` : value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ScoreCard({ highlight = false, label, value }: { highlight?: boolean; label: string; value: number | string }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? 'border-cyan/40 bg-cyan/10' : 'border-white/10 bg-oil/60'}`}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-2 text-lg font-black ${highlight ? 'text-cyan' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function getScoreBreakdown(player: Player, players: Player[]) {
  const assetValue = player.assets.reduce((sum, asset) => sum + calculateAssetValue(asset), 0);

  return {
    money: player.money,
    assetValue,
    influence: player.influence,
    users: player.users,
    data: player.data,
    theoryPoints: player.theoryPoints,
    marketPower: calculateMarketPower(player, players),
    finalScore: calculateTotalScore(player),
  };
}

function getPostGameSummary(gameState: GameState, winner: Player) {
  const players = gameState.players;
  const oilAssets = winner.assets.filter((asset) => asset.era === 'oil');
  const dataAssets = winner.assets.filter((asset) => asset.era === 'data');
  const infrastructureAssets = winner.assets.filter((asset) => ['pipeline', 'logistics', 'cloud-infrastructure'].includes(asset.type));
  const oilAssetNames = oilAssets.map((asset) => asset.name).slice(0, 3);
  const dataAssetNames = dataAssets.map((asset) => asset.name).slice(0, 3);
  const marketPower = calculateMarketPower(winner, players);
  const totalMarketPower = players.reduce((sum, player) => sum + calculateMarketPower(player, players), 0);
  const share = totalMarketPower > 0 ? Math.round((marketPower / totalMarketPower) * 100) : 0;
  const winnerRegulationEvents = gameState.log.filter((entry) => entry.playerId === winner.id && entry.type === 'regulation').length;
  const winnerRentEvents = gameState.log.filter((entry) => entry.type === 'rent' && entry.message.includes(`cho ${winner.name}`)).length;

  let monopolyType = 'Độc quyền hỗn hợp';
  let monopolyReason =
    `${winner.name} thắng bằng sự kết hợp giữa tài sản vật chất, tài sản dữ liệu, vốn, ảnh hưởng và điểm học tập. Đây là dạng quyền lực thị trường pha trộn.`;
  if (infrastructureAssets.length >= Math.max(oilAssets.length, dataAssets.length) && infrastructureAssets.length >= 3) {
    monopolyType = 'Độc quyền hạ tầng';
    monopolyReason =
      `${winner.name} kiểm soát nhiều hạ tầng then chốt như đường ống, logistics hoặc cloud. Điều này cho thấy ai nắm hạ tầng tiếp cận thị trường có thể đặt điều kiện cho người chơi khác.`;
  } else if (dataAssets.length > oilAssets.length) {
    monopolyType = 'Độc quyền dữ liệu';
    monopolyReason =
      `${winner.name} có nhiều tài sản dữ liệu hơn tài sản dầu mỏ, nên chiến thắng chủ yếu dựa trên người dùng, dữ liệu, nền tảng số, cloud hoặc AI.`;
  } else if (oilAssets.length > dataAssets.length) {
    monopolyType = 'Độc quyền dầu mỏ';
    monopolyReason =
      `${winner.name} có nhiều tài sản dầu mỏ hơn tài sản dữ liệu, nên chiến thắng chủ yếu dựa trên tài nguyên vật chất, hạ tầng sản xuất và lưu thông.`;
  }

  const keyResource = getKeyResourceLabel(winner, oilAssets.length, dataAssets.length, infrastructureAssets.length);
  const oilReading =
    oilAssets.length > 0
      ? `${winner.name} sở hữu ${oilAssets.length} tài sản dầu mỏ${oilAssetNames.length > 0 ? `, gồm ${oilAssetNames.join(', ')}` : ''}.`
      : `${winner.name} không sở hữu tài sản dầu mỏ nổi bật trong ván này.`;
  const dataReading =
    dataAssets.length > 0
      ? `${winner.name} sở hữu ${dataAssets.length} tài sản dữ liệu${dataAssetNames.length > 0 ? `, gồm ${dataAssetNames.join(', ')}` : ''}; có ${winner.users} người dùng và ${winner.data} dữ liệu.`
      : `${winner.name} chưa sở hữu tài sản dữ liệu nổi bật; dữ liệu chưa phải nguồn thắng chính trong ván này.`;
  const dependence =
    winnerRentEvents > 0
      ? `Người chơi khác đã trả tiền thuê cho ${winner.name} ${winnerRentEvents} lần, cho thấy có sự phụ thuộc vào tài sản do người thắng kiểm soát.`
      : `Chưa ghi nhận nhiều lần trả thuê cho ${winner.name}; mức phụ thuộc trực tiếp vào tài sản của người thắng còn thấp hoặc chưa thể hiện rõ trong ván này.`;
  const regulation =
    winnerRegulationEvents > 0 || winner.underInvestigation
      ? `${winner.name} đã chịu ${winnerRegulationEvents} tác động điều tiết/chống độc quyền${winner.underInvestigation ? ' và đang bị đánh dấu điều tra' : ''}.`
      : `${winner.name} chưa chịu tác động điều tiết đáng kể; nếu quyền lực tiếp tục tăng, đây là điểm cần thảo luận về nhu cầu can thiệp.`;

  return {
    monopolyType,
    monopolyReason,
    keyResource,
    oilReading,
    dataReading,
    dependence,
    regulation,
    theoryLink: `Kết quả này minh họa tích tụ, tập trung tư bản và quyền lực thị trường. Người thắng đang nắm khoảng ${share}% tổng quyền lực thị trường trong mô phỏng.`,
    learningConclusion:
      `Ván này cần được đọc theo câu hỏi: ${winner.name} thắng nhờ kiểm soát loại nguồn lực nào, và quyền kiểm soát đó làm thị trường hiệu quả hơn hay khiến các chủ thể khác phụ thuộc hơn?`,
  };
}

function getSocialIndicators(gameState: GameState, winner: Player) {
  const players = gameState.players;
  const marketPowers = players.map((player) => calculateMarketPower(player, players));
  const totalMarketPower = marketPowers.reduce((sum, value) => sum + value, 0);
  const winnerShare = totalMarketPower > 0 ? calculateMarketPower(winner, players) / totalMarketPower : 0;
  const sortedPowers = [...marketPowers].sort((left, right) => right - left);
  const gap = (sortedPowers[0] ?? 0) - (sortedPowers[1] ?? 0);
  const regulationEvents = gameState.log.filter((entry) => entry.type === 'regulation').length;
  const rentEvents = gameState.log.filter((entry) => entry.type === 'rent').length;
  const crisisEvents = gameState.log.filter((entry) => entry.type === 'event' && /khủng hoảng|tẩy chay|phạt|điều tra/i.test(entry.message)).length;

  return {
    remainingCompetition:
      winnerShare >= 0.6
        ? 'Thấp: quyền lực tập trung mạnh vào người thắng, đối thủ còn ít khả năng cân bằng.'
        : gap >= 25
          ? 'Trung bình: vẫn còn cạnh tranh, nhưng người dẫn đầu đã tạo khoảng cách đáng kể.'
          : 'Còn tương đối: các người chơi chưa quá chênh lệch về quyền lực thị trường.',
    marketConcentration:
      winnerShare >= 0.6
        ? 'Cao: người thắng kiểm soát từ 60% quyền lực thị trường mô phỏng trở lên.'
        : winnerShare >= 0.4
          ? 'Đáng chú ý: người thắng chưa độc chiếm tuyệt đối nhưng đã có lợi thế lớn.'
          : 'Chưa quá cao: quyền lực thị trường còn phân tán giữa nhiều người chơi.',
    consumerHarm:
      rentEvents + crisisEvents >= 6
        ? 'Cao: nhiều lần trả thuê/khủng hoảng cho thấy chi phí phụ thuộc và tổn hại xã hội đã xuất hiện rõ.'
        : rentEvents + crisisEvents >= 3
          ? 'Trung bình: đã có dấu hiệu phụ thuộc, chi phí và biến động bất lợi cho người chơi yếu hơn.'
          : 'Thấp: ván chơi chưa tạo nhiều tình huống tổn hại trực tiếp.',
    regulationNeed:
      winnerShare >= 0.6 || regulationEvents >= 3
        ? 'Cần thiết cao: mức tập trung hoặc số lần điều tiết cho thấy cần cơ chế kiểm soát độc quyền.'
        : winnerShare >= 0.4
          ? 'Cần theo dõi: quyền lực đang tăng và có thể cần điều tiết nếu tiếp tục tập trung.'
          : 'Chưa cấp bách: thị trường mô phỏng còn đủ cạnh tranh tương đối.',
  };
}

function getKeyResourceLabel(winner: Player, oilAssetCount: number, dataAssetCount: number, infrastructureAssetCount: number) {
  const strongestMetric = [
    { label: 'vốn', value: winner.money },
    { label: 'người dùng', value: winner.users },
    { label: 'dữ liệu', value: winner.data },
    { label: 'ảnh hưởng', value: winner.influence },
  ].sort((left, right) => right.value - left.value)[0]?.label ?? 'tài sản';

  if (dataAssetCount > oilAssetCount && winner.data + winner.users > winner.money) {
    return `Dữ liệu, người dùng và nền tảng số là nguồn lực nổi bật; chỉ số mạnh nhất của người thắng là ${strongestMetric}.`;
  }

  if (oilAssetCount > dataAssetCount) {
    return `Tài sản dầu mỏ và hạ tầng vật chất là nguồn lực nổi bật; người thắng có ${oilAssetCount} tài sản dầu mỏ.`;
  }

  if (infrastructureAssetCount >= 3) {
    return `Hạ tầng phân phối/cloud/logistics là nguồn lực nổi bật; người thắng kiểm soát ${infrastructureAssetCount} tài sản hạ tầng.`;
  }

  return `Nguồn lực then chốt là sự kết hợp giữa tài sản, ${strongestMetric}, người dùng/dữ liệu và ảnh hưởng.`;
}
