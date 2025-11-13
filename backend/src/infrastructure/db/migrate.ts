import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('✅ Migration completed successfully');
  } catch (error: any) {
    if (error.code === 'ENETUNREACH' && error.address?.includes(':')) {
      console.error('❌ Migration failed: IPv6 connectivity issue');
      console.error('Your Supabase database is only accessible via IPv6, but your system cannot reach it.');
      console.error('\nPossible solutions:');
      console.error('1. Enable IPv6 on your network/system');
      console.error('2. Use Supabase pooler with IPv4 (aws-0-ap-southeast-1.pooler.supabase.com)');
      console.error('3. Use a VPN or proxy that supports IPv6');
      console.error('4. Run migration directly from Supabase SQL Editor');
    } else {
      console.error('❌ Migration failed:', error);
    }
  } finally {
    await pool.end();
  }
}

migrate();
