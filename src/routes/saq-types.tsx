import { createFileRoute, Link } from "@tanstack/react-router";
import {
  SAQ_TYPES,
  crossRef,
  fragmentsById,
  axisMeta,
} from "@/data/saq-knowledge";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/saq-types")({
  head: () => ({
    meta: [
      { title: "SAQ Types — SAQ Atlas" },
      {
        name: "description",
        content:
          "Side-by-side comparison of all nine PCI DSS Self-Assessment Questionnaire types: SAQ A, A-EP, B, B-IP, C-VT, C, P2PE, SPoC, D.",
      },
      { property: "og:title", content: "PCI DSS SAQ Types Compared" },
    ],
  }),
  component: SaqTypesPage,
});

function SaqTypesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
      <header className="mb-8">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Reference
        </div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-ink">
          SAQ Types Compared
        </h1>
        <p className="mt-2 max-w-3xl text-ink-soft">
          The nine SAQ paths defined by the PCI Security Standards Council. Each
          card links to the knowledge fragments that define its eligibility.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SAQ_TYPES.map((s) => {
          const linkedIds = crossRef.by_saq_type[s.code] ?? [];
          const linked = linkedIds
            .map((id) => fragmentsById[id])
            .filter(Boolean);
          return (
            <article
              key={s.code}
              id={`saq-${s.code.replace(/\s+/g, "-")}`}
              className="paper rounded-xl p-6 flex flex-col scroll-mt-28"
            >
              <header className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="font-serif text-2xl text-ink">{s.code}</div>
                  <div className="text-sm text-muted-foreground">{s.name}</div>
                </div>
                <span className="font-mono text-[11px] uppercase rounded border border-rule px-2 py-0.5 text-muted-foreground">
                  {s.approxRequirements}
                </span>
              </header>

              <div className="mt-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Channels
                </div>
                <div className="mt-0.5 text-sm text-ink">{s.channels}</div>
              </div>

              <p className="mt-4 text-sm text-ink-soft flex-1">{s.summary}</p>

              {linked.length > 0 && (
                <div className="mt-5 pt-4 border-t border-rule">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                    Related fragments
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {linked.map((f) => {
                      const m = axisMeta[f.axis];
                      return (
                        <Link
                          key={f.id}
                          to="/knowledge"
                          className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] hover:opacity-80 transition-opacity ${m.tagClass}`}
                          title={f.title}
                        >
                          {f.id}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-12 paper rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl text-ink">
            Not sure which SAQ applies?
          </h3>
          <p className="mt-1 text-sm text-ink-soft max-w-xl">
            Walk the six-step decision tree to determine the correct SAQ for
            your e-commerce setup.
          </p>
        </div>
        <Link
          to="/decision"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Open the decision tree <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
