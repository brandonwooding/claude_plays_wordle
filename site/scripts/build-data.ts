/**
 * Build-time data step.
 *
 * Reads the committed SQLite database produced by the Python gameplay pipeline
 * and emits a clean, nested JSON file the React app imports at build time.
 * A React SPA can't read SQLite at runtime, and the dataset is tiny, so
 * bundling JSON is the simplest approach. Runs automatically via the npm
 * `predev` / `prebuild` hooks, so a daily DB commit + rebuild keeps the
 * site current.
 */
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Game, Guess, Tile, TileResult } from "../src/data/types.ts";

const here = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(here, "../../gameplay_scripts/database/wordle_ai_database.db");
const OUT_PATH = resolve(here, "../src/data/games.json");

/** Turn a model id like "claude-opus-4-8" into "Claude Opus 4.8". */
function modelLabel(model: string): string {
  const parts = model.split("-");
  const words: string[] = [];
  let numberRun: string[] = [];
  const flushNumbers = () => {
    if (numberRun.length) {
      words.push(numberRun.join("."));
      numberRun = [];
    }
  };
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      numberRun.push(part);
    } else {
      flushNumbers();
      words.push(part.charAt(0).toUpperCase() + part.slice(1));
    }
  }
  flushNumbers();
  return words.join(" ");
}

const RESULTS: Record<string, TileResult> = {
  correct: "correct",
  present: "present",
  absent: "absent",
};

function normaliseResult(raw: unknown): TileResult {
  const key = String(raw ?? "").toLowerCase();
  return RESULTS[key] ?? "absent";
}

type Row = Record<string, unknown>;

function buildGuesses(row: Row): Guess[] {
  const guesses: Guess[] = [];
  for (let n = 1; n <= 6; n++) {
    const word = row[`guess_${n}`];
    if (!word || typeof word !== "string" || word.trim() === "") continue;

    const tiles: Tile[] = [];
    for (let m = 1; m <= 5; m++) {
      const letter = row[`guess_${n}_letter_${m}`];
      if (letter == null || String(letter).trim() === "") continue;
      tiles.push({
        letter: String(letter).toUpperCase(),
        result: normaliseResult(row[`guess_${n}_letter_${m}_result`]),
      });
    }

    const thinkingRaw = row[`guess_${n}_thinking`];
    const thinking =
      typeof thinkingRaw === "string" && thinkingRaw.trim() !== ""
        ? thinkingRaw.trim()
        : null;

    guesses.push({ word: word.trim().toUpperCase(), thinking, tiles });
  }
  return guesses;
}

function toGame(row: Row): Game {
  const model = String(row.model ?? "unknown");
  const guesses = buildGuesses(row);
  const win = Number(row.win) === 1;

  const lastGuess = guesses[guesses.length - 1];
  const answer =
    win && lastGuess && lastGuess.tiles.every((t) => t.result === "correct")
      ? lastGuess.word
      : null;

  const reflectionRaw = row.reflection;
  const reflection =
    typeof reflectionRaw === "string" && reflectionRaw.trim() !== ""
      ? reflectionRaw.trim()
      : null;

  return {
    id: Number(row.id),
    date: String(row.date ?? ""),
    model,
    modelLabel: modelLabel(model),
    provider: "Anthropic",
    attempts: Number(row.attempts ?? guesses.length),
    win,
    costUsd: Number(row.cost_usd ?? 0),
    durationMs: Number(row.duration_ms ?? 0),
    reflection,
    guesses,
    answer,
  };
}

function main() {
  const db = new DatabaseSync(DB_PATH, { readOnly: true });
  const rows = db
    .prepare("SELECT * FROM game_results ORDER BY date DESC, id ASC")
    .all() as Row[];
  db.close();

  const games = rows.map(toGame);
  const payload = {
    generatedAt: new Date().toISOString(),
    games,
  };

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + "\n");

  console.log(
    `[build-data] wrote ${games.length} games -> ${OUT_PATH}`,
  );
}

main();
