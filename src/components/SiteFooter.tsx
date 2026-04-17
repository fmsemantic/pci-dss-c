import { sources, meta } from "@/data/saq-knowledge";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule bg-surface">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-serif text-lg text-ink">SAQ Atlas</div>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            An interactive knowledge canvas for PCI DSS Self-Assessment
            Questionnaire applicability for e-commerce merchants.
          </p>
          <div className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Standard {meta.standard_version} · Effective{" "}
            {meta.effective_date} · Updated {meta.last_updated}
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
            Primary sources
          </div>
          <ul className="space-y-2 text-sm">
            {sources.map((s) => (
              <li key={s.id} className="flex flex-wrap gap-x-2">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink hover:text-primary underline-offset-2 hover:underline"
                  >
                    {s.title}
                  </a>
                ) : (
                  <span className="text-ink">{s.title}</span>
                )}
                <span className="text-muted-foreground">— {s.publisher}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-4 text-xs text-muted-foreground">
          Reference resource only. Final SAQ determination must be validated
          by your acquirer in accordance with applicable payment brand
          programs.
        </div>
      </div>
    </footer>
  );
}
