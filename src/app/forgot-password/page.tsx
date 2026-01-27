
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import Loader from "@/components/Loader";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [identifier, setIdentifier] = useState(""); // Phone number
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const router = useRouter();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/otp/send-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier }),
            });
            const data = await res.json();

            if (res.ok) {
                setStep(2);
            } else {
                setError(data.error || "Failed to send OTP");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/otp/verify-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, otp, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setError(data.error || "Failed to reset password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
                    <p className="text-gray-500">Your password has been securely reset. Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-gray-500 mt-2">
                        {step === 1 ? "Enter your registered phone number" : "Enter the OTP sent to your phone"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number / Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-blue-50/30 text-gray-900 font-medium"
                                    placeholder="Enter username or phone"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
                        >
                            {loading && <Loader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
                            <span className={loading ? "opacity-0" : "opacity-100 flex items-center gap-2"}>
                                Send OTP <ArrowRight size={20} />
                            </span>
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-blue-50/30 text-gray-900 font-medium tracking-widest"
                                    placeholder="123456"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-blue-50/30 text-gray-900 font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-blue-50/30 text-gray-900 font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
                        >
                            {loading && <Loader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
                            <span className={loading ? "opacity-0" : "opacity-100"}>Update Password</span>
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
