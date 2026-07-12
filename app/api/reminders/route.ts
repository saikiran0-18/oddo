import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendLicenseReminder } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Running manual license expiry check...');
  
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

    let count = 0;
    for (const driver of expiringDrivers) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@transitops.com';
      await sendLicenseReminder(adminEmail, driver.name, driver.licenseExpiryDate.toDateString());
      count++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Checked expiring licenses. Sent ${count} reminders.`,
      expiringDrivers: expiringDrivers.map(d => ({ name: d.name, expiry: d.licenseExpiryDate }))
    });
  } catch (error: any) {
    console.error('Error during license expiry check:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
