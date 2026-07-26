import { useState } from "react"
import { ChevronRight } from "lucide-react"

interface OnboardingScreenProps {
  onDone: () => void
}

const slides = [
  {
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=1000&fit=crop&auto=format",
    title: "Discover Amazing Events",
    subtitle: "Find concerts, festivals, exhibitions and more happening near you — curated just for your taste.",
    accent: "#7C3AED",
  },
  {
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=1000&fit=crop&auto=format",
    title: "Book in Seconds",
    subtitle: "Secure your spot in a few taps. Your tickets are saved digitally — no printing needed.",
    accent: "#2563EB",
  },
  {
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1000&fit=crop&auto=format",
    title: "Never Miss a Moment",
    subtitle: "Get smart reminders, personalized recommendations and exclusive early-bird deals.",
    accent: "#D97706",
  },
]

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [current, setCurrent] = useState(0)

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1)
    else onDone()
  }

  const slide = slides[current]

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt=""
          className="w-full h-full object-cover opacity-40 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
      </div>

      {/* Skip button */}
      <button onClick={onDone} className="absolute top-14 right-6 text-white/60 text-sm font-medium z-10">
        Skip
      </button>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-14 z-10">
        {/* Dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full cursor-pointer"
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                backgroundColor: i === current ? "white" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        <h1 className="text-white text-3xl font-extrabold leading-tight mb-3">{slide.title}</h1>
        <p className="text-white/60 text-base leading-relaxed mb-10">{slide.subtitle}</p>

        <button
          onClick={next}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold text-base py-4 rounded-2xl transition-colors"
        >
          {current < slides.length - 1 ? "Continue" : "Get Started"}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
