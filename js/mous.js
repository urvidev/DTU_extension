document.addEventListener('DOMContentLoaded', function() {
    // Initialize any specific MoUs page functionality
    
    // Smooth scroll for anchor links
    document.querySelectorAll('.dropdown-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100, // Adjust for navbar height
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Handle expand/collapse details with animation
    document.querySelectorAll('.mou-buttons button').forEach(button => {
        button.addEventListener('click', function() {
            const detailsSection = this.getAttribute('data-bs-target');
            const icon = this.querySelector('i');
            
            // Toggle icon when expanded/collapsed
            if (this.getAttribute('aria-expanded') === 'true') {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
    
    // Check if URL has a hash and scroll to that section
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }
});