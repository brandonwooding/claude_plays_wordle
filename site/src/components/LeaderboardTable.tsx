import type { Game } from "../data/types";
import type { ModelAverage } from "../lib/leaderboard";
import { RankTile } from "./Tile";
import {
  formatAvgPlays,
  formatCost,
  formatResult,
  formatSuccessRate,
} from "../lib/leaderboard";

const ROW_GRID =
  "grid grid-cols-[1fr_auto] items-center gap-4 sm:grid-cols-[1fr_auto_1fr]";

const STATS_GRID =
  "hidden sm:grid sm:grid-cols-[6.5rem_5rem_4.5rem] sm:justify-end sm:gap-4";

export default function LeaderboardTable({
  games,
  averages,
  selectedId,
  onSelect,
}: {
  games: Game[];
  averages: Record<string, ModelAverage>;
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  if (games.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line py-12 text-center text-muted">
        No games recorded for this date.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Column headings */}
      <div
        className={`${ROW_GRID} px-4 pb-1 text-[11px] font-bold uppercase tracking-widest text-muted`}
      >
        <div className="flex items-center gap-4">
          <span className="w-10 text-center sm:w-11">Rank</span>
          <span>Model</span>
        </div>
        <span className="hidden text-center sm:block">Result</span>
        <div className={STATS_GRID}>
          <span className="text-center">Avg guesses</span>
          <span className="text-center">Avg cost</span>
          <span className="text-center">Win rate</span>
        </div>
      </div>

      {games.map((game, i) => {
        const selected = game.id === selectedId;
        const top = i === 0;
        const avg = averages[game.model];
        return (
          <button
            key={game.id}
            type="button"
            onClick={() => onSelect(game.id)}
            aria-pressed={selected}
            className={`${ROW_GRID} fade-up rounded-xl border bg-white px-4 py-3.5 text-left transition-all duration-150 hover:-translate-y-px hover:shadow-card ${
              selected
                ? "border-ink shadow-card"
                : "border-line hover:border-absent/50"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Rank + model */}
            <div className="flex min-w-0 items-center gap-4">
              <RankTile rank={i + 1} top={top} />
              <div className="min-w-0">
                <div className="truncate font-display text-[17px] font-bold leading-tight">
                  {game.modelLabel}
                </div>
                <div className="text-xs font-medium text-muted">
                  {game.provider}
                </div>
              </div>
            </div>

            {/* Compact summary for mobile */}
            <div className="text-right sm:hidden">
              <div className="font-bold tabular-nums">
                {formatResult(game)}
              </div>
              <div className="text-xs text-muted">
                {avg ? formatSuccessRate(avg.successRate) : "—"} success
              </div>
            </div>

            {/* Result (centred) */}
            <div className="hidden text-center sm:block">
              <span
                className={`font-bold tabular-nums ${
                  game.win ? "text-ink" : "text-absent"
                }`}
              >
                {formatResult(game)}
              </span>
            </div>

            {/* Average stats */}
            <div className={STATS_GRID}>
              <div className="text-center font-medium tabular-nums text-muted">
                {avg ? formatAvgPlays(avg.avgPlays) : "—"}
              </div>
              <div className="text-center font-medium tabular-nums text-muted">
                {avg ? formatCost(avg.avgCost) : "—"}
              </div>
              <div className="text-center font-medium tabular-nums text-muted">
                {avg ? formatSuccessRate(avg.successRate) : "—"}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
