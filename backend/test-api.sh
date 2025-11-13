#!/bin/bash
# Test script for FuelEU Maritime API
# Make sure the backend is running on http://localhost:3001

BASE_URL="http://localhost:3001"

echo "========================================="
echo "Testing FuelEU Maritime API"
echo "========================================="
echo ""

echo "1. Testing GET /routes"
echo "-------------------------------------"
curl -s "$BASE_URL/routes" | jq '.' || echo "Failed"
echo ""
echo ""

echo "2. Testing GET /routes/comparison"
echo "-------------------------------------"
curl -s "$BASE_URL/routes/comparison" | jq '.' || echo "Failed"
echo ""
echo ""

echo "3. Testing GET /compliance/cb (R001, 2024)"
echo "-------------------------------------"
curl -s "$BASE_URL/compliance/cb?shipId=R001&year=2024" | jq '.' || echo "Failed"
echo ""
echo ""

echo "4. Testing GET /compliance/cb (R002, 2024)"
echo "-------------------------------------"
curl -s "$BASE_URL/compliance/cb?shipId=R002&year=2024" | jq '.' || echo "Failed"
echo ""
echo ""

echo "5. Testing GET /banking/records (R001, 2024)"
echo "-------------------------------------"
curl -s "$BASE_URL/banking/records?shipId=R001&year=2024" | jq '.' || echo "Failed"
echo ""
echo ""

echo "6. Testing POST /banking/bank"
echo "-------------------------------------"
curl -s -X POST "$BASE_URL/banking/bank" \
  -H "Content-Type: application/json" \
  -d '{"shipId":"R002","year":2024,"amount":1000}' | jq '.' || echo "Failed"
echo ""
echo ""

echo "7. Testing GET /compliance/adjusted-cb (R001, 2024)"
echo "-------------------------------------"
curl -s "$BASE_URL/compliance/adjusted-cb?shipId=R001&year=2024" | jq '.' || echo "Failed"
echo ""
echo ""

echo "========================================="
echo "Tests Complete!"
echo "========================================="
