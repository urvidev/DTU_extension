// Programs Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Handle URL hash for direct tab access
    const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash) {
            const validTabs = ['education', 'outreach', 'recurring'];
            const tabId = hash.replace('#', '');
            
            if (validTabs.includes(tabId)) {
                // Activate the tab corresponding to the hash
                const tabElement = document.getElementById(`${tabId}-tab`);
                if (tabElement) {
                    const tab = new bootstrap.Tab(tabElement);
                    tab.show();
                    
                    // Scroll to the content with a small delay for smooth experience
                    setTimeout(() => {
                        const contentElement = document.getElementById(tabId);
                        if (contentElement) {
                            window.scrollTo({
                                top: contentElement.offsetTop - 100,
                                behavior: 'smooth'
                            });
                        }
                    }, 300);
                }
            }
        }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check hash on initial page load
    setTimeout(handleHashChange, 100); // Small delay to ensure DOM is ready

    // Add hash to URL when tab is clicked
    document.querySelectorAll('#programs-tab button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-bs-target').replace('#', '');
            history.replaceState(null, null, `#${tabId}`);
        });
    });

    // Add special handling for program detail cards' learn more buttons
    document.querySelectorAll('.program-detail-card .btn-outline-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            const targetId = this.getAttribute('data-bs-target');
            if (targetId) {
                e.preventDefault();
                const collapseElement = document.querySelector(targetId);
                if (collapseElement) {
                    const bsCollapse = new bootstrap.Collapse(collapseElement);
                    if (collapseElement.classList.contains('show')) {
                        bsCollapse.hide();
                    } else {
                        bsCollapse.show();
                    }
                }
            }
        });
    });

    // Handle gallery view buttons (placeholder functionality)
    document.querySelectorAll('a.btn-primary').forEach(button => {
        if (button.textContent.includes('View Gallery')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // This would ideally launch a gallery modal
                alert('Gallery feature will be implemented soon!');
            });
        }
    });

    // Enhance image loading with fade-in effect
    document.querySelectorAll('.program-img img').forEach(img => {
        img.classList.add('lazy-load');
        
        img.addEventListener('load', function() {
            img.classList.add('loaded');
        });
        
        // For images that might be cached and already loaded
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
});