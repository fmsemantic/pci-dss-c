import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  crossRef,
  fragmentsById,
  axisMeta,
  type Fragment,
} from "@/data/saq-knowledge";
import { FragmentCard } from "@/components/FragmentCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Cross-Reference — SAQ Atlas" },
      {
        name: "description",
        content:
          "Look up PCI DSS SAQ knowledge by SAQ type, by topic, or by PCI DSS requirement number.",
      },
      { property: "og:title", content: "Cross-Reference Index — SAQ Atlas" },
    ],
  }),
  component: ReferencePage,
});

type Tab = "saq" | "topic" | "req";

function humanize(s: string) {
  return s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ReferencePage() {
  const [tab, setTab] = useState<Tab>("saq");

  const groups: { key: string; label: string; ids: string[] }[] = useMemo(() => {
    const src =
      tab === "saq"
        ? crossRef.by_saq_type
        : tab === "topic"
          ? crossRef.by_topic
          : crossRef.by_pci_dss_requirement;
    return Object.entries(src).map(([k, ids]) => ({
      key: k,
      label: tab === "topic" ? humanize(k) : k,
      ids,
    }));
  }, [tab]);

  const [selected, setSelected] = useState<string>(
    Object.keys(crossRef.by_saq_type)[0],
  );

  const activeKey = useMemo(() => {
    if (groups.find((g) => g.key === selected)) return selected;
    return groups[0]?.key ?? "";
  }, [groups, selected]);

  const active = groups.find((g) => g.key === activeKey);
  const items: Fragment[] =
    active?.ids.map((id) => fragmentsById[id]).filter(Boolean) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
      <header className="mb-8">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Index
        </div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-ink">
          Cross-Reference
        </h1>
        <p className="mt-2 max-w-3xl text-ink-soft">
          Three ways to navigate the same body of knowledge — by SAQ type, by
          topic, or by individual PCI DSS requirement number.
        </p>
      </header>

      <div className="mb-6 inline-flex rounded-lg border border-rule bg-surface p-1">
        {(
          [
            { id: "saq", label: "By SAQ type" },
            { id: "topic", label: "By topic" },
            { id: "req", label: "By PCI DSS requirement" },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              const first = Object.keys(
                t.id === "saq"
                  ? crossRef.by_saq_type
                  : t.id === "topic"
                    ? crossRef.by_topic
                    : crossRef.by_pci_dss_requirement,
              )[0];
              setSelected(first ?? "");
            }}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm transition-colors",
              tab === t.id
                ? "bg-card text-ink shadow-sm"
                : "text-muted-foreground hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 lg:self-start paper rounded-xl p-3 max-h-[70vh] overflow-y-auto">
          <ul className="space-y-0.5">
            {groups.map((g) => {
              const isActive = g.key === activeKey;
              return (
                <li key={g.key}>
                  <button
                    onClick={() => setSelected(g.key)}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-ink hover:bg-surface-strong",
                    )}
                  >
                    <span className="truncate">{g.label}</span>
                    <span
                      className={cn(
                        "font-mono text-[10px]",
                        isActive
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground",
                      )}
                    >
                      {g.ids.length}
                    </span>
                    {isActive && <ChevronRight className="size-3.5" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex items-baseline gap-2">
            <h2 className="font-serif text-2xl text-ink">
              {active?.label ?? "—"}
            </h2>
            <span className="text-sm text-muted-foreground">
              · {items.length} linked fragment{items.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid gap-4">
            {items.length === 0 && (
              <div className="paper rounded-xl p-8 text-center text-muted-foreground">
                No fragments linked to this entry.
              </div>
            )}
            {items.map((f) => (
              <FragmentCard key={f.id} fragment={f} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

void axisMeta;
