import { useState } from "react"
import { ArrowLeft, Bell, BellOff, Calendar, Tag, UserPlus, Ticket } from "lucide-react"
import { notifications as allNotifications } from "../data/mock"
import type { Notification } from "../types"
import { formatRelativeTime } from "../utils/format"

interface NotificationsScreenProps {
  onBack: () => void
  onEventClick?: (eventId: string) => void
}

const typeConfig = {
  reminder: { icon: Bell, color: "text-violet-600", bg: "bg-violet-100" },
  new_event: { icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
  booking: { icon: Ticket, color: "text-green-600", bg: "bg-green-100" },
  promo: { icon: Tag, color: "text-orange-600", bg: "bg-orange-100" },
  follow: { icon: UserPlus, color: "text-pink-600", bg: "bg-pink-100" },
}

export default function NotificationsScreen({ onBack, onEventClick }: NotificationsScreenProps) {
  const [notifs, setNotifs] = useState<Notification[]>(allNotifications)
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all")

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n))

  const displayed = activeFilter === "unread" ? notifs.filter((n) => !n.isRead) : notifs
  const unreadCount = notifs.filter((n) => !n.isRead).length

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowLeft size={18} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-gray-900 font-extrabold text-lg">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-violet-600 text-xs font-semibold">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-violet-600 text-xs font-semibold">
              Mark all read
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                activeFilter === f ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {f === "all" ? "All" : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto pb-24">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <BellOff size={28} className="text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-bold text-base mb-1">All caught up!</h3>
            <p className="text-gray-500 text-sm text-center">No {activeFilter === "unread" ? "unread " : ""}notifications right now.</p>
          </div>
        ) : (
          <div className="pt-2">
            {displayed.map((notif) => {
              const cfg = typeConfig[notif.type]
              const Icon = cfg.icon
              return (
                <button
                  key={notif.id}
                  onClick={() => {
                    markRead(notif.id)
                    if (notif.eventId && onEventClick) onEventClick(notif.eventId)
                  }}
                  className={`w-full flex items-start gap-3 px-4 py-4 border-b border-gray-100 text-left transition-colors active:bg-gray-100 ${
                    !notif.isRead ? "bg-violet-50/50" : "bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {notif.image ? (
                      <img src={notif.image} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Icon size={18} className={cfg.color} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-tight ${!notif.isRead ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                        {notif.title}
                      </p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {!notif.isRead && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                        <span className="text-gray-400 text-xs">{formatRelativeTime(notif.timestamp)}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{notif.message}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
