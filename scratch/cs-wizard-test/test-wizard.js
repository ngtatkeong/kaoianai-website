'use strict';
/* Headless DOM test of the Company Secretary wizard (real index.html + app.js
 * against the live API at localhost:8080). Simulates user flows:
 *  T1 initial load, T2 new wizard, T3 live identity bar,
 *  T4 step 1 → step 2 (identity persists across forms),
 *  T5 step 2 → 3 → 4 → 5 → 6 with data, final save, DB read-back,
 *  T6 reload persistence (localStorage restore + resume draft).
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..', 'company-secretary');
const HTML = fs.readFileSync(path.join(ROOT, 'public', 'index.html'), 'utf8');
const APP_JS = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
const BASE = 'http://localhost:8080';

let failures = 0;
function check(name, cond, extra = '') {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra && !ok ? ' — ' + extra : ''}`);
}

function fire(el, type = 'input') {
  el.dispatchEvent(new el.ownerDocument.defaultView.Event(type, { bubbles: true }));
}
function setValue(el, val) { el.value = val; fire(el); }
function click(el) { el.dispatchEvent(new el.ownerDocument.defaultView.Event('click', { bubbles: true })); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Build a running app instance; seedLocalStorage entries are applied pre-init. */
async function bootApp(seedLocalStorage = {}) {
  const dom = new JSDOM(HTML, { url: BASE + '/', runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  window.fetch = (url, opts) => fetch(String(url).startsWith('http') ? String(url) : BASE + String(url), opts);
  window.alert = m => console.log('  [alert]', m);
  window.confirm = () => true;
  window.scrollTo = () => {};
  for (const [k, v] of Object.entries(seedLocalStorage)) window.localStorage.setItem(k, v);
  window.eval(APP_JS);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));
  await sleep(2500); // health check + initial companies fetch
  return { dom, window };
}

async function apiGet(p) { return (await fetch(BASE + p)).json(); }

(async () => {
  const TEST_UEN = '53012345A';

  /* T1 — initial load */
  const A = await bootApp();
  const doc = A.window.document;
  check('T1 list view visible', !doc.querySelector('#listView').hidden);
  check('T1 DB connected badge', doc.querySelector('#dbStatus').dataset.state === 'up',
    doc.querySelector('#dbStatus').textContent);

  /* T2 — start wizard */
  click(doc.querySelector('#btnNewCompany'));
  check('T2 wizard visible', !doc.querySelector('#wizardView').hidden);
  check('T2 step 1 active', doc.querySelector('#step1').classList.contains('active'));
  check('T2 identity bar hidden while empty', doc.querySelector('#identityBar').hidden);

  /* T3 — live identity while typing */
  setValue(doc.querySelector('#f_companyName'), 'Acme Trading Pte Ltd');
  check('T3 identity bar live name', doc.querySelector('#idCompanyName').textContent === 'Acme Trading Pte Ltd');
  check('T3 identity bar visible once name typed', !doc.querySelector('#identityBar').hidden);
  setValue(doc.querySelector('#f_uen'), TEST_UEN);
  check('T3 UEN valid hint', doc.querySelector('#uenHint').className.includes('ok'));
  setValue(doc.querySelector('#f_registeredAddress'), '10 Anson Road, #05-01');

  /* T4 — save & continue to step 2: identity must persist into the next form */
  click(doc.querySelector('#step1 [data-next]'));
  await sleep(1200);
  check('T4 step 2 active', doc.querySelector('#step2').classList.contains('active'));
  check('T4 bar company persisted', doc.querySelector('#idCompanyName').textContent === 'Acme Trading Pte Ltd');
  check('T4 bar UEN persisted', doc.querySelector('#idUen').textContent === TEST_UEN);
  check('T4 bar address persisted', doc.querySelector('#idAddress').textContent === '10 Anson Road, #05-01');
  const chip2 = doc.querySelector('#step2 .identity-chip');
  check('T4 chip in Directors form shows company', chip2.querySelector('[data-chip="companyName"]').textContent === 'Acme Trading Pte Ltd');
  check('T4 chip in Directors form shows UEN', chip2.querySelector('[data-chip="uen"]').textContent === TEST_UEN);
  check('T4 chip in Directors form shows address', chip2.querySelector('[data-chip="address"]').textContent === '10 Anson Road, #05-01');
  const dbCo1 = await apiGet('/api/companies');
  check('T4 company row created in Postgres', dbCo1.some(c => c.uen === TEST_UEN));

  /* T5 — full journey: director → secretary → shareholder → filing → review → save */
  click(doc.querySelector('#step2 [data-add]'));
  setValue(doc.querySelector('#step2 [data-rows="officers-director"] input[data-k="fullName"]'), 'Bob Director');
  click(doc.querySelector('#step2 [data-next]'));
  await sleep(800);
  check('T5 step 3 active (Secretary)', doc.querySelector('#step3').classList.contains('active'));
  const chip3 = doc.querySelector('#step3 .identity-chip');
  check('T5 chip persists in Secretary form', chip3.querySelector('[data-chip="uen"]').textContent === TEST_UEN);

  click(doc.querySelector('#step3 [data-add]'));
  setValue(doc.querySelector('#step3 [data-rows="officers-secretary"] input[data-k="fullName"]'), 'Carol Secretary');
  click(doc.querySelector('#step3 [data-next]'));
  await sleep(800);
  check('T5 step 4 active (Shareholders)', doc.querySelector('#step4').classList.contains('active'));

  click(doc.querySelector('#step4 [data-add]'));
  setValue(doc.querySelector('#step4 [data-rows="shareholders"] input[data-k="shareholderName"]'), 'Bob Director');
  setValue(doc.querySelector('#step4 [data-rows="shareholders"] input[data-k="noOfShares"]'), '60');
  click(doc.querySelector('#step4 [data-add]'));
  setValue(doc.querySelector('#step4 [data-rows="shareholders"] [data-card="1"] input[data-k="shareholderName"]'), 'Carol Secretary');
  setValue(doc.querySelector('#step4 [data-rows="shareholders"] [data-card="1"] input[data-k="noOfShares"]'), '40');
  check('T5 share totals computed', doc.querySelector('#shareTotals').textContent.includes('100'),
    doc.querySelector('#shareTotals').textContent);
  click(doc.querySelector('#step4 [data-next]'));
  await sleep(800);
  check('T5 step 5 active (Filings)', doc.querySelector('#step5').classList.contains('active'));

  click(doc.querySelector('#step5 [data-add]'));
  const filingRow = doc.querySelector('#step5 [data-rows="filings"] [data-card="0"]');
  setValue(filingRow.querySelector('select[data-k="filingType"]'), 'AGM');
  setValue(filingRow.querySelector('input[data-k="dueDate"]'), '2027-04-30');
  click(doc.querySelector('#step5 [data-next]'));
  await sleep(800);
  check('T5 step 6 active (Review)', doc.querySelector('#step6').classList.contains('active'));
  const reviewText = doc.querySelector('#reviewBody').textContent;
  check('T6 review shows identity', reviewText.includes('Acme Trading Pte Ltd') && reviewText.includes(TEST_UEN));
  check('T6 review shows officers', reviewText.includes('Bob Director') && reviewText.includes('Carol Secretary'));

  click(doc.querySelector('#btnFinalSave'));
  await sleep(1500);
  const saveOut = doc.querySelector('#saveResult');
  check('T6 final save success shown', !saveOut.hidden && saveOut.textContent.includes('✓'), saveOut.textContent);

  const rec = await apiGet(`/api/companies/${TEST_UEN}`);
  check('T6 DB full record: company', rec.company.company_name === 'Acme Trading Pte Ltd');
  check('T6 DB full record: officers', rec.officers.length === 2 && rec.officers.some(o => o.role === 'director' && o.full_name === 'Bob Director'));
  check('T6 DB full record: shareholders', rec.shareholders.length === 2 && rec.shareholders.reduce((s, x) => s + Number(x.no_of_shares), 0) === 100);
  check('T6 DB full record: filings', rec.filings.length === 1 && rec.filings[0].filing_type === 'AGM');

  /* T7 — reload persistence: seed a fresh window with the same localStorage */
  const seed = {};
  for (const k of ['cs_identity', 'cs_draft', 'cs_step']) seed[k] = A.window.localStorage.getItem(k);
  check('T7 localStorage identity written', !!seed.cs_identity && JSON.parse(seed.cs_identity).uen === TEST_UEN);

  const B = await bootApp(seed);
  const doc2 = B.window.document;
  await sleep(500);
  check('T7 after reload identity bar restored', doc2.querySelector('#idCompanyName').textContent === 'Acme Trading Pte Ltd'
    && doc2.querySelector('#idUen').textContent === TEST_UEN
    && doc2.querySelector('#idAddress').textContent === '10 Anson Road, #05-01');
  check('T7 resume card offered', !doc2.querySelector('#resumeCard').hidden, doc2.querySelector('#resumeText').textContent);

  click(doc2.querySelector('#btnResume'));
  await sleep(300);
  const savedStep = parseInt(seed.cs_step || '1', 10) || 1;
  check('T7 wizard restored after resume', !doc2.querySelector('#wizardView').hidden
    && doc2.querySelector(`#step${savedStep}`).classList.contains('active'),
    `expected step ${savedStep} active`);
  check('T7 step-1 form prefilled with persisted identity',
    doc2.querySelector('#f_companyName').value === 'Acme Trading Pte Ltd'
    && doc2.querySelector('#f_uen').value === TEST_UEN
    && doc2.querySelector('#f_registeredAddress').value === '10 Anson Road, #05-01');

  /* cleanup: delete test company */
  await fetch(`${BASE}/api/companies/${TEST_UEN}`, { method: 'DELETE' });
  const after = await apiGet('/api/companies');
  check('cleanup test company removed', !after.some(c => c.uen === TEST_UEN));

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
