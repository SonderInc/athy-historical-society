import nodemailer from "nodemailer";

/**
 * Reads and validates the SMTP configuration from the environment.
 *
 * The verification email is delivered through an external SMTP server. If the
 * required variables are not configured, `sendMail` would otherwise fail deep
 * inside Nodemailer with an opaque connection error. Validating up front lets us
 * log exactly what is missing and return a clear signal to the caller.
 */
function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL;
  const siteUrl = process.env.SITE_URL;

  const missing = [
    ["SMTP_HOST", host],
    ["SMTP_USER", user],
    ["SMTP_PASS", pass],
    ["FROM_EMAIL", fromEmail],
    ["SITE_URL", siteUrl],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Email is not configured: missing environment variable(s) ${missing.join(
        ", "
      )}. Set the SMTP_* variables in the Netlify site settings (Site configuration → Environment variables) to enable verification emails.`
    );
  }

  return {
    host: host!,
    user: user!,
    pass: pass!,
    fromEmail: fromEmail!,
    siteUrl: siteUrl!,
  };
}

function getTransport(config: ReturnType<typeof getSmtpConfig>) {
  return nodemailer.createTransport({
    host: config.host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    // Fail fast on an unreachable/misconfigured server instead of letting the
    // serverless function hang until it times out.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
) {
  const config = getSmtpConfig();
  const { fromEmail, siteUrl } = config;
  const verifyUrl = `${siteUrl}/verify?token=${token}`;

  const transport = getTransport(config);

  await transport.sendMail({
    from: `"Athy Historical Society" <${fromEmail}>`,
    to,
    subject: "Confirm your interest – Athy Historical Society",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2c2c2c;">
        <h2 style="color: #3d5a3e; border-bottom: 2px solid #c8a96e; padding-bottom: 12px;">
          Athy Historical Society
        </h2>
        <p>Dear ${name},</p>
        <p>Thank you for your interest in the Athy Historical Society. Please confirm your email address by clicking the link below, after which your name will be added to our public list of interested participants.</p>
        <p style="margin: 32px 0;">
          <a href="${verifyUrl}" style="background:#3d5a3e;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;font-family:Georgia,serif;">
            Confirm my interest
          </a>
        </p>
        <p style="font-size:0.85em;color:#666;">If you did not submit this request, you can safely ignore this email.</p>
        <p style="font-size:0.85em;color:#666;">Or copy this link into your browser:<br>${verifyUrl}</p>
      </div>
    `,
    text: `Dear ${name},\n\nThank you for your interest in the Athy Historical Society.\n\nPlease confirm your email address by visiting:\n${verifyUrl}\n\nIf you did not submit this request, please ignore this email.`,
  });
}
