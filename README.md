# DTU Extension & Outreach Website

This repository contains the website for DTU Extension & Outreach, featuring a comprehensive system for form submission storage using Supabase as the backend database.

## Project Structure

```
index.html               # Main website homepage
SUPABASE_SETUP.md        # Instructions for setting up Supabase
TESTING_GUIDE.md         # Guide for testing forms and database functionality
test-forms.html          # Test page for form submissions
test-supabase-setup.js   # Script to check database tables

css/                     # CSS stylesheets
  |- mous.css
  |- programs.css
  |- styles.css          # Main stylesheet

js/                      # JavaScript files
  |- mous.js
  |- programs.js
  |- script.js           # Main script with contact form handling
  |- supabase-helpers.js # Helper functions for Supabase interactions
  
pages/                   # Website pages
  |- mous.html
  |- programs.html
  
  |- admin/              # Admin dashboard
  |  |- admin.css
  |  |- admin.js         # Admin panel functionality
  |  |- index.html       # Admin login and dashboard
  
  |- get-involved/       # Volunteer forms
     |- get-involved.css
     |- index.html
     |- volunteer-forms.js   # Form submission handling
     |- volunteer-mentor.html
     |- volunteer-ngo.html
     |- volunteer-school.html
```

## Features

1. **Form Submissions Storage**
   - School volunteer form submissions
   - Mentor volunteer form submissions
   - NGO volunteer form submissions
   - Contact form submissions

2. **Admin Dashboard**
   - Secure login with hardcoded credentials
   - View all form submissions
   - Filter and sort submissions
   - View detailed submission information

3. **Supabase Integration**
   - Database tables for all form types
   - Secure data storage
   - Easy data retrieval

## Getting Started

1. Follow the instructions in `SUPABASE_SETUP.md` to set up your Supabase project
2. Deploy the website to your preferred hosting platform
3. Test the form submissions using `test-forms.html`
4. Access the admin dashboard at `/pages/admin/index.html`

## Admin Access

Access the admin dashboard with these credentials:
- **Username:** admin
- **Password:** dtu@extension123

## Testing

See `TESTING_GUIDE.md` for detailed instructions on testing form submissions and the admin panel.

## Technology Stack

- HTML5, CSS3, JavaScript (Frontend)
- Bootstrap 5 (UI Framework)
- Supabase (Backend Database)
- AOS (Animation Library)
- Font Awesome (Icons)

## Support

For questions or issues, please contact the project maintainers.
