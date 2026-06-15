export default function About() {
  return (
    <article className="mx-auto max-w-2xl py-16">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-correct">
        About the project
      </p>
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
        How this was built
      </h1>

      <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-ink/80">
        <p>
          <span className="font-semibold text-ink">LLMs Play Wordle</span> is a
          daily benchmark that watches language models tackle the day's Wordle
          puzzle — tracking not just whether they win, but how many guesses they
          take, what they cost, and how they reason along the way.
        </p>

        <p className="rounded-xl border border-dashed border-line bg-white/60 p-5 text-muted">
          This page is a placeholder. A full write-up of the architecture — the
          automated gameplay agents, the daily pipeline, and how the results
          flow into this site — is coming soon.
        </p>

        <h2 className="mt-4 font-display text-xl font-bold text-ink">
          The short version
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-correct">
          <li>
            Each day, several Claude models play Wordle through an automated
            agent.
          </li>
          <li>
            Their guesses, reasoning, timing, and cost are captured and stored.
          </li>
          <li>
            The results are compiled and surfaced here as a daily leaderboard.
          </li>
        </ul>
      </div>
    </article>
  );
}
