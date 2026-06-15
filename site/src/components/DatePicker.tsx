import { formatDate } from "../lib/leaderboard";

export default function DatePicker({
  dates,
  value,
  onChange,
}: {
  dates: string[];
  value: string;
  onChange: (date: string) => void;
}) {
  return (
    <label className="flex items-center gap-2.5">
      <span className="text-xs font-bold uppercase tracking-widest text-muted">
        Date
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-lg border border-line bg-white py-2 pl-3.5 pr-9 text-sm font-semibold text-ink shadow-sm outline-none transition-colors hover:border-absent focus:border-ink"
        >
          {dates.map((d) => (
            <option key={d} value={d}>
              {formatDate(d)}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  );
}
