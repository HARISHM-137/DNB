// src/lib/sms.ts

export async function sendSMS(to: string, message: string) {
    const start = Date.now();
    const apiKey = process.env.FAST2SMS_API_KEY;

    // DEBUG: Always log SMS to console for development verification
    console.log("------------------------------------------");
    console.log(`📨 [SMS DEBUG] To: ${to}`);
    console.log(`💬 [SMS DEBUG] Message: ${message}`);
    console.log("------------------------------------------");

    // Fast2SMS usually expects 10 digit number for their free route.
    // Robust cleaning: remove non-digits, then take last 10 chars
    const cleanNumber = to.replace(/\D/g, '').slice(-10);

    if (!apiKey) {
        console.log("------------------------------------------");
        console.log("⚠️ [MOCK SMS] FAST2SMS_API_KEY Missing in .env.local");
        console.log(`📨 To: ${to}`);
        console.log(`💬 Message: ${message}`);
        console.log("------------------------------------------");
        return { success: true, mock: true };
    }

    try {
        // Fast2SMS "Quick SMS" API (Free/Bulk)
        // Method: POST
        // URL: https://www.fast2sms.com/dev/bulkV2
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
                'authorization': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "route": "q", // "q" for Quick SMS (promotional/trans) - simplest for testing
                "message": message,
                "language": "english",
                "flash": 0,
                "numbers": cleanNumber,
            })
        });

        const data = await response.json();

        if (data.return) {
            console.log(`✅ SMS sent via Fast2SMS to ${cleanNumber}`);
            return { success: true, data };
        } else {
            console.error("❌ Fast2SMS Failed:", data);
            return { success: false, error: data.message };
        }

    } catch (error) {
        console.error("Error sending SMS:", error);
        return { success: false, error };
    }
}
