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
  'Độc quyền dầu mỏ dựa trên tài nguyên khan hiếm và hạ tầng vật chất.',
  'Độc quyền dữ liệu dựa trên người dùng, dữ liệu, thuật toán, AI và nền tảng.',
  'Hình thức độc quyền thay đổi, nhưng sự tập trung quyền lực thị trường vẫn tồn tại.',
  'Đây là một giới hạn của CNTB hiện đại.',
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
    users: player.users,
    data: player.data,
    theoryPoints: player.theoryPoints,
    marketPower: calculateMarketPower(player, players),
    finalScore: calculateTotalScore(player),
  };
}
