import { Home, Search, Heart, Bell, User } from "lucide-react"

type Screen = "home" | "search" | "favorites" | "notifications" | "profile"

interface BottomNavProps {
  active: Screen
  onNavigate: (screen: Screen) => void
  unreadCount?: number
}

const tabs = [
  { id: "home" as Screen, icon: Home, label: "Home" },
  { id: "search" as Screen, icon: Search, label: "Search" },
  { id: "favorites" as Screen, icon: Heart, label: "Favorites" },
  { id: "notifications" as Screen, icon: Bell, label: "Alerts" },
  { id: "profile" as Screen, icon: User, label: "Profile" },
]

export default function BottomNav({ active, onNavigate, unreadCount = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 active:scale-95"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={isActive ? "text-violet-600" : "text-gray-400"}
                  fill={isActive ? "currentColor" : "none"}
                  strokeWidth={isActive ? 0 : 1.75}
                />
                {id === "notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-violet-600" : "text-gray-400"}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
