'use strict';

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

async function waitForDb(pool, attempts = 30, delayMs = 2000) {
  for (let i = 1; i <= attempts; i++) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      console.log(`[db] not ready yet (attempt ${i}/${attempts}): ${err.message}`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('PostgreSQL never became ready');
}

async function applySchema(pool) {
  const sql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  await pool.query(sql);
  console.log('[db] schema applied');
}

async function init() {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await waitForDb(pool);
  await applySchema(pool);
  return pool;
}

module.exports = { init };
