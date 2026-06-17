import { useMemo, useState } from "react";
import gamesData from "../data/games.json";
import type { GamesData } from "../data/types";
import {
  allDates,
  gamesForDate,
  modelAverages,
  formatDate,
  todayISO,
} from "../lib/leaderboard";
import HistoryMenu from "../components/HistoryMenu";
import LeaderboardTable from "../components/LeaderboardTable";
import RunDetail from "../components/RunDetail";

const data = gamesData as unknown as GamesData;

export default function Leaderboard() {
  const dates = useMemo(() => allDates(data.games), []);
  const averages = useMemo(() => modelAverages(data.games), []);
  const [date, setDate] = useState(dates[0] ?? "");

  const isToday = date === todayISO();
  const ranked = useMemo(() => gamesForDate(data.games, date), [date]);
  const [selectedId, setSelectedId] = useState<number | null>(
    ranked[0]?.id ?? null,
  );

  function changeDate(next: string) {
    setDate(next);
    setSelectedId(gamesForDate(data.games, next)[0]?.id ?? null);
  }

  const selected =
    ranked.find((g) => g.id === selectedId) ?? ranked[0] ?? null;
  const isBest = selected != null && selected.id === ranked[0]?.id;

  if (dates.length === 0) {
    return (
      <div className="py-24 text-center text-muted">
        No games have been recorded yet.
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="pb-8 pt-10 text-center sm:pt-12">
        <h1 className="font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
          Can you beat Claude at <span className="italic">Wordle</span>?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          A benchmark tracking the performance of LLM agents on Wordle daily —
          who did the best and what were they thinking.
        </p>
        {/* Hero footer: sponsor */}
        <div className="mx-auto mt-7 max-w-xl border-t border-line pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
            Today's tokens sponsored by
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">Brandon Wooding</p>
        </div>
      </section>

      {/* Leaderboard */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              {isToday ? "Leaderboard (Today)" : "Leaderboard"}
            </h2>
            <p className="text-sm text-muted">
              {isToday
                ? "Today's standings · all-time averages per model"
                : `Standings for ${formatDate(date)}`}
            </p>
          </div>
          <HistoryMenu dates={dates} value={date} onChange={changeDate} />
        </div>

        <LeaderboardTable
          games={ranked}
          averages={averages}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
        />
      </section>

      {/* Detail */}
      {selected && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl font-bold">
            Run details
          </h2>
          <RunDetail game={selected} isBest={isBest} />
        </section>
      )}
    </>
  );
}
