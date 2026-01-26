import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, otp } = await req.json();

        if (!username || !otp) {
            return NextResponse.json({ error: 'Missing username or OTP' }, { status: 400 });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check OTP
        if (!user.otp || user.otp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // Check Expiry
        if (user.otpExpires < new Date()) {
            return NextResponse.json({ error: 'OTP Expired' }, { status: 400 });
        }

        // Approve User
        user.permissionStatus = 'approved';
        user.otp = undefined;       // Clear OTP
        user.otpExpires = undefined;
        await user.save();

        return NextResponse.json({ message: 'Verification successful', user: { username: user.username, role: user.role } });

    } catch (error) {
        console.error("OTP Verify Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
