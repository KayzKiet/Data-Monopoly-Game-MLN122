export type PageName = 'landing' | 'setup' | 'game' | 'theory' | 'result';

export type Era = 'oil' | 'data' | 'system';

export type TileType =
  | 'start'
  | 'oil-field'
  | 'refinery'
  | 'pipeline'
  | 'logistics'
  | 'search-platform'
  | 'social-network'
  | 'ecommerce-platform'
  | 'cloud-infrastructure'
  | 'ai-lab'
  | 'tax-regulation'
  | 'crisis'
  | 'event'
  | 'theory-quiz'
  | 'antitrust-investigation';

export interface Asset {
  id: string;
  name: string;
  tileId: string;
  type: Exclude<TileType, 'start' | 'tax-regulation' | 'crisis' | 'event' | 'theory-quiz' | 'antitrust-investigation'>;
  era: Exclude<Era, 'system'>;
  purchasePrice: number;
  baseRent: number;
  upgradeCost: number;
  level: number;
  maxLevel: number;
  theoryConnection: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  money: number;
  influence: number;
  users: number;
  data: number;
  theoryPoints: number;
  assets: Asset[];
  position: number;
  isInJail: boolean;
  underInvestigation: boolean;
}

export interface Tile {
  id: string;
  index: number;
  name: string;
  type: TileType;
  era: Era;
  description: string;
  asset?: Asset;
  fee?: number;
  quizId?: string;
  eventDeck?: 'chance' | 'crisis';
}

export interface EventCard {
  id: string;
  title: string;
  description: string;
  effect: string;
  theoryConnection: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  topic:
    | 'monopoly'
    | 'capital-accumulation'
    | 'capital-centralization'
    | 'resource-monopoly'
    | 'data-monopoly'
    | 'network-effect'
    | 'market-entry'
    | 'ai-data'
    | 'historic-limit';
}

export interface GameLogEntry {
  id: string;
  round: number;
  playerId?: string;
  message: string;
  type: 'system' | 'movement' | 'purchase' | 'rent' | 'event' | 'quiz' | 'regulation' | 'win';
  createdAt: string;
}

export interface GameState {
  players: Player[];
  tiles: Tile[];
  currentPlayerIndex: number;
  round: number;
  maxRounds: number;
  diceValue: number | null;
  selectedTileId: string | null;
  activeEventId: string | null;
  activeQuizId: string | null;
  winnerId: string | null;
  status: 'setup' | 'playing' | 'finished';
  log: GameLogEntry[];
}

export interface AvatarOption {
  id: string;
  icon: string;
  label: string;
}
