import raw from "./saq-knowledge.json";

export type AxisId =
  | "truth"
  | "deep"
  | "connect"
  | "service"
  | "knowledge"
  | "evolution"
  | "responsibility";

export type Severity = "critical" | "high" | "medium" | "low";

export interface Citation {
  text: string;
  source: string;
  section?: string;
}

export interface Fragment {
  id: string;
  title: string;
  body: string;
  refs?: string[];
  citations?: Citation[];
  links_to?: string[];
  severity?: Severity;
  decision_map_node?: string;
  is_primary_answer?: boolean;
  cause?: string;
  effect?: string;
  axis: AxisId;
}

export interface AxisGroup {
  id: AxisId;
  axis_label: string;
  axis_purpose: string;
  fragments: Fragment[];
}

export interface DecisionOption {
  value: string;
  label: string;
  description?: string;
  next: string;
}
export interface DecisionStep {
  id: string;
  question: string;
  context?: string;
  ref?: string;
  fragment_links?: string[];
  options: DecisionOption[];
}
export interface DecisionOutcome {
  id: string;
  result_type: string;
  title: string;
  summary: string;
  approximate_controls?: string;
  required_documents?: string[];
  additional_notes?: string[];
  fragment_links?: string[];
}
export interface OverlayRule {
  id: string;
  applies_when: string;
  requirement: string;
  ref?: string;
  fragment_links?: string[];
}

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  date?: string;
  effective_from?: string;
}

export interface GlossaryTerm {
  key: string;
  term: string;
  definition: string;
  ref?: string;
}

const data = raw as any;

export const meta = data.meta as {
  schema_version: string;
  title: string;
  standard_version: string;
  effective_date: string;
  last_updated: string;
  axes: AxisId[];
  sources: { primary: Source[] };
};

export const sources: Source[] = meta.sources.primary;

export const glossary: GlossaryTerm[] = Object.entries(data.glossary).map(
  ([key, v]: [string, any]) => ({ key, ...v }),
);

export const axisOrder: AxisId[] = [
  "truth",
  "deep",
  "connect",
  "service",
  "knowledge",
  "evolution",
  "responsibility",
];

export const axes: AxisGroup[] = axisOrder.map((id) => {
  const g = data.content_fragments[id];
  return {
    id,
    axis_label: g.axis_label,
    axis_purpose: g.axis_purpose,
    fragments: g.fragments.map((f: any) => ({ ...f, axis: id })),
  };
});

export const fragments: Fragment[] = axes.flatMap((a) => a.fragments);
export const fragmentsById: Record<string, Fragment> = Object.fromEntries(
  fragments.map((f) => [f.id, f]),
);

export const decisionMap = {
  title: data.decision_map.title as string,
  description: data.decision_map.description as string,
  version: data.decision_map.version as string,
  disclaimer: data.decision_map.disclaimer as string,
  entry_point: data.decision_map.entry_point as string,
  steps: data.decision_map.steps as DecisionStep[],
  outcomes: data.decision_map.outcomes as DecisionOutcome[],
  overlay_rules: (data.decision_map.overlay_rules ?? []) as OverlayRule[],
};

export const stepsById: Record<string, DecisionStep> = Object.fromEntries(
  decisionMap.steps.map((s) => [s.id, s]),
);
export const outcomesById: Record<string, DecisionOutcome> = Object.fromEntries(
  decisionMap.outcomes.map((o) => [o.id, o]),
);

export const crossRef = {
  by_saq_type: data.cross_reference_index.by_saq_type as Record<
    string,
    string[]
  >,
  by_topic: data.cross_reference_index.by_topic as Record<string, string[]>,
  by_pci_dss_requirement: data.cross_reference_index
    .by_pci_dss_requirement as Record<string, string[]>,
};

export const sourcesById: Record<string, Source> = Object.fromEntries(
  sources.map((s) => [s.id, s]),
);

export const axisMeta: Record<
  AxisId,
  { label: string; tone: string; tagClass: string; dotClass: string }
> = {
  truth: {
    label: "Truth",
    tone: "Foundations",
    tagClass: "bg-axis-truth/10 text-axis-truth border-axis-truth/30",
    dotClass: "bg-axis-truth",
  },
  deep: {
    label: "Deep",
    tone: "Boundaries",
    tagClass: "bg-axis-deep/10 text-axis-deep border-axis-deep/30",
    dotClass: "bg-axis-deep",
  },
  connect: {
    label: "Connect",
    tone: "Ecosystem",
    tagClass: "bg-axis-connect/10 text-axis-connect border-axis-connect/30",
    dotClass: "bg-axis-connect",
  },
  service: {
    label: "Service",
    tone: "Practical answer",
    tagClass: "bg-axis-service/10 text-axis-service border-axis-service/30",
    dotClass: "bg-axis-service",
  },
  knowledge: {
    label: "Knowledge",
    tone: "Critical findings",
    tagClass:
      "bg-axis-knowledge/10 text-axis-knowledge border-axis-knowledge/30",
    dotClass: "bg-axis-knowledge",
  },
  evolution: {
    label: "Evolution",
    tone: "Cause & effect",
    tagClass:
      "bg-axis-evolution/10 text-axis-evolution border-axis-evolution/30",
    dotClass: "bg-axis-evolution",
  },
  responsibility: {
    label: "Responsibility",
    tone: "Accountability",
    tagClass:
      "bg-axis-responsibility/10 text-axis-responsibility border-axis-responsibility/30",
    dotClass: "bg-axis-responsibility",
  },
};

export const severityMeta: Record<
  Severity,
  { label: string; className: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-sev-critical/10 text-sev-critical border-sev-critical/40",
  },
  high: {
    label: "High",
    className: "bg-sev-high/10 text-sev-high border-sev-high/40",
  },
  medium: {
    label: "Medium",
    className: "bg-sev-medium/15 text-sev-medium border-sev-medium/40",
  },
  low: {
    label: "Low",
    className: "bg-sev-low/10 text-sev-low border-sev-low/40",
  },
};

export const SAQ_TYPES: {
  code: string;
  name: string;
  channels: string;
  approxRequirements: string;
  summary: string;
}[] = [
  {
    code: "SAQ A",
    name: "Fully outsourced e-commerce",
    channels: "E-commerce (redirect or iframe + script protection)",
    approxRequirements: "~24",
    summary:
      "Card-not-present merchants who fully outsource CHD handling to compliant TPSPs and never store, process, or transmit CHD on their own systems.",
  },
  {
    code: "SAQ A-EP",
    name: "Partial outsourcing with merchant-controlled page",
    channels: "E-commerce (own page that affects payment, no CHD storage)",
    approxRequirements: "~140",
    summary:
      "E-commerce merchants whose website does not directly receive CHD but can impact the security of the payment transaction.",
  },
  {
    code: "SAQ B",
    name: "Imprint or standalone dial-out terminals",
    channels: "Card-present (no electronic storage)",
    approxRequirements: "~41",
    summary:
      "Merchants using only imprint machines or standalone, dial-out terminals with no electronic CHD storage.",
  },
  {
    code: "SAQ B-IP",
    name: "Standalone IP-connected PTS POI",
    channels: "Card-present (IP-connected approved devices)",
    approxRequirements: "~83",
    summary:
      "Merchants using only standalone, PTS-approved POI devices connected via IP, with no electronic CHD storage.",
  },
  {
    code: "SAQ C-VT",
    name: "Virtual terminal only",
    channels: "MOTO / virtual terminal",
    approxRequirements: "~79",
    summary:
      "Merchants who manually enter a single transaction at a time via a keyboard into an isolated virtual terminal hosted by a PCI DSS validated TPSP.",
  },
  {
    code: "SAQ C",
    name: "Payment application connected to internet",
    channels: "Card-present / MOTO (segmented systems)",
    approxRequirements: "~160",
    summary:
      "Merchants with payment application systems connected to the internet, no electronic CHD storage.",
  },
  {
    code: "SAQ P2PE",
    name: "PCI-listed P2PE solution",
    channels: "Card-present (validated P2PE)",
    approxRequirements: "~33",
    summary:
      "Merchants using only hardware payment terminals included in a PCI SSC-listed P2PE solution, no electronic CHD storage.",
  },
  {
    code: "SAQ SPoC",
    name: "PCI SPoC solution",
    channels: "Mobile / commercial off-the-shelf devices",
    approxRequirements: "~60",
    summary:
      "Merchants using a PCI SSC-listed Software-based PIN Entry on COTS (SPoC) solution.",
  },
  {
    code: "SAQ D",
    name: "All other merchants",
    channels: "Any not covered by the more specific SAQs",
    approxRequirements: "~330",
    summary:
      "Merchants not eligible for any other SAQ type — applies to most full PCI DSS requirements.",
  },
];

export const SAQ_BY_CODE: Record<string, (typeof SAQ_TYPES)[number]> =
  Object.fromEntries(SAQ_TYPES.map((s) => [s.code, s]));
