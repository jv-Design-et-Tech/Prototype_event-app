import { useState, useCallback } from "react"
import BottomNav from "./components/BottomNav"
import SplashScreen from "./pages/SplashScreen"
import OnboardingScreen from "./pages/OnboardingScreen"
import AuthScreen from "./pages/AuthScreen"
import HomeScreen from "./pages/HomeScreen"
import SearchScreen from "./pages/SearchScreen"
import FavoritesScreen from "./pages/FavoritesScreen"
import NotificationsScreen from "./pages/NotificationsScreen"
import ProfileScreen from "./pages/ProfileScreen"
import EventDetailScreen from "./pages/EventDetailScreen"
import BookingScreen from "./pages/BookingScreen"
import TicketScreen from "./pages/TicketScreen"
import CreateEventScreen from "./pages/CreateEventScreen"
import { favoriteEventIds, events, notifications } from "./data/mock"
import type { Event, Ticket } from "./types"

type AppState =
  | "splash"
  | "onboarding"
  | "auth"
  | "home"
  | "search"
  | "favorites"
  | "notifications"
  | "profile"
  | "event_detail"
  | "booking"
  | "ticket"
  | "create_event"

type NavScreen = "home" | "search" | "favorites" | "notifications" | "profile"

export default function App() {
  const [appState, setAppState] = useState<AppState>("splash")
  const [activeNav, setActiveNav] = useState<NavScreen>("home")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [favs, setFavs] = useState<string[]>(favoriteEventIds)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [prevState, setPrevState] = useState<AppState>("home")

  const unreadNotifs = notifications.filter((n) => !n.isRead).length

  const goTo = useCallback((state: AppState, save = true) => {
    if (save && ["home", "search", "favorites", "notifications", "profile"].includes(appState)) {
      setPrevState(appState)
    }
    setAppState(state)
  }, [appState])

  const toggleFavorite = useCallback((id: string) => {
    setFavs((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])
  }, [])

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event)
    goTo("event_detail")
  }, [goTo])

  const handleNavChange = useCallback((screen: NavScreen) => {
    setActiveNav(screen)
    goTo(screen, false)
  }, [goTo])

  const handleBack = useCallback(() => {
    if (appState === "event_detail" || appState === "booking") {
      goTo(prevState, false)
    } else if (appState === "ticket") {
      goTo("profile", false)
    } else if (appState === "search" || appState === "notifications") {
      goTo(prevState || "home", false)
    } else {
      goTo("home", false)
    }
  }, [appState, prevState, goTo])

  const showBottomNav = ["home", "search", "favorites", "notifications", "profile"].includes(appState)
  const showFab = appState === "home"

  return (
    <div
      className="relative w-full h-full bg-gray-50 overflow-hidden"
      style={{ maxWidth: 430, margin: "0 auto" }}
    >
      {/* Screens */}
      {appState === "splash" && (
        <SplashScreen onDone={() => goTo("onboarding", false)} />
      )}

      {appState === "onboarding" && (
        <OnboardingScreen onDone={() => goTo("auth", false)} />
      )}

      {appState === "auth" && (
        <AuthScreen
          onLogin={() => {
            setIsLoggedIn(true)
            setActiveNav("home")
            goTo("home", false)
          }}
          onBack={() => goTo("onboarding", false)}
        />
      )}

      {appState === "home" && (
        <HomeScreen
          favorites={favs}
          onToggleFavorite={toggleFavorite}
          onEventClick={handleEventClick}
          onSearchClick={() => { setPrevState("home"); goTo("search") }}
          onNotificationsClick={() => { setPrevState("home"); goTo("notifications") }}
          onCategoryClick={() => {}}
        />
      )}

      {appState === "search" && (
        <SearchScreen
          favorites={favs}
          onToggleFavorite={toggleFavorite}
          onEventClick={handleEventClick}
          onBack={handleBack}
        />
      )}

      {appState === "favorites" && (
        <FavoritesScreen
          favorites={favs}
          onToggleFavorite={toggleFavorite}
          onEventClick={handleEventClick}
        />
      )}

      {appState === "notifications" && (
        <NotificationsScreen
          onBack={handleBack}
          onEventClick={(eventId) => {
            const ev = events.find((e) => e.id === eventId)
            if (ev) handleEventClick(ev)
          }}
        />
      )}

      {appState === "profile" && (
        <ProfileScreen
          onLogout={() => {
            setActiveNav("home")
            goTo("auth", false)
          }}
          onTicketClick={(ticket) => {
            setSelectedTicket(ticket)
            setPrevState("profile")
            goTo("ticket")
          }}
          onFavoritesClick={() => {
            setActiveNav("favorites")
            goTo("favorites", false)
          }}
          onNotificationsClick={() => {
            setPrevState("profile")
            goTo("notifications")
          }}
        />
      )}

      {appState === "event_detail" && selectedEvent && (
        <EventDetailScreen
          event={selectedEvent}
          isFavorite={favs.includes(selectedEvent.id)}
          isLoggedIn={isLoggedIn}
          onToggleFavorite={toggleFavorite}
          onBack={handleBack}
          onBook={(_event) => {
            setPrevState("event_detail")
            goTo("booking")
          }}
          onSignIn={() => goTo("auth", false)}
        />
      )}

      {appState === "booking" && selectedEvent && (
        <BookingScreen
          event={selectedEvent}
          onBack={handleBack}
          onConfirm={() => {
            setActiveNav("profile")
            goTo("profile", false)
          }}
        />
      )}

      {appState === "ticket" && selectedTicket && (
        <TicketScreen
          ticket={selectedTicket}
          onBack={handleBack}
        />
      )}

      {appState === "create_event" && (
        <CreateEventScreen
          onBack={() => goTo(prevState || "home", false)}
          onPublish={() => {
            setActiveNav("home")
            goTo("home", false)
          }}
        />
      )}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <BottomNav
          active={activeNav}
          onNavigate={handleNavChange}
          unreadCount={unreadNotifs}
        />
      )}

      {/* FAB – Create Event */}
      {showFab && (
        <button
          onClick={() => { setPrevState("home"); goTo("create_event") }}
          aria-label="Create event"
          className="absolute bottom-24 right-4 w-14 h-14 rounded-full bg-violet-600 shadow-lg shadow-violet-400/40 flex items-center justify-center active:scale-95 transition-transform z-40"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-white" strokeWidth={2.5} strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      )}
    </div>
  )
}
