# Leads Cleanup Pipeline

Turns the raw `leads.xlsx` (~26k rows from Serper) into a clean list of
reachable, relevance-gated vendor candidates ready for full enrichment and
import into the Supabase `vendors` table.

## Files

| Script | What it does | Input | Output |
|---|---|---|---|
| `01_dedup.py` | Dedupe by domain, keep best row, track which queries found each | `leads.xlsx` | `01_leads_deduped.xlsx` |
| `02_blocklist.py` | Drop domains already in Supabase + static block list + `.gov/.mil/.edu` TLDs | `01_leads_deduped.xlsx` | `02_leads_filtered.xlsx` + `02_leads_rejected.xlsx` |
| `03_reachability.py` | HTTP-check each site; drop dead; dedupe after redirects | `02_leads_filtered.xlsx` | `03_leads_live.xlsx` + `03_leads_dead.xlsx` |
| `03b_retry_403.py` | Retry 403-blocked sites with browser-realistic headers to recover Cloudflare-protected vendors | `03_leads_*.xlsx` | `03b_leads_*.xlsx` |
| `03_5_operator_check.py` | Heuristic regex score to reject self-storage facility operators (no LLM) | `03b_leads_live.xlsx` | `03_5_vendor_candidates.xlsx` + `03_5_likely_operators.xlsx` + `03_5_unclear.xlsx` |
| `03_6_relevance_gate.py` | LLM (Gemini 2.5 Flash) relevance gate: is this a self-storage vendor, and which category? Resumable. | `03_5_vendor_candidates.xlsx` | `03_6_relevant.xlsx` + `03_6_not_relevant.xlsx` + `03_6_needs_review.xlsx` |
| `diag_gemini.py` | Diagnostic: list available Gemini models and test which ones work with your API key | — | stdout |

All input/output files default to this folder:
```
storage-owner-advisor/.claude/worktrees/friendly-sinoussi/templates/
```

## Run order

From the repo root (PowerShell or Bash — the paths are absolute):

```
python scripts/leads_cleanup/01_dedup.py
python scripts/leads_cleanup/02_blocklist.py
python scripts/leads_cleanup/03_reachability.py
python scripts/leads_cleanup/03b_retry_403.py
python scripts/leads_cleanup/03_5_operator_check.py
python scripts/leads_cleanup/03_6_relevance_gate.py            # full run
python scripts/leads_cleanup/03_6_relevance_gate.py --limit 20 # smoke test
```

Run them in order. Each step prints row counts so you can see the funnel shrink.

## Requirements

Python packages:
```
pip install httpx "httpx[http2]" openpyxl beautifulsoup4
```

Environment variables (read from `storage-owner-advisor/.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY` (for step 3.6 only)

## Remaining steps (not yet built)

- Step 4 — full enrichment of relevant vendors (name, descriptions, phone, features, etc.)
- Step 4b — ratings/review count research
- Step 5 — auto-validation (required fields present)
- Step 6 — human review
- Step 7 — conform to import template
- Step 8 — bulk insert into Supabase `vendors` with `active=false`
