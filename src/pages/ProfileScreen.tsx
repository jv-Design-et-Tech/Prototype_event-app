import { useState } from "react"
import {
  Settings,
  Edit3,
  Ticket,
  Heart,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  MapPin,
  CheckCircle,
  Shield,
  CreditCard,
  Users,
} from "lucide-react"
import { currentUser, tickets } from "../data/mock"
import type { Ticket as TicketType } from "../types"
import { formatDate } from "../utils/format"

interface ProfileScreenProps {
  onLogout: () => void
  onTicketClick: (ticket: TicketType) => void
  onFavoritesClick: () => void
  onNotificationsClick: () => void
}

const menuItems = [
  { icon: CreditCard, label: "Payment Methods", sublabel: "Manage cards & wallets" },
  { icon: Users, label: "Following", sublabel: "Organizers you follow" },
  { icon: Shield, label: "Privacy & Security", sublabel: "Account protection" },
  { icon: HelpCircle, label: "Help & Support", sublabel: "FAQs, contact us" },
]

export default function ProfileScreen({ onLogout, onTicketClick, onFavoritesClick, onNotificationsClick }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [_isEditing, setIsEditing] = useState(false)

  const upcomingTickets = tickets.filter((t) => t.status === "upcoming")
  const pastTickets = tickets.filter((t) => t.status === "past")
  const displayed = activeTab === "upcoming" ? upcomingTickets : pastTickets

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-5">
          <h1 className="text-gray-900 font-extrabold text-xl">Profile</h1>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Settings size={18} className="text-gray-700" />
          </button>
        </div>

        {/* Profile card */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-18 h-18 w-[72px] h-[72px] rounded-2xl object-cover border-2 border-violet-100"
            />
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center border-2 border-white"
            >
              <Edit3 size={10} className="text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-gray-900 font-extrabold text-lg leading-tight">{currentUser.name}</h2>
              <CheckCircle size={16} className="text-violet-500 flex-shrink-0" />
            </div>
            <p className="text-gray-500 text-sm">{currentUser.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-gray-400 text-xs">{currentUser.location}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Events", value: currentUser.eventsAttended },
            { label: "Followers", value: currentUser.followersCount.toLocaleString() },
            { label: "Following", value: currentUser.followingCount },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-900 font-extrabold text-lg leading-tight">{value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Tickets */}
      <div className="mt-4 bg-white border-t border-b border-gray-100">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 font-extrabold text-base">My Tickets</h2>
            <span className="text-gray-400 text-xs">{tickets.length} total</span>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            {(["upcoming", "past"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                }`}
              >
                {tab} ({tab === "upcoming" ? upcomingTickets.length : pastTickets.length})
              </button>
            ))}
          </div>

          {/* Ticket list */}
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <Ticket size={28} className="text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">No {activeTab} tickets</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayed.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => onTicketClick(ticket)}
                  className="w-full flex items-center gap-3 bg-gray-50 rounded-2xl p-3.5 text-left active:bg-gray-100 transition-colors"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={ticket.event.image} alt={ticket.event.title} className="w-full h-full object-cover" />
                    {ticket.status === "past" && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">USED</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-bold text-sm leading-tight line-clamp-1">{ticket.event.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{formatDate(ticket.event.date)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ticket.type === "vip" ? "bg-amber-100 text-amber-700" :
                        ticket.type === "premium" ? "bg-violet-100 text-violet-700" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {ticket.type.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-xs">{ticket.event.currency}{ticket.price}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 bg-white border-t border-b border-gray-100 px-5 py-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={onFavoritesClick}
            className="flex flex-col items-center gap-2 p-3 bg-red-50 rounded-2xl active:bg-red-100"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Heart size={18} className="text-red-500" />
            </div>
            <span className="text-gray-700 text-xs font-semibold">Favorites</span>
          </button>
          <button
            onClick={onNotificationsClick}
            className="flex flex-col items-center gap-2 p-3 bg-violet-50 rounded-2xl active:bg-violet-100"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Bell size={18} className="text-violet-600" />
            </div>
            <span className="text-gray-700 text-xs font-semibold">Alerts</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-yellow-50 rounded-2xl active:bg-yellow-100">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Star size={18} className="text-yellow-600" />
            </div>
            <span className="text-gray-700 text-xs font-semibold">Reviews</span>
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="mt-4 bg-white border-t border-b border-gray-100">
        {menuItems.map(({ icon: Icon, label, sublabel }, i) => (
          <button
            key={label}
            className={`w-full flex items-center gap-4 px-5 py-4 text-left active:bg-gray-50 transition-colors ${
              i < menuItems.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Icon size={17} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-semibold text-sm">{label}</p>
              <p className="text-gray-400 text-xs">{sublabel}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-4 px-5 mb-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-4 rounded-2xl active:bg-red-100 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
