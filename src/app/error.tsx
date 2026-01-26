"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-black z-[100] relative">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Application Error</h2>
            <p className="text-lg text-gray-700 mb-6">
                Something went wrong. Please share this error with the developer:
            </p>

            <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 w-full max-w-4xl overflow-auto mb-8 shadow-inner">
                <p className="font-mono text-base font-bold text-red-800 mb-2">
                    {error.message || "Unknown Error"}
                </p>
                <p className="font-mono text-xs text-gray-500 mb-4">
                    Digest: {error.digest}
                </p>
                {error.stack && (
                    <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap">
                        {error.stack}
                    </pre>
                )}
            </div>

            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
                Try again
            </button>
        </div>
    );
}
