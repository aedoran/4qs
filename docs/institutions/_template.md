---
name: Institution Name
slug: institution-slug
sector: sector/subsector
type: company            # company | agency | platform | nonprofit | other
jurisdiction: US
summary: "One line. What it is and who it serves."
last_reviewed: 2026-01-01
confidence: medium       # high | medium | low
scorecard:
  incentives:   { rating: unrated, note: "", sources: [] }
  corrections:  { rating: unrated, note: "", sources: [] }
  verification: { rating: unrated, note: "", sources: [] }
  exit:         { rating: unrated, by_design: false, note: "", sources: [] }
flags: []
sources:
  # id: "https://..."
---

<!--
  Ratings: strong | partial | weak | absent | unrated
  Any rating other than `unrated` MUST list at least one source id that exists
  in the `sources` map below the scorecard, or the build fails.
  For a singular institution that cannot offer exit, set exit.by_design: true.
  See docs/methodology.md for the rubric.
  The scorecard and Sources list are generated — do not write them here.
  Write the narrative below.
-->

## Q1 · Incentives

Who pays them, and for what? What does the arrangement make profitable, punishable, or invisible?

## Q2 · Corrections

Notable errors, how they surfaced (internally, or only via leaks/lawsuits/press), and whether they were fixed in the open.

## Q3 · Verification

Who checks the claims from outside? Is the verifier independent, is the result public, is it current?

## Q4 · Exit

Are there real alternatives? What is the switching cost? Are records/data portable? If exit is impossible by design, say how discipline is supplied instead.

## Timeline

- YYYY-MM-DD — notable episode.

## Corrections log

- YYYY-MM-DD — created.
