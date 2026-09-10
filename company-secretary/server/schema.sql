-- KaoinAI Company Secretary Register — PostgreSQL schema
-- All corporate secretarial information is stored here, keyed by UEN.

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- 1. Companies (master record — company name, UEN, registered address)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS companies (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uen                 VARCHAR(20)  NOT NULL UNIQUE,
  company_name        VARCHAR(200) NOT NULL,
  former_name         VARCHAR(200),
  registered_address  TEXT         NOT NULL DEFAULT '',
  postal_code         VARCHAR(10)  NOT NULL DEFAULT '',
  country             VARCHAR(2)   NOT NULL DEFAULT 'SG',
  jurisdiction_note   VARCHAR(120),
  incorporation_date  DATE,
  company_type        VARCHAR(50)  NOT NULL DEFAULT 'LOCAL COMPANY',
  fiscal_year_end     VARCHAR(5),            -- 'MM-DD', e.g. '12-31'
  ssic_code           VARCHAR(10),
  ssic_description    VARCHAR(200),
  paid_up_capital     NUMERIC(18,2) NOT NULL DEFAULT 0,
  share_currency      CHAR(3)      NOT NULL DEFAULT 'SGD',
  contact_email       VARCHAR(200),
  contact_phone       VARCHAR(30),
  status              VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
                      CHECK (status IN ('ACTIVE','STRUCK_OFF','IN_LIQUIDATION','DORMANT','CLOSED')),
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_companies_name ON companies (LOWER(company_name));

-- ----------------------------------------------------------------------------
-- 2. Officers (directors, company secretaries, auditors, C-suite)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role                VARCHAR(20)  NOT NULL
                      CHECK (role IN ('director','secretary','auditor','ceo','cfo','other')),
  full_name           VARCHAR(200) NOT NULL,
  id_type             VARCHAR(20),           -- NRIC / FIN / PASSPORT
  id_number           VARCHAR(50),
  nationality         VARCHAR(60),
  date_of_appointment DATE,
  date_of_cessation   DATE,
  residential_address TEXT,
  email               VARCHAR(200),
  phone               VARCHAR(30),
  is_resident_director BOOLEAN NOT NULL DEFAULT FALSE,  -- SG Companies Act s145
  professional_body   VARCHAR(120),           -- e.g. SAICSA / CSIS (secretaries)
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_officers_company ON officers (company_id);
CREATE INDEX IF NOT EXISTS idx_officers_role    ON officers (company_id, role);

-- ----------------------------------------------------------------------------
-- 3. Shareholders & shareholdings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shareholders (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id         UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  shareholder_name   VARCHAR(200) NOT NULL,
  id_type            VARCHAR(20),
  id_number          VARCHAR(50),
  is_corporate       BOOLEAN NOT NULL DEFAULT FALSE,
  share_class        VARCHAR(30) NOT NULL DEFAULT 'ORDINARY',
  no_of_shares       BIGINT  NOT NULL DEFAULT 0 CHECK (no_of_shares >= 0),
  share_cert_no      VARCHAR(50),
  date_of_allotment  DATE,
  email              VARCHAR(200),
  phone              VARCHAR(30),
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shareholders_company ON shareholders (company_id);

-- ----------------------------------------------------------------------------
-- 4. Statutory filings & compliance calendar (AGM, Annual Return, ACRA notices…)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS filings (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id           UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  filing_type          VARCHAR(60) NOT NULL,   -- AGM / ANNUAL_RETURN / S44_NOTICE / TAX / OTHER
  description          TEXT,
  statutory_period_end DATE,                   -- FY end the obligation relates to
  due_date             DATE NOT NULL,
  completed_date       DATE,
  status               VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                       CHECK (status IN ('PENDING','COMPLETED','OVERDUE','NOT_APPLICABLE')),
  penalty_exposure     NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_filings_company ON filings (company_id);
CREATE INDEX IF NOT EXISTS idx_filings_due     ON filings (due_date);

-- ----------------------------------------------------------------------------
-- 5. Wizard drafts (per-step autosave so a half-finished wizard is resumable)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wizard_drafts (
  uen          VARCHAR(20)  NOT NULL PRIMARY KEY,
  company_name VARCHAR(200),
  address      TEXT,
  current_step SMALLINT     NOT NULL DEFAULT 1,
  draft        JSONB        NOT NULL DEFAULT '{}'::jsonb,
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- Updated_at trigger
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['companies','officers','shareholders','filings','wizard_drafts'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_touch_%1$s ON %1$s', t);
    EXECUTE format('CREATE TRIGGER trg_touch_%1$s BEFORE UPDATE ON %1$s
                    FOR EACH ROW EXECUTE FUNCTION touch_updated_at()', t);
  END LOOP;
END $$;
