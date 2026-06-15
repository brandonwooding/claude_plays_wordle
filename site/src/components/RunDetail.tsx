import type { Game } from "../data/types";
import GameBoard from "./GameBoard";
import { formatCost, formatDuration, formatResult } from "../lib/leaderboard";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
        {label}
      </span>
      <span className="font-display text-lg font-bold tabular-nums">{value}</span>
    </div>
  );
}

export default function RunDetail({
  game,
  isBest,
}: {
  game: Game;
  isBest: boolean;
}) {
  return (
    <section
      key={game.id}
      className="fade-up overflow-hidden rounded-2xl border border-line bg-white shadow-card"
    >
      <div className="flex flex-col gap-4 border-b border-line bg-paper/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-display text-2xl font-bold leading-none">
              {game.modelLabel}
            </h3>
            {isBest && (
              <span className="rounded-full bg-correct px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                Best run
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            {game.provider}
            {game.answer && (
              <>
                {" · Answer "}
                <span className="font-bold tracking-widest text-correct">
                  {game.answer}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-8">
          <Stat
            label={game.win ? "Solved in" : "Result"}
            value={formatResult(game)}
          />
          <Stat label="Cost" value={formatCost(game.costUsd)} />
          <Stat label="Time" value={formatDuration(game.durationMs)} />
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted">
            Guesses &amp; reasoning
          </h4>
          {!game.win && (
            <span className="text-xs font-semibold text-absent">
              Did not solve
            </span>
          )}
        </div>
        <GameBoard game={game} />

        {game.reflection && (
          <div className="mt-7 rounded-xl border border-line bg-paper/60 p-4">
            <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted">
              Reflection
            </h4>
            <p className="text-sm leading-relaxed text-ink/80">
              {game.reflection}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
