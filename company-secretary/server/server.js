'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const { init } = require('./db');

const PORT = parseInt(process.env.PORT || '8080', 10);

// Singapore UEN formats: business (8 digits + letter), local company
// (9 digits + letter), other entities (T/S/R + 2 digits + 2 letters + 4 digits + letter).
const UEN_RE = /^(\d{8}[A-Z]|\d{9}[A-Z]|[TSR]\d{2}[A-Z]{2}\d{4}[A-Z])$/;
const ISO_COUNTRY_RE = /^[A-Z]{2}$/;

const app = express();
app.use(express.json({ limit: '2mb' }));

let pool;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function bad(res, msg, code = 400) {
  return res.status(code).json({ error: msg });
}

function normalizeUen(raw) {
  return String(raw || '').trim().toUpperCase();
}

function pick(v, transform) {
  if (v === undefined || v === null || v === '') return null;
  return transform ? transform(v) : v;
}

const str = v => String(v).trim();
const num = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const date = v => {
  const s = String(v).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
};

async function findCompanyByUen(uen) {
  const { rows } = await pool.query('SELECT * FROM companies WHERE uen = $1', [uen]);
  return rows[0] || null;
}

async function fullRecord(companyId, uen) {
  const [company, officers, shareholders, filings] = await Promise.all([
    pool.query('SELECT * FROM companies WHERE id = $1', [companyId]),
    pool.query('SELECT * FROM officers WHERE company_id = $1 ORDER BY role, full_name', [companyId]),
    pool.query('SELECT * FROM shareholders WHERE company_id = $1 ORDER BY shareholder_name', [companyId]),
    pool.query('SELECT * FROM filings WHERE company_id = $1 ORDER BY due_date', [companyId]),
  ]);
  return {
    company: company.rows[0],
    officers: officers.rows,
    shareholders: shareholders.rows,
    filings: filings.rows,
  };
}

function mapCompanyRow(body) {
  return {
    uen: normalizeUen(body.uen),
    company_name: pick(body.companyName ?? body.company_name, str),
    former_name: pick(body.formerName ?? body.former_name, str),
    registered_address: pick(body.registeredAddress ?? body.registered_address, str) ?? '',
    postal_code: pick(body.postalCode ?? body.postal_code, str) ?? '',
    country: (pick(body.country, str) || 'SG').toUpperCase(),
    jurisdiction_note: pick(body.jurisdictionNote ?? body.jurisdiction_note, str),
    incorporation_date: date(body.incorporationDate ?? (body.incorporation_date || '')),
    company_type: pick(body.companyType ?? body.company_type, str) || 'LOCAL COMPANY',
    fiscal_year_end: pick(body.fiscalYearEnd ?? body.fiscal_year_end, str),
    ssic_code: pick(body.ssicCode ?? body.ssic_code, str),
    ssic_description: pick(body.ssicDescription ?? body.ssic_description, str),
    paid_up_capital: num(body.paidUpCapital ?? body.paid_up_capital ?? 0) ?? 0,
    share_currency: (pick(body.shareCurrency ?? body.share_currency, str) || 'SGD').toUpperCase(),
    contact_email: pick(body.contactEmail ?? body.contact_email, str),
    contact_phone: pick(body.contactPhone ?? body.contact_phone, str),
    status: pick(body.status, str) || 'ACTIVE',
  };
}

function mapOfficerRow(o) {
  return {
    role: pick(o.role, str) || 'director',
    full_name: pick(o.fullName ?? o.full_name, str),
    id_type: pick(o.idType ?? o.id_type, str),
    id_number: pick(o.idNumber ?? o.id_number, str),
    nationality: pick(o.nationality, str),
    date_of_appointment: date(o.dateOfAppointment ?? (o.date_of_appointment || '')),
    date_of_cessation: date(o.dateOfCessation ?? (o.date_of_cessation || '')),
    residential_address: pick(o.residentialAddress ?? o.residential_address, str),
    email: pick(o.email, str),
    phone: pick(o.phone, str),
    is_resident_director: o.isResidentDirector === true || o.is_resident_director === true,
    professional_body: pick(o.professionalBody ?? o.professional_body, str),
    notes: pick(o.notes, str),
  };
}

function mapShareholderRow(s) {
  return {
    shareholder_name: pick(s.shareholderName ?? s.shareholder_name, str),
    id_type: pick(s.idType ?? s.id_type, str),
    id_number: pick(s.idNumber ?? s.id_number, str),
    is_corporate: s.isCorporate === true || s.is_corporate === true,
    share_class: pick(s.shareClass ?? s.share_class, str) || 'ORDINARY',
    no_of_shares: num(s.noOfShares ?? s.no_of_shares ?? 0) ?? 0,
    share_cert_no: pick(s.shareCertNo ?? s.share_cert_no, str),
    date_of_allotment: date(s.dateOfAllotment ?? (s.date_of_allotment || '')),
    email: pick(s.email, str),
    phone: pick(s.phone, str),
    notes: pick(s.notes, str),
  };
}

function mapFilingRow(f) {
  const due = date(f.dueDate ?? (f.due_date || ''));
  return {
    filing_type: pick(f.filingType ?? f.filing_type, str) || 'OTHER',
    description: pick(f.description, str),
    statutory_period_end: date(f.statutoryPeriodEnd ?? (f.statutory_period_end || '')),
    due_date: due,
    completed_date: date(f.completedDate ?? (f.completed_date || '')),
    status: pick(f.status, str) || 'PENDING',
    penalty_exposure: num(f.penaltyExposure ?? f.penalty_exposure ?? 0) ?? 0,
    notes: pick(f.notes, str),
  };
}

// Replace a section's rows atomically (wizard "Save & Continue" semantics).
async function replaceSection(client, companyId, table, mapper, rows, requiredFields = []) {
  const list = Array.isArray(rows) ? rows : [];
  for (const [i, row] of list.entries()) {
    const mapped = mapper(row);
    for (const field of requiredFields) {
      if (!mapped[field]) {
        const e = new Error(`Row ${i + 1}: missing required field "${field}"`);
        e.status = 400;
        throw e;
      }
    }
  }
  await client.query(`DELETE FROM ${table} WHERE company_id = $1`, [companyId]);
  for (const row of list) {
    const cols = mapper(row);
    const keys = Object.keys(cols);
    const vals = keys.map(k => cols[k]);
    const ph = keys.map((_, i) => `$${i + 2}`).join(', ');
    await client.query(
      `INSERT INTO ${table} (company_id, ${keys.join(', ')}) VALUES ($1, ${ph})`,
      [companyId, ...vals]
    );
  }
  return list.length;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, service: 'company-secretary', db: 'up' });
  } catch {
    res.status(503).json({ ok: false, db: 'down' });
  }
});

app.get('/api/companies', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.id, c.uen, c.company_name, c.registered_address, c.postal_code, c.country,
             c.incorporation_date, c.company_type, c.status, c.updated_at,
             (SELECT count(*) FROM officers o WHERE o.company_id = c.id) AS officer_count,
             (SELECT count(*) FROM shareholders s WHERE s.company_id = c.id) AS shareholder_count,
             (SELECT count(*) FROM filings f WHERE f.company_id = c.id) AS filing_count
      FROM companies c ORDER BY c.company_name`);
    res.json(rows);
  } catch (err) { next(err); }
});

// Upsert company particulars by UEN — the anchor every other section hangs off.
app.post('/api/companies', async (req, res, next) => {
  try {
    const c = mapCompanyRow(req.body || {});
    if (!c.uen) return bad(res, 'UEN is required');
    if (!UEN_RE.test(c.uen)) return bad(res, `UEN "${c.uen}" is not a valid Singapore UEN format (e.g. 201612345K or T08LL1234A)`);
    if (!c.company_name) return bad(res, 'Company name is required');
    if (c.registered_address === '' ) return bad(res, 'Registered address is required');
    if (!ISO_COUNTRY_RE.test(c.country)) return bad(res, 'Country must be a 2-letter ISO code');
    if (c.status && !['ACTIVE','STRUCK_OFF','IN_LIQUIDATION','DORMANT','CLOSED'].includes(c.status)) {
      return bad(res, 'Invalid status');
    }

    const keys = Object.keys(c);
    const vals = keys.map(k => c[k]);
    const ph = keys.map((_, i) => `$${i + 1}`).join(', ');
    const updates = keys.filter(k => k !== 'uen')
      .map((k, i) => `${k} = EXCLUDED.${k}`).join(', ');
    const { rows } = await pool.query(
      `INSERT INTO companies (${keys.join(', ')}) VALUES (${ph})
       ON CONFLICT (uen) DO UPDATE SET ${updates}
       RETURNING *`, vals);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

app.get('/api/companies/:uen', async (req, res, next) => {
  try {
    const uen = normalizeUen(req.params.uen);
    const co = await findCompanyByUen(uen);
    if (!co) return bad(res, `No company with UEN ${uen}`, 404);
    res.json(await fullRecord(co.id, uen));
  } catch (err) { next(err); }
});

app.put('/api/companies/:uen', async (req, res, next) => {
  try {
    const uen = normalizeUen(req.params.uen);
    const co = await findCompanyByUen(uen);
    if (!co) return bad(res, `No company with UEN ${uen}`, 404);
    const c = mapCompanyRow({ ...req.body, uen });
    const keys = Object.keys(c).filter(k => c[k] !== null);
    if (!keys.length) return bad(res, 'No fields to update');
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const { rows } = await pool.query(
      `UPDATE companies SET ${sets} WHERE uen = $${keys.length + 1} RETURNING *`,
      [...keys.map(k => c[k]), uen]);
    res.json(rows[0]);
  } catch (err) { next(err); }
});

app.delete('/api/companies/:uen', async (req, res, next) => {
  try {
    const uen = normalizeUen(req.params.uen);
    const co = await findCompanyByUen(uen);
    if (!co) return bad(res, `No company with UEN ${uen}`, 404);
    await pool.query('DELETE FROM companies WHERE id = $1', [co.id]);
    await pool.query('DELETE FROM wizard_drafts WHERE uen = $1', [uen]);
    res.json({ deleted: uen });
  } catch (err) { next(err); }
});

// Section replace endpoints (officers / shareholders / filings)
const SECTIONS = {
  officers:      { table: 'officers',      mapper: mapOfficerRow,      required: ['full_name'] },
  shareholders:  { table: 'shareholders',  mapper: mapShareholderRow,  required: ['shareholder_name'] },
  filings:       { table: 'filings',       mapper: mapFilingRow,       required: ['due_date'] },
};

for (const [name, cfg] of Object.entries(SECTIONS)) {
  app.put(`/api/companies/:uen/${name}`, async (req, res, next) => {
    try {
      const uen = normalizeUen(req.params.uen);
      const co = await findCompanyByUen(uen);
      if (!co) return bad(res, `No company with UEN ${uen} — save Company Particulars first`, 404);
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const count = await replaceSection(client, co.id, cfg.table, cfg.mapper, req.body, cfg.required);
        await client.query('COMMIT');
        res.json({ company: co.uen, section: name, saved: count });
      } catch (err) {
        await client.query('ROLLBACK');
        err.status = err.status || 500;
        throw err;
      } finally {
        client.release();
      }
    } catch (err) { next(err); }
  });
}

// Wizard draft autosave / restore — keyed by UEN, stores the whole draft JSON.
app.get('/api/drafts/:uen', async (req, res, next) => {
  try {
    const uen = normalizeUen(req.params.uen);
    const { rows } = await pool.query('SELECT * FROM wizard_drafts WHERE uen = $1', [uen]);
    res.json(rows[0] || { uen, draft: null });
  } catch (err) { next(err); }
});

app.put('/api/drafts/:uen', async (req, res, next) => {
  try {
    const uen = normalizeUen(req.params.uen);
    const body = req.body || {};
    if (!UEN_RE.test(uen) && uen !== 'DRAFT') {
      return bad(res, 'A valid UEN is needed before drafts can be stored server-side');
    }
    const { rows } = await pool.query(`
      INSERT INTO wizard_drafts (uen, company_name, address, current_step, draft)
      VALUES ($1, $2, $3, $4, $5::jsonb)
      ON CONFLICT (uen) DO UPDATE
        SET company_name = EXCLUDED.company_name,
            address      = EXCLUDED.address,
            current_step = EXCLUDED.current_step,
            draft        = EXCLUDED.draft,
            updated_at   = now()
      RETURNING *`,
      [uen, body.companyName || null, body.address || null, body.currentStep || 1, JSON.stringify(body.draft || {})]);
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// Serve the wizard (static) — same origin as the API, no CORS needed.
// Docker image flattens server files into /app; local dev keeps public/ as a sibling.
const PUBLIC_DIR = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC_DIR));
app.get(/^\/(?!api\/).*/, (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const isPgInputError = ['23502', '23503', '23514', '22P02', '22007'].includes(err.code);
  const status = err.status || (isPgInputError ? 400 : 500);
  console.error('[api]', err.message);
  res.status(status).json({ error: err.message || 'Internal server error' });
});

init()
  .then(p => { pool = p; })
  .then(() => {
    app.listen(PORT, () => console.log(`[api] company-secretary listening on :${PORT}`));
  })
  .catch(err => {
    console.error('[fatal]', err);
    process.exit(1);
  });
