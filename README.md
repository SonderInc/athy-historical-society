# Athy Historical Society

A website for the proposed Athy Historical Society, designed to gather community interest and support the establishment of the society. Visitors can read the society's founding proposal, view the list of interested participants, and add their own name via an email-verified sign-up form.

## Key Technologies

- **TanStack Start** – Full-stack React framework with server-side rendering
- **TanStack Router** – Type-safe routing
- **Netlify Database** (Postgres via Drizzle ORM) – Stores participant submissions and verification state
- **Nodemailer** – Sends verification emails via SMTP
- **Tailwind CSS v4** – Styling
- **Netlify** – Hosting, serverless functions, and database

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables (copy `.env.example` to `.env` locally, and configure the same variables in the Netlify site environment for deploys):
   ```
   SMTP_HOST=your.smtp.host
   SMTP_PORT=587
   SMTP_USER=your@email.com
   SMTP_PASS=your-smtp-password
   FROM_EMAIL=noreply@athyheritagesociety.com
   SITE_URL=http://localhost:8889
   ```

3. Start the local development server:
   ```bash
   npx netlify dev --port 8889
   ```

## Email Verification Flow

1. User submits name + email via the form on the homepage.
2. A verification email is sent to the address provided.
3. The user clicks the link in the email, which calls `/api/verify?token=...`.
4. On success, the participant is marked as verified and redirected to the homepage.
5. Only verified names (never email addresses) appear publicly on the site.
