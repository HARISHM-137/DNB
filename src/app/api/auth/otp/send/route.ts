import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendSMS } from '@/lib/sms';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, accessNumber } = await req.json();

        // 1. Verify Access Number matches HOD Admin (hardcoded for now as per req)
        const HOD_ADMIN_NUMBER = "7904311829";

        // Normalize input number (simple check)
        if (!accessNumber || accessNumber.replace(/\D/g, '') !== HOD_ADMIN_NUMBER) {
            return NextResponse.json({ error: 'Invalid Access Number.' }, { status: 400 });
        }

        // 2. Find User
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 3. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // 4. Save to DB
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // 5. Send SMS
        // Note: Sending to the verified HOD Access Number as requested
        // Format: +91<number>
        const targetNumber = "+91" + HOD_ADMIN_NUMBER;
        const message = `DNB Verification Code: ${otp} for HOD Application (User: ${username})`;

        const smsResult = await sendSMS(targetNumber, message);

        // MOCK MODE: Return OTP in response so frontend can show it
        return NextResponse.json({
            message: 'OTP sent successfully',
            debug_otp: smsResult.debug_otp // Frontend will show this in Alert
        });

    } catch (error) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
