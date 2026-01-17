# Vercel Deployment Guide (Free Hosting + Custom Domain)

## 1. Sign Up & Install Vercel CLI (Optional)
- Go to https://vercel.com and sign up (GitHub recommended).
- (Optional) Install Vercel CLI:
  ```bash
  npm install -g vercel
  ```

## 2. Connect Your Repository
- Import your project from GitHub/GitLab/Bitbucket on the Vercel dashboard.
- Vercel auto-detects Next.js and sets up the build.

## 3. Configure Environment Variables
- In the Vercel dashboard, go to your project → Settings → Environment Variables.
- Add:
  - `MONGO_URL` (your MongoDB Atlas connection string)
  - `DB_NAME` (your database name)
  - Any other required variables from `.env.local`

## 4. Deploy
- Click "Deploy" in the Vercel dashboard, or run:
  ```bash
  vercel --prod
  ```

## 5. Add Your Custom Domain
- In Vercel dashboard → Project → Settings → Domains → "Add" your GoDaddy domain.
- Vercel will show DNS records to add in GoDaddy (usually CNAME or A records).
- In GoDaddy, update your domain's DNS to match Vercel's instructions.
- Wait for DNS to propagate (can take up to 24 hours).

## 6. SSL
- Vercel provides free SSL automatically for your custom domain.

## 7. Done!
- Your site is now live on your custom domain, hosted for free on Vercel.

---

# Netlify Alternative
- Similar steps: import repo, set env vars, deploy, add custom domain, update DNS in GoDaddy.
- For Next.js SSR, use Netlify's Next.js runtime plugin.

---

# Notes
- Free tiers have usage limits (bandwidth, serverless execution, build minutes).
- For dynamic/SSR features, Vercel is the most seamless for Next.js.
- You can always upgrade for more resources if needed.

---

# Custom Email (Free/Low-Cost Options)

## 1. Use Zoho Mail (Free for 1 Domain)
- Go to https://zoho.com/mail/ and sign up for the free plan.
- Add your domain and follow Zoho’s instructions to verify (add TXT/CNAME records in GoDaddy).
- Set MX records in GoDaddy DNS to Zoho’s values.
- Create your email address (e.g., info@yourdomain.com) in Zoho Mail dashboard.
- Access your mailbox via Zoho webmail or mobile app.

## 2. Use AWS SES (Free Tier for Sending)
- AWS SES is free for up to 62,000 emails/month (if sent from EC2/Lambda), but not for receiving.
- See the AWS section in DEPLOYMENT_GUIDE_AWS.md for setup.
- Add SES SMTP credentials to your app’s environment variables:
  ```env
  EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
  EMAIL_PORT=587
  EMAIL_USER=SES_SMTP_USERNAME
  EMAIL_PASS=SES_SMTP_PASSWORD
  ```
- For receiving, forward to another mailbox or use a service like ImprovMX (free for forwarding).

## 3. ImprovMX (Free Email Forwarding)
- Go to https://improvmx.com and add your domain.
- Set MX records in GoDaddy to ImprovMX.
- Forward emails (e.g., info@yourdomain.com) to your Gmail or other inbox.
- You can reply as your custom domain using Gmail’s "Send mail as" feature.

---

# Using with Vercel/Netlify
- Add your SMTP credentials (from Zoho, SES, or ImprovMX) to your environment variables.
- Use a Node.js mailer library (e.g., nodemailer) in your API routes to send emails.
- Example (Node.js):
  ```js
  import nodemailer from 'nodemailer';

  export default async function handler(req, res) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: 'info@yourdomain.com',
      to: 'recipient@example.com',
      subject: 'Test',
      text: 'Hello from your site!',
    });
    res.status(200).json({ success: true });
  }
  ```
- For contact forms, use this API route to send emails to your inbox.

---

# Summary
- For a free mailbox: Zoho Mail (best for full mailbox), ImprovMX (forwarding only).
- For sending only: AWS SES (free tier), or Zoho SMTP.
- Update DNS in GoDaddy as instructed by your chosen provider.
- Add SMTP credentials to your app for sending emails from forms.
