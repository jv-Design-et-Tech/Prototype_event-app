import { useState } from "react"
import { ArrowLeft, Check, CreditCard, Smartphone, Building2 } from "lucide-react"
import type { Event } from "../types"
import { formatDate } from "../utils/format"

interface BookingScreenProps {
  event: Event
  onBack: () => void
  onConfirm: (event: Event) => void
}

type TicketType = "standard" | "vip" | "premium"
type PaymentMethod = "card" | "apple_pay" | "bank"

const ticketTypes: { id: TicketType; label: string; description: string; multiplier: number }[] = [
  { id: "standard", label: "Standard", description: "General admission", multiplier: 1 },
  { id: "vip", label: "VIP", description: "Priority access + drinks", multiplier: 2.2 },
  { id: "premium", label: "Premium", description: "VIP + backstage access", multiplier: 3.5 },
]

const paymentMethods: { id: PaymentMethod; icon: React.ReactNode; label: string }[] = [
  { id: "card", icon: <CreditCard size={18} />, label: "Credit / Debit Card" },
  { id: "apple_pay", icon: <Smartphone size={18} />, label: "Apple Pay" },
  { id: "bank", icon: <Building2 size={18} />, label: "Bank Transfer" },
]

export default function BookingScreen({ event, onBack, onConfirm }: BookingScreenProps) {
  const [step, setStep] = useState<"select" | "payment" | "confirm">("select")
  const [ticketType, setTicketType] = useState<TicketType>("standard")
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [loading, setLoading] = useState(false)
  const [cardForm, setCardForm] = useState({ name: "Sophie Martin", number: "", expiry: "", cvv: "" })

  const selectedType = ticketTypes.find((t) => t.id === ticketType)!
  const basePrice = event.price === 0 ? 0 : event.price
  const unitPrice = Math.round(basePrice * selectedType.multiplier)
  const subtotal = unitPrice * quantity
  const serviceFee = event.price === 0 ? 0 : Math.round(subtotal * 0.08)
  const total = subtotal + serviceFee

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("confirm")
    }, 1800)
  }

  if (step === "confirm") {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Check size={36} className="text-green-600 stroke-[2.5]" />
        </div>
        <h1 className="text-gray-900 text-2xl font-extrabold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Your {quantity} × {selectedType.label} ticket{quantity > 1 ? "s" : ""} for
        </p>
        <p className="text-gray-900 font-bold text-base mb-6">"{event.title}"</p>
        <div className="w-full bg-violet-50 rounded-2xl p-4 mb-8 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="text-gray-900 font-semibold">{formatDate(event.date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Venue</span>
            <span className="text-gray-900 font-semibold">{event.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total paid</span>
            <span className="text-violet-600 font-extrabold">{event.currency}{total}</span>
          </div>
        </div>
        <button
          onClick={() => onConfirm(event)}
          className="w-full bg-violet-600 text-white font-bold py-4 rounded-2xl mb-3 active:bg-violet-800 transition-colors"
        >
          View My Ticket
        </button>
        <button onClick={onBack} className="text-gray-500 text-sm font-medium">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div className="flex-1">
          <p className="text-gray-900 font-bold text-base leading-tight">{event.title}</p>
          <p className="text-gray-400 text-xs">{formatDate(event.date)} · {event.location}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center px-5 py-4 gap-2">
        {["select", "payment"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step === s || (i === 0 && step === "payment") ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {i === 0 && step === "payment" ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-xs font-semibold ${step === s ? "text-gray-900" : "text-gray-400"}`}>
              {s === "select" ? "Choose Ticket" : "Payment"}
            </span>
            {i < 1 && <div className="flex-1 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-36">
        {step === "select" && (
          <div className="space-y-4 pt-2">
            {/* Ticket types */}
            <div>
              <h2 className="text-gray-900 font-bold text-sm mb-3">Select Ticket Type</h2>
              <div className="space-y-3">
                {ticketTypes.map((type) => {
                  const price = event.price === 0 ? 0 : Math.round(basePrice * type.multiplier)
                  return (
                    <button
                      key={type.id}
                      onClick={() => setTicketType(type.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                        ticketType === type.id
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          ticketType === type.id ? "border-violet-600 bg-violet-600" : "border-gray-300"
                        }`}>
                          {ticketType === type.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="text-gray-900 font-bold text-sm">{type.label}</p>
                          <p className="text-gray-500 text-xs">{type.description}</p>
                        </div>
                      </div>
                      <span className="text-violet-600 font-extrabold text-sm">
                        {price === 0 ? "Free" : `${event.currency}${price}`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h2 className="text-gray-900 font-bold text-sm mb-3">Quantity</h2>
              <div className="flex items-center gap-5 bg-gray-50 rounded-2xl p-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg shadow-sm active:bg-gray-100"
                >
                  −
                </button>
                <span className="text-gray-900 font-extrabold text-xl flex-1 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-sm active:bg-violet-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{quantity} × {selectedType.label}</span>
                <span className="text-gray-900 font-semibold">{event.currency}{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service fee</span>
                <span className="text-gray-900 font-semibold">{event.currency}{serviceFee}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                <span className="text-gray-900 font-bold">Total</span>
                <span className="text-violet-600 font-extrabold">{event.currency}{total}</span>
              </div>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-5 pt-2">
            <div>
              <h2 className="text-gray-900 font-bold text-sm mb-3">Payment Method</h2>
              <div className="space-y-2">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === pm.id ? "border-violet-500 bg-violet-50" : "border-gray-200"
                    }`}
                  >
                    <div className={`${paymentMethod === pm.id ? "text-violet-600" : "text-gray-400"}`}>
                      {pm.icon}
                    </div>
                    <span className={`text-sm font-semibold ${paymentMethod === pm.id ? "text-violet-700" : "text-gray-700"}`}>
                      {pm.label}
                    </span>
                    {paymentMethod === pm.id && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <h2 className="text-gray-900 font-bold text-sm">Card Details</h2>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardForm.name}
                    onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                      maxLength={7}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                      maxLength={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-violet-50 rounded-2xl p-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Order total</span>
                <span className="text-violet-600 font-extrabold text-base">{event.currency}{total}</span>
              </div>
              <p className="text-gray-400 text-xs">
                {quantity} × {selectedType.label} ticket{quantity > 1 ? "s" : ""} for {event.title}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8 space-y-2">
        {step === "select" ? (
          <button
            onClick={() => setStep("payment")}
            className="w-full bg-violet-600 text-white font-bold py-4 rounded-2xl active:bg-violet-800 transition-colors"
          >
            Continue to Payment
          </button>
        ) : (
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white font-bold py-4 rounded-2xl disabled:opacity-60 active:bg-violet-800 transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              `Pay ${event.currency}${total}`
            )}
          </button>
        )}
      </div>
    </div>
  )
}
