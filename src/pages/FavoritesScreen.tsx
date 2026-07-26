import { Heart } from "lucide-react"
import EventCard from "../components/EventCard"
import { events } from "../data/mock"
import type { Event } from "../types"

interface FavoritesScreenProps {
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onEventClick: (event: Event) => void
}

export default function FavoritesScreen({ favorites, onToggleFavorite, onEventClick }: FavoritesScreenProps) {
  const favoriteEvents = events.filter((e) => favorites.includes(e.id))

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-5 border-b border-gray-100">
        <h1 className="text-gray-900 font-extrabold text-xl">My Favorites</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {favoriteEvents.length} saved event{favoriteEvents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Content */}
      {favoriteEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-20">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
            <Heart size={36} className="text-red-300" />
          </div>
          <h2 className="text-gray-900 font-bold text-lg mb-2">No favorites yet</h2>
          <p className="text-gray-500 text-sm text-center leading-relaxed">
            Tap the heart icon on any event to save it here for quick access.
          </p>
        </div>
      ) : (
        <div className="px-5 pt-5 space-y-3">
          {favoriteEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onClick={onEventClick}
              variant="horizontal"
            />
          ))}
        </div>
      )}
    </div>
  )
}
