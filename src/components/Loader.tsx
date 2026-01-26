export default function Loader({ size = 24, className = "" }: { size?: number; className?: string }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                    background: "conic-gradient(from 0deg, #22d3ee, #4ade80, #f472b6, #a855f7, #22d3ee)",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
                    WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
                }}
            />
            {/* Secondary segment layer for the "dashed" look */}
            <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                    background: "transparent",
                    border: "4px solid transparent",
                    borderTopColor: "rgba(255,255,255,0.8)",
                    borderRadius: "50%",
                    animationDuration: "1.5s",
                }}
            />
        </div>
    );
}
// Actually, let's stick to the user's specific image look: Colorful segments.
// Best way: Conic gradient with transparent stops.

export function SegmentedLoader({ size = 24, className = "" }: { size?: number; className?: string }) {
    return (
        <div className={`relative animate-spin ${className}`} style={{ width: size, height: size }}>
            <div
                className="w-full h-full rounded-full"
                style={{
                    background: "conic-gradient(from 0deg, #06b6d4, #22c55e, #e11d48, #9333ea, #06b6d4)",
                    maskImage: "radial-gradient(transparent 55%, black 55%), repeating-conic-gradient(black 0deg 15deg, transparent 15deg 20deg)",
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                    WebkitMaskImage: "radial-gradient(transparent 55%, black 55%), repeating-conic-gradient(black 0deg 15deg, transparent 15deg 20deg)"
                }}
            />
        </div>
    )
}
