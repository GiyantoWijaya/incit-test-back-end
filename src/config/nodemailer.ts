import nodemailer from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';


export const emailConfig: SMTPConnection.Options = {
  host: process.env.HOST_EMAIL,
  port: parseInt(process.env.PORT_EMAIL || '0', 10), // Port for TLS/STARTTLS
  secure: true, // Use TLS
  auth: {
    user: process.env.NAME_EMAIL, // Your Gmail email address
    pass: process.env.PASS_EMAIL, // Your Gmail password or app-specific password
  },
};

// Create a Nodemailer transporter
export const transporter = nodemailer.createTransport(emailConfig);



