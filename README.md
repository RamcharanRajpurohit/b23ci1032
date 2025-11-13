# FuelEU Maritime Compliance Platform

Full-stack TypeScript application for managing maritime fuel compliance under FuelEU regulations.

## 🎯 Features

- **Routes Management**: Track vessel routes with GHG intensity data
- **Compliance Comparison**: Compare actual vs target intensities
- **Banking (Article 20)**: Bank surplus compliance balance
- **Pooling (Article 21)**: Pool compliance balance across ships

## 🏗️ Architecture

**Hexagonal Architecture (Ports & Adapters / Clean Architecture)**

- **Core Domain**: Business logic independent of frameworks
- **Ports**: Interfaces defining contracts
- **Adapters**: Implementations (HTTP, Database, UI)
- **Infrastructure**: Framework-specific code

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for PostgreSQL database)
- PostgreSQL connection with IPv4 support (or direct IPv6 access)

### 1. Database Setup

⚠️ **CRITICAL STEP** - Run this first!

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to SQL Editor
3. Copy and run `backend/SUPABASE_SETUP.sql`
4. Verify 5 routes are inserted

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Get your Supabase Pooler connection string:
# Dashboard > Project Settings > Database > Connection Pooling
# Copy the "Transaction mode" connection string

# Update .env with your connection string
# DATABASE_URL=postgresql://postgres.YOUR-PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres

# Build
npm run build

# Start backend
npm run dev
```

Backend runs at: http://localhost:3001

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Build
npm run build

# Start frontend
npm run dev
```

Frontend runs at: http://localhost:5173

## 📊 Sample Data

The database includes 5 routes as per assignment requirements:

| Route ID | Vessel Type | Fuel Type | Year | GHG Intensity | Baseline |
|----------|-------------|-----------|------|---------------|----------|
| R001 | Container | HFO | 2024 | 91.0 | ✅ |
| R002 | BulkCarrier | LNG | 2024 | 88.0 | ❌ |
| R003 | Tanker | MGO | 2024 | 93.5 | ❌ |
| R004 | RoRo | HFO | 2025 | 89.2 | ❌ |
| R005 | Container | LNG | 2025 | 90.5 | ❌ |

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### API Manual Testing
```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── core/
│   │   │   ├── domain/          # Entities
│   │   │   ├── application/     # Use Cases
│   │   │   └── ports/           # Interfaces
│   │   ├── adapters/
│   │   │   ├── inbound/http/    # Controllers
│   │   │   └── outbound/postgres/ # Repositories
│   │   └── infrastructure/
│   │       ├── db/              # Schema & Seeds
│   │       └── server/          # Express setup
│   ├── SUPABASE_SETUP.sql      # ⚠️ RUN THIS FIRST!
│   └── SETUP_INSTRUCTIONS.md   # Detailed backend guide
├── frontend/
│   ├── src/
│   │   ├── core/
│   │   │   ├── domain/
│   │   │   └── ports/
│   │   └── adapters/
│   │       ├── ui/components/
│   │       └── infrastructure/
│   └── README.md
├── AGENT_WORKFLOW.md           # AI agent usage documentation
├── REFLECTION.md               # Learning reflections
└── README.md                   # This file
```

## 🔧 Troubleshooting

### "Tenant or user not found" Error
- You're using the wrong connection string format
- Use the **Pooler connection string** (Transaction mode, port 6543)
- Get it from: Supabase Dashboard > Project Settings > Database > Connection Pooling

### "Connection timeout" or "ENETUNREACH"
- Your network doesn't support IPv6
- Use the Supabase Pooler (IPv4) instead of direct connection
- See `backend/SETUP_INSTRUCTIONS.md` for details

### "shipId, year, and amount are required"
- Make sure your frontend is sending all three fields in the request body
- Check browser console for error details
- Use route IDs (R001-R005) as shipId values

### Tables not found
- Run `backend/SUPABASE_SETUP.sql` in Supabase SQL Editor first
- Verify in Supabase: Database > Tables
- Should see: routes, ship_compliance, bank_entries, pools, pool_members

## 📚 API Endpoints

### Routes
- `GET /routes` - List all routes
- `GET /routes/comparison` - Compare baseline vs other routes
- `POST /routes/:id/baseline` - Set route as baseline

### Compliance
- `GET /compliance/cb?shipId=R001&year=2024` - Get compliance balance
- `GET /compliance/adjusted-cb?shipId=R001&year=2024` - Get adjusted CB

### Banking
- `GET /banking/records?shipId=R001&year=2024` - Get bank entries
- `POST /banking/bank` - Bank surplus (body: {shipId, year, amount})
- `POST /banking/apply` - Apply banked (body: {shipId, year, amount})

### Pooling
- `POST /pools` - Create pool (body: {year, members: [{shipId, cbBefore}]})

## 🎓 Documentation

- `AGENT_WORKFLOW.md` - Details on AI tools used (Copilot, Claude, Cursor)
- `REFLECTION.md` - Learning outcomes and insights
- `backend/SETUP_INSTRUCTIONS.md` - Detailed backend setup
- `SUPABASE_SETUP.md` - Supabase configuration guide

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- TailwindCSS
- Vite
- Axios
- Recharts

**Backend:**
- Node.js
- TypeScript
- Express
- PostgreSQL (Supabase)
- pg (node-postgres)

## ✅ Assignment Compliance

- ✅ Hexagonal Architecture implemented
- ✅ All 4 tabs functional (Routes, Compare, Banking, Pooling)
- ✅ TypeScript strict mode
- ✅ 5 sample routes from requirements
- ✅ Formulas match specifications
- ✅ AI agent documentation included
- ✅ Clean separation of concerns

## 📝 License

MIT

