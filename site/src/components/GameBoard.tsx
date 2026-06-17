import { useLayoutEffect, useRef, useState } from "react";
import type { Game, Guess } from "../data/types";
import { FeedbackTile } from "./Tile";
import Markdown from "./Markdown";

// Collapsed reasoning height, in px. Kept in sync with the inline maxHeight
// below so overflow can be measured against the full content height in both
// the collapsed and expanded states.
const COLLAPSED_MAX = 120;

function GuessRow({ guess, rowIndex }: { guess: Guess; rowIndex: number }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Decide whether the reasoning is actually clipped by measuring the rendered
  // content height against the collapsed cap — not a brittle character count.
  // scrollHeight is the full content height regardless of expand state, so the
  // toggle stays visible after expanding (lets the user collapse again).
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => setOverflows(el.scrollHeight > COLLAPSED_MAX + 1);

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [guess.thinking]);

  const collapsed = !expanded;

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
          <div className="relative">
            <div
              ref={contentRef}
              className={`text-sm text-muted ${
                collapsed ? "overflow-hidden" : ""
              }`}
              style={collapsed ? { maxHeight: COLLAPSED_MAX } : undefined}
            >
              <Markdown>{guess.thinking}</Markdown>
            </div>
            {collapsed && overflows && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
          {overflows && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1.5 text-xs font-bold uppercase tracking-wide text-ink/60 transition-colors hover:text-ink hover:underline"
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
