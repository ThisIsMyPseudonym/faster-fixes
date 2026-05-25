import type { TableOfContents as Toc } from "fumadocs-core/toc";

export function TableOfContents({ headings }: { headings: Toc }) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="mb-8">
      <h2 className="mb-2 text-lg font-semibold tracking-wide uppercase">
        Table of contents
      </h2>
      <ul className="space-y-1">
        {headings.map((entry) => (
          <li
            key={entry.url}
            style={{ paddingLeft: `${(entry.depth - 2) * 12}px` }}
          >
            <a
              href={entry.url}
              className="text-muted-foreground hover:text-primary text-lg transition-colors"
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
