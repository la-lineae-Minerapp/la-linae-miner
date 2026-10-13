PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  telegram_id TEXT PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  pearls INTEGER NOT NULL DEFAULT 0 CHECK (pearls >= 0),
  activity_points INTEGER NOT NULL DEFAULT 0 CHECK (activity_points >= 0),
  purchase_points INTEGER NOT NULL DEFAULT 0 CHECK (purchase_points >= 0),
  banned INTEGER NOT NULL DEFAULT 0 CHECK (banned IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS payment_orders (
  id TEXT PRIMARY KEY,
  telegram_id TEXT NOT NULL REFERENCES users(telegram_id),
  asset TEXT NOT NULL CHECK (asset IN ('USDT','SUI','GRAM')),
  network TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  expected_amount TEXT NOT NULL,
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'awaiting_payment'
    CHECK (status IN ('awaiting_payment','checking','verified_pending_admin','approved','rejected','expired')),
  chain_verified INTEGER NOT NULL DEFAULT 0 CHECK (chain_verified IN (0,1)),
  verification_json TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_tx_hash_per_network
ON payment_orders(network, tx_hash)
WHERE tx_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS point_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id TEXT NOT NULL REFERENCES users(telegram_id),
  reason TEXT NOT NULL CHECK (reason IN ('daily_activity','purchase')),
  points INTEGER NOT NULL CHECK (points > 0),
  source_id TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(reason, source_id)
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_telegram_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details_json TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

INSERT OR IGNORE INTO app_settings(key, value) VALUES
  ('daily_activity_points', '50'),
  ('purchase_points_per_usd', '1'),
  ('proposed_airdrop_cap', '1000000'),
  ('pearl_conversion_ratio', '100'),
  ('listing_target_utc', '');
