import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a markdown string with GFM support (tables, strikethrough, etc.).
 * Styled via @tailwindcss/typography `prose`, toned down to match the muted
 * body copy. Wide tables scroll horizontally instead of overflowing the card.
 */
export default function Markdown({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <div
      className={`prose prose-sm max-w-none overflow-x-auto leading-relaxed text-current prose-headings:font-display prose-headings:text-ink prose-p:my-2 prose-p:text-current prose-a:text-correct prose-strong:text-ink prose-table:text-xs prose-th:text-ink prose-li:my-0.5 prose-hr:my-3 prose-hr:border-line first:[&>*]:mt-0 last:[&>*]:mb-0 ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
