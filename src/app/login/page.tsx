"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import Loader from "@/components/Loader";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(res.error || "Login failed");
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
            // Keep loading true while redirecting for smoother UX
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Sign in to access the dashboard</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-500" size={20} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-blue-50/30 text-gray-900 font-medium"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-blue-50/30 text-gray-900 font-medium"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        {loading && <Loader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
                        <span className={loading ? "opacity-0" : "opacity-100"}>Sign In</span>
                        {!loading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-lg" />}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
