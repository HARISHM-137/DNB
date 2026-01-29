
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendSMS } from '@/lib/sms';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { identifier } = await req.json(); // Can be username or phoneNumber

        if (!identifier) {
            return NextResponse.json({ error: 'Please enter your username or phone number' }, { status: 400 });
        }

        // Find User
        const user = await User.findOne({
            $or: [{ username: identifier }, { phoneNumber: identifier }]
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.phoneNumber) {
            return NextResponse.json({ error: 'No phone number linked to this account.' }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Save to DB
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send SMS
        // Ensure +91 prefix
        let formattedNumber = user.phoneNumber.trim();
        // Simple heuristic: if 10 digits, add +91. If starts with 91 and 12 digits, add +
        if (/^\d{10}$/.test(formattedNumber)) {
            formattedNumber = "+91" + formattedNumber;
        } else if (/^91\d{10}$/.test(formattedNumber)) {
            formattedNumber = "+" + formattedNumber;
        }
        // Else assume it is correct or let sendSMS handle/fail.

        const message = `DNB Password Reset OTP: ${otp}. Do not share this with anyone.`;

        const smsResult = await sendSMS(formattedNumber, message);

        // MOCK MODE: Return OTP in response so frontend can show it
        return NextResponse.json({
            message: 'OTP sent successfully',
            phoneNumber: user.phoneNumber,
            debug_otp: smsResult.debug_otp // Frontend will show this in Alert
        });

    } catch (error) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
