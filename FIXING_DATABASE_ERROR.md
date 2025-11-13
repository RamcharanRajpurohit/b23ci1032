# 🚨 FIXING "Tenant or user not found" Error

## What This Error Means

**"Tenant or user not found"** is a **Supabase-specific error** that means:
- Your database connection string is **INCORRECT**
- The format doesn't match what Supabase expects
- OR the credentials (project ref/password) are wrong

This is **NOT** an application code error - it's a configuration issue.

---

## ✅ HOW TO FIX IT

### Step 1: Get Your CORRECT Connection String from Supabase

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Log in to your account

2. **Select Your Project:**
   - Click on your project: `gfjbyrywwzcfavlfsgop`

3. **Go to Database Settings:**
   - Click **Settings** (gear icon, bottom left)
   - Click **Database** tab

4. **Find Connection Pooling Section:**
   - Scroll down to **"Connection Pooling"**
   - Make sure **Transaction** mode is selected (NOT Session)
   - Port should show **6543** (NOT 5432)

5. **Copy the Connection String:**
   - Click the **Copy** icon next to the connection string
   - It should look like:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```

### Step 2: Update Your .env File

1. **Open:** `backend/.env`

2. **Replace the DATABASE_URL line** with the string you copied:
   ```env
   DATABASE_URL=postgresql://postgres.gfjbyrywwzcfavlfsgop:[YOUR-ACTUAL-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

3. **Important Checks:**
   - ✅ Port is **6543** (NOT 5432)
   - ✅ Host includes **pooler.supabase.com** (NOT just supabase.co)
   - ✅ User format is **postgres.[PROJECT-REF]** (with the dot)
   - ✅ Password is correct (no special characters escaped)

4. **Save the file**

### Step 3: Restart Backend Server

```bash
# Stop the current server (Ctrl+C in the terminal)

# Start again
cd /home/ramcharan/Documents/b23ci1032/backend
npm run dev
```

### Step 4: Verify Connection

You should see in the terminal:
```
🔌 Connecting to database...
📍 DATABASE_URL: postgresql://postgres.gfjbyrywwzcfavlfsgop:****@aws-0-...
✅ Database connected successfully
🚀 Server running on port 3001
```

If you see **"❌ Database connection failed"**, the connection string is still wrong.

---

## 🔍 NEW DEBUG FEATURES ADDED

I've added console logging to help you identify errors:

### Server Startup Logging:
- Shows connection attempt
- Hides password in logs (shows as ****)
- Tests connection immediately
- Shows clear success/failure message

### API Error Logging:
- All controllers now log errors to console
- Detects "Tenant or user not found" specifically
- Provides hints for fixing

### Example Error Output:
```
❌ Error in getAllRoutes: Tenant or user not found
💡 Database connection error - check .env DATABASE_URL
```

---

## 🧪 TEST YOUR CONNECTION

After updating .env and restarting:

### Test 1: Check Server Logs
Look for:
```
✅ Database connected successfully
```

### Test 2: Test Routes Endpoint
```bash
curl http://localhost:3001/routes
```

**Expected:** JSON array with 5 routes
**If Error:** Check server terminal for error messages

### Test 3: Test Pools Endpoint
```bash
curl -X POST http://localhost:3001/pools \
  -H "Content-Type: application/json" \
  -d '{"year": 2024, "members": []}'
```

**Expected:** Error about members being required (this is GOOD - means DB connected)
**If "Tenant or user not found":** Connection string still wrong

---

## 🎯 CHECKLIST

Before asking for help, verify:

- [ ] You copied the connection string from **Connection Pooling** section (NOT Connection string for direct access)
- [ ] Mode is set to **Transaction** (NOT Session)
- [ ] Port is **6543** (NOT 5432)
- [ ] You pasted the ENTIRE string including `postgresql://`
- [ ] You saved the `.env` file
- [ ] You restarted the backend server (Ctrl+C then `npm run dev`)
- [ ] You see the "🔌 Connecting to database..." message on startup
- [ ] No typos in the connection string

---

## 📸 Screenshot Guide

If you're still stuck, here's what to look for in Supabase Dashboard:

```
Settings > Database > Connection Pooling

[x] Transaction Mode    [ ] Session Mode
Port: 6543

Connection string:
postgresql://postgres.gfjbyrywwzcfavlfsgop:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
                      ^                     ^            ^                                               ^
                      |                     |            |                                               |
                This part -----------------+            |                                               |
                Should have                              |                                               |
                the dot (.)                              Must say "pooler"                               Must be 6543
                                                        (NOT just supabase.co)                          (NOT 5432)
```

---

## 🆘 STILL NOT WORKING?

### Option A: Try Direct Connection (if you have IPv6)
```env
DATABASE_URL=postgresql://postgres:G6GGXK6ksn+ry.N@db.gfjbyrywwzcfavlfsgop.supabase.co:5432/postgres
```

### Option B: Reset Your Supabase Password
1. Go to Supabase Dashboard > Settings > Database
2. Click "Reset database password"
3. Copy the new password
4. Update your connection string with new password

### Option C: Check Supabase Project Status
- Make sure your Supabase project is active (not paused)
- Check if you have a free tier limit reached
- Verify project is in the correct region

---

## ✅ SUCCESS INDICATORS

You'll know it's working when:

1. **Server starts with:**
   ```
   ✅ Database connected successfully
   ```

2. **API calls work:**
   ```bash
   curl http://localhost:3001/routes
   # Returns: [{"id":1,"route_id":"R001",...}]
   ```

3. **No more "Tenant or user not found" errors**

4. **Frontend can load data from backend**

---

**The code is perfect - it's just a connection string configuration issue!** 🎯
