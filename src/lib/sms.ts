// src/lib/sms.ts

export async function sendSMS(to: string, message: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
        console.log("------------------------------------------");
        console.log("⚠️ [MOCK SMS] Twilio Credentials Missing");
        console.log(`📨 To: ${to}`);
        console.log(`💬 Message: ${message}`);
        console.log("------------------------------------------");
        return { success: true, mock: true };
    }

    try {
        const client = require('twilio')(accountSid, authToken);
        await client.messages.create({
            body: message,
            from: fromNumber,
            to: to,
        });
        return { success: true };
    } catch (error) {
        console.error("Error sending SMS:", error);
        return { success: false, error };
    }
}
