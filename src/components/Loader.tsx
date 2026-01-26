export default function Loader({ size = 20, className = "" }: { size?: number; className?: string }) {
    return (
        <div
            className={`relative rounded-full animate-spin cursor-wait ${className}`}
            style={{
                width: size,
                height: size,
                background: "conic-gradient(#ff0080, #7928ca, #ff0080)",
                maskImage: "radial-gradient(transparent 55%, black 55%)",
                WebkitMaskImage: "radial-gradient(transparent 55%, black 55%)",
            }}
        />
    );
}
