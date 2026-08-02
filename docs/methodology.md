# Methodology

This wiki rates institutions on four structural questions from the essay. It does **not** rate character, sincerity, or intentions. Every rating must cite structural, checkable facts.

## The four questions

1. **Incentives** — Who pays them, and for what? What does the arrangement make profitable, punishable, or invisible?
2. **Corrections** — Can you see the mistakes and the corrections? Do errors surface, and do they get fixed in the open?
3. **Verification** — Can someone outside verify the claims? Is there real, independent checking, and has anyone actually done it?
4. **Exit** — Can you leave? Are there real alternatives at a reasonable switching cost?

## No overall score

Each question gets its own rating. They are **never** summed or averaged into an overall grade. Two reasons:

- A composite manufactures precision the evidence does not support.
- Some sound institutions score "no exit" *by design* — a central bank, a court, a sole regulator. Averaging would misrank them. Absence of exit by design is not a failure; it shifts the weight onto the other three questions.

Read four separate answers, each with its evidence. That is the whole comparability model.

## Rating scale

Four levels per question, anchored to what an outsider can observe.

| | **Strong** | **Partial** | **Weak** | **Absent** |
|---|---|---|---|---|
| **Incentives** | funding fully public; conflicts disclosed | main payers known, edge flows opaque | funding obscured; takes digging | deliberately hidden principals |
| **Corrections** | published corrections log / independent incident reports; errors surface internally | discloses some errors, reactively | errors surface mainly via leaks, lawsuits, or press | suppresses errors; retaliates against internal reporting |
| **Verification** | independent verifier (not paid by the subject); results public and current | audits exist but conflicted, stale, or private | self-attestation only | blocks outside inspection |
| **Exit** | real alternatives + low switching cost + portable records | alternatives exist but high lock-in | near-monopoly; nominal choice | captive; you are the product |

A fifth value, `unrated`, is used when the evidence is not yet gathered. An `unrated` cell needs no source; every other rating **requires at least one source** or the build fails.

### Exit "by design"

For a singular institution that cannot offer exit (central bank, court, sole regulator), set `by_design: true` on the exit entry. It renders as **None · by design**, not as a failure. The narrative should then explain how discipline is supplied instead — usually through Questions 1–3 plus external oversight.

## Flags

Reusable tags that surface the essay's anti-patterns across institutions. Use them in the `flags` list.

- `issuer-pays` — the party being rated pays for its own verification.
- `you-are-the-product` — the people affected are not the customers.
- `regulatory-capture` — the verifier is captured by the subject.
- `revolving-door` — staff rotate between subject and overseer.
- `passed-checks-but-failed` — cleared formal verification yet failed (verification was gameable).
- `lock-in-pitch` — loyalty framing used to raise exit costs.
- `sealed-settlements` — errors resolved privately, out of public view.

## Evidence standards

- **No rating without a citation.** Prefer primary sources (rulings, regulatory filings, audited reports, peer-reviewed papers) over coverage.
- **Contested numbers get a caveat inline**, next to the claim.
- **Structure, not adjectives.** "Paid by the issuers it rates" is evidence. "Seems trustworthy" is not.
- Every page carries a `last_reviewed` date and a **Corrections log** section for edits and disputes to that page.

## How a page is built

Each institution is one Markdown file in `docs/institutions/`. Structured data lives in YAML front matter (the `scorecard` and `sources`); the body holds the narrative. The build renders the scorecard, generates the index, and validates that every concrete rating cites a source that exists. See `docs/institutions/_template.md`.
