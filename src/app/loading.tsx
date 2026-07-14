export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Animated plant spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-brand-hero" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-secondary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            🌿
          </div>
        </div>
        <p className="text-sm font-semibold text-brand-secondary tracking-wide animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
