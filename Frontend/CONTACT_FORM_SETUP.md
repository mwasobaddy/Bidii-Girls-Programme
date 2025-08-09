# Contact Form Backend Setup

This document explains how to set up the backend for the contact form.

## Prerequisites

1. Install nodemailer package (this is required for the contact form to work):
   ```bash
   npm install nodemailer
   ```
   or
   ```bash
   pnpm install nodemailer
   ```

## Environment Variables

A `.env.local` file has been created in the `Frontend` directory with placeholder values. Replace these with your actual credentials:

```env
CONTACT_EMAIL_ADDRESS=your-email@gmail.com
CONTACT_EMAIL_PASSWORD=your-app-password
```

### Gmail Setup

If using Gmail, you'll need to:

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to your Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in the `CONTACT_EMAIL_PASSWORD` variable

## How It Works

The contact form now sends data to `/api/contact` endpoint which:

1. Validates the form data
2. Uses nodemailer to send an email to `support@bidiigirlsprogramme.org`
3. Returns a success or error response to the frontend

## Testing

After setting up the environment variables, you can test the contact form by:

1. Running the development server:
   ```bash
   npm run dev
   ```
2. Navigating to the contact page
3. Filling out and submitting the form

You should receive the form submission at `support@bidiigirlsprogramme.org`.

## Troubleshooting

If you're getting a 500 Internal Server Error, it's most likely because nodemailer is not installed. Please make sure to install it first:

```bash
npm install nodemailer
```

Other troubleshooting steps:

1. Check that your `.env.local` file exists in the `Frontend` directory and contains the correct variables:

   ```env
   CONTACT_EMAIL_ADDRESS=your-email@gmail.com
   CONTACT_EMAIL_PASSWORD=your-app-password
   ```

2. Verify that you've enabled 2-factor authentication and generated an App Password if using Gmail.

3. Check the server console for more detailed error messages.
