
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { identifier, otp, newPassword } = await req.json();

        if (!identifier || !otp || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = await User.findOne({
            $or: [{ username: identifier }, { phoneNumber: identifier }]
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.otp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        if (user.otpExpires && user.otpExpires < new Date()) {
            return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
        }

        // Reset Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined; // Clear OTP
        user.otpExpires = undefined;
        await user.save();

        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error("OTP Verify Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
