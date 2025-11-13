CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  route_id VARCHAR(50) UNIQUE NOT NULL,
  vessel_type VARCHAR(50) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  ghg_intensity DECIMAL(10, 4) NOT NULL,
  fuel_consumption DECIMAL(10, 2) NOT NULL,
  distance DECIMAL(10, 2) NOT NULL,
  total_emissions DECIMAL(10, 2) NOT NULL,
  is_baseline BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ship_compliance (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  cb_gco2eq DECIMAL(15, 2) NOT NULL,
  target_intensity DECIMAL(10, 4) NOT NULL,
  actual_intensity DECIMAL(10, 4) NOT NULL,
  energy_in_scope DECIMAL(15, 2) NOT NULL,
  UNIQUE(ship_id, year)
);

CREATE TABLE IF NOT EXISTS bank_entries (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  amount_gco2eq DECIMAL(15, 2) NOT NULL,
  applied_amount DECIMAL(15, 2) DEFAULT 0,
  remaining_amount DECIMAL(15, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS pools (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pool_members (
  pool_id INTEGER REFERENCES pools(id),
  ship_id VARCHAR(50) NOT NULL,
  cb_before DECIMAL(15, 2) NOT NULL,
  cb_after DECIMAL(15, 2) NOT NULL,
  PRIMARY KEY (pool_id, ship_id)
);
