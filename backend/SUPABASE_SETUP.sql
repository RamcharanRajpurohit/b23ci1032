-- FuelEU Maritime Database Setup
-- Run this entire script in Supabase SQL Editor

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS pool_members CASCADE;
DROP TABLE IF EXISTS pools CASCADE;
DROP TABLE IF EXISTS bank_entries CASCADE;
DROP TABLE IF EXISTS ship_compliance CASCADE;
DROP TABLE IF EXISTS routes CASCADE;

-- Create tables
CREATE TABLE routes (
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

CREATE TABLE ship_compliance (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  cb_gco2eq DECIMAL(15, 2) NOT NULL,
  target_intensity DECIMAL(10, 4) NOT NULL,
  actual_intensity DECIMAL(10, 4) NOT NULL,
  energy_in_scope DECIMAL(15, 2) NOT NULL,
  UNIQUE(ship_id, year)
);

CREATE TABLE bank_entries (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  amount_gco2eq DECIMAL(15, 2) NOT NULL,
  applied_amount DECIMAL(15, 2) DEFAULT 0,
  remaining_amount DECIMAL(15, 2) NOT NULL
);

CREATE TABLE pools (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pool_members (
  pool_id INTEGER REFERENCES pools(id),
  ship_id VARCHAR(50) NOT NULL,
  cb_before DECIMAL(15, 2) NOT NULL,
  cb_after DECIMAL(15, 2) NOT NULL,
  PRIMARY KEY (pool_id, ship_id)
);

-- Insert seed data (5 routes from requirements)
INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline)
VALUES
  ('R001', 'Container', 'HFO', 2024, 91.0, 5000, 12000, 4500, true),
  ('R002', 'BulkCarrier', 'LNG', 2024, 88.0, 4800, 11500, 4200, false),
  ('R003', 'Tanker', 'MGO', 2024, 93.5, 5100, 12500, 4700, false),
  ('R004', 'RoRo', 'HFO', 2025, 89.2, 4900, 11800, 4300, false),
  ('R005', 'Container', 'LNG', 2025, 90.5, 4950, 11900, 4400, false);

-- Verify data
SELECT * FROM routes ORDER BY route_id;

-- Success message
SELECT 'Database setup complete! 5 routes inserted.' as status;
