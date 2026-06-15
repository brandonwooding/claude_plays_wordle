import { useState } from "react";
import type { Game, Guess } from "../data/types";
import { FeedbackTile } from "./Tile";

function GuessRow({ guess, rowIndex }: { guess: Guess; rowIndex: number }) {
  const [expanded, setExpanded] = useState(false);
  const long = (guess.thinking?.length ?? 0) > 220;

  return (
    <li className="flex flex-col gap-3 border-b border-line/70 pb-5 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:gap-6">
      <div className="flex shrink-0 items-center gap-2">
        <span className="w-5 text-right text-xs font-bold tabular-nums text-muted">
          {rowIndex + 1}
        </span>
        <div className="flex gap-1.5">
          {guess.tiles.map((tile, ti) => (
            <FeedbackTile
              key={ti}
              letter={tile.letter}
              result={tile.result}
              index={rowIndex * 5 + ti}
            />
          ))}
        </div>
      </div>

      {guess.thinking ? (
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm leading-relaxed text-muted ${
              long && !expanded ? "line-clamp-3" : ""
            }`}
          >
            {guess.thinking}
          </p>
          {long && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-bold uppercase tracking-wide text-correct hover:underline"
            >
              {expanded ? "Show less" : "Show full reasoning"}
            </button>
          )}
        </div>
      ) : (
        <p className="flex-1 text-sm italic text-muted/70 sm:pt-2">
          No reasoning recorded.
        </p>
      )}
    </li>
  );
}

export default function GameBoard({ game }: { game: Game }) {
  return (
    <ol className="flex flex-col gap-5">
      {game.guesses.map((guess, gi) => (
        <GuessRow key={gi} guess={guess} rowIndex={gi} />
      ))}
    </ol>
  );
}
