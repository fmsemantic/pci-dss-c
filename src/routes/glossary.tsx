import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { glossary, sourcesById } from "@/data/saq-knowledge";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "Glossary — SAQ Atlas" },
      {
        name: "description",
        content:
          "PCI DSS glossary: CHD, SAD, CDE, SAQ, ROC, AOC, TPSP, QSA, ISA, ASV, P2PE, CEE — definitions and references.",
      },
      { property: "og:title", content: "PCI DSS Glossary — SAQ Atlas" },
    ],
  }),
  component: GlossaryPage,
});

function GlossaryPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return glossary;
    return glossary.filter(
      (g) =>
        g.key.toLowerCase().includes(t) ||
        g.term.toLowerCase().includes(t) ||
        g.definition.toLowerCase().includes(t),
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12">
      <header className="mb-8">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {filtered.length} of {glossary.length} terms
        </div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-ink">
          Glossary
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          The essential acronyms used throughout the PCI DSS standard and SAQ
          documentation.
        </p>
      </header>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search terms…"
          className="w-full rounded-md border border-rule bg-card pl-9 pr-9 py-2 text-sm outline-none focus:border-primary/40"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {filtered.map((g) => (
          <div
            key={g.key}
            id={`glossary-${g.key}`}
            className="paper rounded-xl p-5 scroll-mt-28"
          >
            <dt className="flex items-baseline gap-2">
              <span className="font-mono text-base font-semibold text-primary">
                {g.key}
              </span>
              <span className="font-serif text-base text-ink">— {g.term}</span>
            </dt>
            <dd className="mt-2 text-sm text-ink-soft leading-relaxed">
              {g.definition}
            </dd>
            {g.ref && (
              <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {g.ref}
              </div>
            )}
          </div>
        ))}
      </dl>

      {filtered.length === 0 && (
        <div className="paper rounded-xl p-8 text-center text-muted-foreground">
          No terms match.
        </div>
      )}
    </div>
  );
}

void sourcesById;
