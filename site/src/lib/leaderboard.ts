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

export interface ModelAverage {
  avgPlays: number | null; // null when the model has never won
  avgCost: number;
  successRate: number; // 0..1
}

/**
 * All-time per-model aggregates, keyed by `model`:
 * - avgPlays: mean attempts across won games only (failures excluded)
 * - avgCost: mean cost across every game
 * - successRate: wins / total games
 */
export function modelAverages(games: Game[]): Record<string, ModelAverage> {
  const byModel = new Map<string, Game[]>();
  for (const g of games) {
    const list = byModel.get(g.model);
    if (list) list.push(g);
    else byModel.set(g.model, [g]);
  }

  const out: Record<string, ModelAverage> = {};
  for (const [model, list] of byModel) {
    const wins = list.filter((g) => g.win);
    out[model] = {
      avgPlays: wins.length
        ? wins.reduce((s, g) => s + g.attempts, 0) / wins.length
        : null,
      avgCost: list.reduce((s, g) => s + g.costUsd, 0) / list.length,
      successRate: wins.length / list.length,
    };
  }
  return out;
}

export function formatAvgPlays(avg: number | null): string {
  return avg == null ? "—" : avg.toFixed(1);
}

export function formatSuccessRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
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

/** Today's date as YYYY-MM-DD in local time. */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "3/6" for a win, "X / 6" for a loss. */
export function formatResult(game: Game): string {
  return game.win ? `${game.attempts}/6` : "X/6";
}
