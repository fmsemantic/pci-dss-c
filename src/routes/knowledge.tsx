import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  axes,
  axisMeta,
  fragmentsById,
  severityMeta,
  type AxisId,
  type Severity,
} from "@/data/saq-knowledge";
import { FragmentCard } from "@/components/FragmentCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Explorer — SAQ Atlas" },
      {
        name: "description",
        content:
          "Browse all PCI DSS SAQ knowledge fragments by semantic axis, severity, or full-text search. Cross-linked rationale.",
      },
      { property: "og:title", content: "Knowledge Explorer — SAQ Atlas" },
    ],
  }),
  component: KnowledgePage,
});

const SEVS: Severity[] = ["critical", "high", "medium", "low"];

function KnowledgePage() {
  const [activeAxes, setActiveAxes] = useState<Set<AxisId>>(new Set());
  const [activeSevs, setActiveSevs] = useState<Set<Severity>>(new Set());
  const [q, setQ] = useState("");

  const allFragments = useMemo(
    () => axes.flatMap((a) => a.fragments),
    [],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return allFragments.filter((f) => {
      if (activeAxes.size && !activeAxes.has(f.axis)) return false;
      if (
        activeSevs.size &&
        (!f.severity || !activeSevs.has(f.severity))
      )
        return false;
      if (term) {
        const hay = `${f.title} ${f.body} ${f.id}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [q, activeAxes, activeSevs, allFragments]);

  const toggle = <T,>(set: Set<T>, v: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setter(next);
  };

  const clearAll = () => {
    setActiveAxes(new Set());
    setActiveSevs(new Set());
    setQ("");
  };

  const jump = (id: string) => {
    const el = document.getElementById(`fragment-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    el?.classList.add("ring-2", "ring-ring");
    setTimeout(() => el?.classList.remove("ring-2", "ring-ring"), 1500);
  };

  const grouped = useMemo(() => {
    const g = new Map<AxisId, typeof filtered>();
    for (const f of filtered) {
      if (!g.has(f.axis)) g.set(f.axis, []);
      g.get(f.axis)!.push(f);
    }
    return g;
  }, [filtered]);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
      <header className="mb-8">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {filtered.length} of {allFragments.length} fragments
        </div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-ink">
          Knowledge Explorer
        </h1>
        <p className="mt-2 max-w-3xl text-ink-soft">
          Every fragment is anchored to a semantic axis and links to related
          fragments. Filter, search, then click any chip to jump.
        </p>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search fragments…"
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

          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              Axis
            </div>
            <div className="flex flex-wrap gap-1.5">
              {axes.map((a) => {
                const m = axisMeta[a.id];
                const on = activeAxes.has(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggle(activeAxes, a.id, setActiveAxes)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors",
                      on
                        ? m.tagClass
                        : "border-rule bg-card text-muted-foreground hover:bg-surface-strong",
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", m.dotClass)} />
                    {m.label}
                    <span className="font-mono text-[10px] opacity-70">
                      {a.fragments.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              Severity
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SEVS.map((s) => {
                const on = activeSevs.has(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggle(activeSevs, s, setActiveSevs)}
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs transition-colors",
                      on
                        ? severityMeta[s].className
                        : "border-rule bg-card text-muted-foreground hover:bg-surface-strong",
                    )}
                  >
                    {severityMeta[s].label}
                  </button>
                );
              })}
            </div>
          </div>

          {(activeAxes.size || activeSevs.size || q) && (
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-ink underline-offset-2 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </aside>

        <div className="min-w-0 space-y-12">
          {grouped.size === 0 && (
            <div className="paper rounded-xl p-12 text-center text-muted-foreground">
              No fragments match your filters.
            </div>
          )}
          {axes.map((a) => {
            const items = grouped.get(a.id);
            if (!items?.length) return null;
            const m = axisMeta[a.id];
            return (
              <section key={a.id}>
                <div className="mb-4 flex items-baseline gap-3">
                  <span
                    className={cn("h-2.5 w-2.5 rounded-full", m.dotClass)}
                  />
                  <h2 className="font-serif text-2xl text-ink">{m.label}</h2>
                  <span className="text-sm text-muted-foreground">
                    {a.axis_label}
                  </span>
                  <span className="ml-auto font-mono text-[11px] uppercase text-muted-foreground">
                    {items.length} fragment{items.length === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mb-4 max-w-3xl text-sm text-ink-soft">
                  {a.axis_purpose}
                </p>
                <div className="grid gap-4">
                  {items.map((f) => (
                    <FragmentCard key={f.id} fragment={f} onJump={jump} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

void fragmentsById;
