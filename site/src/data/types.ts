export type TileResult = "correct" | "present" | "absent";

export interface Tile {
  letter: string;
  result: TileResult;
}

export interface Guess {
  word: string;
  thinking: string | null;
  tiles: Tile[];
}

export interface Game {
  id: number;
  date: string;
  model: string;
  modelLabel: string;
  provider: string;
  attempts: number;
  win: boolean;
  costUsd: number;
  durationMs: number;
  reflection: string | null;
  guesses: Guess[];
  /** The target word, if the game was won (final correct guess). */
  answer: string | null;
}

export interface GamesData {
  generatedAt: string;
  games: Game[];
}
