export interface BackgroundMusicTrack {
  id: string;
  title: string;
  filePath: string;
}

export const backgroundMusicTracks: BackgroundMusicTrack[] = [
  {
    id: 'synthetic-deception',
    title: 'Synthetic Deception',
    filePath: '/sounds/joelfazhari-synthetic-deception-loopable-epic-cyberpunk-crime-music-157454.mp3',
  },
  {
    id: 'minstrels-return',
    title: 'The Minstrels Return',
    filePath: '/sounds/kaazoom-the-minstrels-return-loopable-fantasy-medieval-rpg-music-447849.mp3',
  },
  {
    id: 'sigma-background',
    title: 'Background Music',
    filePath: '/sounds/sigmamusicart-background-music-556016.mp3',
  },
  {
    id: 'mountain-background',
    title: 'Mountain Background',
    filePath: '/sounds/the_mountain-background-music-159125.mp3',
  },
  {
    id: 'mountain-upbeat',
    title: 'Mountain Upbeat',
    filePath: '/sounds/the_mountain-upbeat-background-483308.mp3',
  },
];

export const defaultBackgroundMusicTrackId = 'mountain-background';
