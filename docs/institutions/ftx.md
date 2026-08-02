---
name: FTX
slug: ftx
sector: finance/crypto-exchange
type: company
jurisdiction: Bahamas / US
summary: "A crypto exchange optimized for person trust, with almost none of the controls that hold other people's money."
last_reviewed: 2026-08-02
confidence: high
scorecard:
  incentives:   { rating: weak,    note: "Customer assets were commingled with and lent to the affiliated trading firm Alameda, setting the exchange's incentives against the customers whose funds it held.", sources: [ray-testimony] }
  corrections:  { rating: absent,  note: "By the sworn account of the man who cleaned it up, there was no board of directors and virtually none of the expected controls; problems surfaced only when withdrawals spiked and the firm collapsed.", sources: [ray-testimony] }
  verification: { rating: absent,  note: "No reliable audit or outside verification that customer assets were actually there; sophisticated investors relied on the founder's reputation instead of checks.", sources: [ray-testimony] }
  exit:         { rating: partial, note: "Customers could withdraw and other exchanges existed, but exit worked only until the run exposed the shortfall and withdrawals froze.", sources: [ray-testimony] }
flags: [no-controls, commingled-funds]
sources:
  ray-testimony: "https://democrats-financialservices.house.gov/uploadedfiles/hhrg-117-ba00-wstate-rayj-20221213.pdf"
  ftx-recovery:  "https://www.cryptotimes.io/2026/07/31/ftx-creditors-105-recovery-why-exchanges-clients-are-getting-more-than-they-lost/"
---

## Q1 · Incentives

What FTX had instead of controls was a founder optimized for person trust: the rumpled genius who did not care about money and slept on a beanbag. Underneath, customer funds were commingled with and lent to Alameda, the affiliated trading firm. That structure pointed the exchange's incentives directly against the customers it was supposed to safeguard, whatever anyone's stated intentions.

## Q2 · Corrections

There was nothing to correct with, because there was almost nothing there. By the sworn testimony of John J. Ray III, who took over in bankruptcy, FTX had no board and virtually none of the systems a firm holding other people's assets is expected to run. Nothing surfaced internally; the failure appeared all at once, as a run.

## Q3 · Verification

This is the third question failing completely. There was no dependable outside audit of whether customer assets existed. Journalists, politicians, and sophisticated investors extended trust on the strength of reputation and vibes, which is exactly the signal a fraud can produce cheaply. When it came apart, internal messages put the hole at about $8.1 billion.

The essay flags this as its shakiest number, and so should this page: the bankruptcy estate later recovered enough to repay customers in dollar terms, and some scholars dispute the $8 billion figure. The shortfall on the day the withdrawals came was real; a later bull market disguising it is not a defense of the design. See [ftx-recovery].

## Q4 · Exit

Nominally there was exit: customers could withdraw, and rival exchanges existed. In practice exit held only until the shortfall was exposed, at which point withdrawals froze and the option vanished. An exit that closes exactly when you need it is not a reliable one.

## Timeline

- 2022-11 — Withdrawal run; FTX files for bankruptcy.
- 2022-12 — John J. Ray III testifies to the absence of corporate controls.

## Corrections log

- 2026-08-02 — Created. The $8.1B shortfall figure is flagged as contested per the essay's own standard.
