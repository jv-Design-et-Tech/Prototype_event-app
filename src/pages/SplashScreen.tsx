import { useEffect } from "react"

interface SplashScreenProps {
  onDone: () => void
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2200)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="fixed inset-0 bg-violet-600 flex flex-col items-center justify-center z-50">
      <div className="animate-bounce-slow flex flex-col items-center gap-4">
        {/* Logo mark */}
        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center shadow-2xl">
          <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
            <circle cx="24" cy="24" r="20" fill="white" fillOpacity="0.15" />
            <path
              d="M24 8C24 8 12 16 12 26C12 32.627 17.373 38 24 38C30.627 38 36 32.627 36 26C36 16 24 8 24 8Z"
              fill="white"
            />
            <path d="M18 26L22 30L30 22" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-white text-3xl font-extrabold tracking-tight">Eventorias</h1>
          <p className="text-white/70 text-sm mt-1 font-medium">Discover. Book. Experience.</p>
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
