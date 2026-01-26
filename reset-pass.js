const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function resetPassword() {
    console.log('⏳ Reading .env.local...');
    const envPath = path.resolve(__dirname, '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env.local not found');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    let uri = match ? match[1].trim() : null;
    if (uri && (uri.startsWith('"') || uri.startsWith("'"))) {
        uri = uri.slice(1, -1);
    }

    if (!uri) {
        console.error('❌ MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        const userSchema = new mongoose.Schema({
            username: String,
            password: String
        }, { versionKey: false });
        const User = mongoose.models.User || mongoose.model('User', userSchema);

        const hashedPassword = await bcrypt.hash('hod123', 10);
        const result = await User.updateOne(
            { username: 'hod' },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount > 0) {
            console.log('✅ Password for "hod" updated to "hod123"');
        } else {
            console.log('⚠️ User "hod" found but not modified (maybe same password or user missing?)');
            console.log('Result:', result);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ DB Error:', error);
    }
}

resetPassword();
