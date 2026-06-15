export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:px-8">
        <span className="font-display font-semibold text-ink">
          LLMs Play Wordle
        </span>
        <span>
          A daily benchmark of language models on the day's Wordle.
        </span>
      </div>
    </footer>
  );
}
