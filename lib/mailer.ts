import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password',
  },
});

export const sendLicenseReminder = async (to: string, driverName: string, expiryDate: string) => {
  const mailOptions = {
    from: '"TransitOps Admin" <admin@transitops.com>',
    to,
    subject: `Action Required: License Expiry Reminder for ${driverName}`,
    text: `Hello,\n\nThis is an automated reminder that the driving license for ${driverName} is set to expire on ${expiryDate}. Please ensure it is renewed promptly to avoid service disruption.\n\nThank you,\nTransitOps System`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent for driver ${driverName}`);
  } catch (error) {
    console.error(`Failed to send email for ${driverName}:`, error);
  }
};
