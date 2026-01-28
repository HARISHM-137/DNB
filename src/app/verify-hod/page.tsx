"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Smartphone, CheckCircle, ArrowRight } from "lucide-react";
import Loader from "../../components/Loader";

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get("username");

    const [step, setStep] = useState<"access" | "otp">("access");
    const [accessNumber, setAccessNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!username) {
        return <div className="p-8 text-center text-red-600 font-bold">Error: Missing Username</div>;
    }

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, accessNumber }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep("otp");
                setSuccess("OTP sent successfully to the registered admin number.");
            } else {
                setError(data.error || "Failed to send OTP");
            }
        } catch {
            setError("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Verification Successful! Redirecting...");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setError(data.error || "Invalid OTP");
            }
        } catch {
            setError("Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">HOD Verification</h1>
                    <p className="text-gray-500 mt-2">
                        {step === "access"
                            ? "Enter the Administrator Access Number to verify your identity."
                            : "Enter the OTP sent to the admin number."}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium text-center border border-red-100">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium text-center border border-green-100">
                        {success}
                    </div>
                )}

                {step === "access" ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Access Number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={accessNumber}
                                    onChange={(e) => setAccessNumber(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none text-lg tracking-wide"
                                    placeholder="Enter Admin Phone Number"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                        >

                            <span className={`flex items-center gap-2 ${loading ? "opacity-0" : "opacity-100"}`}>
                                Request OTP <ArrowRight size={18} />
                            </span>
                            {!loading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-lg" />}
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader />
                                </div>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">One-Time Password (OTP)</label>
                            <div className="relative">
                                <CheckCircle className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none text-center text-2xl tracking-[0.5em] font-mono"
                                    placeholder="••••••"
                                    maxLength={6}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            {loading && <Loader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
                            <span className={loading ? "opacity-0" : "opacity-100"}>Verify & Approve</span>
                            {!loading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-lg" />}
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader />
                                </div>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep("access")}
                            className="w-full text-gray-500 text-sm hover:underline"
                        >
                            Go Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function VerifyHodPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
