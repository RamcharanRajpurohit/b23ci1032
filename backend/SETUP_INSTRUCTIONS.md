# FuelEU Maritime - Backend Setup Instructions

## ⚠️ IMPORTANT: Database Setup Required

Your Supabase database requires manual setup due to IPv6 connectivity issues.

### Step 1: Run Database Setup in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Copy the entire contents of `SUPABASE_SETUP.sql`
5. Paste it into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`
7. Verify you see "Database setup complete! 5 routes inserted."

### Step 2: Get Your Connection String

1. In Supabase Dashboard, go to **Project Settings** > **Database**
2. Scroll to **Connection Pooling** section
3. Copy the **Connection string** in **Transaction mode**
4. It should look like:
   ```
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

### Step 3: Update .env File

1. Open `backend/.env`
2. Replace the `DATABASE_URL` with your pooler connection string from Step 2
3. Save the file

Example:
```env
PORT=3001
DATABASE_URL=postgresql://postgres.gfjbyrywwzcfavlfsgop:G6GGXK6ksn+ry.N@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
NODE_ENV=development
```

### Step 4: Install Dependencies

```bash
cd backend
npm install
```

### Step 5: Build and Run

```bash
# Build TypeScript
npm run build

# Start the server
npm run dev
```

The backend will be running at: http://localhost:3001

## 🧪 Testing the API

### Test Routes Endpoint
```bash
curl http://localhost:3001/routes
```

Expected: Should return 5 routes (R001-R005)

### Test Comparison Endpoint
```bash
curl http://localhost:3001/routes/comparison
```

Expected: Comparison data between baseline (R001) and other routes

### Test Compliance Balance
```bash
curl "http://localhost:3001/compliance/cb?shipId=SHIP001&year=2024"
```

### Test Banking Records
```bash
curl "http://localhost:3001/banking/records?shipId=SHIP001&year=2024"
```

## 📊 Sample Data Loaded

| Route ID | Vessel Type | Fuel Type | Year | GHG Intensity | Fuel Consumption | Distance | Total Emissions | Baseline |
|----------|-------------|-----------|------|---------------|------------------|----------|-----------------|----------|
| R001 | Container | HFO | 2024 | 91.0 | 5000 | 12000 | 4500 | ✅ |
| R002 | BulkCarrier | LNG | 2024 | 88.0 | 4800 | 11500 | 4200 | ❌ |
| R003 | Tanker | MGO | 2024 | 93.5 | 5100 | 12500 | 4700 | ❌ |
| R004 | RoRo | HFO | 2025 | 89.2 | 4900 | 11800 | 4300 | ❌ |
| R005 | Container | LNG | 2025 | 90.5 | 4950 | 11900 | 4400 | ❌ |

## 🔧 Troubleshooting

### Error: "Tenant or user not found"
- Your connection string format is incorrect
- Make sure you're using the **Pooler connection string** from Supabase
- Verify the project reference and password are correct

### Error: Connection timeout or ENETUNREACH
- You're using the direct connection (IPv6) instead of pooler (IPv4)
- Switch to the pooler connection string as described in Step 2

### Tables not found
- Run the `SUPABASE_SETUP.sql` script in Supabase SQL Editor
- Verify all 5 tables were created successfully

## 📁 Project Structure

```
backend/
├── src/
│   ├── adapters/
│   │   ├── inbound/http/        # Controllers
│   │   └── outbound/postgres/   # Repositories
│   ├── core/
│   │   ├── application/         # Use Cases
│   │   ├── domain/              # Entities
│   │   └── ports/               # Interfaces
│   └── infrastructure/
│       ├── db/                  # Schema & Seed
│       └── server/              # Express setup
├── .env                         # Your config (not in git)
├── SUPABASE_SETUP.sql          # Run this in Supabase!
└── package.json
```

## ✅ Next Steps

Once the backend is running:
1. Test all endpoints using curl or Postman
2. Set up the frontend (see `/frontend/README.md`)
3. The frontend will connect to http://localhost:3001
