import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Info,
  Share2,
} from "lucide-react";
import {
  decisionMap,
  stepsById,
  outcomesById,
  fragmentsById,
  type DecisionStep,
} from "@/data/saq-knowledge";
import { FragmentCard } from "@/components/FragmentCard";

export const Route = createFileRoute("/decision")({
  head: () => ({
    meta: [
      { title: "Decision Tree — SAQ Atlas" },
      {
        name: "description",
        content:
          "Walk a six-step interactive decision tree to determine the appropriate PCI DSS SAQ type for an e-commerce merchant.",
      },
      { property: "og:title", content: "PCI DSS SAQ Decision Tree" },
      {
        property: "og:description",
        content:
          "Six-step interactive wizard from merchant level to SAQ outcome with full rationale.",
      },
    ],
  }),
  component: DecisionPage,
});

type Trail = { stepId: string; option: string; label: string }[];

function DecisionPage() {
  const [currentId, setCurrentId] = useState<string>(decisionMap.entry_point);
  const [trail, setTrail] = useState<Trail>([]);
  const [shareNote, setShareNote] = useState(false);

  const isOutcome = currentId.startsWith("outcome_");
  const step = !isOutcome ? stepsById[currentId] : undefined;
  const outcome = isOutcome ? outcomesById[currentId] : undefined;

  const reset = () => {
    setCurrentId(decisionMap.entry_point);
    setTrail([]);
  };
  const back = () => {
    if (trail.length === 0) return;
    const prev = trail[trail.length - 1];
    setTrail(trail.slice(0, -1));
    setCurrentId(prev.stepId);
  };

  const choose = (s: DecisionStep, optValue: string) => {
    const opt = s.options.find((o) => o.value === optValue);
    if (!opt) return;
    setTrail([
      ...trail,
      { stepId: s.id, option: opt.value, label: opt.label },
    ]);
    setCurrentId(opt.next);
  };

  const share = async () => {
    const path = [
      ...trail.map((t) => `${t.stepId}=${t.option}`),
      `current=${currentId}`,
    ].join("&");
    const url = `${window.location.origin}/decision?path=${encodeURIComponent(path)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareNote(true);
      setTimeout(() => setShareNote(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const fragmentLinks: string[] =
    (step?.fragment_links ?? outcome?.fragment_links ?? []).filter(
      (id) => fragmentsById[id],
    );

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
      <div className="mb-8">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Interactive
        </div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-ink">
          {decisionMap.title}
        </h1>
        <p className="mt-2 max-w-3xl text-ink-soft">{decisionMap.description}</p>
      </div>

      {/* Disclaimer */}
      <div className="mb-8 flex items-start gap-3 rounded-lg border border-sev-medium/40 bg-sev-medium/10 p-4 text-sm">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-sev-medium" />
        <div className="text-ink/85">
          <span className="font-medium text-ink">Disclaimer · </span>
          {decisionMap.disclaimer}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        {/* Main panel */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {step && (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="paper rounded-2xl p-6 sm:p-8"
              >
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Step {decisionMap.steps.findIndex((s) => s.id === step.id) + 1}{" "}
                  / {decisionMap.steps.length} · {step.id}
                </div>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl text-ink leading-tight">
                  {step.question}
                </h2>
                {step.context && (
                  <div className="mt-4 flex gap-3 rounded-lg bg-surface-strong p-4 text-sm text-ink-soft">
                    <Info className="mt-0.5 size-4 shrink-0 text-primary/70" />
                    <p>{step.context}</p>
                  </div>
                )}
                {step.ref && (
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Ref · {step.ref}
                  </div>
                )}
                <div className="mt-6 grid gap-2.5">
                  {step.options.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => choose(step, o.value)}
                      className="group flex items-start gap-4 rounded-xl border border-rule bg-card p-4 text-left hover:border-primary/40 hover:bg-surface-strong transition-colors"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rule group-hover:border-primary group-hover:bg-primary transition-colors">
                        <div className="h-2 w-2 rounded-full bg-transparent group-hover:bg-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-ink">{o.label}</div>
                        {o.description && (
                          <div className="mt-1 text-sm text-muted-foreground">
                            {o.description}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {outcome && (
              <motion.div
                key={outcome.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="paper rounded-2xl p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Outcome · {outcome.result_type}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink leading-tight">
                      {outcome.title}
                    </h2>
                  </div>
                </div>
                <p className="mt-5 text-[15px] text-ink-soft leading-relaxed">
                  {outcome.summary}
                </p>
                {outcome.approximate_controls && (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-rule bg-surface px-3 py-1.5 text-sm">
                    <span className="font-mono text-[11px] uppercase text-muted-foreground">
                      Approx. controls
                    </span>
                    <span className="text-ink">
                      {outcome.approximate_controls}
                    </span>
                  </div>
                )}
                {outcome.required_documents && (
                  <div className="mt-6">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                      Required documents
                    </div>
                    <ul className="space-y-1.5">
                      {outcome.required_documents.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-sm text-ink"
                        >
                          <FileText className="mt-0.5 size-4 shrink-0 text-primary/70" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {outcome.additional_notes && (
                  <div className="mt-6">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                      Notes
                    </div>
                    <ul className="space-y-1.5">
                      {outcome.additional_notes.map((n) => (
                        <li
                          key={n}
                          className="text-sm text-ink-soft border-l-2 border-rule pl-3"
                        >
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    <RotateCcw className="size-4" /> Start over
                  </button>
                  <Link
                    to="/saq-types"
                    className="inline-flex items-center gap-2 rounded-md border border-rule bg-card px-4 py-2 text-sm text-ink hover:bg-surface-strong"
                  >
                    Compare all SAQ types
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={back}
              disabled={trail.length === 0}
              className="inline-flex items-center gap-2 rounded-md border border-rule bg-card px-3 py-1.5 text-sm text-ink hover:bg-surface-strong disabled:opacity-40 disabled:hover:bg-card"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-md border border-rule bg-card px-3 py-1.5 text-sm text-ink hover:bg-surface-strong"
            >
              <RotateCcw className="size-4" /> Restart
            </button>
            <button
              onClick={share}
              className="inline-flex items-center gap-2 rounded-md border border-rule bg-card px-3 py-1.5 text-sm text-ink hover:bg-surface-strong"
            >
              <Share2 className="size-4" />
              {shareNote ? "Copied!" : "Share path"}
            </button>
          </div>

          {/* Linked fragments */}
          {fragmentLinks.length > 0 && (
            <section className="mt-10">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Underlying rationale
                  </div>
                  <h3 className="font-serif text-xl text-ink">
                    Why this {isOutcome ? "outcome" : "step"}
                  </h3>
                </div>
                <Link
                  to="/knowledge"
                  className="text-sm text-primary hover:underline"
                >
                  All fragments →
                </Link>
              </div>
              <div className="grid gap-4">
                {fragmentLinks.map((id) => (
                  <FragmentCard
                    key={id}
                    fragment={fragmentsById[id]}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Trail */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="paper rounded-xl p-5">
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
              Path so far
            </div>
            {trail.length === 0 && !isOutcome && (
              <div className="text-sm text-muted-foreground">
                Answer the first question to begin.
              </div>
            )}
            <ol className="space-y-3">
              {trail.map((t, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] text-primary">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase text-muted-foreground">
                      {t.stepId}
                    </div>
                    <div className="text-ink truncate">{t.label}</div>
                  </div>
                </li>
              ))}
              {isOutcome && outcome && (
                <li className="flex gap-3 text-sm pt-2 border-t border-rule">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="size-3" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase text-muted-foreground">
                      Result
                    </div>
                    <div className="font-medium text-ink">
                      {outcome.result_type}
                    </div>
                  </div>
                </li>
              )}
            </ol>
          </div>

          {/* Overlay rules */}
          <div className="paper rounded-xl p-5 mt-4">
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
              Overlay rules
            </div>
            <ul className="space-y-3">
              {decisionMap.overlay_rules.map((r) => (
                <li key={r.id} className="text-sm">
                  <div className="text-ink">{r.requirement}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    When: {r.applies_when}
                  </div>
                  {r.ref && (
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                      {r.ref}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

