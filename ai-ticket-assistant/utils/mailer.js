import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create the transporter using environment variables (defaults map to the MAILTRAP Sandbox)
export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: process.env.MAILTRAP_SMTP_PORT,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS
  }
});

/**
 * Send a welcome or registration email 
 * @param {string} toEmail User's email
 */
export const sendWelcomeEmail = async (toEmail) => {
  try {
    const info = await transporter.sendMail({
      from: '"AI Ticket System" <noreply@aiticket.local>',
      to: toEmail,
      subject: "Welcome to AI Ticket System!",
      text: "You have successfully registered to the AI Ticket platform. You can now login and start managing tickets.",
      html: "<b>You have successfully registered to the AI Ticket platform.</b><p>You can now login and start managing tickets.</p>",
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

/**
 * Send a login activity alert
 * @param {string} toEmail User's email
 */
export const sendLoginAlert = async (toEmail) => {
  try {
    const info = await transporter.sendMail({
      from: '"AI Ticket Security" <security@aiticket.local>',
      to: toEmail,
      subject: "New Login into AI Ticket System",
      text: "A new login was detected on your account.",
      html: "<p>A new login was detected on your account. If this was not you, please contact support.</p>",
    });
    console.log("Login alert sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending login alert:", error);
    throw error;
  }
};