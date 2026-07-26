import { ArrowLeft, MapPin, Calendar, Clock, Download, Share2 } from "lucide-react"
import type { Ticket } from "../types"
import { formatDate } from "../utils/format"

interface TicketScreenProps {
  ticket: Ticket
  onBack: () => void
}

export default function TicketScreen({ ticket, onBack }: TicketScreenProps) {
  const event = ticket.event

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <h1 className="text-gray-900 font-extrabold text-lg flex-1">My Ticket</h1>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Share2 size={16} className="text-gray-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Download size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Ticket */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
          {/* Event image */}
          <div className="relative h-44">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                ticket.type === "vip" ? "bg-amber-400 text-amber-900" :
                ticket.type === "premium" ? "bg-violet-500 text-white" :
                "bg-white/90 text-gray-700"
              }`}>
                {ticket.type.toUpperCase()}
              </span>
              <h2 className="text-white font-extrabold text-lg leading-tight">{event.title}</h2>
            </div>
          </div>

          {/* Event details */}
          <div className="px-5 py-5 space-y-3 border-b border-dashed border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
                <Calendar size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Date</p>
                <p className="text-gray-900 font-bold text-sm">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
                <Clock size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Time</p>
                <p className="text-gray-900 font-bold text-sm">{event.time} – {event.endTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
                <MapPin size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Venue</p>
                <p className="text-gray-900 font-bold text-sm">{event.location}</p>
                <p className="text-gray-500 text-xs">{event.address}</p>
              </div>
            </div>
            {ticket.seatInfo && (
              <div className="bg-violet-50 rounded-xl px-4 py-3">
                <p className="text-violet-600 text-xs font-semibold">Seat Information</p>
                <p className="text-violet-900 font-bold text-sm mt-0.5">{ticket.seatInfo}</p>
              </div>
            )}
          </div>

          {/* Ticket notch */}
          <div className="flex items-center -mx-4 relative">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 -ml-4" />
            <div className="flex-1 border-t-2 border-dashed border-gray-200" />
            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 -mr-4" />
          </div>

          {/* QR code section */}
          <div className="px-5 py-5 flex flex-col items-center">
            {/* Fake QR code */}
            <div className="w-44 h-44 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 p-3">
              <div className="w-full h-full relative">
                <QrCodeSVG />
              </div>
            </div>
            <p className="text-gray-900 font-mono font-bold text-sm tracking-widest">{ticket.qrCode}</p>
            <p className="text-gray-400 text-xs mt-1">Present this code at the entrance</p>

            {/* Status badge */}
            <div className={`mt-4 px-4 py-2 rounded-full text-xs font-bold ${
              ticket.status === "upcoming"
                ? "bg-green-100 text-green-700"
                : ticket.status === "past"
                ? "bg-gray-200 text-gray-500"
                : "bg-red-100 text-red-600"
            }`}>
              {ticket.status === "upcoming" ? "✓ Valid Ticket" : ticket.status === "past" ? "Ticket Used" : "Cancelled"}
            </div>
          </div>

          {/* Buyer info */}
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Booking ID</span>
              <span className="text-gray-900 font-mono font-bold">{ticket.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-gray-500">Purchase Date</span>
              <span className="text-gray-900 font-semibold">{formatDate(ticket.purchaseDate)}</span>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-gray-500">Amount Paid</span>
              <span className="text-violet-600 font-extrabold">{event.currency}{ticket.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Minimal fake QR code SVG
function QrCodeSVG() {
  const cells = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,1,0,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,0,1],
  ]
  const size = 17
  const cell = 100 / size
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {cells.map((row, y) =>
        row.map((val, x) =>
          val ? (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              fill="white"
            />
          ) : null
        )
      )}
    </svg>
  )
}
