#!/bin/bash
# Test Supabase Connection - All Methods

echo "=================================="
echo "Testing Supabase Connections"
echo "=================================="
echo ""

# Method 1: Direct Connection (IPv6)
echo "1️⃣ Testing Direct Connection (IPv6)..."
echo "Connection: db.gfjbyrywwzcfavlfsgop.supabase.co:5432"
nc -zv db.gfjbyrywwzcfavlfsgop.supabase.co 5432 2>&1 | head -1
echo ""

# Method 2: Pooler Connection (IPv4)
echo "2️⃣ Testing Pooler Connection (IPv4)..."
echo "Connection: aws-0-ap-southeast-1.pooler.supabase.com:6543"
nc -zv aws-0-ap-southeast-1.pooler.supabase.com 6543 2>&1 | head -1
echo ""

echo "=================================="
echo "Results:"
echo "=================================="
echo ""
echo "✅ If Method 2 shows 'succeeded' = Use Pooler connection"
echo "❌ If both fail = Use Supabase SQL Editor to setup database"
echo ""
