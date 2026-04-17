import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, BookOpenText, GitBranch, Layers, Network, Library } from "lucide-react";
import { fragments, glossary, SAQ_TYPES, axisMeta } from "@/data/saq-knowledge";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: BookOpenText },
  { to: "/decision", label: "Decision Tree", icon: GitBranch },
  { to: "/knowledge", label: "Knowledge", icon: Layers },
  { to: "/saq-types", label: "SAQ Types", icon: Library },
  { to: "/reference", label: "Reference", icon: Network },
  { to: "/glossary", label: "Glossary", icon: BookOpenText },
] as const;

type Hit = {
  kind: "fragment" | "glossary" | "saq";
  id: string;
  title: string;
  sub: string;
  to: string;
  params?: Record<string, string>;
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hits: Hit[] = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const out: Hit[] = [];
    for (const f of fragments) {
      if (
        f.title.toLowerCase().includes(term) ||
        f.body.toLowerCase().includes(term) ||
        f.id.includes(term)
      ) {
        out.push({
          kind: "fragment",
          id: f.id,
          title: f.title,
          sub: `${axisMeta[f.axis].label} · ${f.id}`,
          to: "/knowledge",
        });
      }
    }
    for (const g of glossary) {
      if (
        g.term.toLowerCase().includes(term) ||
        g.key.toLowerCase().includes(term) ||
        g.definition.toLowerCase().includes(term)
      ) {
        out.push({
          kind: "glossary",
          id: g.key,
          title: `${g.key} — ${g.term}`,
          sub: "Glossary",
          to: "/glossary",
        });
      }
    }
    for (const s of SAQ_TYPES) {
      if (
        s.code.toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term) ||
        s.summary.toLowerCase().includes(term)
      ) {
        out.push({
          kind: "saq",
          id: s.code,
          title: s.code,
          sub: s.name,
          to: "/saq-types",
        });
      }
    }
    return out.slice(0, 30);
  }, [q]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rule bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-serif text-[13px] font-semibold text-primary-foreground">
              §
            </div>
            <div className="leading-tight">
              <div className="font-serif text-[15px] font-semibold text-ink">
                SAQ Atlas
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                PCI DSS v4.0.1
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-ink hover:bg-surface-strong transition-colors data-[status=active]:text-ink data-[status=active]:bg-surface-strong data-[status=active]:font-medium"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-rule bg-surface px-3 py-1.5 text-sm text-muted-foreground hover:text-ink hover:bg-surface-strong transition-colors"
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Search…</span>
              <kbd className="hidden sm:inline font-mono text-[10px] text-muted-foreground/80 border border-rule rounded px-1.5 py-0.5">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        <div className="md:hidden border-t border-rule bg-background/85">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="shrink-0 px-2.5 py-1 rounded-md text-muted-foreground data-[status=active]:text-ink data-[status=active]:bg-surface-strong"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-xl border border-rule bg-card shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-rule px-4">
              <Search className="size-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search fragments, glossary terms, SAQ types…"
                className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="font-mono text-[10px] text-muted-foreground border border-rule rounded px-1.5 py-0.5">
                Esc
              </kbd>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {q.trim() === "" ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Type to search across the entire knowledge base.
                </div>
              ) : hits.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No matches.
                </div>
              ) : (
                <ul className="py-2">
                  {hits.map((h, i) => (
                    <li key={`${h.kind}-${h.id}-${i}`}>
                      <button
                        onClick={() => {
                          setOpen(false);
                          navigate({ to: h.to });
                          setTimeout(() => {
                            const el = document.getElementById(
                              h.kind === "fragment"
                                ? `fragment-${h.id}`
                                : h.kind === "glossary"
                                  ? `glossary-${h.id}`
                                  : `saq-${h.id.replace(/\s+/g, "-")}`,
                            );
                            el?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                            el?.classList.add("ring-2", "ring-ring");
                            setTimeout(
                              () => el?.classList.remove("ring-2", "ring-ring"),
                              1500,
                            );
                          }, 200);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-surface-strong flex items-start gap-3"
                      >
                        <span
                          className={cn(
                            "mt-1 font-mono text-[10px] uppercase rounded px-1.5 py-0.5 shrink-0",
                            h.kind === "fragment" &&
                              "bg-axis-knowledge/10 text-axis-knowledge",
                            h.kind === "glossary" &&
                              "bg-axis-truth/10 text-axis-truth",
                            h.kind === "saq" &&
                              "bg-axis-service/10 text-axis-service",
                          )}
                        >
                          {h.kind}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm text-ink truncate">
                            {h.title}
                          </span>
                          <span className="block text-xs text-muted-foreground truncate">
                            {h.sub}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
