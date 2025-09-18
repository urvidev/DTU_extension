// Handle volunteer form submissions with Supabase integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    let supabase;
    
    // Use the global client if available, otherwise create a new one as fallback
    if (typeof window.supabaseClient !== 'undefined') {
        supabase = window.supabaseClient;
        console.log('Using global Supabase client for form submissions');
    } else {
        // Fallback to creating a new client (not recommended)
        console.warn('Global Supabase client not found. Creating a new instance.');
        const SUPABASE_URL = "https://vbliswazkbdlswqgmcmo.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibGlzd2F6a2JkbHN3cWdtY21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjU4NTEsImV4cCI6MjA2NDEwMTg1MX0.lgn6Q2FFeC1JiSJMH2gpMwshg13fJ7ZMoBmMdAngicM";
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        } else {
            console.error('Supabase library not loaded. Form submissions will not work.');
        }
    }

    // School Form
    const schoolForm = document.getElementById('schoolForm');
    if (schoolForm) {
        schoolForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (validateForm(schoolForm)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
                }
                
                // Form is valid, collect data
                const formData = {
                    schoolName: document.getElementById('schoolName').value,
                    contactName: document.getElementById('contactName').value,
                    position: document.getElementById('position').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    schoolAddress: document.getElementById('schoolAddress').value,
                    studentCount: document.getElementById('studentCount').value,
                    interests: collectCheckboxValues('interest'),
                    message: document.getElementById('message').value,
                    created_at: new Date().toISOString()
                };
                  try {
                    // Use safer submission helper function if available
                    if (typeof window.submitFormToSupabase === 'function') {
                        const result = await window.submitFormToSupabase(
                            supabase, 
                            'school_submissions', 
                            formData
                        );
                        
                        if (!result.success) throw result.error;
                    } else {
                        // Fallback to direct submission
                        const { data, error } = await supabase
                            .from('school_submissions')
                            .insert([formData]);
                            
                        if (error) throw error;
                    }
                        
                    if (error) throw error;
                    
                    console.log('School Form Submission Successful:', data);
                    
                    // Show success modal
                    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                    successModal.show();
                    
                    // Reset form
                    schoolForm.reset();
                } catch (error) {
                    console.error('Error submitting school form:', error);
                    alert('There was an error submitting your form. Please try again later.');
                } finally {
                    // Restore button state
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }
            }
        });
    }

    // Mentor Form
    const mentorForm = document.getElementById('mentorForm');
    if (mentorForm) {
        // Show/hide "other" expertise field
        const expertiseOtherCheckbox = document.getElementById('expertiseOther');
        if (expertiseOtherCheckbox) {
            expertiseOtherCheckbox.addEventListener('change', function() {
                document.getElementById('otherExpertiseDiv').style.display = this.checked ? 'block' : 'none';
            });
        }

        mentorForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (validateForm(mentorForm)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
                }
                
                // Form is valid, collect data                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    organization: document.getElementById('organization').value,
                    designation: document.getElementById('designation').value,
                    expertise: collectCheckboxValues('expertise'),
                    other_expertise: document.getElementById('otherExpertise')?.value, // Changed to match column name in database
                    experience: document.getElementById('experience').value,
                    availability: document.getElementById('availability').value,
                    message: document.getElementById('message').value,
                    created_at: new Date().toISOString()
                };
                  try {
                    // Use safer submission helper function if available
                    if (typeof window.submitFormToSupabase === 'function') {
                        const result = await window.submitFormToSupabase(
                            supabase, 
                            'mentor_submissions', 
                            formData
                        );
                        
                        if (!result.success) throw result.error;
                        
                        console.log('Mentor Form Submission Successful:', result.data);
                    } else {
                        // Fallback to direct submission
                        console.warn('Using direct submission - helper function not available');
                        const { data, error } = await supabase
                            .from('mentor_submissions')
                            .insert([formData]);
                            
                        if (error) throw error;
                        
                        console.log('Mentor Form Submission Successful:', data);
                    }
                    
                    // Show success modal
                    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                    successModal.show();
                    
                    // Reset form
                    mentorForm.reset();
                    document.getElementById('otherExpertiseDiv').style.display = 'none';
                } catch (error) {
                    console.error('Error submitting mentor form:', error);
                    alert('There was an error submitting your form. Please try again later.\n\nError: ' + (error.message || 'Unknown error'));
                } finally {
                    // Restore button state
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }
            }
        });
    }

    // NGO Form
    const ngoForm = document.getElementById('ngoForm');
    if (ngoForm) {
        // Show/hide "other" focus field
        const focusOtherCheckbox = document.getElementById('focusOther');
        if (focusOtherCheckbox) {
            focusOtherCheckbox.addEventListener('change', function() {
                document.getElementById('otherFocusDiv').style.display = this.checked ? 'block' : 'none';
            });
        }

        ngoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (validateForm(ngoForm)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
                }
                
                // Form is valid, collect data
                const formData = {
                    ngoName: document.getElementById('ngoName').value,
                    contactName: document.getElementById('contactName').value,
                    designation: document.getElementById('designation').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    website: document.getElementById('website').value,
                    address: document.getElementById('address').value,
                    establishedYear: document.getElementById('establishedYear').value,
                    focusAreas: collectCheckboxValues('focus'),
                    otherFocus: document.getElementById('otherFocus')?.value,
                    message: document.getElementById('message').value,
                    previousWork: document.getElementById('previousWork').value,
                    created_at: new Date().toISOString()
                };
                  try {
                    // Use safer submission helper function if available
                    if (typeof window.submitFormToSupabase === 'function') {
                        const result = await window.submitFormToSupabase(
                            supabase, 
                            'ngo_submissions', 
                            formData
                        );
                        
                        if (!result.success) throw result.error;
                    } else {
                        // Fallback to direct submission
                        const { data, error } = await supabase
                            .from('ngo_submissions')
                            .insert([formData]);
                            
                        if (error) throw error;
                    }
                        
                    if (error) throw error;
                    
                    console.log('NGO Form Submission Successful:', data);
                    
                    // Show success modal
                    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                    successModal.show();
                    
                    // Reset form
                    ngoForm.reset();
                    document.getElementById('otherFocusDiv').style.display = 'none';
                } catch (error) {
                    console.error('Error submitting NGO form:', error);
                    alert('There was an error submitting your form. Please try again later.');
                } finally {
                    // Restore button state
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }
            }
        });
    }

    // Helper function to validate forms
    function validateForm(form) {
        let isValid = true;
        
        // Check all required inputs
        const requiredInputs = form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            if (input.type === 'checkbox' && !input.checked) {
                isValid = false;
                input.classList.add('is-invalid');
            } else if (input.value.trim() === '') {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }

            // Add event listeners to clear validation on input
            input.addEventListener('input', function() {
                if (
                    (input.type === 'checkbox' && input.checked) || 
                    (input.type !== 'checkbox' && input.value.trim() !== '')
                ) {
                    input.classList.remove('is-invalid');
                }
            });
        });

        // Email validation
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value.trim() !== '') {
            const isValidEmail = validateEmail(emailInput.value);
            if (!isValidEmail) {
                isValid = false;
                emailInput.classList.add('is-invalid');
            }
        }

        return isValid;
    }

    // Email validation helper
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Helper function to collect checkbox values
    function collectCheckboxValues(prefix) {
        const selected = [];
        const checkboxes = document.querySelectorAll(`input[id^="${prefix}"]`);
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && !checkbox.id.includes('Other')) {
                // Extract label text
                const label = document.querySelector(`label[for="${checkbox.id}"]`);
                if (label) {
                    selected.push(label.textContent);
                }
            }
        });
        return selected;
    }
});