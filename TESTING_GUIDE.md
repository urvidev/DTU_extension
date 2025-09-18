# DTU Extension & Outreach Website - Form Testing Guide

This guide will help you test the form submission functionality that uses Supabase for data storage.

## Prerequisites

Before testing the forms, make sure:

1. You have set up Supabase according to the instructions in `SUPABASE_SETUP.md`
2. You have verified all required tables exist in Supabase (use `test-supabase-setup.js` to help verify)
3. Your website is running either locally or on a web server

## Quick Setup Verification

To verify your Supabase setup:

1. Open any page of the website in your browser
2. Open the browser console (F12 or Right-click > Inspect > Console)
3. Copy and paste the entire contents of `test-supabase-setup.js` into the console
4. Press Enter to run the verification script
5. Check the results - you should see green checkmarks for all tables

## Testing Each Form

### 1. School Volunteer Form

**Path:** `/pages/get-involved/volunteer-school.html`

**Test Steps:**
1. Navigate to the school volunteer form
2. Fill out all required fields:
   - School Name
   - Contact Person's Name
   - Position/Role
   - Email Address
   - Select interests (optional)
   - Message
3. Click the "Submit Application" button
4. Verify that a success modal appears
5. Check your Supabase dashboard to verify the entry is in the `school_submissions` table

### 2. Mentor Volunteer Form

**Path:** `/pages/get-involved/volunteer-mentor.html`

**Test Steps:**
1. Navigate to the mentor form
2. Fill out all required fields:
   - Name
   - Email Address
   - Check "Other" expertise to test that the additional field appears
   - Fill out other required fields
3. Click the "Submit Application" button
4. Verify that a success modal appears
5. Check your Supabase dashboard to verify the entry is in the `mentor_submissions` table

### 3. NGO Volunteer Form

**Path:** `/pages/get-involved/volunteer-ngo.html`

**Test Steps:**
1. Navigate to the NGO form
2. Fill out all required fields:
   - NGO Name
   - Contact Person's Name
   - Email Address
   - Phone Number
   - Message
3. Check "Other" focus area and verify the additional field appears
4. Click the "Submit Application" button
5. Verify that a success modal appears
6. Check your Supabase dashboard to verify the entry is in the `ngo_submissions` table

### 4. Contact Form

**Path:** `/index.html` (Contact section)

**Test Steps:**
1. Navigate to the contact section on the homepage
2. Fill out:
   - Name
   - Email
   - Subject
   - Message
3. Click the "Send Message" button
4. Verify that a success message appears
5. Check your Supabase dashboard to verify the entry is in the `contact_submissions` table

## Testing the Admin Panel

**Path:** `/pages/admin/index.html`

**Test Steps:**
1. Navigate to the admin panel
2. Log in with the credentials:
   - Username: admin
   - Password: dtu@extension123
3. Verify that you can see all form submissions in their respective tabs
4. Test the refresh buttons on each tab
5. Click the "View" button for a submission to see its details

## Testing with Test Pages

We've created two special test pages to help verify your Supabase integration:

### 1. Test Supabase Setup Script

Open `test-supabase-setup.js` in your code editor to see how to verify table existence.
You can run this script in the browser console on any page of your website to verify the tables.

### 2. Form Submission Test Page

Open `test-forms.html` in your browser to access a dedicated test page for all forms:

1. Use this page to check your Supabase connection status
2. Verify that all required tables exist
3. Test each form submission individually with pre-filled test data
4. Get detailed error messages if something goes wrong

This page is especially useful when initially setting up the project or diagnosing issues.

## Troubleshooting

If forms are not submitting correctly:

1. Open the browser's developer console (F12) to check for JavaScript errors
2. Verify that the Supabase URL and API key are correct in:
   - `js/script.js`
   - `pages/get-involved/volunteer-forms.js`
   - `pages/admin/admin.js`
3. Check the Supabase dashboard for any error logs
4. Use the `test-forms.html` page to isolate and test each form
5. Verify that all required tables have been created with the correct structure

### Common Issues and Solutions

1. **"Error: relation 'X' does not exist"**
   - The table hasn't been created in Supabase yet
   - Follow the SQL commands in `SUPABASE_SETUP.md` to create the table
   
2. **"Error: invalid input syntax for type json"**
   - Check that your JSON fields (interests, expertise, focusAreas) are properly formatted
   - Arrays should be formatted as valid JSON arrays
   
3. **"Supabase library not loaded"**
   - Make sure the Supabase script is included before your custom JavaScript
   - Check that the CDN is accessible
   
4. **"Network error"**
   - Check your internet connection
   - Verify the Supabase URL is correct
   - Make sure your Supabase project is active

5. **"Request failed with status code 404"**
   - The Supabase URL is incorrect
   - Check for typos in the URL
4. Verify that the table structure in Supabase matches the requirements

## Security Notes

The current implementation uses:
- Row-level security policies to control data access
- Hardcoded admin credentials for the admin panel

In a production environment, consider:
- Implementing proper user authentication for admin access
- Setting up CORS restrictions in Supabase
- Adding rate limiting to prevent form spam
