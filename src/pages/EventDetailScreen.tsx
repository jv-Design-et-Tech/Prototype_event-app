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
} from "lucide-react"
import type { Event, Review } from "../types"
import { formatDate, formatAttendees } from "../utils/format"
import { reviews as allReviews } from "../data/mock"

interface EventDetailScreenProps {
  event: Event
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onBack: () => void
  onBook: (event: Event) => void
}

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
  onToggleFavorite,
  onBack,
  onBook,
}: EventDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details")
  const [imageIndex, setImageIndex] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isFollowingOrganizer, setIsFollowingOrganizer] = useState(false)

  const eventReviews = allReviews.filter((r) => r.eventId === event.id)
  const spotsLeft = event.maxAttendees - event.attendeesCount
  const spotsPercent = (event.attendeesCount / event.maxAttendees) * 100

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Image carousel */}
        <div className="relative h-72 bg-gray-200">
          <img
            src={event.images[imageIndex] ?? event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Top bar */}
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

          {/* Image dots */}
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

          {/* Category badge */}
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
                {[1,2,3,4,5].map((i) => (
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
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
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
              <div className="mb-5">
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isFollowingOrganizer
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
              {/* Rating summary */}
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

              {/* Review list */}
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

      {/* Bottom CTA */}
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
              {[1,2,3,4,5].map((i) => (
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
