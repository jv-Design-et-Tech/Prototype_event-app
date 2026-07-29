import { useState } from "react"
import { Bell, MapPin, Search, ChevronRight, TrendingUp } from "lucide-react"
import EventCard from "../components/EventCard"
import { events, categories, currentUser, notifications } from "../data/mock"
import type { Event } from "../types"

interface HomeScreenProps {
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onEventClick: (event: Event) => void
  onSearchClick: () => void
  onNotificationsClick: () => void
  onCategoryClick: (categoryId: string) => void
}

export default function HomeScreen({
  favorites,
  onToggleFavorite,
  onEventClick,
  onSearchClick,
  onNotificationsClick,
  onCategoryClick,
}: HomeScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const featuredEvents = events.filter((e) => e.isFeatured)
  const filteredEvents =
    activeCategory === "all" ? events : events.filter((e) => e.categoryId === activeCategory)
  const nearbyEvents = events.filter((e) => e.city === "Paris").slice(0, 4)

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id)
    if (id !== "all") onCategoryClick(id)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-5 sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-violet-100"
            />
            <div>
              <p className="text-gray-500 text-xs">Good morning 👋</p>
              <p className="text-gray-900 font-bold text-sm">{currentUser.name.split(" ")[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-violet-50 px-2.5 py-1.5 rounded-xl">
              <MapPin size={13} className="text-violet-600" />
              <span className="text-violet-700 text-xs font-semibold">Paris</span>
            </div>
            {/* <button
              onClick={onNotificationsClick}
              className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button> */}
          </div>
        </div>

        {/* Search bar */}
        {/* <button
          onClick={onSearchClick}
          className="w-full flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3"
        >
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-400 text-sm">Search events, artists, venues…</span>
        </button> */}
      </div>

      {/* Featured Events */}
      <div className="pt-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-gray-900 font-extrabold text-base">Featured Events</h2>
          <button
            className="text-violet-600 text-xs font-semibold flex items-center gap-0.5"
            onClick={() => setActiveCategory("all")}
          >
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 px-5 overflow-x-auto pb-2 scrollbar-hide">
          {featuredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isFavorite={favorites.includes(event.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={onEventClick}
              variant="featured"
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="pt-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-gray-900 font-extrabold text-base">Browse Categories</h2>
        </div>
        <div className="flex gap-2 px-5 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeCategory === "all"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeCategory === cat.id
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="pt-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-gray-900 font-extrabold text-base">
            {activeCategory === "all" ? "All Events" : categories.find((c) => c.id === activeCategory)?.name + " Events"}
          </h2>
          <span className="text-gray-400 text-xs">{filteredEvents.length} events</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-5">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">🎪</span>
            </div>
            <h3 className="text-gray-900 font-bold text-base mb-1">No events found</h3>
            <p className="text-gray-500 text-sm text-center">
              No events in this category right now. Check back soon!
            </p>
          </div>
        ) : (
          <div className="px-5 grid grid-cols-2 gap-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFavorite={favorites.includes(event.id)}
                onToggleFavorite={onToggleFavorite}
                onClick={onEventClick}
                variant="compact"
              />
            ))}
          </div>
        )}
      </div>

      {/* Trending Near You */}
      <div className="pt-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-600" />
            <h2 className="text-gray-900 font-extrabold text-base">Trending Near You</h2>
          </div>
          <button className="text-violet-600 text-xs font-semibold flex items-center gap-0.5">
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="px-5 space-y-3">
          {nearbyEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isFavorite={favorites.includes(event.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={onEventClick}
              variant="horizontal"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
