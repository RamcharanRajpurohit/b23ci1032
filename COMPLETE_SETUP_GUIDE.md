# 🚀 COMPLETE SETUP GUIDE - Follow These Steps Exactly

## ⚠️ CURRENT STATUS

Your project has:
- ✅ All TypeScript compilation errors FIXED
- ✅ Backend builds successfully
- ✅ Frontend builds successfully
- ⚠️ Database needs manual setup (IPv6 connectivity issue)
- ⚠️ Connection string needs to be updated

## 📋 STEP-BY-STEP INSTRUCTIONS

### STEP 1: Set Up Supabase Database (5 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Log in to your account
   - Select your project: `gfjbyrywwzcfavlfsgop`

2. **Run Database Setup**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**
   - Open this file on your computer: `backend/SUPABASE_SETUP.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)
   - Wait for completion
   - You should see: "Database setup complete! 5 routes inserted."

3. **Verify Data**
   - Go to **Database** > **Tables** in left sidebar
   - You should see 5 tables: routes, ship_compliance, bank_entries, pools, pool_members
   - Click on `routes` table
   - Verify you see 5 rows (R001 through R005)

### STEP 2: Get Correct Connection String (2 minutes)

1. **In Supabase Dashboard:**
   - Go to **Project Settings** (gear icon, bottom left)
   - Click **Database** tab
   - Scroll down to **Connection Pooling** section

2. **Copy the Connection String:**
   - Make sure **Transaction** mode is selected (NOT Session mode)
   - Click the copy icon next to the connection string
   - It should look like:
     ```
     postgresql://postgres.gfjbyrywwzcfavlfsgop:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
     ```
   - **Important:** Port should be **6543** (not 5432)

### STEP 3: Update Backend Configuration (1 minute)

1. **Open the file:** `backend/.env`
   
2. **Replace the DATABASE_URL line** with your connection string from Step 2:
   ```env
   PORT=3001
   DATABASE_URL=postgresql://postgres.gfjbyrywwzcfavlfsgop:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   NODE_ENV=development
   ```

3. **Save the file**

### STEP 4: Start Backend (2 minutes)

```bash
cd /home/ramcharan/Documents/b23ci1032/backend

# Install dependencies (if not already done)
npm install

# Start the backend server
npm run dev
```

You should see:
```
Server listening on port 3001
```

**Leave this terminal running!**

### STEP 5: Test Backend (2 minutes)

Open a NEW terminal and run:

```bash
# Test routes endpoint
curl http://localhost:3001/routes

# You should see 5 routes (R001-R005) as JSON
```

If you see the 5 routes, SUCCESS! ✅

### STEP 6: Start Frontend (2 minutes)

Open a NEW terminal:

```bash
cd /home/ramcharan/Documents/b23ci1032/frontend

# Install dependencies (if not already done)
npm install

# Start the frontend
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

### STEP 7: Test the Application (3 minutes)

1. **Open your browser:**
   - Go to: http://localhost:5173

2. **Test Routes Tab:**
   - You should see 5 routes displayed
   - R001 should show as baseline

3. **Test Compare Tab:**
   - Should show comparison data
   - Charts should render

4. **Test Banking Tab:**
   - Enter Ship ID: `R001`
   - Enter Year: `2024`
   - Click "Load CB"
   - Should show compliance balance

5. **Test Pooling Tab:**
   - Should load data for available ships

## 🐛 TROUBLESHOOTING

### Issue: "Tenant or user not found"
**Solution:** Your connection string is wrong.
- Go back to Step 2
- Make sure you're using **Pooler** connection (port 6543)
- Make sure you're in **Transaction** mode (not Session mode)

### Issue: Backend won't start
**Solution:** Check if port 3001 is already in use
```bash
# Kill any process on port 3001
kill -9 $(lsof -t -i:3001)

# Try starting again
npm run dev
```

### Issue: "Cannot connect to database"
**Solution:** 
1. Verify your internet connection
2. Make sure you ran SUPABASE_SETUP.sql in Step 1
3. Check your connection string has the correct password

### Issue: Frontend shows no data
**Solution:**
1. Make sure backend is running (Step 4)
2. Check browser console for errors (F12)
3. Verify backend URL in `frontend/.env` is `http://localhost:3001`

### Issue: "shipId, year, and amount are required"
**Solution:**
- Use route IDs (R001, R002, etc.) as ship IDs
- Make sure all form fields are filled
- Year should be 2024 or 2025

## 📊 DATA TO USE FOR TESTING

Use these values when testing:

**Ship IDs (Route IDs):**
- R001 (Container, HFO, 2024) - This is the baseline
- R002 (BulkCarrier, LNG, 2024)
- R003 (Tanker, MGO, 2024)
- R004 (RoRo, HFO, 2025)
- R005 (Container, LNG, 2025)

**Years:**
- 2024
- 2025

**Test Banking:**
```json
{
  "shipId": "R002",
  "year": 2024,
  "amount": 1000
}
```

## ✅ SUCCESS CRITERIA

You know everything is working when:
- ✅ Backend runs without errors on port 3001
- ✅ `curl http://localhost:3001/routes` returns 5 routes
- ✅ Frontend loads at http://localhost:5173
- ✅ All 4 tabs (Routes, Compare, Banking, Pooling) display data
- ✅ No errors in browser console
- ✅ You can interact with the UI (click buttons, load data)

## 🎯 NEXT STEPS AFTER SETUP

Once everything is running:

1. **Test all features thoroughly**
2. **Take screenshots** for your submission
3. **Complete AGENT_WORKFLOW.md** with your AI tool usage
4. **Complete REFLECTION.md** with your learning
5. **Push to GitHub** with proper commit history

## 📞 NEED HELP?

Check these files for more details:
- `backend/SETUP_INSTRUCTIONS.md` - Detailed backend guide
- `backend/SUPABASE_SETUP.md` - Supabase configuration help
- `README.md` - Project overview

Good luck! 🚀
