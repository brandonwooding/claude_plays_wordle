import type { TileResult } from "../data/types";

const feedbackClasses: Record<TileResult, string> = {
  correct: "bg-correct",
  present: "bg-present",
  absent: "bg-absent",
};

/** A single Wordle feedback tile (a letter coloured by its result). */
export function FeedbackTile({
  letter,
  result,
  index = 0,
}: {
  letter: string;
  result: TileResult;
  index?: number;
}) {
  return (
    <div
      className={`tile-pop flex h-10 w-10 select-none items-center justify-center rounded-md text-base font-extrabold uppercase text-white sm:h-11 sm:w-11 sm:text-lg ${feedbackClasses[result]}`}
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {letter}
    </div>
  );
}

/**
 * The rank square in the leaderboard. Grey by default; green for the day's
 * top model (rank 1) — mirroring the green of a solved Wordle.
 */
export function RankTile({ rank, top }: { rank: number; top: boolean }) {
  return (
    <div
      className={`flex h-10 w-10 select-none items-center justify-center rounded-md text-base font-extrabold sm:h-11 sm:w-11 sm:text-lg ${
        top ? "bg-correct text-white" : "bg-tile text-ink"
      }`}
    >
      {rank}
    </div>
  );
}
