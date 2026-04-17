import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  GitBranch,
  Layers,
  Library,
  Network,
  BookOpenText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  axes,
  fragments,
  glossary,
  decisionMap,
  SAQ_TYPES,
  meta,
  axisMeta,
} from "@/data/saq-knowledge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAQ Atlas — PCI DSS v4.0.1 Applicability Knowledge Base" },
      {
        name: "description",
        content:
          "Browse the PCI DSS v4.0.1 SAQ applicability knowledge base. Decision tree, 33 knowledge fragments, 9 SAQ types, glossary, and cross-reference index.",
      },
    ],
  }),
  component: Home,
});

const TILES = [
  {
    to: "/decision",
    icon: GitBranch,
    title: "Decision Tree",
    body: "Six-step interactive wizard from merchant level to final SAQ type with rationale.",
    cta: "Start the wizard",
  },
  {
    to: "/knowledge",
    icon: Layers,
    title: "Knowledge Explorer",
    body: "All knowledge fragments organized along seven semantic axes, filterable and cross-linked.",
    cta: "Browse fragments",
  },
  {
    to: "/saq-types",
    icon: Library,
    title: "SAQ Types",
    body: "Side-by-side comparison of all nine SAQ types: channels, control counts, eligibility.",
    cta: "Compare SAQs",
  },
  {
    to: "/reference",
    icon: Network,
    title: "Cross-Reference",
    body: "Look up by SAQ type, by topic, or by PCI DSS requirement number.",
    cta: "Open the index",
  },
  {
    to: "/glossary",
    icon: BookOpenText,
    title: "Glossary",
    body: "Essential PCI DSS acronyms and their definitions, with source references.",
    cta: "Read glossary",
  },
] as const;

function Home() {
  const stats = [
    { v: SAQ_TYPES.length, l: "SAQ types" },
    { v: fragments.length, l: "Knowledge fragments" },
    { v: axes.length, l: "Semantic axes" },
    { v: decisionMap.steps.length, l: "Decision steps" },
    { v: glossary.length, l: "Glossary terms" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-14 lg:py-20">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid lg:grid-cols-12 gap-10 items-end"
      >
        <div className="lg:col-span-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-rule bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <Sparkles className="size-3" />
            {meta.standard_version} · effective {meta.effective_date}
          </div>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-ink">
            A working atlas of{" "}
            <span className="italic text-primary">PCI DSS SAQ</span>{" "}
            applicability for e-commerce merchants.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft leading-relaxed">
            {meta.title}. Walk a structured decision tree, read the underlying
            rationale across seven semantic axes, and cross-reference everything
            back to its source — Council standard, brand programs, and the
            January 2025 SAQ A revision.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/decision"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Start the decision tree
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/knowledge"
              className="inline-flex items-center gap-2 rounded-md border border-rule bg-card px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-strong transition-colors"
            >
              Browse the knowledge
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-4 paper rounded-2xl p-6">
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            What's new
          </div>
          <div className="mt-2 font-serif text-xl text-ink leading-snug">
            SAQ A v4.0.1 r1 — January 2025
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            Fewer controls (~24) but a higher bar: merchants using iframes must
            now confirm whole-site script protection per FAQ 1588 — or fall to
            SAQ A-EP and ~140 requirements.
          </p>
          <Link
            to="/knowledge"
            className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-2"
          >
            Read the analysis
            <ArrowRight className="size-3.5" />
          </Link>
        </aside>
      </motion.section>

      {/* Stats */}
      <section className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div
            key={s.l}
            className="paper rounded-lg p-5 text-center"
          >
            <div className="font-serif text-3xl text-ink">{s.v}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {s.l}
            </div>
          </div>
        ))}
      </section>

      {/* Tiles */}
      <section className="mt-20">
        <div className="flex items-end justify-between mb-6 gap-4">
          <h2 className="font-serif text-2xl text-ink">Explore</h2>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Five entry points
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group paper rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="size-5" />
                </div>
                <h3 className="font-serif text-lg text-ink">{t.title}</h3>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{t.body}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                {t.cta}
                <ArrowRight className="size-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Axes preview */}
      <section className="mt-20">
        <h2 className="font-serif text-2xl text-ink mb-6">
          Seven semantic axes
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {axes.map((a) => {
            const m = axisMeta[a.id];
            return (
              <Link
                to="/knowledge"
                key={a.id}
                className="paper rounded-lg p-4 hover:bg-surface-strong transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${m.dotClass}`} />
                  <span className="font-serif text-base text-ink">
                    {m.label}
                  </span>
                  <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                    {a.fragments.length}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {a.axis_label}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
