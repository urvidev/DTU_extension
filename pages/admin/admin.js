// Admin dashboard JavaScript with Supabase integration
document.addEventListener('DOMContentLoaded', function() {
    // Hardcoded admin credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "dtu@extension123";
    let supabase;
    
    // Use the global client if available, otherwise create a new one as fallback
    if (typeof window.supabaseClient !== 'undefined') {
        supabase = window.supabaseClient;
        console.log('Using global Supabase client');
    } else {
        // Fallback to creating a new client (not recommended)
        console.warn('Global Supabase client not found. Creating a new instance (not recommended).');
        const SUPABASE_URL = "https://vbliswazkbdlswqgmcmo.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibGlzd2F6a2JkbHN3cWdtY21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjU4NTEsImV4cCI6MjA2NDEwMTg1MX0.lgn6Q2FFeC1JiSJMH2gpMwshg13fJ7ZMoBmMdAngicM";
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        } else {
            console.error('Supabase library not loaded. Admin dashboard will not work properly.');
        }
    }
    
    // Check database status when admin logs in
    async function checkDatabaseStatus() {
        try {
            const status = await checkSupabaseStatus(supabase);
            console.info('Database status:', status);
            return status;
        } catch (error) {
            console.error('Error checking database status:', error);
            return { status: 'error', message: error.message };
        }
    }
    
    // DOM Elements
    const loginScreen = document.getElementById('loginScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginError = document.getElementById('loginError');
    
    // Table body elements
    const schoolsTableBody = document.getElementById('schoolsTableBody');
    const mentorsTableBody = document.getElementById('mentorsTableBody');
    const ngosTableBody = document.getElementById('ngosTableBody');
    const contactsTableBody = document.getElementById('contactsTableBody');
    
    // Refresh buttons
    const refreshSchoolsBtn = document.getElementById('refreshSchoolsBtn');
    const refreshMentorsBtn = document.getElementById('refreshMentorsBtn');
    const refreshNgosBtn = document.getElementById('refreshNgosBtn');
    const refreshContactsBtn = document.getElementById('refreshContactsBtn');
    
    // Check if user is logged in based on session storage
    function checkAuth() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        if (isLoggedIn) {
            showDashboard();
            loadAllData(); // Load data for all tabs
        } else {
            showLogin();
        }
    }
    
    // Show login screen
    function showLogin() {
        loginScreen.style.display = 'block';
        dashboardScreen.style.display = 'none';
    }
      // Show dashboard screen
    async function showDashboard() {
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'block';
        
    // Check database connection when dashboard is shown
        const dbStatus = await checkDatabaseStatus();
        if (dbStatus.status !== 'connected') {
            // If there's a database connection issue, show warning
            const alertHtml = `
                <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
                    <strong>Database Connection Issue</strong>
                    <p class="mb-0">${dbStatus.message || 'Could not connect to database. Some features may not work.'}</p>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            const alertContainer = document.createElement('div');
            alertContainer.innerHTML = alertHtml;
            dashboardScreen.querySelector('.container').prepend(alertContainer);
        }
        
        // Check if all required tables exist
        const requiredTables = ['school_submissions', 'mentor_submissions', 'ngo_submissions', 'contact_submissions'];
        const missingTables = [];
        
        // Check each table
        for (const table of requiredTables) {
            try {
                const { data, error } = await supabase
                    .from(table)
                    .select('count(*)')
                    .limit(1);
                    
                if (error) {
                    console.error(`Table '${table}' error:`, error);
                    missingTables.push(table);
                }
            } catch (err) {
                console.error(`Error checking table '${table}':`, err);
                missingTables.push(table);
            }
        }
        
        // If there are missing tables, show warning
        if (missingTables.length > 0) {
            const missingTablesHtml = `
                <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                    <strong>Missing Database Tables</strong>
                    <p class="mb-0">The following tables are missing in your Supabase database:</p>
                    <ul class="mb-0">
                        ${missingTables.map(table => `<li>${table}</li>`).join('')}
                    </ul>
                    <hr>
                    <p class="mb-0">Please follow the instructions in <code>SUPABASE_SETUP.md</code> to create these tables.</p>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            const missingTablesContainer = document.createElement('div');
            missingTablesContainer.innerHTML = missingTablesHtml;
            dashboardScreen.querySelector('.container').prepend(missingTablesContainer);
        }
    }
    
    // Login functionality
    loginBtn.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Store login state in session storage
            sessionStorage.setItem('adminLoggedIn', 'true');
            loginError.style.display = 'none';
            showDashboard();
            loadAllData();
        } else {
            loginError.style.display = 'block';
        }
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('adminLoggedIn');
        showLogin();
    });
    
    // Load data for all tabs
    function loadAllData() {
        loadSchoolSubmissions();
        loadMentorSubmissions();
        loadNGOSubmissions();
        loadContactSubmissions();
    }
    
    // Function to load school submissions
    async function loadSchoolSubmissions() {
        setLoading(schoolsTableBody);
        
        try {
            const { data, error } = await supabase
                .from('school_submissions')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            
            renderSchoolSubmissions(data);
        } catch (error) {
            console.error('Error loading school submissions:', error);
            showError(schoolsTableBody, 'Failed to load school submissions');
        }
    }
    
    // Function to load mentor submissions
    async function loadMentorSubmissions() {
        setLoading(mentorsTableBody);
        
        try {
            const { data, error } = await supabase
                .from('mentor_submissions')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            
            renderMentorSubmissions(data);
        } catch (error) {
            console.error('Error loading mentor submissions:', error);
            showError(mentorsTableBody, 'Failed to load mentor submissions');
        }
    }
    
    // Function to load NGO submissions
    async function loadNGOSubmissions() {
        setLoading(ngosTableBody);
        
        try {
            const { data, error } = await supabase
                .from('ngo_submissions')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            
            renderNGOSubmissions(data);
        } catch (error) {
            console.error('Error loading NGO submissions:', error);
            showError(ngosTableBody, 'Failed to load NGO submissions');
        }
    }
    
    // Function to load contact form submissions
    async function loadContactSubmissions() {
        setLoading(contactsTableBody);
        
        try {
            const { data, error } = await supabase
                .from('contact_submissions')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            
            renderContactSubmissions(data);
        } catch (error) {
            console.error('Error loading contact submissions:', error);
            showError(contactsTableBody, 'Failed to load contact submissions');
        }
    }
    
    // Render school submissions in the table
    function renderSchoolSubmissions(submissions) {
        if (!submissions || submissions.length === 0) {
            schoolsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No submissions found</td></tr>';
            return;
        }
        
        let html = '';
        submissions.forEach(submission => {
            const date = new Date(submission.created_at).toLocaleDateString();
            html += `
                <tr>
                    <td>${escapeHtml(submission.schoolName)}</td>
                    <td>${escapeHtml(submission.contactName)}</td>
                    <td>${escapeHtml(submission.email)}</td>
                    <td>${escapeHtml(submission.phone || 'N/A')}</td>
                    <td>${date}</td>
                    <td>
                        <button class="btn btn-sm btn-primary view-details" 
                                data-bs-toggle="modal" 
                                data-bs-target="#viewDetailsModal"
                                data-id="${submission.id}"
                                data-type="school">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        schoolsTableBody.innerHTML = html;
        
        // Add event listeners to view buttons
        addViewDetailsListeners('school');
    }
    
    // Render mentor submissions in the table
    function renderMentorSubmissions(submissions) {
        if (!submissions || submissions.length === 0) {
            mentorsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No submissions found</td></tr>';
            return;
        }
        
        let html = '';
        submissions.forEach(submission => {
            const date = new Date(submission.created_at).toLocaleDateString();
            const expertise = Array.isArray(submission.expertise) ? submission.expertise.join(', ') : submission.expertise;
            
            html += `
                <tr>
                    <td>${escapeHtml(submission.name)}</td>
                    <td>${escapeHtml(submission.email)}</td>
                    <td>${escapeHtml(submission.phone || 'N/A')}</td>
                    <td>${escapeHtml(expertise || 'N/A')}</td>
                    <td>${date}</td>
                    <td>
                        <button class="btn btn-sm btn-primary view-details" 
                                data-bs-toggle="modal" 
                                data-bs-target="#viewDetailsModal"
                                data-id="${submission.id}"
                                data-type="mentor">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        mentorsTableBody.innerHTML = html;
        
        // Add event listeners to view buttons
        addViewDetailsListeners('mentor');
    }
    
    // Render NGO submissions in the table
    function renderNGOSubmissions(submissions) {
        if (!submissions || submissions.length === 0) {
            ngosTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No submissions found</td></tr>';
            return;
        }
        
        let html = '';
        submissions.forEach(submission => {
            const date = new Date(submission.created_at).toLocaleDateString();
            const focusAreas = Array.isArray(submission.focusAreas) ? submission.focusAreas.join(', ') : submission.focusAreas;
            
            html += `
                <tr>
                    <td>${escapeHtml(submission.ngoName)}</td>
                    <td>${escapeHtml(submission.contactName)}</td>
                    <td>${escapeHtml(submission.email)}</td>
                    <td>${escapeHtml(focusAreas || 'N/A')}</td>
                    <td>${date}</td>
                    <td>
                        <button class="btn btn-sm btn-primary view-details" 
                                data-bs-toggle="modal" 
                                data-bs-target="#viewDetailsModal"
                                data-id="${submission.id}"
                                data-type="ngo">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        ngosTableBody.innerHTML = html;
        
        // Add event listeners to view buttons
        addViewDetailsListeners('ngo');
    }
    
    // Render contact submissions in the table
    function renderContactSubmissions(submissions) {
        if (!submissions || submissions.length === 0) {
            contactsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No submissions found</td></tr>';
            return;
        }
        
        let html = '';
        submissions.forEach(submission => {
            const date = new Date(submission.created_at).toLocaleDateString();
            
            // Truncate message if it's too long
            const truncatedMessage = submission.message && submission.message.length > 50 
                ? submission.message.substring(0, 50) + '...' 
                : submission.message || 'N/A';
                
            html += `
                <tr>
                    <td>${escapeHtml(submission.name)}</td>
                    <td>${escapeHtml(submission.email)}</td>
                    <td>${escapeHtml(submission.subject || 'N/A')}</td>
                    <td>${escapeHtml(truncatedMessage)}</td>
                    <td>${date}</td>
                    <td>
                        <button class="btn btn-sm btn-primary view-details" 
                                data-bs-toggle="modal" 
                                data-bs-target="#viewDetailsModal"
                                data-id="${submission.id}"
                                data-type="contact">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        contactsTableBody.innerHTML = html;
        
        // Add event listeners to view buttons
        addViewDetailsListeners('contact');
    }
    
    // Add event listeners to view details buttons
    function addViewDetailsListeners(type) {
        const buttons = document.querySelectorAll(`.view-details[data-type="${type}"]`);
        buttons.forEach(button => {
            button.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                const submissionType = this.getAttribute('data-type');
                
                await showSubmissionDetails(id, submissionType);
            });
        });
    }
    
    // Show submission details in modal
    async function showSubmissionDetails(id, type) {
        const detailsContent = document.getElementById('detailsContent');
        const modalTitle = document.getElementById('viewDetailsModalLabel');
        
        // Set loading state
        detailsContent.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div><p class="mt-2">Loading details...</p></div>';
        
        try {
            // Determine which table to query based on the type
            let tableName;
            let title;
            
            switch (type) {
                case 'school':
                    tableName = 'school_submissions';
                    title = 'School Submission Details';
                    break;
                case 'mentor':
                    tableName = 'mentor_submissions';
                    title = 'Mentor Submission Details';
                    break;
                case 'ngo':
                    tableName = 'ngo_submissions';
                    title = 'NGO Submission Details';
                    break;
                case 'contact':
                    tableName = 'contact_submissions';
                    title = 'Contact Submission Details';
                    break;
                default:
                    throw new Error('Invalid submission type');
            }
            
            modalTitle.textContent = title;
            
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq('id', id)
                .single();
                
            if (error) throw error;
            
            if (!data) {
                detailsContent.innerHTML = '<div class="alert alert-warning">No details found for this submission.</div>';
                return;
            }
            
            renderSubmissionDetails(data, type);
            
        } catch (error) {
            console.error('Error fetching submission details:', error);
            detailsContent.innerHTML = '<div class="alert alert-danger">Failed to load submission details.</div>';
        }
    }
    
    // Render submission details in the modal
    function renderSubmissionDetails(data, type) {
        const detailsContent = document.getElementById('detailsContent');
        let html = '<div class="container-fluid p-0">';
        
        // Format created_at date if it exists
        const submissionDate = data.created_at 
            ? new Date(data.created_at).toLocaleString() 
            : 'Not available';
        
        // Add submission date
        html += createDetailRow('Submission Date', submissionDate);
        
        // Render fields based on submission type
        switch (type) {
            case 'school':
                html += createDetailRow('School Name', data.schoolName);
                html += createDetailRow('Contact Person', data.contactName);
                html += createDetailRow('Position', data.position);
                html += createDetailRow('Email', data.email);
                html += createDetailRow('Phone', data.phone);
                html += createDetailRow('School Address', data.schoolAddress);
                html += createDetailRow('Student Count', data.studentCount);
                
                if (data.interests && Array.isArray(data.interests)) {
                    html += createDetailRow('Interests', data.interests.join(', '));
                }
                
                html += createDetailRow('Message', data.message, true);
                break;
                
            case 'mentor':
                html += createDetailRow('Name', data.name);
                html += createDetailRow('Email', data.email);
                html += createDetailRow('Phone', data.phone);
                html += createDetailRow('Organization', data.organization);
                html += createDetailRow('Designation', data.designation);
                
                if (data.expertise && Array.isArray(data.expertise)) {
                    html += createDetailRow('Areas of Expertise', data.expertise.join(', '));
                }
                
                html += createDetailRow('Other Expertise', data.otherExpertise);
                html += createDetailRow('Experience', data.experience);
                html += createDetailRow('Availability', data.availability);
                html += createDetailRow('Message', data.message, true);
                break;
                
            case 'ngo':
                html += createDetailRow('NGO Name', data.ngoName);
                html += createDetailRow('Contact Person', data.contactName);
                html += createDetailRow('Designation', data.designation);
                html += createDetailRow('Email', data.email);
                html += createDetailRow('Phone', data.phone);
                html += createDetailRow('Website', data.website);
                html += createDetailRow('Address', data.address);
                html += createDetailRow('Year Established', data.establishedYear);
                
                if (data.focusAreas && Array.isArray(data.focusAreas)) {
                    html += createDetailRow('Focus Areas', data.focusAreas.join(', '));
                }
                
                html += createDetailRow('Other Focus Areas', data.otherFocus);
                html += createDetailRow('Message', data.message, true);
                html += createDetailRow('Previous Work', data.previousWork, true);
                break;
                
            case 'contact':
                html += createDetailRow('Name', data.name);
                html += createDetailRow('Email', data.email);
                html += createDetailRow('Subject', data.subject);
                html += createDetailRow('Message', data.message, true);
                break;
        }
        
        html += '</div>';
        detailsContent.innerHTML = html;
    }
    
    // Create a detail row for the modal
    function createDetailRow(label, value, isLongText = false) {
        if (value === null || value === undefined || value === '') {
            value = 'Not provided';
        }
        
        // Escape HTML to prevent XSS
        value = escapeHtml(value);
        
        // Format long text differently
        if (isLongText) {
            return `
                <div class="row detail-row">
                    <div class="col-12 mb-2">
                        <strong class="detail-label">${label}:</strong>
                    </div>
                    <div class="col-12">
                        <p style="white-space: pre-wrap;">${value}</p>
                    </div>
                </div>
            `;
        }
        
        // Regular row format
        return `
            <div class="row detail-row">
                <div class="col-md-4">
                    <strong class="detail-label">${label}:</strong>
                </div>
                <div class="col-md-8">
                    ${value}
                </div>
            </div>
        `;
    }
    
    // Helper function to set loading state
    function setLoading(element) {
        element.innerHTML = '<tr><td colspan="6" class="text-center"><div class="spinner-border spinner-border-sm me-2" role="status"></div> Loading...</td></tr>';
    }
    
    // Helper function to show error message
    function showError(element, message) {
        element.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${message}</td></tr>`;
    }
    
    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        if (unsafe === null || unsafe === undefined) return '';
        
        return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Refresh button event listeners
    refreshSchoolsBtn.addEventListener('click', function() {
        this.querySelector('i').classList.add('fa-spin');
        loadSchoolSubmissions().then(() => {
            this.querySelector('i').classList.remove('fa-spin');
        });
    });
    
    refreshMentorsBtn.addEventListener('click', function() {
        this.querySelector('i').classList.add('fa-spin');
        loadMentorSubmissions().then(() => {
            this.querySelector('i').classList.remove('fa-spin');
        });
    });
    
    refreshNgosBtn.addEventListener('click', function() {
        this.querySelector('i').classList.add('fa-spin');
        loadNGOSubmissions().then(() => {
            this.querySelector('i').classList.remove('fa-spin');
        });
    });
    
    refreshContactsBtn.addEventListener('click', function() {
        this.querySelector('i').classList.add('fa-spin');
        loadContactSubmissions().then(() => {
            this.querySelector('i').classList.remove('fa-spin');
        });
    });
    
    // Check authentication status when the page loads
    checkAuth();
    
    // Handle Enter key press in login form
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
});
