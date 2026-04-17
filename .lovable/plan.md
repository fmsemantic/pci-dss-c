

## PCI DSS SAQ Applicability — Interactive Knowledge Canvas

A modern, professional reference site for compliance practitioners to explore the uploaded knowledge base. Clean, document-inspired aesthetic (think Stripe Docs × Linear × Notion) with a focus on dense, navigable, cross-linked content.

### Information architecture (separate routes, SSR-friendly)

1. **Home (`/`)** — Hero introducing the knowledge base, key stats (SAQ types, fragments, decision steps), quick-entry tiles to the four main tools below, "what's new in v4.0.1 r1" highlight.
2. **Decision Tree (`/decision`)** — Interactive 6-step wizard that walks the user through merchant level → storage → server processing → TPSP → integration → script protection. Live progress sidebar showing path taken; final outcome card with required documents, control count, notes, and links to relevant fragments. Restart / back / share-path buttons.
3. **Knowledge Explorer (`/knowledge`)** — All ~30 content fragments browsable by the 7 semantic axes (Truth, Deep, Connect, Service, Knowledge, Evolution, Responsibility). Filter by axis, severity, or search text. Each fragment shows title, body, citations (with source refs), and clickable "links to" chips that jump to related fragments. Severity badges (critical/high/medium/low).
4. **SAQ Comparison (`/saq-types`)** — Side-by-side table/cards of all 9 SAQ types (A, A-EP, B, B-IP, C-VT, C, P2PE, SPoC, D) with channels, approximate requirement count, summary, and links to related fragments via the cross-reference index.
5. **Cross-Reference (`/reference`)** — Three lookup views: by SAQ type, by topic, by PCI DSS requirement. Click any entry to see the linked fragments inline.
6. **Glossary (`/glossary`)** — Searchable list of all terms (CHD, SAD, CDE, SAQ, ROC, AOC, TPSP, QSA, ISA, ASV, P2PE, CEE) with definitions and references. Terms also appear as hover tooltips throughout the site.

### Key UX features

- **Persistent header** with nav + global search across fragments, glossary, and SAQ types.
- **Fragment deep-linking**: every fragment has a stable anchor; "links_to" relationships render as clickable chips.
- **Decision-tree → fragment bridge**: each decision step surfaces its `fragment_links` so users can read the underlying rationale without leaving the flow.
- **Source attribution panel**: citations shown with publisher and section, sources listed on a dedicated about/footer area.
- **Disclaimer banner** on the decision tree (per the source's own disclaimer).
- **Responsive**, keyboard-navigable, accessible.

### Visual design

- Light, document-grade typography; serif accents for headings, clean sans for body.
- Restrained palette: deep navy primary, warm neutral background, amber/red severity accents.
- Card-based layouts with subtle borders, generous whitespace, monospace for IDs/refs.
- Subtle motion on tree progression and fragment expansion.

### Data layer

- Bundle the JSON as a typed module under `src/data/saq-knowledge.ts` (parsed once, exported with TypeScript interfaces for fragments, decision steps, outcomes, glossary, etc.).
- All filtering/search done client-side — dataset is small enough.
- Per-route SEO metadata in each route's `head()`.

