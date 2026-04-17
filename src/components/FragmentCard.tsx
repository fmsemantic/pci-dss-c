import {
  axisMeta,
  fragmentsById,
  severityMeta,
  sourcesById,
  type Fragment,
} from "@/data/saq-knowledge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Quote, Link2 } from "lucide-react";

export function FragmentCard({
  fragment,
  onJump,
  defaultExpanded = true,
}: {
  fragment: Fragment;
  onJump?: (id: string) => void;
  defaultExpanded?: boolean;
}) {
  const ax = axisMeta[fragment.axis];
  return (
    <article
      id={`fragment-${fragment.id}`}
      className="paper rounded-xl p-6 scroll-mt-28 transition-shadow hover:shadow-sm"
    >
      <header className="flex flex-wrap items-start gap-3 mb-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
            ax.tagClass,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", ax.dotClass)} />
          {ax.label}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {fragment.id}
        </span>
        {fragment.severity && (
          <span
            className={cn(
              "ml-auto rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase",
              severityMeta[fragment.severity].className,
            )}
          >
            {severityMeta[fragment.severity].label}
          </span>
        )}
      </header>

      <h3 className="font-serif text-xl text-ink leading-snug">
        {fragment.title}
      </h3>

      {defaultExpanded && (
        <>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/85">
            {fragment.body}
          </p>

          {fragment.cause && fragment.effect && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-rule bg-surface p-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Cause
                </div>
                <div className="mt-1 text-sm text-ink">{fragment.cause}</div>
              </div>
              <div className="rounded-lg border border-rule bg-surface p-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Effect
                </div>
                <div className="mt-1 text-sm text-ink">{fragment.effect}</div>
              </div>
            </div>
          )}

          {fragment.citations?.map((c, i) => (
            <blockquote
              key={i}
              className="mt-4 border-l-2 border-accent pl-4 py-1 text-sm italic text-ink/80"
            >
              <Quote className="inline-block size-3 mr-1 -mt-1 text-accent-foreground/50" />
              "{c.text}"
              <footer className="not-italic mt-1 font-mono text-[11px] text-muted-foreground">
                {sourcesById[c.source]?.title ?? c.source}
                {c.section ? ` · ${c.section}` : ""}
              </footer>
            </blockquote>
          ))}

          {(fragment.refs?.length || fragment.links_to?.length) && (
            <footer className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-rule">
              {fragment.refs?.map((r) => (
                <span
                  key={r}
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground rounded border border-rule px-1.5 py-0.5"
                  title={sourcesById[r]?.title ?? r}
                >
                  {r}
                </span>
              ))}
              {fragment.links_to?.length ? (
                <span className="ml-auto flex flex-wrap items-center gap-1.5">
                  <Link2 className="size-3 text-muted-foreground" />
                  {fragment.links_to.map((l) => {
                    const target = fragmentsById[l];
                    return (
                      <button
                        key={l}
                        onClick={() => onJump?.(l)}
                        className="group inline-flex items-center gap-1 rounded-md bg-surface-strong px-2 py-0.5 text-[11px] text-ink hover:bg-accent transition-colors"
                        title={target?.title}
                      >
                        <span className="font-mono">{l}</span>
                        <ArrowUpRight className="size-3 opacity-50 group-hover:opacity-100" />
                      </button>
                    );
                  })}
                </span>
              ) : null}
            </footer>
          )}
        </>
      )}
    </article>
  );
}
