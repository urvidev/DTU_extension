//  Supabase Database Status Check
// This file can be included in the admin panel to check database connection status

async function checkSupabaseStatus(supabaseClient) {
    try {
        // Try a simple query to check if the database is responsive
        const { data, error } = await supabaseClient
            .from('school_submissions')
            .select('id')
            .limit(1);
            
        if (error) {
            console.error('Supabase connection test error:', error);
            return {
                status: 'error',
                message: `Database error: ${error.message}`,
                details: error
            };
        }
        
        // Check if tables exist
        const tables = [
            'school_submissions',
            'mentor_submissions',
            'ngo_submissions',
            'contact_submissions'
        ];
        
        const tableChecks = await Promise.all(tables.map(async (table) => {
            const { data: testData, error: testError } = await supabaseClient
                .from(table)
                .select('count(*)');
                
            return {
                table,
                exists: !testError,
                count: testError ? 0 : testData[0]?.count || 0,
                error: testError ? testError.message : null
            };
        }));
        
        // Check storage
        let storageStatus = { status: 'unknown' };
        try {
            const { data: buckets, error: bucketsError } = await supabaseClient
                .storage
                .listBuckets();
                
            storageStatus = {
                status: bucketsError ? 'error' : 'connected',
                buckets: bucketsError ? [] : buckets,
                error: bucketsError ? bucketsError.message : null
            };
        } catch (storageError) {
            storageStatus = {
                status: 'error',
                error: storageError.message
            };
        }
        
        return {
            status: 'connected',
            tables: tableChecks,
            storage: storageStatus,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Failed to check Supabase status:', error);
        return {
            status: 'error',
            message: `Connection error: ${error.message}`,
            details: error
        };
    }
}

// Helper function to create tables if they don't exist
async function ensureTablesExist(supabaseClient) {
    const tables = [
        {
            name: 'school_submissions',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true },
                { name: 'schoolName', type: 'text' },
                { name: 'contactName', type: 'text' },
                { name: 'position', type: 'text' },
                { name: 'email', type: 'text' },
                { name: 'phone', type: 'text' },
                { name: 'schoolAddress', type: 'text' },
                { name: 'studentCount', type: 'integer' },
                { name: 'interests', type: 'jsonb' },
                { name: 'message', type: 'text' },
                { name: 'created_at', type: 'timestamp' }
            ]
        },
        {
            name: 'mentor_submissions',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true },
                { name: 'name', type: 'text' },
                { name: 'email', type: 'text' },
                { name: 'phone', type: 'text' },
                { name: 'organization', type: 'text' },
                { name: 'designation', type: 'text' },
                { name: 'expertise', type: 'jsonb' },
                { name: 'otherExpertise', type: 'text' },
                { name: 'experience', type: 'text' },
                { name: 'availability', type: 'text' },
                { name: 'message', type: 'text' },
                { name: 'created_at', type: 'timestamp' }
            ]
        },
        {
            name: 'ngo_submissions',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true },
                { name: 'ngoName', type: 'text' },
                { name: 'contactName', type: 'text' },
                { name: 'designation', type: 'text' },
                { name: 'email', type: 'text' },
                { name: 'phone', type: 'text' },
                { name: 'website', type: 'text' },
                { name: 'address', type: 'text' },
                { name: 'establishedYear', type: 'integer' },
                { name: 'focusAreas', type: 'jsonb' },
                { name: 'otherFocus', type: 'text' },
                { name: 'message', type: 'text' },
                { name: 'previousWork', type: 'text' },
                { name: 'created_at', type: 'timestamp' }
            ]
        },
        {
            name: 'contact_submissions',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true },
                { name: 'name', type: 'text' },
                { name: 'email', type: 'text' },
                { name: 'subject', type: 'text' },
                { name: 'message', type: 'text' },
                { name: 'created_at', type: 'timestamp' }
            ]
        }
    ];
    
    // Note: In a real scenario, you would use SQL migrations or Supabase's dashboard
    // This is just a helper function to demonstrate the table structure needed
    
    return {
        status: 'success',
        message: 'Required table structure provided. Please create these tables in the Supabase dashboard.',
        tables: tables
    };
}

// Helper function for properly formatting form data before submission
function prepareFormDataForSupabase(formData) {
    // Create a copy to avoid modifying the original
    const cleanData = { ...formData };
    
    // Format arrays properly for Supabase JSONB fields
    for (const key in cleanData) {
        const value = cleanData[key];
        
        // Handle arrays (like checkboxes)
        if (Array.isArray(value)) {
            // Make sure the array is valid for Supabase JSONB
            cleanData[key] = value;
        }
        
        // Convert empty strings to null
        if (value === '') {
            cleanData[key] = null;
        }
    }
    
    // Make sure created_at is in ISO format
    if (!cleanData.created_at) {
        cleanData.created_at = new Date().toISOString();
    }
    
    return cleanData;
}

// Helper function to safely submit form data to Supabase
async function submitFormToSupabase(supabase, tableName, formData) {
    if (!supabase) {
        throw new Error('Supabase client is not initialized');
    }
    
    // Prepare the data
    const cleanData = prepareFormDataForSupabase(formData);
    
    console.log(`Submitting to ${tableName}:`, cleanData);
    
    try {
        // Check if the table exists first
        const { data: testData, error: testError } = await supabase
            .from(tableName)
            .select('count(*)', { count: 'exact', head: true });
        
        if (testError && testError.code === '42P01') { // PostgreSQL code for table does not exist
            throw new Error(`Table '${tableName}' does not exist. Please create it in your Supabase dashboard.`);
        }
        
        // Submit the data
        const { data, error } = await supabase
            .from(tableName)
            .insert([cleanData]);
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error(`Error submitting to ${tableName}:`, error);
        return { success: false, error };
    }
}

// Export functions if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkSupabaseStatus,
        ensureTablesExist,
        prepareFormDataForSupabase,
        submitFormToSupabase
    };
}

// Add functions to window object for browser use
if (typeof window !== 'undefined') {
    window.prepareFormDataForSupabase = prepareFormDataForSupabase;
    window.submitFormToSupabase = submitFormToSupabase;
}
