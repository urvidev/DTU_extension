// Global Supabase client initialization
// Include this script before any other scripts that use Supabase

// Initialize Supabase client only once
if (typeof window.supabaseClient === 'undefined') {
    const SUPABASE_URL = "https://vbliswazkbdlswqgmcmo.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibGlzd2F6a2JkbHN3cWdtY21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjU4NTEsImV4cCI6MjA2NDEwMTg1MX0.lgn6Q2FFeC1JiSJMH2gpMwshg13fJ7ZMoBmMdAngicM";
    
    // Check if supabase is available
    if (typeof supabase !== 'undefined') {
        // Create a single client instance
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Global Supabase client initialized');
    } else {
        console.error('Supabase library not loaded. Please include the Supabase script first.');
    }
}
