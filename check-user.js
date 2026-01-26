const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function checkUser() {
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

        // minimal user schema definition for query
        const userSchema = new mongoose.Schema({
            username: String,
            role: String,
            permissionStatus: String
        });
        const User = mongoose.models.User || mongoose.model('User', userSchema);

        const user = await User.findOne({ username: 'hod' });
        if (user) {
            console.log('✅ User "hod" FOUND:', JSON.stringify(user, null, 2));
        } else {
            console.log('❌ User "hod" NOT FOUND');
            // List all users to see what exists
            const allUsers = await User.find({}, 'username role permissionStatus');
            console.log('📋 Existing users:', JSON.stringify(allUsers, null, 2));
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ DB Error:', error);
    }
}

checkUser();
