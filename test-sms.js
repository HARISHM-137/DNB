// Using native fetch

async function testSMS() {
    try {
        console.log("Testing Fast2SMS...");
        const response = await fetch('http://localhost:3000/api/auth/otp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'hod123', // Assuming this user exists from previous logs
                accessNumber: '7904311829'
            })
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testSMS();
