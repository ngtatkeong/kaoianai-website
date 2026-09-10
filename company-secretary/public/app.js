'use strict';

/* =========================================================================
 * KaoinAI Company Secretary Register — wizard front-end
 *
 * The three identity anchors (company name, UEN, registered address) are
 * captured once in Step 1 and then:
 *   1. mirrored in the sticky identity bar on every step,
 *   2. rendered as a locked chip inside every subsequent form,
 *   3. kept in localStorage (survives reloads / offline),
 *   4. autosaved to the wizard_drafts table in PostgreSQL by UEN.
 * ========================================================================= */

const UEN_RE = /^(\d{8}[A-Z]|\d{9}[A-Z]|[TSR]\d{2}[A-Z]{2}\d{4}[A-Z])$/;

const LS_IDENTITY = 'cs_identity';   // { companyName, uen, address }
const LS_DRAFT = 'cs_draft';         // full wizard state
const LS_STEP = 'cs_step';

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* -------------------------------------------------------------- state --- */
const state = {
  step: 1,
  dbUp: null,
  mode: 'new',                       // 'new' | 'edit'
  data: {
    company: emptyCompany(),
    officers: [],                    // role: 'director' | 'secretary' | ...
    shareholders: [],
    filings: [],
  },
};

function emptyCompany() {
  return {
    companyName: '', uen: '', registeredAddress: '', postalCode: '', country: 'SG',
    incorporationDate: '', companyType: 'LOCAL COMPANY', fiscalYearEnd: '',
    ssicCode: '', ssicDescription: '', paidUpCapital: 0, shareCurrency: 'SGD',
    contactEmail: '', contactPhone: '', status: 'ACTIVE',
  };
}

/* --------------------------------------------------- identity anchors --- */
function getIdentity() {
  const c = state.data.company;
  return {
    companyName: (c.companyName || '').trim(),
    uen: (c.uen || '').trim().toUpperCase(),
    address: (c.registeredAddress || '').trim(),
  };
}

function persistIdentityLocally() {
  localStorage.setItem(LS_IDENTITY, JSON.stringify(getIdentity()));
}

function restoreIdentityLocally() {
  try {
    const id = JSON.parse(localStorage.getItem(LS_IDENTITY) || 'null');
    if (id && id.uen) {
      state.data.company.companyName = id.companyName || '';
      state.data.company.uen = id.uen || '';
      state.data.company.registeredAddress = id.address || '';
      return true;
    }
  } catch { /* corrupted localStorage — ignore */ }
  return false;
}

/** Repaint identity bar + every chip + the locked field copies in all forms. */
function syncIdentityUI() {
  const id = getIdentity();
  const bar = $('#identityBar');

  // Bar only appears once a UEN exists (even partial name is fine to preview).
  bar.hidden = !(id.uen || id.companyName);
  $('#idCompanyName').textContent = id.companyName || '—';
  $('#idUen').textContent = id.uen || '—';
  $('#idAddress').textContent = id.address || '—';

  // Chips inside steps 2–6 — the same values physically present in each form.
  $$('.identity-chip').forEach(chip => {
    chip.querySelector('[data-chip="companyName"]').textContent = id.companyName || '—';
    chip.querySelector('[data-chip="uen"]').textContent = id.uen || '—';
    chip.querySelector('[data-chip="address"]').textContent = id.address || '—';
  });
  $('#wizardTitle').textContent = id.companyName
    ? `${id.companyName} — Secretarial Record`
    : 'New Company Filing';
}

/** Insert a fresh chip clone into each [data-slot="chip"] placeholder. */
function mountChips() {
  const tpl = $('#tplIdentityChip');
  $$('[data-slot="chip"]').forEach(slot => {
    slot.innerHTML = '';
    slot.appendChild(tpl.content.cloneNode(true));
  });
  syncIdentityUI();
}

/* ------------------------------------------------------------ api io --- */
async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return json;
}

async function checkHealth() {
  const el = $('#dbStatus');
  try {
    const j = await api('/api/health');
    state.dbUp = !!j.ok;
    el.dataset.state = j.ok ? 'up' : 'down';
    el.textContent = j.ok ? 'DB: connected' : 'DB: unhealthy';
  } catch {
    state.dbUp = false;
    el.dataset.state = 'down';
    el.textContent = 'DB: offline (saving locally)';
  }
}

/* ------------------------------------------------------ draft autosave --- */
let draftTimer = null;
function scheduleDraftSave() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(saveDraft, 900);
}

async function saveDraft() {
  localStorage.setItem(LS_DRAFT, JSON.stringify(state.data));
  localStorage.setItem(LS_STEP, String(state.step));
  const id = getIdentity();
  if (state.dbUp && UEN_RE.test(id.uen)) {
    try {
      await api(`/api/drafts/${encodeURIComponent(id.uen)}`, {
        method: 'PUT',
        body: { companyName: id.companyName, address: id.address, currentStep: state.step, draft: state.data },
      });
    } catch { /* local draft already covers us */ }
  }
}

/* --------------------------------------------------------- step logic --- */
function goStep(n) {
  state.step = n;
  $$('.wizard-step').forEach(el => el.classList.toggle('active', +el.dataset.step === n));
  $('#progressFill').style.width = `${(n / 6) * 100}%`;
  $$('.progress-labels span').forEach(el => el.classList.toggle('on', +el.dataset.step === n));
  if (n === 6) renderReview();
  scheduleDraftSave();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep1() {
  const id = getIdentity();
  let ok = true;
  const mark = (el, bad) => { el.classList.toggle('invalid', bad); if (bad) ok = false; };

  mark($('#f_companyName'), !id.companyName);
  mark($('#f_registeredAddress'), !id.address);

  const hint = $('#uenHint');
  if (!id.uen) {
    mark($('#f_uen'), true);
    hint.textContent = 'UEN is required.'; hint.className = 'hint err';
  } else if (!UEN_RE.test(id.uen)) {
    mark($('#f_uen'), true);
    hint.textContent = 'Not a valid UEN format. Expected 201612345K · 53012345A · T08LL1234A';
    hint.className = 'hint err';
  } else {
    mark($('#f_uen'), false);
    hint.textContent = '✓ Valid UEN format'; hint.className = 'hint ok';
  }
  return ok;
}

function readStep1Form() {
  const c = state.data.company;
  c.postalCode = $('#f_postalCode').value.trim();
  c.country = $('#f_country').value;
  c.incorporationDate = $('#f_incorporationDate').value;
  c.companyType = $('#f_companyType').value;
  c.fiscalYearEnd = $('#f_fiscalYearEnd').value.trim();
  c.ssicCode = $('#f_ssicCode').value.trim();
  c.ssicDescription = $('#f_ssicDescription').value.trim();
  c.paidUpCapital = $('#f_paidUpCapital').value || 0;
  c.shareCurrency = $('#f_shareCurrency').value;
  c.contactEmail = $('#f_contactEmail').value.trim();
  c.contactPhone = $('#f_contactPhone').value.trim();
  c.status = $('#f_status').value;
}

function fillStep1Form() {
  const c = state.data.company;
  $('#f_companyName').value = c.companyName || '';
  $('#f_uen').value = c.uen || '';
  $('#f_registeredAddress').value = c.registeredAddress || '';
  $('#f_postalCode').value = c.postalCode || '';
  $('#f_country').value = c.country || 'SG';
  $('#f_incorporationDate').value = c.incorporationDate || '';
  $('#f_companyType').value = c.companyType || 'LOCAL COMPANY';
  $('#f_fiscalYearEnd').value = c.fiscalYearEnd || '';
  $('#f_ssicCode').value = c.ssicCode || '';
  $('#f_ssicDescription').value = c.ssicDescription || '';
  $('#f_paidUpCapital').value = c.paidUpCapital ?? 0;
  $('#f_shareCurrency').value = c.shareCurrency || 'SGD';
  $('#f_contactEmail').value = c.contactEmail || '';
  $('#f_contactPhone').value = c.contactPhone || '';
  $('#f_status').value = c.status || 'ACTIVE';
}

/* Drop rows the user never touched (no primary field filled). */
function meaningfulRows(rows, primary) {
  return (rows || []).filter(r => String(r[primary] || '').trim() !== '');
}

/** Persist step and advance. Falls back to local-only when DB is offline. */
async function advance(stepEl) {
  const step = +stepEl.dataset.step;
  const busy = stepEl.querySelector('[data-next]');
  busy.disabled = true;
  try {
    if (step === 1) {
      if (!validateStep1()) return;
      readStep1Form();
      persistIdentityLocally();
      syncIdentityUI();
      await persistCompany();
    } else if (step >= 2 && step <= 5) {
      await persistSection(step);
    }
    goStep(step + 1);
  } catch (err) {
    if (state.dbUp === false) return goStep(step + 1); // offline: local-only
    alert(`Could not save: ${err.message}\n\nFix the issue or continue while the database is offline.`);
  } finally {
    busy.disabled = false;
  }
}

async function persistCompany() {
  if (!state.dbUp) return;
  const c = { ...state.data.company, uen: getIdentity().uen };
  try {
    await api('/api/companies', { method: 'POST', body: c });
  } catch (err) {
    if (err.status) throw err;            // server rejected it — surface it
    state.dbUp = false;                   // network failure — degrade to local
    $('#dbStatus').dataset.state = 'down';
    $('#dbStatus').textContent = 'DB: offline (saving locally)';
  }
}

async function persistSection(step) {
  if (!state.dbUp) return;
  const uen = getIdentity().uen;
  try {
    if (step === 2 || step === 3) {
      const officers = meaningfulRows(state.data.officers, 'fullName');
      await api(`/api/companies/${encodeURIComponent(uen)}/officers`, { method: 'PUT', body: officers });
    } else if (step === 4) {
      const shareholders = meaningfulRows(state.data.shareholders, 'shareholderName');
      await api(`/api/companies/${encodeURIComponent(uen)}/shareholders`, { method: 'PUT', body: shareholders });
    } else if (step === 5) {
      const filings = meaningfulRows(state.data.filings, 'filingType');
      await api(`/api/companies/${encodeURIComponent(uen)}/filings`, { method: 'PUT', body: filings });
    }
  } catch (err) {
    if (err.status) throw err;            // server rejected it — surface it
    state.dbUp = false;                   // network failure — degrade to local
  }
}

/* ------------------------------------------------------ row editors ----- */
const SECTION_DEFS = {
  'officers-director': {
    key: 'officers', role: 'director', primary: 'fullName',
    make: () => ({ role: 'director', fullName: '', idType: 'NRIC', idNumber: '', nationality: '', dateOfAppointment: '', dateOfCessation: '', residentialAddress: '', email: '', phone: '', isResidentDirector: false }),
    fields: [
      { k: 'fullName', l: 'Full Name', t: 'text', req: true, wide: true },
      { k: 'idType', l: 'ID Type', t: 'select', opts: ['NRIC', 'FIN', 'PASSPORT'] },
      { k: 'idNumber', l: 'ID Number', t: 'text' },
      { k: 'nationality', l: 'Nationality', t: 'text' },
      { k: 'dateOfAppointment', l: 'Appointed', t: 'date' },
      { k: 'dateOfCessation', l: 'Ceased', t: 'date' },
      { k: 'residentialAddress', l: 'Residential Address', t: 'text', wide: true },
      { k: 'email', l: 'Email', t: 'email' },
      { k: 'phone', l: 'Phone', t: 'tel' },
      { k: 'isResidentDirector', l: 'Ordinarily resident director (s 145)', t: 'check' },
    ],
  },
  'officers-secretary': {
    key: 'officers', role: 'secretary', primary: 'fullName',
    make: () => ({ role: 'secretary', fullName: '', idType: 'NRIC', idNumber: '', nationality: '', dateOfAppointment: '', dateOfCessation: '', residentialAddress: '', email: '', phone: '', professionalBody: '', notes: '' }),
    fields: [
      { k: 'fullName', l: 'Full Name', t: 'text', req: true, wide: true },
      { k: 'professionalBody', l: 'Professional Body (SAICSA / CSIS)', t: 'text' },
      { k: 'idType', l: 'ID Type', t: 'select', opts: ['NRIC', 'FIN', 'PASSPORT'] },
      { k: 'idNumber', l: 'ID Number', t: 'text' },
      { k: 'nationality', l: 'Nationality', t: 'text' },
      { k: 'dateOfAppointment', l: 'Appointed', t: 'date' },
      { k: 'dateOfCessation', l: 'Ceased', t: 'date' },
      { k: 'email', l: 'Email', t: 'email' },
      { k: 'phone', l: 'Phone', t: 'tel' },
      { k: 'notes', l: 'Notes', t: 'text', wide: true },
    ],
  },
  shareholders: {
    key: 'shareholders', primary: 'shareholderName',
    make: () => ({ shareholderName: '', idType: 'NRIC', idNumber: '', isCorporate: false, shareClass: 'ORDINARY', noOfShares: 0, shareCertNo: '', dateOfAllotment: '', email: '', phone: '' }),
    fields: [
      { k: 'shareholderName', l: 'Shareholder / Member', t: 'text', req: true, wide: true },
      { k: 'isCorporate', l: 'Corporate shareholder', t: 'check' },
      { k: 'idType', l: 'ID Type', t: 'select', opts: ['NRIC', 'FIN', 'PASSPORT', 'UEN'] },
      { k: 'idNumber', l: 'ID / UEN Number', t: 'text' },
      { k: 'shareClass', l: 'Share Class', t: 'select', opts: ['ORDINARY', 'PREFERENCE', 'MANAGEMENT'] },
      { k: 'noOfShares', l: 'No. of Shares', t: 'number', min: 0 },
      { k: 'shareCertNo', l: 'Share Cert No.', t: 'text' },
      { k: 'dateOfAllotment', l: 'Date of Allotment', t: 'date' },
      { k: 'email', l: 'Email', t: 'email' },
      { k: 'phone', l: 'Phone', t: 'tel' },
    ],
  },
  filings: {
    key: 'filings', primary: 'filingType',
    make: () => ({ filingType: 'ANNUAL_RETURN', description: '', statutoryPeriodEnd: '', dueDate: '', completedDate: '', status: 'PENDING', penaltyExposure: 0, notes: '' }),
    fields: [
      { k: 'filingType', l: 'Filing Type', t: 'select', req: true, opts: ['AGM', 'ANNUAL_RETURN', 'S44_NOTICE', 'S45_CHANGE_OF_OFFICER', 'SHARE_ALLOTMENT', 'TAX_ESTIMATE (IR8A/C)', 'GST', 'OTHER'] },
      { k: 'description', l: 'Description', t: 'text', wide: true },
      { k: 'statutoryPeriodEnd', l: 'Period End (FY)', t: 'date' },
      { k: 'dueDate', l: 'Due Date', t: 'date', req: true },
      { k: 'completedDate', l: 'Completed On', t: 'date' },
      { k: 'status', l: 'Status', t: 'select', opts: ['PENDING', 'COMPLETED', 'OVERDUE', 'NOT_APPLICABLE'] },
      { k: 'penaltyExposure', l: 'Late Penalty ($)', t: 'number', min: 0 },
      { k: 'notes', l: 'Notes', t: 'text', wide: true },
    ],
  },
};

function sectionRows(def) {
  return def.role ? state.data[def.key].filter(r => r.role === def.role) : state.data[def.key];
}

function fieldHtml(f, val, rowIdx, defId) {
  const name = `${defId}-${rowIdx}-${f.k}`;
  const common = `data-row="${rowIdx}" data-k="${f.k}" id="${name}"`;
  if (f.t === 'check') {
    return `<label class="field ${f.wide ? 'span-2' : ''}"><span>&nbsp;</span>
      <span class="check-line"><input type="checkbox" ${common} ${val ? 'checked' : ''}> ${esc(f.l)}</span></label>`;
  }
  let input;
  if (f.t === 'select') {
    input = `<select ${common}>${f.opts.map(o =>
      `<option value="${esc(o)}" ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  } else {
    input = `<input type="${f.t}" ${common} value="${esc(val ?? '')}"` +
      (f.min !== undefined ? ` min="${f.min}"` : '') + '>';
  }
  return `<label class="field ${f.wide ? 'span-2' : ''}">
    <span>${esc(f.l)}${f.req ? ' <em>*</em>' : ''}</span>${input}</label>`;
}

function renderSection(defId) {
  const def = SECTION_DEFS[defId];
  const host = $(`[data-rows="${defId}"]`);
  const rows = sectionRows(def);
  host.innerHTML = rows.map((row, i) => `
    <div class="row-card" data-card="${i}">
      <button type="button" class="row-remove" data-remove="${defId}" data-row="${i}" title="Remove row">×</button>
      <div class="grid-2">${def.fields.map(f => fieldHtml(f, row[f.k], i, defId)).join('')}</div>
    </div>`).join('');
  if (defId === 'shareholders') updateShareTotals();
}

function bindSectionHost(defId) {
  const host = $(`[data-rows="${defId}"]`);
  const def = SECTION_DEFS[defId];

  host.addEventListener('input', e => {
    const rowIdx = +e.target.dataset.row;
    const k = e.target.dataset.k;
    if (Number.isNaN(rowIdx) || !k) return;
    const row = sectionRows(def)[rowIdx];
    if (!row) return;
    row[k] = e.target.type === 'checkbox' ? e.target.checked
      : e.target.type === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value))
      : e.target.value;
    if (defId === 'shareholders') updateShareTotals();
    scheduleDraftSave();
  });

  host.addEventListener('click', e => {
    const btn = e.target.closest('[data-remove]');
    if (!btn) return;
    const rowIdx = +btn.dataset.row;
    const rows = def.role
      ? state.data.officers.filter(r => r.role === def.role)
      : state.data[def.key];
    const real = rows[rowIdx];
    state.data[def.key] = state.data[def.key].filter(r => r !== real);
    renderSection(defId);
    scheduleDraftSave();
  });
}

function addRow(defId) {
  const def = SECTION_DEFS[defId];
  state.data[def.key].push(def.make());
  renderSection(defId);
  const cards = $(`[data-rows="${defId}"]`).querySelectorAll('.row-card');
  cards[cards.length - 1]?.querySelector('input')?.focus();
  scheduleDraftSave();
}

function updateShareTotals() {
  const rows = meaningfulRows(state.data.shareholders, 'shareholderName');
  const total = rows.reduce((s, r) => s + (Number(r.noOfShares) || 0), 0);
  $('#shareTotals').innerHTML =
    `Total shares: <strong>${total.toLocaleString()}</strong> across <strong>${rows.length}</strong> holder${rows.length === 1 ? '' : 's'}` +
    (rows.length > 1 && total > 0
      ? ` · largest holding <strong>${Math.max(...rows.map(r => Number(r.noOfShares) || 0)).toLocaleString()}</strong> (${(Math.max(...rows.map(r => Number(r.noOfShares) || 0)) / total * 100).toFixed(1)}%)`
      : '');
}

/* ------------------------------------------------------------- review --- */
function fmt(v) { return (v === null || v === undefined || v === '') ? '—' : esc(v); }
function dt(v) { return v ? esc(v) : '—'; }

function renderReview() {
  const c = state.data.company;
  const id = getIdentity();
  const directors = state.data.officers.filter(o => o.role === 'director' && (o.fullName || '').trim());
  const secretaries = state.data.officers.filter(o => o.role === 'secretary' && (o.fullName || '').trim());
  const holders = meaningfulRows(state.data.shareholders, 'shareholderName');
  const filings = meaningfulRows(state.data.filings, 'filingType');
  const totalShares = holders.reduce((s, r) => s + (Number(r.noOfShares) || 0), 0);

  const officerTable = (list, extra) => list.length ? `
    <table class="review-table">
      ${list.map(o => `<tr><td>${esc(o.fullName)}</td><td>
        ${dt(o.dateOfAppointment)}${o.dateOfCessation ? ` → ceased ${esc(o.dateOfCessation)}` : ''}${extra(o)}
      </td></tr>`).join('')}
    </table>` : '<p class="muted">None recorded.</p>';

  $('#reviewBody').innerHTML = `
    <div class="review-block"><h3>Company Particulars</h3>
      <table class="review-table">
        <tr><td>Company Name</td><td><strong>${fmt(id.companyName)}</strong></td></tr>
        <tr><td>UEN</td><td class="mono">${fmt(id.uen)}</td></tr>
        <tr><td>Registered Address</td><td>${fmt(id.address)}${c.postalCode ? ` ${esc(c.postalCode)}` : ''} (${esc(c.country)})</td></tr>
        <tr><td>Incorporated</td><td>${dt(c.incorporationDate)} · ${esc(c.companyType)}</td></tr>
        <tr><td>Paid-Up Capital</td><td>${esc(c.shareCurrency)} ${Number(c.paidUpCapital || 0).toLocaleString()}</td></tr>
        <tr><td>Status</td><td>${esc(c.status)}</td></tr>
      </table>
    </div>
    <div class="review-block"><h3>Directors (${directors.length})</h3>
      ${officerTable(directors, o => o.isResidentDirector ? ' · resident (s 145)' : '')}
    </div>
    <div class="review-block"><h3>Company Secretary (${secretaries.length})</h3>
      ${officerTable(secretaries, o => o.professionalBody ? ` · ${esc(o.professionalBody)}` : '')}
    </div>
    <div class="review-block"><h3>Shareholders (${holders.length} · ${totalShares.toLocaleString()} shares)</h3>
      ${holders.length ? `<table class="review-table">${holders.map(h => {
        const n = Number(h.noOfShares) || 0;
        const pct = totalShares ? (n / totalShares * 100).toFixed(1) : '0.0';
        return `<tr><td>${esc(h.shareholderName)}${h.isCorporate ? ' (corporate)' : ''}</td>
          <td>${n.toLocaleString()} ${esc(h.shareClass)} · ${pct}%</td></tr>`;
      }).join('')}</table>` : '<p class="muted">None recorded.</p>'}
    </div>
    <div class="review-block"><h3>Statutory Filings (${filings.length})</h3>
      ${filings.length ? `<table class="review-table">${filings.map(f => {
        const badge = f.status === 'COMPLETED' ? 'ok' : f.status === 'OVERDUE' ? 'bad' : f.status === 'PENDING' ? 'warn' : '';
        return `<tr><td>${esc(f.filingType)}</td><td>due ${dt(f.dueDate)}
          <span class="badge ${badge}">${esc(f.status)}</span></td></tr>`;
      }).join('')}</table>` : '<p class="muted">None recorded.</p>'}
    </div>`;
}

async function finalSave() {
  const btn = $('#btnFinalSave');
  const out = $('#saveResult');
  btn.disabled = true;
  try {
    readStep1Form();
    await persistCompany();
    for (const s of [2, 3, 4, 5]) await persistSection(s);
    localStorage.setItem(LS_DRAFT, JSON.stringify(state.data));
    out.hidden = false;
    out.className = 'save-result';
    out.textContent = `✓ Saved — ${getIdentity().companyName} (${getIdentity().uen}) and all sections are stored in PostgreSQL.`;
    await loadCompanies();
  } catch (err) {
    out.hidden = false;
    out.className = 'save-result err';
    out.textContent = `✗ Save failed: ${err.message}. Your draft is safe locally and will re-sync when the DB is reachable.`;
  } finally {
    btn.disabled = false;
  }
}

/* ------------------------------------------------------- company list --- */
async function loadCompanies() {
  const tbody = $('#companiesTable tbody');
  if (!state.dbUp) {
    tbody.innerHTML = '<tr><td colspan="7" class="muted">Database offline — start the stack with <code>docker compose up -d</code>.</td></tr>';
    return;
  }
  try {
    const rows = await api('/api/companies');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="muted">No companies yet — run the wizard.</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(r => `
      <tr>
        <td><strong>${esc(r.company_name)}</strong></td>
        <td class="mono">${esc(r.uen)}</td>
        <td class="hide-sm">${esc(r.registered_address)}</td>
        <td>${r.officer_count}</td>
        <td>${r.shareholder_count}</td>
        <td><span class="badge ${r.status === 'ACTIVE' ? 'ok' : 'warn'}">${esc(r.status)}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" data-edit="${esc(r.uen)}">Edit</button>
          <button class="btn btn-danger btn-sm" data-del="${esc(r.uen)}">Delete</button>
        </td>
      </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="muted">Could not load companies: ${esc(err.message)}</td></tr>`;
  }
}

async function loadCompanyIntoWizard(uen) {
  const rec = await api(`/api/companies/${encodeURIComponent(uen)}`);
  state.mode = 'edit';
  state.data.company = {
    companyName: rec.company.company_name,
    uen: rec.company.uen,
    registeredAddress: rec.company.registered_address,
    postalCode: rec.company.postal_code,
    country: rec.company.country,
    incorporationDate: rec.company.incorporation_date || '',
    companyType: rec.company.company_type,
    fiscalYearEnd: rec.company.fiscal_year_end || '',
    ssicCode: rec.company.ssic_code || '',
    ssicDescription: rec.company.ssic_description || '',
    paidUpCapital: Number(rec.company.paid_up_capital) || 0,
    shareCurrency: rec.company.share_currency,
    contactEmail: rec.company.contact_email || '',
    contactPhone: rec.company.contact_phone || '',
    status: rec.company.status,
  };
  state.data.officers = rec.officers.map(o => ({
    role: o.role, fullName: o.full_name, idType: o.id_type || 'NRIC', idNumber: o.id_number || '',
    nationality: o.nationality || '', dateOfAppointment: o.date_of_appointment || '',
    dateOfCessation: o.date_of_cessation || '',
    residentialAddress: o.residential_address || '', email: o.email || '', phone: o.phone || '',
    isResidentDirector: o.is_resident_director, professionalBody: o.professional_body || '', notes: o.notes || '',
  }));
  state.data.shareholders = rec.shareholders.map(s => ({
    shareholderName: s.shareholder_name, idType: s.id_type || 'NRIC', idNumber: s.id_number || '',
    isCorporate: s.is_corporate, shareClass: s.share_class, noOfShares: Number(s.no_of_shares) || 0,
    shareCertNo: s.share_cert_no || '', dateOfAllotment: s.date_of_allotment || '',
    email: s.email || '', phone: s.phone || '',
  }));
  state.data.filings = rec.filings.map(f => ({
    filingType: f.filing_type, description: f.description || '',
    statutoryPeriodEnd: f.statutory_period_end || '', dueDate: f.due_date || '',
    completedDate: f.completed_date || '', status: f.status,
    penaltyExposure: Number(f.penalty_exposure) || 0, notes: f.notes || '',
  }));
  hydrateAllSteps();
  persistIdentityLocally();
  syncIdentityUI();
  showView('wizard');
  goStep(1);
}

function hydrateAllSteps() {
  fillStep1Form();
  renderSection('officers-director');
  renderSection('officers-secretary');
  renderSection('shareholders');
  renderSection('filings');
  updateShareTotals();
}

/* ------------------------------------------------------------- views --- */
function showView(name) {
  $('#listView').hidden = name !== 'list';
  $('#wizardView').hidden = name !== 'wizard';
}

function startNewWizard() {
  state.mode = 'new';
  state.data = { company: emptyCompany(), officers: [], shareholders: [], filings: [] };
  hydrateAllSteps();
  persistIdentityLocally();
  syncIdentityUI();
  showView('wizard');
  goStep(1);
  $('#f_companyName').focus();
}

async function maybeOfferResume() {
  const localDraft = localStorage.getItem(LS_DRAFT);
  const card = $('#resumeCard');
  if (!localDraft) { card.hidden = true; return; }
  let identityNote = 'Locally saved draft available.';
  try {
    const d = JSON.parse(localDraft);
    const uen = (d.company && d.company.uen) || '';
    if (uen && state.dbUp) {
      const srv = await api(`/api/drafts/${encodeURIComponent(uen)}`);
      if (srv && srv.draft) {
        $('#resumeText').textContent =
          `Draft for ${srv.company_name || d.company.companyName || 'company'} (UEN ${uen}), last saved to the database ${new Date(srv.updated_at).toLocaleString()} at step ${srv.current_step}.`;
        card.hidden = false;
        return;
      }
    }
    identityNote += ` UEN ${uen || '—'}.`;
  } catch { /* ignore */ }
  $('#resumeText').textContent = identityNote;
  card.hidden = false;
}

function resumeDraft() {
  try {
    const d = JSON.parse(localStorage.getItem(LS_DRAFT) || '{}');
    if (d && d.company) state.data = {
      company: { ...emptyCompany(), ...d.company },
      officers: d.officers || [],
      shareholders: d.shareholders || [],
      filings: d.filings || [],
    };
  } catch { /* ignore */ }
  hydrateAllSteps();
  persistIdentityLocally();
  syncIdentityUI();
  showView('wizard');
  goStep(Math.min(6, Math.max(1, parseInt(localStorage.getItem(LS_STEP) || '1', 10) || 1)));
}

/* ------------------------------------------------------------- wiring --- */
function init() {
  if (window.__csInitDone) return;   // guard against double DOMContentLoaded
  window.__csInitDone = true;

  showView('list');
  mountChips();
  Object.keys(SECTION_DEFS).forEach(bindSectionHost);

  $('#brandHome').addEventListener('click', e => { e.preventDefault(); showView('list'); loadCompanies(); });
  $('#btnNewCompany').addEventListener('click', startNewWizard);
  $('#btnBackToList').addEventListener('click', () => { showView('list'); loadCompanies(); });
  $('#btnResume').addEventListener('click', resumeDraft);
  $('#btnFinalSave').addEventListener('click', finalSave);
  $('#editIdentity').addEventListener('click', () => { showView('wizard'); goStep(1); $('#f_companyName').focus(); });

  // Step 1 identity anchors — live persistence across every other form.
  $$('#step1 [data-identity]').forEach(el => {
    el.addEventListener('input', () => {
      const key = el.dataset.identity;
      state.data.company[key] = key === 'uen' ? el.value.trim().toUpperCase() : el.value;
      if (key === 'uen') {
        const hint = $('#uenHint');
        const v = state.data.company.uen;
        if (UEN_RE.test(v)) { hint.textContent = '✓ Valid UEN format'; hint.className = 'hint ok'; el.classList.remove('invalid'); }
        else { hint.textContent = 'Formats: 201612345K · 53012345A · T08LL1234A'; hint.className = 'hint'; }
      }
      persistIdentityLocally();
      syncIdentityUI();
      scheduleDraftSave();
    });
  });

  $$('.wizard-step').forEach(stepEl => {
    stepEl.querySelector('[data-add]')?.addEventListener('click', () => {
      addRow(stepEl.querySelector('[data-rows]')?.dataset.rows);
    });
    stepEl.querySelector('[data-next]')?.addEventListener('click', () => advance(stepEl));
    stepEl.querySelector('[data-prev]')?.addEventListener('click', () => goStep(+stepEl.dataset.step - 1));
  });

  $('#companiesTable').addEventListener('click', async e => {
    const editBtn = e.target.closest('[data-edit]');
    const delBtn = e.target.closest('[data-del]');
    if (editBtn) {
      try { await loadCompanyIntoWizard(editBtn.dataset.edit); }
      catch (err) { alert(err.message); }
    } else if (delBtn) {
      const uen = delBtn.dataset.del;
      if (confirm(`Delete ${uen} and ALL its officers, shareholders and filings from PostgreSQL?`)) {
        try {
          await api(`/api/companies/${encodeURIComponent(uen)}`, { method: 'DELETE' });
          if (getIdentity().uen === uen) localStorage.removeItem(LS_IDENTITY);
          await loadCompanies();
        } catch (err) { alert(err.message); }
      }
    }
  });

  restoreIdentityLocally();
  fillStep1Form();
  hydrateAllSteps();
  syncIdentityUI();

  checkHealth().then(() => {
    loadCompanies();
    maybeOfferResume();
  });
  setInterval(checkHealth, 60000);
}

document.addEventListener('DOMContentLoaded', init);
