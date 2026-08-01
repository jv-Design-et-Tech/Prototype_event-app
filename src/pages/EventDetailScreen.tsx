import { useState } from "react"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  CheckCircle,
  Ticket,
  Globe,
  Check,
  LogIn,
  X,
  Navigation
} from "lucide-react"
import type { Event, Review } from "../types"
import { formatDate, formatAttendees } from "../utils/format"
import { reviews as allReviews } from "../data/mock"

interface EventDetailScreenProps {
  event: Event
  isFavorite: boolean
  isLoggedIn: boolean
  onToggleFavorite: (id: string) => void
  onBack: () => void
  onBook: (event: Event) => void
  onSignIn: () => void
}

type CalendarSheet = "closed" | "picking" | "loading" | "success"

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  )
}

export default function EventDetailScreen({
  event,
  isFavorite,
  isLoggedIn,
  onToggleFavorite,
  onBack,
  onBook,
  onSignIn,
}: EventDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details")
  const [imageIndex, setImageIndex] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isFollowingOrganizer, setIsFollowingOrganizer] = useState(false)

  // Calendar state
  const [calendarSheet, setCalendarSheet] = useState<CalendarSheet>("closed")
  const [selectedCalendar, setSelectedCalendar] = useState<"google" | "apple" | null>(null)
  const [showAuthGate, setShowAuthGate] = useState(false)

  // Maps state
  const [showMapsSheet, setShowMapsSheet] = useState(false)

  const eventReviews = allReviews.filter((r) => r.eventId === event.id)
  const spotsLeft = event.maxAttendees - event.attendeesCount
  const spotsPercent = (event.attendeesCount / event.maxAttendees) * 100

  const handleAddToCalendar = () => {
    if (!isLoggedIn) {
      setShowAuthGate(true)
    } else {
      setCalendarSheet("picking")
    }
  }

  const handleCalendarChoice = (cal: "google" | "apple") => {
    setSelectedCalendar(cal)
    setCalendarSheet("loading")
    setTimeout(() => setCalendarSheet("success"), 1400)
  }

  const handleCalendarDone = () => {
    setCalendarSheet("closed")
    setSelectedCalendar(null)
  }

  const overlayVisible = calendarSheet !== "closed" || showAuthGate || showMapsSheet

  const openInMaps = (provider: "google" | "apple") => {
    const query = encodeURIComponent(`${event.location}, ${event.address}, ${event.city}`)
    const url =
      provider === "google"
        ? `https://www.google.com/maps/search/?api=1&query=${query}`
        : `https://maps.apple.com/?q=${query}`
    window.open(url, "_blank", "noopener,noreferrer")
    setShowMapsSheet(false)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Image carousel */}
        <div className="relative h-72 bg-gray-200">
          <img
            src={event.images[imageIndex] ?? event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-14">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div className="flex gap-2">
              <button
                className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
                aria-label="Share"
              >
                <Share2 size={16} className="text-white" />
              </button>
              <button
                onClick={() => onToggleFavorite(event.id)}
                className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  size={16}
                  className={isFavorite ? "text-red-400" : "text-white"}
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>

          {event.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {event.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === imageIndex ? 20 : 6,
                    height: 6,
                    backgroundColor: i === imageIndex ? "white" : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
          )}

          <div className="absolute bottom-4 left-4 bg-violet-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {event.category}
          </div>
          {event.isOnline && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <Globe size={10} />
              Online
            </div>
          )}
        </div>

        {/* Event info */}
        <div className="px-5 pt-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h1 className="text-gray-900 font-extrabold text-xl leading-tight flex-1">{event.title}</h1>
            <div className="flex-shrink-0 text-right">
              {event.originalPrice && (
                <p className="text-gray-400 text-xs line-through">{event.currency}{event.originalPrice}</p>
              )}
              <p className="text-violet-600 font-extrabold text-xl">
                {event.price === 0 ? "Free" : `${event.currency}${event.price}`}
              </p>
            </div>
          </div>

          {/* Rating & attendees */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={13} className={i <= Math.round(event.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                ))}
              </div>
              <span className="text-gray-700 text-sm font-bold">{event.rating}</span>
              <span className="text-gray-400 text-xs">({event.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={13} className="text-gray-400" />
              <span className="text-gray-500 text-xs">{formatAttendees(event.attendeesCount)} going</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="flex items-start gap-3 bg-violet-50 rounded-2xl p-3.5">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Calendar size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Date</p>
                <p className="text-gray-900 font-bold text-xs leading-tight mt-0.5">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-violet-50 rounded-2xl p-3.5">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Time</p>
                <p className="text-gray-900 font-bold text-xs leading-tight mt-0.5">{event.time} – {event.endTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-violet-50 rounded-2xl p-3.5 col-span-2">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Location</p>
                <p className="text-gray-900 font-bold text-xs leading-tight mt-0.5">{event.location}</p>
                <p className="text-gray-500 text-xs">{event.address}</p>
              </div>
            </div>
          </div>

          {/* ── Map section ── */}
          <MapPreview event={event} onTap={() => setShowMapsSheet(true)} />

          {/* Capacity bar */}
          <div className="mb-5 bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-900 font-semibold text-sm">Availability</span>
              <span className={`text-xs font-bold ${spotsLeft < 500 ? "text-red-500" : "text-green-600"}`}>
                {spotsLeft < 500 ? `Only ${spotsLeft} spots left!` : `${formatAttendees(spotsLeft)} spots left`}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${spotsPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-gray-400 text-xs">{formatAttendees(event.attendeesCount)} attending</span>
              <span className="text-gray-400 text-xs">{formatAttendees(event.maxAttendees)} max</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-5">
            {(["details", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab
                    ? "text-violet-600 border-b-2 border-violet-600"
                    : "text-gray-500"
                  }`}
              >
                {tab === "reviews" ? `Reviews (${eventReviews.length || event.reviewsCount})` : "Details"}
              </button>
            ))}
          </div>

          {activeTab === "details" && (
            <div>
              {/* Description */}
              <div className="mb-4">
                <h2 className="text-gray-900 font-bold text-sm mb-2">About this event</h2>
                <p className={`text-gray-600 text-sm leading-relaxed ${!showFullDescription ? "line-clamp-4" : ""}`}>
                  {event.longDescription}
                </p>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-violet-600 text-sm font-semibold mt-1"
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </button>
              </div>

              {/* ── ADD TO CALENDAR BUTTON ── */}
              <button
                onClick={handleAddToCalendar}
                className="w-full flex items-center justify-center gap-2.5 bg-violet-600 text-white font-bold py-3.5 rounded-2xl mb-5 active:bg-violet-800 transition-colors shadow-sm shadow-violet-200"
              >
                <Calendar size={18} />
                Add to Calendar
              </button>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {event.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Organizer */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h2 className="text-gray-900 font-bold text-sm mb-3">Organizer</h2>
                <div className="flex items-center gap-3">
                  <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-gray-900 font-bold text-sm">{event.organizer.name}</p>
                      {event.organizer.verified && (
                        <CheckCircle size={14} className="text-violet-500 fill-violet-100 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">
                      {formatAttendees(event.organizer.followersCount)} followers · {event.organizer.eventsCount} events
                    </p>
                  </div>
                  <button
                    onClick={() => setIsFollowingOrganizer(!isFollowingOrganizer)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${isFollowingOrganizer
                        ? "bg-violet-100 text-violet-700"
                        : "bg-violet-600 text-white"
                      }`}
                  >
                    {isFollowingOrganizer ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center gap-5 bg-gray-50 rounded-2xl p-4 mb-5">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-gray-900">{event.rating}</p>
                  <StarRow rating={event.rating} />
                  <p className="text-gray-500 text-xs mt-1">{event.reviewsCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 7 : star === 2 ? 2 : 1
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-3">{star}</span>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {eventReviews.length > 0 ? (
                <div className="space-y-4">
                  {eventReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-10">
                  <Star size={32} className="text-gray-200 mb-3" />
                  <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-gray-500 text-xs">From</p>
            <p className="text-violet-600 font-extrabold text-xl">
              {event.price === 0 ? "Free" : `${event.currency}${event.price}`}
            </p>
          </div>
          <button
            onClick={() => onBook(event)}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 text-white font-bold py-4 rounded-2xl active:bg-violet-800 transition-colors"
          >
            <Ticket size={18} />
            Book Tickets
          </button>
        </div>
      </div>

      {/* ── Dim overlay ── */}
      {overlayVisible && (
        <div
          className="absolute inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => {
            setCalendarSheet("closed")
            setShowAuthGate(false)
          }}
        />
      )}

      {/* ── Auth gate modal ── */}
      {showAuthGate && (
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-3xl z-40 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center">
              <LogIn size={20} className="text-violet-600" />
            </div>
            <button
              onClick={() => setShowAuthGate(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X size={15} className="text-gray-500" />
            </button>
          </div>
          <h2 className="text-gray-900 font-extrabold text-lg mb-1">Sign in required</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Please sign in to add this event to your Google or Apple Calendar.
          </p>
          <div className="space-y-2.5">
            <button
              onClick={() => { setShowAuthGate(false); onSignIn() }}
              className="w-full bg-violet-600 text-white font-bold py-3.5 rounded-2xl active:bg-violet-800 transition-colors"
            >
              Sign In{/* ── Map section ── */}
              <MapPreview event={event} onTap={() => setShowMapsSheet(true)} />
            </button>
            <button
              onClick={() => setShowAuthGate(false)}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-2xl active:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Maps bottom sheet ── */}
      {showMapsSheet && (
        <MapsSheet
          event={event}
          onClose={() => setShowMapsSheet(false)}
          onSelect={openInMaps}
        />
      )}

      {/* ── Calendar bottom sheet ── */}
      {calendarSheet !== "closed" && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-40 shadow-2xl"
          style={{
            transform: "translateY(0)",
            transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {calendarSheet === "picking" && (
            <div className="px-5 pb-10 pt-3">
              <h2 className="text-gray-900 font-extrabold text-lg text-center mb-1">Choose your calendar</h2>
              <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
                Save <span className="font-semibold text-gray-600">"{event.title}"</span> so you never miss it.
              </p>
              <div className="space-y-3">
                {/* Google Calendar */}
                <button
                  onClick={() => handleCalendarChoice("google")}
                  className="w-full flex items-center gap-4 bg-gray-50 hover:bg-gray-100 active:bg-gray-100 rounded-2xl px-5 py-4 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <svg viewBox="0 0 48 48" className="w-7 h-7">
                      <path fill="#4285F4" d="M44 20H24v8h11.3C33.7 32.6 29.4 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.9 0 5.5 1.1 7.5 2.9l5.7-5.7C33.8 7.3 29.2 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19c9.7 0 18-7 18-19 0-1.3-.1-2.7-.3-4z" />
                      <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 13 24 13c2.9 0 5.5 1.1 7.5 2.9l5.7-5.7C33.8 7.3 29.2 5 24 5c-7.6 0-14.1 4.4-17.7 9.7z" />
                      <path fill="#FBBC05" d="M24 43c5.2 0 9.8-1.8 13.3-4.7l-6.1-5.2C29.4 34.6 26.8 35 24 35c-5.4 0-9.8-3.5-11.3-8.3l-6.5 5C9.9 38.7 16.4 43 24 43z" />
                      <path fill="#EA4335" d="M44 20H24v8h11.3c-.7 2.1-2 3.9-3.8 5.1l6.1 5.2c3.6-3.3 5.8-8.2 5.8-14.3 0-1.3-.1-2.7-.4-4z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-gray-900 font-bold text-base">Google Calendar</p>
                    <p className="text-gray-400 text-xs mt-0.5">Add to your Google account</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center group-active:bg-violet-100">
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                      <path d="M6 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* Apple Calendar */}
                <button
                  onClick={() => handleCalendarChoice("apple")}
                  className="w-full flex items-center gap-4 bg-gray-50 hover:bg-gray-100 active:bg-gray-100 rounded-2xl px-5 py-4 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <svg viewBox="0 0 48 48" className="w-7 h-7">
                      <rect width="48" height="48" rx="10" fill="#FF3B30" />
                      <rect x="6" y="6" width="36" height="36" rx="6" fill="white" />
                      <rect x="6" y="6" width="36" height="10" rx="0" fill="#FF3B30" />
                      <rect x="6" y="6" width="36" height="10" rx="6" fill="#FF3B30" />
                      <text x="24" y="36" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1C1C1E" fontFamily="system-ui">
                        {new Date().getDate()}
                      </text>
                      <circle cx="15" cy="8" r="2" fill="white" />
                      <circle cx="33" cy="8" r="2" fill="white" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-gray-900 font-bold text-base">Apple Calendar</p>
                    <p className="text-gray-400 text-xs mt-0.5">Add to your iCloud calendar</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center group-active:bg-violet-100">
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                      <path d="M6 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          )}

          {calendarSheet === "loading" && (
            <div className="px-5 pb-12 pt-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin mt-6 mb-5" />
              <p className="text-gray-900 font-bold text-base">Adding to calendar…</p>
              <p className="text-gray-400 text-sm mt-1">
                Saving to your {selectedCalendar === "google" ? "Google" : "Apple"} Calendar
              </p>
            </div>
          )}

          {calendarSheet === "success" && (
            <div className="px-5 pb-10 pt-4 flex flex-col items-center text-center">
              {/* Animated success ring */}
              <div className="relative w-20 h-20 mb-5 mt-4">
                <div className="absolute inset-0 rounded-full bg-green-100" />
                <div className="absolute inset-0 rounded-full bg-green-50 scale-110 opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200">
                    <Check size={28} className="text-white stroke-[3]" />
                  </div>
                </div>
              </div>

              <h2 className="text-gray-900 font-extrabold text-xl mb-2">
                Event added successfully!
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-1">
                <span className="font-semibold text-gray-700">"{event.title}"</span> has been saved to your{" "}
                {selectedCalendar === "google" ? "Google" : "Apple"} Calendar.
              </p>

              {/* Mini event summary */}
              <div className="w-full bg-gray-50 rounded-2xl px-4 py-3.5 mt-5 mb-6 text-left space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-violet-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-semibold">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-violet-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{event.time} – {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-violet-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm truncate">{event.location}</span>
                </div>
              </div>

              <button
                onClick={handleCalendarDone}
                className="w-full bg-violet-600 text-white font-bold py-4 rounded-2xl active:bg-violet-800 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Map preview component ──────────────────────────────────────────────────

interface MapPreviewProps {
  event: Event
  onTap: () => void
}

function MapPreview({ event, onTap }: MapPreviewProps) {
  const lat = event.lat ?? 48.8566
  const lng = event.lng ?? 2.3522
  const pad = 0.012
  const bbox = `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`

  return (
    <div className="mb-5">

      {/* Map container */}
      <div
        className="relative rounded-2xl overflow-hidden border border-gray-200"
        style={{ height: 180, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        {/* OpenStreetMap iframe */}
        <iframe
          title={`Map – ${event.location}`}
          src={embedUrl}
          className="w-full h-full"
          style={{ border: 0, pointerEvents: "none" }}
          loading="lazy"
          aria-hidden="true"
        />

        {/* Transparent tap overlay */}
        <button
          onClick={onTap}
          className="absolute inset-0 w-full h-full"
          aria-label="Open location in maps app"
        />

        {/* "Open in Maps" pill */}
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-200/60">
            <Navigation size={12} className="text-violet-600" />
            <span className="text-gray-700 text-xs font-semibold">Open in Maps</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Open-with bottom sheet ─────────────────────────────────────────────────

interface MapsSheetProps {
  event: Event
  onClose: () => void
  onSelect: (provider: "google" | "apple") => void
}

function MapsSheet({ event, onClose, onSelect }: MapsSheetProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-40 shadow-2xl"
      style={{ transform: "translateY(0)", transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-gray-200 rounded-full" />
      </div>

      <div className="px-5 pb-10 pt-3">
        <h2 className="text-gray-900 font-extrabold text-lg text-center mb-1">Open with</h2>
        <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
          Get directions to{" "}
          <span className="font-semibold text-gray-600">{event.location}</span>
        </p>

        <div className="space-y-3">
          {/* Google Maps */}
          <button
            onClick={() => onSelect("google")}
            className="w-full flex items-center gap-4 bg-gray-50 active:bg-gray-100 rounded-2xl px-5 py-4 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100">
              <svg viewBox="0 0 48 48" className="w-7 h-7">
                <path fill="#34A853" d="M24 38.4C24 38.4 10 26.1 10 18.6 10 11.1 16.3 5 24 5s14 6.1 14 13.6c0 7.5-14 19.8-14 19.8z" />
                <path fill="#4285F4" d="M24 5C16.3 5 10 11.1 10 18.6c0 2.6.8 5 2.1 7.1L24 9.8V5z" />
                <path fill="#FBBC05" d="M24 5v4.8L35.9 25.7c1.3-2.1 2.1-4.5 2.1-7.1C38 11.1 31.7 5 24 5z" />
                <path fill="#EA4335" d="M10 18.6c0 2.6.8 5 2.1 7.1L24 9.8c-5.5 0-14 3.9-14 8.8z" />
                <circle fill="white" cx="24" cy="18.6" r="5" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 font-bold text-base">Google Maps</p>
              <p className="text-gray-400 text-xs mt-0.5 truncate">{event.address}, {event.city}</p>
            </div>
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0">
              <path d="M6 4l4 4-4 4" stroke="#D1D5DB" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Apple Maps */}
          <button
            onClick={() => onSelect("apple")}
            className="w-full flex items-center gap-4 bg-gray-50 active:bg-gray-100 rounded-2xl px-5 py-4 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100 overflow-hidden">
              <svg viewBox="0 0 48 48" className="w-12 h-12">
                <rect width="48" height="48" fill="white" />
                {/* Sky gradient */}
                <rect x="0" y="0" width="48" height="28" fill="#5AC8FA" />
                {/* Ground */}
                <rect x="0" y="28" width="48" height="20" fill="#5DC15A" />
                {/* Road */}
                <path d="M22 48 L24 20 L26 48Z" fill="#B0B0B0" />
                {/* Pin */}
                <circle cx="24" cy="16" r="7" fill="#FF3B30" />
                <circle cx="24" cy="16" r="3" fill="white" />
                <path d="M24 22 L24 26" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 font-bold text-base">Apple Maps</p>
              <p className="text-gray-400 text-xs mt-0.5 truncate">{event.address}, {event.city}</p>
            </div>
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0">
              <path d="M6 4l4 4-4 4" stroke="#D1D5DB" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="w-full mt-3 py-3.5 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-sm active:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={review.user.avatar}
          alt={review.user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-gray-900 font-bold text-sm">{review.user.name}</p>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={11} className={i <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
              ))}
            </div>
            <span className="text-gray-400 text-xs">{review.date}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
      <div className="flex items-center gap-1.5 mt-2">
        <Heart size={13} className="text-gray-400" />
        <span className="text-gray-400 text-xs">{review.likes} found this helpful</span>
      </div>
    </div>
  )
}
