# KaoinAI Company Secretary Register

Corporate secretarial register with a 6-step wizard. All information is stored in
**PostgreSQL**, keyed by **UEN**. The three identity anchors — **company name,
UEN and registered address** — are entered once in Step 1 and then persist
across every other form in the wizard (sticky identity bar + locked chip in
each form), in `localStorage`, and in the database.

## What it stores (Postgres schema — `server/schema.sql`)

| Table | Contents |
| :--- | :--- |
| `companies` | Company name, UEN (unique), registered address, incorporation date, type, FYE, SSIC, paid-up capital, contacts, status |
| `officers` | Directors, company secretaries, auditors — ID, nationality, appointment/cessation dates, s 145 resident-director flag, professional body |
| `shareholders` | Register of members — share class, number of shares, certificate no., allotment date |
| `filings` | Compliance calendar — AGM, Annual Return (s 197), ACRA notices, tax — due dates, status, penalty exposure |
| `wizard_drafts` | Per-UEN autosaved wizard draft (resumable) |

All child tables cascade-delete with their company.

## Run it

```bash
cd company-secretary
cp .env.example .env          # change POSTGRES_PASSWORD
docker compose up -d --build
# → http://localhost:8080
```

First boot applies `schema.sql` automatically after Postgres is healthy.

## API

| Method & path | Purpose |
| :--- | :--- |
| `GET /api/health` | Liveness + DB check |
| `GET /api/companies` | List all companies with section counts |
| `POST /api/companies` | Upsert company particulars by UEN (validates SG UEN format) |
| `GET /api/companies/:uen` | Full record (company + officers + shareholders + filings) |
| `PUT /api/companies/:uen` | Partial update of particulars |
| `DELETE /api/companies/:uen` | Delete company and all cascaded sections |
| `PUT /api/companies/:uen/officers` | Replace officer set (wizard "Save & Continue") |
| `PUT /api/companies/:uen/shareholders` | Replace shareholder set |
| `PUT /api/companies/:uen/filings` | Replace filing set |
| `GET/PUT /api/drafts/:uen` | Wizard draft autosave / restore |

The Node/Express server (`server/`) also serves the wizard front-end
(`public/`) on the same origin — no CORS.

## Wizard flow

1. **Company Particulars** — name, UEN, registered address (the identity
   anchors) + incorporation details. Saving this step upserts the company row.
2. **Directors** — repeatable rows, s 145 resident flag.
3. **Company Secretary** — repeatable rows, professional body.
4. **Shareholders & Capital** — rows + auto-computed share totals/percentages.
5. **Statutory Filings** — AGM / Annual Return / notices with due dates.
6. **Review & Save** — everything re-saved to Postgres in one pass.

Drafts autosave (debounced) to `localStorage` always, and to the
`wizard_drafts` table once the UEN is valid. The list view offers **Resume**
when a draft exists. If the API is unreachable the wizard keeps working
locally and shows `DB: offline (saving locally)`.

## UEN validation

Singapore formats accepted (`201612345K`, `53012345A`, `T08LL1234A`), enforced
client-side (live hint) and server-side (400 with a clear message).

## Headless regression test

```bash
cd scratch/cs-wizard-test
npm install        # jsdom
node test-wizard.js
```

Requires the stack to be running. Exercises the full journey: identity
persistence across all forms, section saves, Postgres read-back, reload
restore and draft resume (35 checks).

## Deploy to the KaoinAI VPS

Copy the folder to the VPS, then in `docker-compose.yml` switch the `app`
service from published ports to the existing traefik network (commented block
in the file) and `docker compose up -d`. Data lives in the
`cs_postgres_data` named volume.
