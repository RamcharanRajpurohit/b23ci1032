import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    const seedData = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await pool.query(seedData);
    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await pool.end();
  }
}

seed();
