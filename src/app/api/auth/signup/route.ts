import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, password, role, phoneNumber } = await req.json();

        if (!username || !password || !role || !phoneNumber) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { phoneNumber }]
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Username or Phone Number already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Students are auto-approved (though they don't really login in this system based on original req, 
        // but if we support student login later, this handles it. 
        // For Admin/HOD, status is pending.
        const permissionStatus = role === 'student' ? 'approved' : 'pending';

        const user = await User.create({
            username,
            phoneNumber,
            password: hashedPassword,
            role,
            permissionStatus,
        });

        return NextResponse.json({ message: 'User created successfully', user: { username: user.username, role: user.role, status: user.permissionStatus } });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
