import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, ChevronRight } from "lucide-react"

interface AuthScreenProps {
  onLogin: () => void
  onBack?: () => void
}

export default function AuthScreen({ onLogin, onBack: _onBack }: AuthScreenProps) {
  const [mode, setMode] = useState<"choose" | "login" | "register">("choose")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin()
    }, 1200)
  }

  if (mode === "choose") {
    return (
      <div className="fixed inset-0 flex flex-col bg-white">
        {/* Hero */}
        <div className="relative h-2/5">
          <img
            src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
          <div className="absolute bottom-6 left-6">
            <h1 className="text-white text-3xl font-extrabold leading-tight">
              Your next great<br />experience awaits
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pt-8 pb-10 flex flex-col">
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Join thousands of event-goers discovering unforgettable experiences every day.
          </p>

          <div className="space-y-3 flex-1">
            <button
              onClick={() => setMode("register")}
              className="w-full bg-violet-600 text-white font-bold py-4 rounded-2xl text-base active:bg-violet-800 transition-colors"
            >
              Create Account
            </button>
            <button
              onClick={() => setMode("login")}
              className="w-full bg-violet-50 text-violet-700 font-bold py-4 rounded-2xl text-base border border-violet-100 active:bg-violet-100 transition-colors"
            >
              Sign In
            </button>
          </div>

          <p className="text-gray-400 text-xs text-center mt-6 leading-relaxed">
            By continuing, you agree to our{" "}
            <span className="text-violet-600 font-medium">Terms of Service</span> and{" "}
            <span className="text-violet-600 font-medium">Privacy Policy</span>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button
          onClick={() => setMode("choose")}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
          <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
            <path d="M16 4C16 4 8 10 8 18C8 22.418 11.582 26 16 26C20.418 26 24 22.418 24 18C24 10 16 4 16 4Z" fill="white" />
          </svg>
        </div>
        <span className="text-xl font-extrabold text-gray-900">Eventorias</span>
      </div>

      <div className="flex-1 px-6 pt-4 pb-10 overflow-y-auto">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          {mode === "login"
            ? "Sign in to access your events and tickets."
            : "Join Eventorias and discover amazing events."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Sophie Martin"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={mode === "register" ? "Min. 8 characters" : "Enter your password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === "login" && (
            <div className="text-right">
              <button type="button" className="text-violet-600 text-sm font-medium">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white font-bold py-4 rounded-2xl text-base mt-2 disabled:opacity-60 active:bg-violet-800 transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onLogin}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 border border-gray-200 rounded-2xl bg-white active:bg-gray-50 transition-colors shadow-sm"
            aria-label="Sign in with Google"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-gray-700 font-semibold text-sm">Google</span>
          </button>

          <button
            type="button"
            onClick={onLogin}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 border border-gray-200 rounded-2xl bg-white active:bg-gray-50 transition-colors shadow-sm"
            aria-label="Sign in with Apple"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.27.07 2.15.74 2.89.8.93-.19 1.82-.86 2.93-.93 1.28-.07 2.4.36 3.24 1.3-2.78 1.68-2.36 5.26.26 6.28-.5 1.27-1.14 2.53-1.32 5.43zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000" />
            </svg>
            <span className="text-gray-700 font-semibold text-sm">Apple</span>
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-violet-600 font-semibold"
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  )
}
