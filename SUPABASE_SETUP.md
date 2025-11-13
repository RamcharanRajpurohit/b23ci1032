# Supabase Database Configuration Guide

## Issue: IPv6 Connectivity
Your Supabase database is only accessible via IPv6, but your system doesn't support IPv6 connections.

## Solutions:

### Option 1: Use Supabase SQL Editor (RECOMMENDED for migrations)
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `src/infrastructure/db/schema.sql`
4. Run the SQL directly in the editor
5. Then copy and paste `src/infrastructure/db/seed.sql` and run it

### Option 2: Use Supabase Pooler (for application runtime)
Update your `.env` file with the correct pooler connection string.

Get your pooler connection string from Supabase:
1. Go to Project Settings > Database
2. Look for "Connection Pooling" section
3. Copy the "Connection string" in Transaction mode
4. It should look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

### Option 3: Enable IPv6 on your system
If you're on Ubuntu/Linux:
```bash
# Check if IPv6 is disabled
cat /proc/sys/net/ipv6/conf/all/disable_ipv6

# If it returns 1, enable IPv6 temporarily:
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=0
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=0

# Or permanently by editing /etc/sysctl.conf
```

### Option 4: Use VPN/Proxy with IPv6 support

## Current Configuration Status:
- ✅ SSL Configuration added for Supabase
- ✅ IPv4 DNS preference set in scripts
- ⚠️  Direct database connection requires IPv6
- ℹ️  Application can run with pooler connection

## What's Been Configured:
1. Added SSL configuration to all database connections
2. Added IPv4 DNS preference to npm scripts
3. Created `.env` file with pooler connection string template
4. Updated server, migrate, and seed files with Supabase-compatible config

## To Get Your Correct Pooler String:
Please check your Supabase dashboard and update the `.env` file with the exact pooler connection string.
