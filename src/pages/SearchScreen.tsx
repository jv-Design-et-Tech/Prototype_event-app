import { useState, useMemo } from "react"
import { Search, X, SlidersHorizontal, ArrowLeft } from "lucide-react"
import EventCard from "../components/EventCard"
import { events, categories } from "../data/mock"
import type { Event } from "../types"

interface SearchScreenProps {
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onEventClick: (event: Event) => void
  onBack: () => void
}

const popularSearches = ["Jazz Festival", "Tech Conference", "Coldplay", "Food Festival", "Comedy Night", "Art Exhibition"]
const cities = ["All Cities", "Paris", "Lyon", "Marseille", "Cannes", "Nice"]
const priceRanges = ["Any Price", "Free", "Under €30", "€30–€100", "Over €100"]
const sortOptions = ["Relevance", "Date: Soonest", "Price: Low to High", "Price: High to Low", "Top Rated"]

export default function SearchScreen({ favorites, onToggleFavorite, onEventClick, onBack }: SearchScreenProps) {
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCity, setSelectedCity] = useState("All Cities")
  const [selectedPrice, setSelectedPrice] = useState("Any Price")
  const [selectedSort, setSelectedSort] = useState("Relevance")
  const [showFilters, setShowFilters] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const filtered = useMemo(() => {
    let result = [...events]
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (selectedCategory !== "all") {
      result = result.filter((e) => e.categoryId === selectedCategory)
    }
    if (selectedCity !== "All Cities") {
      result = result.filter((e) => e.city === selectedCity)
    }
    if (selectedPrice === "Free") result = result.filter((e) => e.price === 0)
    else if (selectedPrice === "Under €30") result = result.filter((e) => e.price > 0 && e.price < 30)
    else if (selectedPrice === "€30–€100") result = result.filter((e) => e.price >= 30 && e.price <= 100)
    else if (selectedPrice === "Over €100") result = result.filter((e) => e.price > 100)

    if (selectedSort === "Date: Soonest") result.sort((a, b) => a.date.localeCompare(b.date))
    else if (selectedSort === "Price: Low to High") result.sort((a, b) => a.price - b.price)
    else if (selectedSort === "Price: High to Low") result.sort((a, b) => b.price - a.price)
    else if (selectedSort === "Top Rated") result.sort((a, b) => b.rating - a.rating)

    return result
  }, [query, selectedCategory, selectedCity, selectedPrice, selectedSort])

  const hasFilters = selectedCategory !== "all" || selectedCity !== "All Cities" || selectedPrice !== "Any Price"

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Search Header */}
      <div className="px-4 pt-14 pb-3 border-b border-gray-100 bg-white z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              type="search"
              placeholder="Search events, venues, artists…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 100)}
              className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={15} className="text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              hasFilters ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === "all" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat.id ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-4 space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">City</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedCity === city ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Price</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {priceRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedPrice(range)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedPrice === range ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sort by</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedSort(opt)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedSort === opt ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {hasFilters && (
            <button
              onClick={() => { setSelectedCategory("all"); setSelectedCity("All Cities"); setSelectedPrice("Any Price") }}
              className="text-violet-600 text-xs font-semibold"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {!query && !isFocused && !hasFilters ? (
          <div className="px-4 pt-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 font-medium"
                >
                  <Search size={13} className="text-gray-400" />
                  {s}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-6 mb-3">All Events</p>
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
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
        ) : (
          <div className="px-4 pt-4">
            <p className="text-xs text-gray-500 mb-3">
              <span className="font-bold text-gray-900">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
              {query && ` for "${query}"`}
              {!query && selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            </p>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Search size={28} className="text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-1">No results found</h3>
                <p className="text-gray-500 text-sm text-center">
                  Try a different search or adjust your filters.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((event) => (
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}
