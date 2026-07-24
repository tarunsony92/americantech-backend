const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
});

const sendMail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_HOST) {
    console.warn(`[mail] SMTP not configured — skipping email to ${to}: "${subject}"`);
    return null;
  }
  return transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html });
};

module.exports = { sendMail, transporter };
