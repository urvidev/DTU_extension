// Supabase setup verification script
// This script checks if all required tables exist in your Supabase project
// Run this script in the browser console after opening any page of your website

async function verifySupabaseTables() {
  console.log('🔍 Verifying Supabase tables...');
    // Try to use global client first, otherwise initialize a new one
  let supabase;
  
  if (typeof window.supabaseClient !== 'undefined') {
    console.log('ℹ️ Using global Supabase client');
    supabase = window.supabaseClient;
  } else if (typeof window.supabase !== 'undefined') {
    console.log('ℹ️ Creating new Supabase client (global client not found)');
    const SUPABASE_URL = "https://vbliswazkbdlswqgmcmo.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibGlzd2F6a2JkbHN3cWdtY21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjU4NTEsImV4cCI6MjA2NDEwMTg1MX0.lgn6Q2FFeC1JiSJMH2gpMwshg13fJ7ZMoBmMdAngicM";
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  } else {
    console.error('❌ Supabase is not initialized. Make sure the Supabase script is loaded.');
    return;
  }
  
  // Tables that should exist
  const requiredTables = [
    'school_submissions',
    'mentor_submissions',
    'ngo_submissions',
    'contact_submissions'
  ];
  
  const tableResults = {};
  
  // Check each table
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count(*)')
        .limit(1);
      
      if (error) {
        console.error(`❌ Table '${table}' error:`, error.message);
        tableResults[table] = {
          exists: false,
          error: error.message
        };
      } else {
        console.log(`✅ Table '${table}' exists with ${data[0]?.count || 0} records`);
        tableResults[table] = {
          exists: true,
          recordCount: data[0]?.count || 0
        };
      }
    } catch (err) {
      console.error(`❌ Error checking table '${table}':`, err);
      tableResults[table] = {
        exists: false,
        error: err.message
      };
    }
  }
  
  // Summary
  const allTablesExist = Object.values(tableResults).every(result => result.exists);
  
  if (allTablesExist) {
    console.log('✅ All required tables exist! Your Supabase setup is correct.');
  } else {
    console.log('❌ Some tables are missing. Please create them as described in SUPABASE_SETUP.md');
    
    // Print SQL statements for missing tables
    console.log('\nUse these SQL statements to create missing tables:');
    
    if (!tableResults['school_submissions'].exists) {
      console.log(`
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
      `);
    }
      if (!tableResults['mentor_submissions'].exists) {
      console.log(`
CREATE TABLE mentor_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  designation TEXT,
  expertise JSONB,
  other_expertise TEXT,
  experience TEXT,
  availability TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
      `);
    }
    
    if (!tableResults['ngo_submissions'].exists) {
      console.log(`
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
      `);
    }
    
    if (!tableResults['contact_submissions'].exists) {
      console.log(`
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
      `);
    }
  }
  
  return tableResults;
}

// Run the verification
verifySupabaseTables().then(results => {
  console.log('Verification complete:', results);
});
