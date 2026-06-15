import { useMemo, useState } from "react";
import gamesData from "../data/games.json";
import type { GamesData } from "../data/types";
import { allDates, gamesForDate, formatDate } from "../lib/leaderboard";
import DatePicker from "../components/DatePicker";
import LeaderboardTable from "../components/LeaderboardTable";
import RunDetail from "../components/RunDetail";

const data = gamesData as unknown as GamesData;

export default function Leaderboard() {
  const dates = useMemo(() => allDates(data.games), []);
  const [date, setDate] = useState(dates[0] ?? "");

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
      <section className="pb-10 pt-14 text-center sm:pt-20">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-correct">
          Daily AI Benchmark
        </p>
        <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
          LLMs Play <span className="italic">Wordle</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Every day, language models take on the day's Wordle. Here's who guessed
          sharpest — and how they reasoned their way there.
        </p>
      </section>

      {/* Leaderboard */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Leaderboard</h2>
            <p className="text-sm text-muted">
              Standings for {formatDate(date)}
            </p>
          </div>
          <DatePicker dates={dates} value={date} onChange={changeDate} />
        </div>

        <LeaderboardTable
          games={ranked}
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
