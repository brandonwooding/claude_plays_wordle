import { useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import architectureDiagram from "../assets/architecture.png";

/* TODO: drop a square photo at `site/public/portrait.jpg` to replace the
   initials placeholder, and fill in the real profile URLs below. */
const socials: { name: string; href: string; icon: ComponentType<IconProps> }[] =
  [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/brandonwooding/", icon: LinkedInIcon },
    { name: "X", href: "https://x.com/brandonmarkusw", icon: XIcon },
    { name: "GitHub", href: "https://github.com/brandonwooding", icon: GitHubIcon },
  ];

const headingClass =
  "text-sm font-bold uppercase tracking-[0.2em] text-muted";

export default function About() {
  return (
    <article className="mx-auto max-w-3xl py-10 sm:py-14">
      {/* 1 — Creator */}
      <section className="fade-up">
        <h1 className={headingClass}>About the creator</h1>
        <div className="mt-4 flex items-stretch gap-4">
          <Portrait />
          <div>
            <p className="text-md leading-tight text-ink">
              Brandon Wooding
            </p>
            <p className="text-sm text-muted">
              AI Postgrad @ Imperial College London
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              {socials.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-white text-muted transition-colors hover:border-correct hover:text-correct"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2 — The project */}
      <Section heading="About the project">
        <p>
          I love Wordle; I play it every day. There's a small sense of
          intellectual satisfaction I get from completing the Wordle —
          especially in three attempts or fewer. I also love AI; I use it every
          day, and I'm sure we all still marvel at its capacity. Out of hubris,
          and in an attempt to justify the satisfaction I get from completing
          the Wordle, I wanted to see how well LLM-based agents can solve the
          puzzle.
        </p>
        <p>
          As a developer, I also wanted to get experience with new agentic
          frameworks — in this case, the Claude Agent SDK. There are other
          frameworks and models I'd like to test as a potential expansion on
          this project. In the strictest sense, the one I used is somewhat
          inappropriate for the task at hand, but I'll discuss that in a more
          personal, technical reflection{" "}
          <span className="text-muted">(coming soon)</span>.
        </p>
        <p>
          For now, I'll simply thank you for checking this out. If you find it
          interesting,{" "}
          <a href="#sponsor" className="font-semibold text-correct hover:underline">
            sponsor some tokens
          </a>
          !
        </p>
      </Section>

      {/* 3 — Support */}
      <Section id="sponsor" heading="Sponsor tokens">
        <p>
          A typical run costs around $1 right now. If there's interest in seeing
          more models play, that could go up a little — but regardless, it
          doesn't take much to sponsor a run. I love the project, but I'm just a
          student, so a little support to keep it going would be much
          appreciated.
        </p>
        <p>
          You'll get your name featured on the site for the day(s) you've
          sponsored, and you can share a message with me — feedback or requests.
          Every cent goes straight to tokens for this project (minus the cents
          Stripe takes as a fee).
        </p>
        <SponsorCard />
      </Section>

      {/* 4 — Architecture */}
      <Section heading="Under the hood">
        <p>
          The project began as an exercise to practise with the Claude Agent
          SDK. Here's how the pieces fit together. There are two agents: the{" "}
          <strong className="font-semibold text-ink">Wordle Player</strong> and
          the{" "}
          <strong className="font-semibold text-ink">Strategy Reviewer</strong>.
        </p>

        <figure className="my-2">
          <div className="overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-card sm:p-6">
            <img
              src={architectureDiagram}
              alt="Architecture diagram: a script launches the browser; the Wordle Player plays using the check_game_state and play_word tools, guided by game-strategy.md; it produces game-summary.json, which the Strategy Reviewer reads to refine the strategy."
              className="mx-auto w-full max-w-2xl"
            />
          </div>
          <figcaption className="mt-3 text-center text-xs text-muted">
            The two-agent loop — the Wordle Player plays; the Strategy Reviewer
            learns and refines the strategy.
          </figcaption>
        </figure>

        <p>
          A script launches a browser and navigates to Wordle, then the Wordle
          Player begins its agent loop. It has access to two tools —{" "}
          <Code>check_game_state</Code> and <Code>play_word</Code> — and
          typically cycles through checking state, thinking, and playing a word.
        </p>
        <p>
          A game strategy is appended to each call as an appendix to the system
          prompt, describing basic game dynamics and best practices. A very
          simple initial strategy was set; the Strategy Reviewer updates this
          document after each game.
        </p>
        <p>
          When the Wordle Player finishes its run, a script compiles the game
          into a structured summary. The Strategy Reviewer picks up that
          summary, reflects on the game, finds improvements, and writes updates
          to the strategy document — changing how the Wordle Player approaches
          the next run.
        </p>
        <p>
          The game summary and the reflection are captured in a database and
          presented on this site.
        </p>
        <p>
          Ultimately, while it's a fun result, this might be an unnecessary use
          of the Claude Agent SDK — it may have been better suited as a workflow
          built in another framework. More on that in the technical reflection.
        </p>

        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-correct hover:underline"
        >
          ← Back to the leaderboard
        </Link>
      </Section>
    </article>
  );
}

/* ── Building blocks ─────────────────────────────────────────────── */

function Section({
  id,
  heading,
  children,
}: {
  id?: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mt-10 scroll-mt-24 border-t border-line pt-10"
    >
      <h2 className={headingClass}>{heading}</h2>
      <div className="mt-5 flex flex-col gap-5 text-base leading-relaxed text-ink/80">
        {children}
      </div>
    </section>
  );
}

function Portrait() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex w-20 shrink-0 select-none items-center justify-center self-stretch rounded-xl bg-correct font-display text-2xl font-black text-white">
        BW
      </div>
    );
  }

  return (
    <div className="w-20 shrink-0 self-stretch overflow-hidden rounded-xl bg-tile/40">
      <img
        src="/portrait.png"
        alt="Brandon Wooding"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}

function SponsorCard() {
  const presets = [1, 5, 10];
  const [selected, setSelected] = useState<number | "custom">(5);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState("");

  const amount =
    selected === "custom" ? Math.max(0, Math.floor(Number(custom) || 0)) : selected;

  function handleSubmit() {
    // The message + amount are gathered here, on the site, then handed to the
    // backend BEFORE redirecting — Stripe Checkout has no multi-line message
    // field, so the message rides along as session metadata:
    //
    //   const res = await fetch("/api/create-checkout-session", {
    //     method: "POST",
    //     body: JSON.stringify({ amount, message }),
    //   });
    //   const { url } = await res.json();   // session created with metadata.message
    //   window.location.href = url;          // Stripe collects card + name/email
    //
    // A Stripe webhook then persists { name, message, amount, date } once the
    // payment succeeds, and the name gets featured on the leaderboard.
  }

  return (
    <div className="mt-2 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7">
      {/* Message */}
      <label
        htmlFor="sponsor-message"
        className="text-xs font-bold uppercase tracking-[0.15em] text-muted"
      >
        Message (optional)
      </label>
      <textarea
        id="sponsor-message"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="A note, some feedback, or a model you'd like to see play…"
        className="mt-2 w-full resize-none rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none"
      />

      {/* Amount */}
      <div className="mt-5">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted">
          Amount
        </span>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {presets.map((p) => (
            <AmountButton
              key={p}
              active={selected === p}
              onClick={() => setSelected(p)}
            >
              ${p}
            </AmountButton>
          ))}
          <AmountButton
            active={selected === "custom"}
            onClick={() => setSelected("custom")}
          >
            Custom
          </AmountButton>
        </div>
        {selected === "custom" && (
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
              $
            </span>
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Other amount"
              className="w-full rounded-md border border-line bg-paper py-2 pl-7 pr-3 text-sm text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={amount < 1}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-correct px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-correct/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue to payment{amount >= 1 ? ` · $${amount}` : ""}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        You'll be redirected to Stripe to pay. Your name and message are saved
        once the payment succeeds. (Integration coming soon.)
      </p>
    </div>
  );
}

function AmountButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-10 rounded-md border text-sm font-semibold transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-line text-ink hover:border-absent"
      }`}
    >
      {children}
    </button>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-tile/60 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
      {children}
    </code>
  );
}

/* ── Icons ───────────────────────────────────────────────────────── */

type IconProps = { className?: string };

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  );
}

function GitHubIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}
