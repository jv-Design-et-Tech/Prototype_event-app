import { Heart, MapPin, Star, Calendar } from "lucide-react"
import type { Event } from "../types"
import { formatDate } from "../utils/format"

interface EventCardProps {
  event: Event
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onClick: (event: Event) => void
  variant?: "featured" | "regular" | "compact" | "horizontal"
}

export default function EventCard({
  event,
  isFavorite,
  onToggleFavorite,
  onClick,
  variant = "regular",
}: EventCardProps) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(event.id)
  }

  if (variant === "featured") {
    return (
      <div
        onClick={() => onClick(event)}
        className="relative flex-shrink-0 w-72 h-80 rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
        role="button"
        tabIndex={0}
        aria-label={`View ${event.title}`}
      >
        <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3 bg-violet-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          Featured
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={15}
            className={isFavorite ? "text-red-400" : "text-white"}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full mb-2">
            {event.category}
          </span>
          <h3 className="text-white font-bold text-base leading-tight mb-2 line-clamp-2">{event.title}</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-white/70" />
              <span className="text-white/80 text-xs">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-white/70" />
              <span className="text-white/80 text-xs truncate max-w-[120px]">{event.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-semibold">{event.rating}</span>
              <span className="text-white/60 text-xs">({event.reviewsCount})</span>
            </div>
            <span className="text-white font-bold text-sm">
              {event.price === 0 ? "Free" : `${event.currency}${event.price}`}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "horizontal") {
    return (
      <div
        onClick={() => onClick(event)}
        className="flex gap-3 bg-white rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform border border-gray-100"
        role="button"
        tabIndex={0}
        aria-label={`View ${event.title}`}
      >
        <div className="relative w-28 flex-shrink-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={13}
              className={isFavorite ? "text-red-500" : "text-gray-400"}
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
        <div className="flex-1 py-3 pr-3 flex flex-col justify-between min-w-0">
          <div>
            <span className="text-violet-600 text-xs font-medium">{event.category}</span>
            <h3 className="text-gray-900 font-bold text-sm leading-tight mt-0.5 line-clamp-2">{event.title}</h3>
          </div>
          <div className="mt-1.5 space-y-1">
            <div className="flex items-center gap-1">
              <Calendar size={11} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-500 text-xs">{formatDate(event.date)} · {event.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-500 text-xs truncate">{event.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span className="text-gray-700 text-xs font-semibold">{event.rating}</span>
            </div>
            <span className="text-violet-600 font-bold text-sm">
              {event.price === 0 ? "Free" : `${event.currency}${event.price}`}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div
        onClick={() => onClick(event)}
        className="relative flex-shrink-0 w-44 rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform shadow-sm border border-gray-100"
        role="button"
        tabIndex={0}
        aria-label={`View ${event.title}`}
      >
        <div className="relative h-28">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Heart
              size={12}
              className={isFavorite ? "text-red-400" : "text-white"}
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
        <div className="bg-white p-2.5">
          <span className="text-violet-600 text-[10px] font-medium">{event.category}</span>
          <h3 className="text-gray-900 font-bold text-xs leading-tight mt-0.5 line-clamp-2">{event.title}</h3>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-gray-400 text-[10px]">{formatDate(event.date)}</span>
            <span className="text-violet-600 font-bold text-xs">
              {event.price === 0 ? "Free" : `${event.currency}${event.price}`}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Default "regular" card
  return (
    <div
      onClick={() => onClick(event)}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform shadow-sm border border-gray-100"
      role="button"
      tabIndex={0}
      aria-label={`View ${event.title}`}
    >
      <div className="relative h-44">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          {event.category}
        </div>
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={15}
            className={isFavorite ? "text-red-500" : "text-gray-400"}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="p-3.5">
        <h3 className="text-gray-900 font-bold text-sm leading-tight mb-2 line-clamp-2">{event.title}</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-violet-500 flex-shrink-0" />
            <span className="text-gray-500 text-xs">{formatDate(event.date)} · {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-violet-500 flex-shrink-0" />
            <span className="text-gray-500 text-xs truncate">{event.location}, {event.city}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-gray-700 text-xs font-semibold">{event.rating}</span>
            <span className="text-gray-400 text-xs">({event.reviewsCount})</span>
          </div>
          <div className="text-right">
            {event.originalPrice && (
              <span className="text-gray-400 text-xs line-through mr-1">
                {event.currency}{event.originalPrice}
              </span>
            )}
            <span className="text-violet-600 font-bold text-sm">
              {event.price === 0 ? "Free" : `${event.currency}${event.price}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
