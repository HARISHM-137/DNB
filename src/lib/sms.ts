// src/lib/sms.ts

export async function sendSMS(to: string, message: string) {
    // DEBUG: Always log SMS to console for development/demo verification
    console.log("------------------------------------------");
    console.log(`📨 [MOCK SMS] To: ${to}`);
    console.log(`💬 [MOCK SMS] Message: ${message}`);
    console.log("------------------------------------------");

    // Extract OTP from message if present (simple regex)
    const otpMatch = message.match(/\b\d{6}\b/);
    const mockOtp = otpMatch ? otpMatch[0] : null;

    // Simulate success
    return {
        success: true,
        mock: true,
        message: "Mock SMS Sent Successfully",
        debug_otp: mockOtp
    };
}
