# Supabase Setup Instructions for DTU Extension & Outreach

This document guides you through setting up Supabase for the DTU Extension & Outreach website's form submission and storage functionality.

## 1. Create a Supabase Project

1. Sign up or log in to Supabase at [https://supabase.com](https://supabase.com)
2. Create a new project with a name like "dtu-extension"
3. Wait for the database to be initialized

## 2. Create Database Tables

Create the following tables in your Supabase project:

### School Submissions Table
```sql
CREATE TABLE school_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schoolName TEXT NOT NULL,
  contactName TEXT NOT NULL,
  position TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  schoolAddress TEXT,
  studentCount INTEGER,
  interests JSONB,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Mentor Submissions Table
```sql
CREATE TABLE mentor_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  designation TEXT,
  expertise JSONB,
  otherExpertise TEXT,
  experience TEXT,
  availability TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### NGO Submissions Table
```sql
CREATE TABLE ngo_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngoName TEXT NOT NULL,
  contactName TEXT NOT NULL,
  designation TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  address TEXT,
  establishedYear INTEGER,
  focusAreas JSONB,
  otherFocus TEXT,
  message TEXT,
  previousWork TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Contact Submissions Table
```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

## 3. Get API Keys and Update Code

1. In your Supabase dashboard, go to Settings > API
2. Copy the "URL" and "anon" key
3. Update these values in the following files:
   - `js/script.js`
   - `pages/get-involved/volunteer-forms.js`
   - `pages/admin/admin.js`

Replace:
```javascript
const SUPABASE_URL = "https://your-supabase-url.supabase.co";
const SUPABASE_KEY = "your-supabase-anon-key";
```

With your actual values:
```javascript
const SUPABASE_URL = "https://vbliswazkbdlswqgmcmo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibGlzd2F6a2JkbHN3cWdtY21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjU4NTEsImV4cCI6MjA2NDEwMTg1MX0.lgn6Q2FFeC1JiSJMH2gpMwshg13fJ7ZMoBmMdAngicM";
```

## 4. Set Row Level Security (RLS) Policies

For basic security, enable Row Level Security on all tables and add appropriate policies:

### For All Tables
1. Go to Authentication > Policies
2. Select each table
3. Enable RLS
4. Add a policy for INSERT that allows anyone to insert data:

```sql
-- Example for school_submissions
CREATE POLICY "Allow anonymous inserts"
ON school_submissions
FOR INSERT
TO anon
WITH CHECK (true);
```

For the admin dashboard to work, also add a policy for SELECT:

```sql
-- Example for school_submissions
CREATE POLICY "Allow authenticated selects"
ON school_submissions
FOR SELECT
TO authenticated
USING (true);
```

## 5. Test the Forms

1. Deploy your website or test locally
2. Submit test entries through each form
3. Check your Supabase dashboard to verify the data is being stored correctly

## 6. Admin Panel Access

The admin panel uses a hardcoded username and password for simplicity:
- Username: admin
- Password: dtu@extension123

In a production environment, you should implement proper authentication through Supabase Auth or another authentication provider.

## 7. Additional Security Measures (Recommended)

1. Set up CORS restrictions in Supabase dashboard: Settings > API > Configure CORS
2. Add your website's domain to the allowed origins
3. Consider implementing rate limiting if form spam becomes an issue

## Support

If you encounter any issues with the Supabase integration, refer to the [Supabase documentation](https://supabase.io/docs) or contact the development team.
