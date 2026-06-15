import type { Game } from "../data/types";

/** Distinct dates present in the data, most recent first. */
export function allDates(games: Game[]): string[] {
  return [...new Set(games.map((g) => g.date))].sort((a, b) =>
    b.localeCompare(a),
  );
}

/**
 * Games played on a given date, ranked best-first:
 * wins before losses, then fewest attempts, then lowest cost.
 * Index 0 is the "best run of the day".
 */
export function gamesForDate(games: Game[], date: string): Game[] {
  return games
    .filter((g) => g.date === date)
    .sort((a, b) => {
      if (a.win !== b.win) return a.win ? -1 : 1;
      if (a.attempts !== b.attempts) return a.attempts - b.attempts;
      return a.costUsd - b.costUsd;
    });
}

export function formatCost(usd: number): string {
  if (usd >= 1) return `$${usd.toFixed(2)}`;
  return `$${usd.toFixed(3)}`;
}

export function formatDuration(ms: number): string {
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return `${minutes}m ${rest}s`;
}

/** "2026-06-15" -> "June 15, 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** "3/6" for a win, "X / 6" for a loss. */
export function formatResult(game: Game): string {
  return game.win ? `${game.attempts}/6` : "X/6";
}
