import type { EventCard } from '../types/game';

interface EventModalProps {
  event: EventCard | null;
  onApply: () => void;
}

export function EventModal({ event, onApply }: EventModalProps) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-oil/80 px-4 py-8 backdrop-blur-md">
      <section className="w-full max-w-2xl rounded-lg border border-cyan/30 bg-midnight p-6 shadow-glow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan">Event Card</p>
            <h2 className="mt-3 text-3xl font-black text-white">{event.title}</h2>
          </div>
          <span className="rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-sm font-black text-gold">
            Market Shock
          </span>
        </div>

        <div className="mt-6 grid gap-4">
          <InfoBlock label="Sự kiện" tone="cyan">
            {event.description}
          </InfoBlock>
          <InfoBlock label="Tác động gameplay" tone="gold">
            {event.effect}
          </InfoBlock>
          <InfoBlock label="Diễn giải lý thuyết" tone="slate">
            {event.theoryConnection}
          </InfoBlock>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="primary-button" onClick={onApply} type="button">
            Áp dụng sự kiện
          </button>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ children, label, tone }: { children: string; label: string; tone: 'cyan' | 'gold' | 'slate' }) {
  const toneClass =
    tone === 'cyan'
      ? 'border-cyan/25 bg-cyan/10 text-cyan'
      : tone === 'gold'
        ? 'border-gold/25 bg-gold/10 text-gold'
        : 'border-white/10 bg-oil/60 text-slate-300';

  return (
    <article className={`rounded-lg border p-4 ${toneClass}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-2 text-base leading-7 text-slate-100">{children}</p>
    </article>
  );
}
