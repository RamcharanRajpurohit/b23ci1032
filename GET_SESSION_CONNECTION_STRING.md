# 🎯 GET YOUR SESSION MODE CONNECTION STRING FROM SUPABASE

## Why This Is Needed

Your network doesn't support IPv6, so you need to use Supabase's **Session Mode Pooler** which supports IPv4.

The "Tenant or user not found" error means we need the EXACT connection string format from Supabase.

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Open Supabase Dashboard

Go to: https://supabase.com/dashboard/project/gfjbyrywwzcfavlfsgop

### Step 2: Click "Connect" Button

- Look at the top right of the dashboard
- Click the **"Connect"** button
- A modal will open

### Step 3: Select "Session" Mode

In the connection modal:
1. Look for tabs or dropdown at the top
2. You'll see options like:
   - **URI** / **Session** / **Transaction** / **Direct**
3. Click on **"Session"** (or "Pooler - Session Mode")

### Step 4: Copy the Connection String

You should see a connection string that looks like:

```
postgres://postgres.gfjbyrywwzcfavlfsgop:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

**Important Details:**
- Should have `pooler.supabase.com` in the hostname
- Port should be **5432** (NOT 6543)
- Username format: `postgres.PROJECT-REF` (with a DOT)

### Step 5: Replace Password

The connection string will show `[YOUR-PASSWORD]` or `****`

Replace it with your actual password: `aGYKetISHxrDu3Xp`

Final string should look like:
```
postgres://postgres.gfjbyrywwzcfavlfsgop:aGYKetISHxrDu3Xp@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### Step 6: Update .env File

1. Open `/home/ramcharan/Documents/b23ci1032/backend/.env`
2. Replace the DATABASE_URL line with your copied string
3. Save the file

### Step 7: Restart Backend

```bash
cd /home/ramcharan/Documents/b23ci1032/backend
npm run dev
```

---

## 🔍 WHAT TO LOOK FOR

**Success indicators:**
```
🔌 Connecting to database...
📍 DATABASE_URL: postgresql://postgres.gfjbyrywwzcfavlfsgop:****@aws-0-...
✅ Database connected successfully
🚀 Server running on port 3001
```

**If you still see error:**
- Screenshot the Supabase "Connect" modal
- Share the exact connection string format shown (with password hidden)
- There might be a special format or setting needed

---

## 📸 Screenshot Guide

If you're unsure, take a screenshot of:

1. The Supabase "Connect" modal
2. With "Session" mode selected
3. Showing the connection string (you can blur/hide the password)

This will help identify the exact format Supabase expects.

---

## 🆘 Alternative If Session Mode Doesn't Work

If Supabase says "Session mode not available" or similar:

1. Check if you need to enable it in project settings
2. OR Supabase may require the **IPv4 add-on** purchase
3. OR you may need to test via Supabase's online SQL editor only

---

## ✅ ONCE CONNECTED

After the backend connects successfully:

1. Test in browser: http://localhost:3001/routes
2. Should return 5 routes (R001-R005)
3. Then start the frontend and test the full app

---

**The database is set up correctly - we just need the right connection string format!** 🚀
