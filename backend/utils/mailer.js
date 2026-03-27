import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: process.env.MAILTRAP_SMTP_PORT,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS
  }
});

// Generate Tokens
export const generateAccessToken = (userId, role) => {
  return jwt.sign({ _id: userId, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId, role) => {
  return jwt.sign({ _id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

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

export const sendMail = async (toEmail, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: '"AI Ticket System" <noreply@aiticket.local>',
      to: toEmail,
      subject,
      text,
      html: `<p>${text.replace(/\n/g, '<br/>')}</p>`,
    });
    console.log("Custom Mail sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending custom mail:", error);
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