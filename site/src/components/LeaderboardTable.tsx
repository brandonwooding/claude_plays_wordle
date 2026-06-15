import type { Game } from "../data/types";
import { RankTile } from "./Tile";
import { formatCost, formatDuration, formatResult } from "../lib/leaderboard";

const ROW_GRID =
  "grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:grid-cols-[auto_1fr_5rem_4.5rem_5rem]";

export default function LeaderboardTable({
  games,
  selectedId,
  onSelect,
}: {
  games: Game[];
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
        <span>Rank</span>
        <span>Model</span>
        <span className="hidden text-right sm:block">Result</span>
        <span className="hidden text-right sm:block">Cost</span>
        <span className="hidden text-right sm:block">Time</span>
      </div>

      {games.map((game, i) => {
        const selected = game.id === selectedId;
        const top = i === 0;
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
            <RankTile rank={i + 1} top={top} />

            <div className="min-w-0">
              <div className="truncate font-display text-[17px] font-bold leading-tight">
                {game.modelLabel}
              </div>
              <div className="text-xs font-medium text-muted">
                {game.provider}
              </div>
            </div>

            {/* Compact result for mobile */}
            <div className="text-right sm:hidden">
              <div className="font-bold tabular-nums">
                {formatResult(game)}
              </div>
              <div className="text-xs text-muted">{formatCost(game.costUsd)}</div>
            </div>

            <div className="hidden text-right sm:block">
              <span
                className={`font-bold tabular-nums ${
                  game.win ? "text-ink" : "text-absent"
                }`}
              >
                {formatResult(game)}
              </span>
            </div>
            <div className="hidden text-right font-semibold tabular-nums text-ink sm:block">
              {formatCost(game.costUsd)}
            </div>
            <div className="hidden text-right font-medium tabular-nums text-muted sm:block">
              {formatDuration(game.durationMs)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
