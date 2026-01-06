# Quick Setup Guide

Follow these steps to get Disease Connect running locally.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - Name: `disease-connect-pro` (or any name)
   - Database Password: (save this securely)
   - Region: Choose closest to you
4. Wait 2-3 minutes for project to initialize

## Step 3: Get Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 4: Create Environment File

Create a file named `.env.local` in the `disease-connect` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 3.

## Step 5: Set Up Database

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `database/schema.sql` from this project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

## Step 6: Seed the Database

```bash
npm run seed
```

This will populate your database with sample data. You should see:
- ✅ Inserted X diseases
- ✅ Inserted X genes
- ✅ Inserted X disease-gene associations
- ✅ Inserted X comorbidity relationships

## Step 7: Run the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Troubleshooting

### "Missing Supabase credentials" error
- Make sure `.env.local` exists in the `disease-connect` folder
- Check that variable names start with `NEXT_PUBLIC_`
- Restart the dev server after creating `.env.local`

### "relation does not exist" error
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check that all tables were created (go to **Table Editor** in Supabase)

### Seed script fails
- Make sure your `.env.local` has the correct Supabase URL and key
- Check that tables exist in Supabase
- Try running the seed script again

### Graph not showing
- Make sure you ran `npm run seed` successfully
- Check browser console for errors
- Verify data exists in Supabase (go to **Table Editor**)

## Next Steps

Once everything is working:
1. Explore the network graph on the home page
2. Search for diseases using the search bar
3. Click on diseases to see detailed information
4. Customize the data in `scripts/mock-data.json` and reseed

## Deploy to Vercel

When ready to deploy:
1. Push code to GitHub
2. Go to vercel.com
3. Import your GitHub repo
4. Add the same environment variables
5. Deploy!

