import { useEffect, useMemo, useRef, useState } from 'react';
import { avatars } from '../data/avatars';
import { backgroundMusicTracks, defaultBackgroundMusicTrackId, type BackgroundMusicTrack } from '../data/backgroundMusic';
import type { BackgroundMusicMode, GameState } from '../types/game';
import { createInitialGameState } from '../utils/gameLogic';
import { PlayerAvatar } from './PlayerAvatar';

interface PlayerSetupProps {
  onBack: () => void;
  onStart: (gameState: GameState) => void;
}

interface PlayerFormState {
  name: string;
  avatarId: string;
  backgroundMusicTrackId: string;
}

const defaultPlayers: PlayerFormState[] = [
  { name: 'Player 1', avatarId: avatars[0].id, backgroundMusicTrackId: backgroundMusicTracks[0]?.id ?? defaultBackgroundMusicTrackId },
  { name: 'Player 2', avatarId: avatars[1].id, backgroundMusicTrackId: backgroundMusicTracks[1]?.id ?? defaultBackgroundMusicTrackId },
  { name: 'Player 3', avatarId: avatars[2].id, backgroundMusicTrackId: backgroundMusicTracks[2]?.id ?? defaultBackgroundMusicTrackId },
  { name: 'Player 4', avatarId: avatars[3].id, backgroundMusicTrackId: backgroundMusicTracks[3]?.id ?? defaultBackgroundMusicTrackId },
];

export function PlayerSetup({ onBack, onStart }: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<PlayerFormState[]>(defaultPlayers);
  const [backgroundMusicMode, setBackgroundMusicMode] = useState<BackgroundMusicMode>('shared');
  const [sharedBackgroundMusicTrackId, setSharedBackgroundMusicTrackId] = useState(defaultBackgroundMusicTrackId);
  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState('');

  const activePlayers = useMemo(() => players.slice(0, playerCount), [playerCount, players]);
  const selectedAvatarIds = useMemo(() => activePlayers.map((player) => player.avatarId), [activePlayers]);

  const updatePlayerName = (index: number, name: string) => {
    setPlayers((current) => current.map((player, itemIndex) => (itemIndex === index ? { ...player, name } : player)));
    setError('');
  };

  const updatePlayerAvatar = (index: number, avatarId: string) => {
    const isTaken = activePlayers.some((player, itemIndex) => itemIndex !== index && player.avatarId === avatarId);
    if (isTaken) {
      setError('Avatar này đã có người chơi khác chọn.');
      return;
    }

    setPlayers((current) => current.map((player, itemIndex) => (itemIndex === index ? { ...player, avatarId } : player)));
    setError('');
  };

  const updatePlayerMusic = (index: number, backgroundMusicTrackId: string) => {
    setPlayers((current) => current.map((player, itemIndex) => (itemIndex === index ? { ...player, backgroundMusicTrackId } : player)));
  };

  useEffect(() => {
    return () => {
      previewAudioRef.current?.pause();
    };
  }, []);

  const stopPreview = () => {
    previewAudioRef.current?.pause();
    previewAudioRef.current = null;
    setPreviewingTrackId(null);
  };

  const previewTrack = (trackId: string) => {
    const track = backgroundMusicTracks.find((item) => item.id === trackId);
    if (!track) return;

    if (previewingTrackId === track.id) {
      stopPreview();
      return;
    }

    previewAudioRef.current?.pause();
    const previewAudio = new Audio(track.filePath);
    previewAudio.volume = 0.5;
    previewAudioRef.current = previewAudio;
    previewAudio.play()
      .then(() => setPreviewingTrackId(track.id))
      .catch(() => setPreviewingTrackId(null));
    previewAudio.addEventListener('ended', () => setPreviewingTrackId(null), { once: true });
  };

  const handleStart = () => {
    const normalizedNames = activePlayers.map((player) => player.name.trim().toLocaleLowerCase());
    const hasEmptyName = normalizedNames.some((name) => name.length === 0);
    if (hasEmptyName) {
      setError('Tên người chơi không được để trống.');
      return;
    }

    if (new Set(normalizedNames).size !== normalizedNames.length) {
      setError('Tên người chơi không được trùng nhau.');
      return;
    }

    if (new Set(selectedAvatarIds).size !== selectedAvatarIds.length) {
      setError('Avatar người chơi không được trùng nhau.');
      return;
    }

    stopPreview();

    const initialGameState = createInitialGameState(
      activePlayers.map((player, index) => {
        const selectedAvatar = avatars.find((avatar) => avatar.id === player.avatarId) ?? avatars[index];

        return {
          id: `player-${index + 1}`,
          name: player.name.trim(),
          avatar: selectedAvatar.imagePath,
          backgroundMusicTrackId: backgroundMusicMode === 'per-player' ? player.backgroundMusicTrackId : sharedBackgroundMusicTrackId,
        };
      }),
      {
        mode: backgroundMusicMode,
        sharedTrackId: sharedBackgroundMusicTrackId,
      },
    );

    onStart(initialGameState);
  };

  return (
    <section className="screen-shell space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">Setup</p>
          <h1 className="section-title mt-2">Thiết lập người chơi</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Chọn đội hình thuyết trình, đặt tên đại diện và ảnh nhân vật. Khi bắt đầu, hệ thống sẽ tạo
            trạng thái game ban đầu với vốn khởi nghiệp; ảnh hưởng, người dùng, dữ liệu, tài sản và điểm lý luận đều bắt đầu từ 0.
          </p>
        </div>
        <button className="secondary-button" onClick={onBack} type="button">
          Quay lại
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="panel h-fit space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">Số người chơi</h2>
            <p className="muted-text mt-2">Game hỗ trợ 2-4 người chơi trên cùng một thiết bị.</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[2, 3, 4].map((count) => (
              <button
                className={`rounded-md px-3 py-3 font-black transition ${
                  playerCount === count
                    ? 'bg-cyan text-oil shadow-glow'
                    : 'border border-white/10 bg-white/5 text-white hover:border-cyan/50'
                }`}
                key={count}
                onClick={() => {
                  setPlayerCount(count);
                  setError('');
                }}
                type="button"
              >
                {count}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-gold/30 bg-gold/10 p-4">
            <p className="text-sm font-bold text-gold">Mục tiêu chiến thắng</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Kiểm soát quyền lực thị trường, đạt điểm lý luận cao, hoặc dẫn đầu tổng điểm sau 25 vòng.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-white">Nhạc nền</p>
            <div className="mt-3 grid gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <input
                  checked={backgroundMusicMode === 'shared'}
                  name="background-music-mode"
                  onChange={() => setBackgroundMusicMode('shared')}
                  type="radio"
                />
                Dùng chung một bài
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <input
                  checked={backgroundMusicMode === 'per-player'}
                  name="background-music-mode"
                  onChange={() => setBackgroundMusicMode('per-player')}
                  type="radio"
                />
                Đổi theo lượt người chơi
              </label>
            </div>
            <MusicTrackPicker
              disabled={backgroundMusicMode !== 'shared'}
              id="shared-background-music-setup"
              onPreview={previewTrack}
              onTrackChange={setSharedBackgroundMusicTrackId}
              previewingTrackId={previewingTrackId}
              trackId={sharedBackgroundMusicTrackId}
              tracks={backgroundMusicTracks}
            />
          </div>

          <button className="primary-button w-full" onClick={handleStart} type="button">
            Bắt đầu game
          </button>
          {error && (
            <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200">
              {error}
            </p>
          )}
        </aside>

        <div className="grid gap-4 md:grid-cols-2">
          {activePlayers.map((player, index) => {
            const selectedAvatar = avatars.find((avatar) => avatar.id === player.avatarId) ?? avatars[0];

            return (
              <section className="panel" key={`player-${index + 1}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan">Người chơi {index + 1}</p>
                    <label className="mt-3 block text-sm font-bold text-slate-200" htmlFor={`player-${index + 1}`}>
                      Tên người chơi
                    </label>
                  </div>
                  <PlayerAvatar
                    alt={selectedAvatar.label}
                    className="h-14 w-14 rounded-lg border border-gold/40"
                    imagePath={selectedAvatar.imagePath}
                    label={selectedAvatar.label}
                  />
                </div>

                <input
                  className="mt-3 w-full rounded-md border border-white/10 bg-midnight px-3 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan"
                  id={`player-${index + 1}`}
                  onChange={(event) => updatePlayerName(index, event.target.value)}
                  placeholder={`Nhập tên người chơi ${index + 1}`}
                  type="text"
                  value={player.name}
                />

                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-200">Chọn ảnh nhân vật</p>
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8 md:grid-cols-4 xl:grid-cols-8">
                    {avatars.map((avatar) => {
                      const isSelected = player.avatarId === avatar.id;
                      const isTaken = selectedAvatarIds.includes(avatar.id) && !isSelected;

                      return (
                        <button
                          aria-label={avatar.label}
                          className={`relative grid h-11 w-full place-items-center rounded-md border text-xl transition ${
                            isSelected
                              ? 'border-gold bg-gold/20 shadow-gold'
                              : isTaken
                                ? 'cursor-not-allowed border-white/5 bg-white/[0.03] opacity-35'
                                : 'border-white/10 bg-white/5 hover:border-cyan/50'
                          }`}
                          disabled={isTaken}
                          key={avatar.id}
                          onClick={() => updatePlayerAvatar(index, avatar.id)}
                          title={isTaken ? 'Avatar đã được chọn' : avatar.label}
                          type="button"
                        >
                          <PlayerAvatar
                            alt={avatar.label}
                            className="h-8 w-8 rounded-md"
                            imagePath={avatar.imagePath}
                            label={avatar.label}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-bold text-slate-200" htmlFor={`player-music-${index + 1}`}>
                    Nhạc nền khi đến lượt
                  </label>
                  <MusicTrackPicker
                    disabled={backgroundMusicMode !== 'per-player'}
                    id={`player-music-${index + 1}`}
                    onPreview={previewTrack}
                    onTrackChange={(trackId) => updatePlayerMusic(index, trackId)}
                    previewingTrackId={previewingTrackId}
                    trackId={player.backgroundMusicTrackId}
                    tracks={backgroundMusicTracks}
                  />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface MusicTrackPickerProps {
  disabled: boolean;
  id: string;
  trackId: string;
  tracks: BackgroundMusicTrack[];
  previewingTrackId: string | null;
  onTrackChange: (trackId: string) => void;
  onPreview: (trackId: string) => void;
}

function MusicTrackPicker({ disabled, id, trackId, tracks, previewingTrackId, onTrackChange, onPreview }: MusicTrackPickerProps) {
  const selectedTrack = tracks.find((track) => track.id === trackId) ?? tracks[0];
  const isPreviewing = previewingTrackId === selectedTrack.id;

  return (
    <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
      <select
        className="min-w-0 rounded-md border border-white/10 bg-midnight px-3 py-3 text-white outline-none transition focus:border-cyan disabled:opacity-50"
        disabled={disabled}
        id={id}
        onChange={(event) => onTrackChange(event.target.value)}
        value={trackId}
      >
        {tracks.map((track) => (
          <option key={track.id} value={track.id}>
            {track.title}
          </option>
        ))}
      </select>
      <button
        className="secondary-button whitespace-nowrap px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={() => onPreview(selectedTrack.id)}
        type="button"
      >
        {isPreviewing ? 'Dừng' : 'Nghe thử'}
      </button>
    </div>
  );
}
