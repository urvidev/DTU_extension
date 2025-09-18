    // Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Get the global Supabase client
    let supabaseClient;
    try {
        if (typeof window.supabaseClient !== 'undefined') {
            supabaseClient = window.supabaseClient;
            console.log('Using global Supabase client');
        } else {
            // Fallback to creating a new client (not recommended)
            console.warn('Global Supabase client not found. Using fallback initialization.');
            const SUPABASE_URL = "https://vbliswazkbdlswqgmcmo.supabase.co";
            const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibGlzd2F6a2JkbHN3cWdtY21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjU4NTEsImV4cCI6MjA2NDEwMTg1MX0.lgn6Q2FFeC1JiSJMH2gpMwshg13fJ7ZMoBmMdAngicM";
            if (typeof window.supabase !== 'undefined') {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            } else {
                console.warn('Supabase library not loaded yet');
            }
        }
    } catch (e) {
        console.error('Error initializing Supabase client:', e);
    }

    
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

   
    const counters = document.querySelectorAll('.counter-value');
    const speed = 200; // The lower the faster


    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                let count = 0;
                
                const updateCount = () => {
                    const increment = target / speed;
                    
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

      const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            if (name.value.trim() === '') {
                isValid = false;
                showError(name, 'Please enter your name');
            } else {
                removeError(name);
            }
            
            if (email.value.trim() === '') {
                isValid = false;
                showError(email, 'Please enter your email');
            } else if (!isValidEmail(email.value)) {
                isValid = false;
                showError(email, 'Please enter a valid email');
            } else {
                removeError(email);
            }
            
            if (subject.value.trim() === '') {
                isValid = false;
                showError(subject, 'Please enter a subject');
            } else {
                removeError(subject);
            }
            
            if (message.value.trim() === '') {
                isValid = false;
                showError(message, 'Please enter your message');
            } else {
                removeError(message);
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
                }
                
                // Collect form data
                const formData = {
                    name: name.value,
                    email: email.value,
                    subject: subject.value,
                    message: message.value,
                    created_at: new Date().toISOString()
                };
                  try {
                    if (supabaseClient) {
                        // Use safer submission helper if available
                        if (typeof window.submitFormToSupabase === 'function') {
                            const result = await window.submitFormToSupabase(
                                supabaseClient, 
                                'contact_submissions', 
                                formData
                            );
                            
                            if (!result.success) throw result.error;
                            
                            console.log('Contact Form Submission Successful:', result.data);
                        } else {
                            // Fallback to direct submission
                            const { data, error } = await supabaseClient
                                .from('contact_submissions')
                                .insert([formData]);
                                
                            if (error) throw error;
                            
                            console.log('Contact Form Submission Successful:', data);
                        }
                    } else {
                        console.log('Contact Form Submission (No Supabase):', formData);
                    }
                    
                    alert('Message sent successfully! We will contact you soon.');
                    contactForm.reset();                } catch (error) {
                    console.error('Error submitting contact form:', error);
                    
                    // Provide more detailed error message
                    let errorMessage = 'There was an error sending your message. Please try again later.';
                    
                    if (error && error.message && error.message.includes('does not exist')) {
                        errorMessage = 'The database is not properly set up. Please contact the administrator.';
                    } else if (error && error.message) {
                        errorMessage += '\n\nDetails: ' + error.message;
                    }
                    
                    alert(errorMessage);
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

    function showError(input, message) {
        const formControl = input.parentElement;
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerText = message;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '-10px';
        errorElement.style.marginBottom = '10px';
        
      
        removeError(input);
        
        formControl.appendChild(errorElement);
        input.style.borderColor = 'red';
    }

    function removeError(input) {
        const formControl = input.parentElement;
        const errorElement = formControl.querySelector('.error-message');
        if (errorElement) {
            formControl.removeChild(errorElement);
        }
        input.style.borderColor = '';
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // Adjust offset for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
});
