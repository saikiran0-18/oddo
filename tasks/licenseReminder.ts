import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { sendLicenseReminder } from '../lib/mailer';

// Run every day at 08:00 AM
cron.schedule('0 8 * * *', async () => {
  console.log('Running daily license expiry check...');
  
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  try {
    const expiringDrivers = await prisma.driver.findMany({
      where: {
        licenseExpiryDate: {
          lte: thirtyDaysFromNow,
          gte: new Date(), // Don't send for already expired (or handle separately)
        }
      }
    });

    for (const driver of expiringDrivers) {
      // In a real app, you'd have an admin email or the driver's email.
      // We'll send to a configured admin email.
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@transitops.com';
      await sendLicenseReminder(adminEmail, driver.name, driver.licenseExpiryDate.toDateString());
    }
  } catch (error) {
    console.error('Error during license expiry check:', error);
  }
});
