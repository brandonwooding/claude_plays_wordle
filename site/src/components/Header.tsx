import { NavLink } from "react-router-dom";

const linkBase =
  "text-sm font-semibold tracking-wide transition-colors duration-150";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
        <NavLink to="/" className="group flex items-center gap-2.5">
          <span className="flex gap-1" aria-hidden>
            <span className="h-3.5 w-3.5 rounded-[3px] bg-correct" />
            <span className="h-3.5 w-3.5 rounded-[3px] bg-present" />
            <span className="h-3.5 w-3.5 rounded-[3px] bg-absent" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            LLMs Play{" "}
            <span className="italic font-black">Wordle</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "text-ink"
                  : "text-muted hover:text-ink"
              }`
            }
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? "text-ink" : "text-muted hover:text-ink"
              }`
            }
          >
            About
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
