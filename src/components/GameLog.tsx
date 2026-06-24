import type { GameLogEntry } from '../types/game';

interface GameLogProps {
  entries: GameLogEntry[];
}

const logTypeStyles: Record<GameLogEntry['type'], string> = {
  system: 'text-slate-300',
  movement: 'text-cyan',
  purchase: 'text-gold',
  rent: 'text-rose-200',
  event: 'text-emerald-200',
  quiz: 'text-violet-200',
  regulation: 'text-orange-200',
  win: 'text-gold',
};

export function GameLog({ entries }: GameLogProps) {
  const visibleEntries = [...entries].slice(-8).reverse();

  return (
    <section className="panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">Game log</h2>
        <span className="text-xs font-bold text-slate-500">{entries.length} entries</span>
      </div>
      <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1 text-sm">
        {visibleEntries.length > 0 ? (
          visibleEntries.map((entry) => (
            <li className="rounded-md border border-white/10 bg-oil/50 p-2" key={entry.id}>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-black uppercase ${logTypeStyles[entry.type]}`}>{entry.type}</span>
                <span className="text-[10px] font-bold text-slate-600">R{entry.round}</span>
              </div>
              <p className="mt-1 leading-5 text-slate-300">{entry.message}</p>
            </li>
          ))
        ) : (
          <li className="text-slate-400">Game đã sẵn sàng.</li>
        )}
      </ul>
    </section>
  );
}
