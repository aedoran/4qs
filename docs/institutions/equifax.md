---
name: Equifax
slug: equifax
sector: finance/credit-reporting
type: company
jurisdiction: US
summary: "A consumer credit bureau. The people in its files are the product, not the customers."
last_reviewed: 2026-08-02
confidence: high
scorecard:
  incentives:   { rating: weak,    note: "Paid by lenders, not by the ~147M people whose files it holds.", sources: [cfpb-2019] }
  corrections:  { rating: weak,    note: "The 2017 breach surfaced through regulators and press; discipline came from settlements, not internal correction.", sources: [ftc-2019] }
  verification: { rating: partial, note: "Federally regulated and examined, but the breach exposed real gaps between oversight and practice.", sources: [ftc-2019] }
  exit:         { rating: absent,  by_design: false, note: "Consumers never chose Equifax and cannot leave it; there is nowhere to move your file.", sources: [cfpb-2019] }
flags: [you-are-the-product, regulator-only-discipline]
sources:
  ftc-2019:  "https://www.ftc.gov/news-events/news/press-releases/2019/07/equifax-pay-575-million-part-settlement-ftc-cfpb-states-related-2017-data-breach"
  cfpb-2019: "https://www.consumerfinance.gov/archive/newsroom/cfpb-ftc-states-announce-settlement-with-equifax-over-2017-data-breach/"
---

## Q1 · Incentives

Equifax's customers are lenders, insurers, and employers who buy access to consumer files. The roughly 147 million people described in those files are not customers and never signed up. That is the load-bearing structural fact: the incentive is to serve the buyers of data, and the people the data is about have no standing as customers. Who pays them, and for what, is public and boring, and it explains the behavior without reference to anyone's character.

## Q2 · Corrections

In 2017 Equifax exposed sensitive data on about 147 million people, including roughly 145 million Social Security numbers, after failing for four months to install a patch its own security team had flagged for installation within forty eight hours. The failure did not surface through any internal correction machinery. It surfaced through disclosure, regulators, and press, and the consequence arrived as a settlement rather than a fix the company caught itself.

## Q3 · Verification

Equifax operates under federal regulation and examination, which is real outside verification and is why this scores partial rather than weak. But the 2017 breach showed the gap between being examined and being secure: formal oversight existed and the failure still happened and still had to be caught after the fact.

## Q4 · Exit

There is no exit. A consumer cannot fire a credit bureau, because a consumer never hired one, and there is nowhere to move a file to. The settlement with the FTC, the CFPB, and fifty states and territories, at least $575 million and possibly up to $700 million, came entirely from regulators, attorneys general, and courts, not from customers leaving. Where exit does not exist, the entire burden of discipline falls on Questions 1 through 3 and on regulators.

## Timeline

- 2017-03 — Apache Struts vulnerability disclosed; Equifax's security team flags the patch (48-hour window).
- 2017-07 — Breach discovered internally; ~147M people affected.
- 2019-07 — Settlement with FTC, CFPB, and 50 states/territories announced (at least $575M).

## Corrections log

- 2026-08-02 — Created. Verification rated partial pending a closer look at post-2017 examination findings.
