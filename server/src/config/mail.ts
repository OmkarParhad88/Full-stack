import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const options: SMTPTransport.Options = {
  service: "gmail",
  host: Bun.env.SMTP_HOST,
  port: parseInt(Bun.env.SMTP_PORT || "587"),
  secure: true,
  auth: {
    user: Bun.env.SMTP_USER,
    pass: Bun.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false,
  },
};

export const transporter = nodemailer.createTransport(options);

export const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: `"EXPRESS" <${Bun.env.SMTP_FROM}>`,
    to: to,
    subject: subject,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

