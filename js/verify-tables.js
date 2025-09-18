// Verify and create Supabase tables if they don't exist
// This script should be included after supabase-init.js

document.addEventListener('DOMContentLoaded', async function() {
    if (typeof window.supabaseClient === 'undefined') {
        console.error('Supabase client not initialized. Cannot verify tables.');
        return;
    }
    
    const supabase = window.supabaseClient;
    const requiredTables = [
        'school_submissions',
        'mentor_submissions',
        'ngo_submissions',
        'contact_submissions'
    ];
    
    // Check if tables exist
    const tablesStatus = {};
    
    for (const tableName of requiredTables) {
        try {
            console.log(`Checking if table ${tableName} exists...`);
            
            const { data, error } = await supabase
                .from(tableName)
                .select('count(*)', { count: 'exact', head: true });
                
            if (error && error.code === '42P01') { // Table doesn't exist error code
                tablesStatus[tableName] = false;
                console.warn(`Table ${tableName} does not exist`);
            } else if (error) {
                console.error(`Error checking table ${tableName}:`, error);
                tablesStatus[tableName] = false;
            } else {
                tablesStatus[tableName] = true;
                console.log(`Table ${tableName} exists`);
            }
        } catch (e) {
            console.error(`Error checking table ${tableName}:`, e);
            tablesStatus[tableName] = false;
        }
    }
    
    console.log('Tables status:', tablesStatus);
    
    // Alert user if tables don't exist
    const missingTables = Object.entries(tablesStatus)
        .filter(([_, exists]) => !exists)
        .map(([tableName]) => tableName);
        
    if (missingTables.length > 0) {
        console.warn(`The following tables are missing: ${missingTables.join(', ')}`);
        console.warn('Please create the tables as described in SUPABASE_SETUP.md');
        
        // Show alert on the page if we're on a form page
        if (window.location.pathname.includes('volunteer-') || 
            window.location.pathname.includes('/admin/')) {
            const alertHtml = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Missing Database Tables</strong>
                    <p>The following tables are missing in your Supabase database: ${missingTables.join(', ')}</p>
                    <p>Please create them as described in SUPABASE_SETUP.md before submitting forms.</p>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            const alertContainer = document.createElement('div');
            alertContainer.className = 'container mt-2';
            alertContainer.innerHTML = alertHtml;
            
            // Insert after the navbar or at the top of the body
            const navbar = document.querySelector('nav');
            if (navbar && navbar.nextSibling) {
                document.body.insertBefore(alertContainer, navbar.nextSibling);
            } else {
                const firstElement = document.body.firstChild;
                document.body.insertBefore(alertContainer, firstElement);
            }
        }
    }
});
