import { useState } from "react"
import {
  ArrowLeft,
  ChevronRight,
  Check,
  ImagePlus,
  MapPin,
  Calendar,
  Clock,
  Users,
  Ticket,
  Globe,
  Lock,
  Sparkles,
  X,
} from "lucide-react"
import { categories } from "../data/mock"

interface CreateEventScreenProps {
  onBack: () => void
  onPublish: () => void
}

type Step = "basics" | "datetime" | "location" | "tickets" | "media" | "review"

const STEPS: { id: Step; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "datetime", label: "Date & Time" },
  { id: "location", label: "Location" },
  { id: "tickets", label: "Tickets" },
  { id: "media", label: "Media" },
  { id: "review", label: "Review" },
]

const STEP_ORDER: Step[] = ["basics", "datetime", "location", "tickets", "media", "review"]

const visibilityOptions = [
  { id: "public", icon: Globe, label: "Public", sub: "Anyone can discover and join" },
  { id: "private", icon: Lock, label: "Private", sub: "Only people with the link" },
]

const ticketTypeOptions = [
  { id: "free", label: "Free", sub: "No charge to attend" },
  { id: "paid", label: "Paid", sub: "Set your ticket price" },
  { id: "donation", label: "Donation", sub: "Attendees choose amount" },
]

const suggestedImages = [
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop&auto=format",
]

const initialForm = {
  title: "",
  description: "",
  categoryId: "",
  tags: [] as string[],
  tagInput: "",
  visibility: "public",
  date: "",
  startTime: "",
  endTime: "",
  isOnline: false,
  venue: "",
  address: "",
  city: "",
  onlineLink: "",
  ticketType: "free",
  price: "",
  capacity: "",
  ticketTiers: [{ name: "General Admission", price: "", qty: "" }],
  coverImage: suggestedImages[0],
}

export default function CreateEventScreen({ onBack, onPublish }: CreateEventScreenProps) {
  const [step, setStep] = useState<Step>("basics")
  const [form, setForm] = useState(initialForm)
  const [publishing, setPublishing] = useState(false)

  const stepIndex = STEP_ORDER.indexOf(step)
  const progress = ((stepIndex + 1) / STEP_ORDER.length) * 100

  const set = (key: keyof typeof initialForm, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }))

  const addTag = () => {
    const tag = form.tagInput.trim().toLowerCase().replace(/^#/, "")
    if (tag && !form.tags.includes(tag)) set("tags", [...form.tags, tag])
    set("tagInput", "")
  }

  const removeTag = (tag: string) => set("tags", form.tags.filter((t) => t !== tag))

  const next = () => {
    const i = STEP_ORDER.indexOf(step)
    if (i < STEP_ORDER.length - 1) setStep(STEP_ORDER[i + 1])
  }
  const prev = () => {
    const i = STEP_ORDER.indexOf(step)
    if (i > 0) setStep(STEP_ORDER[i - 1])
    else onBack()
  }

  const handlePublish = () => {
    setPublishing(true)
    setTimeout(() => {
      setPublishing(false)
      onPublish()
    }, 1600)
  }

  // ── validate each step for the Continue button ──
  const canAdvance =
    step === "basics" ? form.title.trim().length > 2 && form.categoryId !== "" :
    step === "datetime" ? form.date !== "" && form.startTime !== "" :
    step === "location" ? (form.isOnline ? true : form.venue.trim() !== "") :
    step === "tickets" ? true :
    step === "media" ? true :
    true

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-14 pb-0 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <p className="text-gray-500 text-xs font-medium">
              Step {stepIndex + 1} of {STEP_ORDER.length}
            </p>
            <h1 className="text-gray-900 font-extrabold text-base leading-tight">
              {STEPS[stepIndex].label}
            </h1>
          </div>
          <button onClick={onBack} className="text-gray-400 text-xs font-medium">
            Cancel
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden -mx-4 mb-0">
          <div
            className="h-full bg-violet-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicator pills */}
      <div className="flex gap-1.5 px-4 py-3 overflow-x-auto scrollbar-hide bg-white border-b border-gray-100">
        {STEPS.map((s, i) => {
          const done = i < stepIndex
          const active = s.id === step
          return (
            <button
              key={s.id}
              onClick={() => i <= stepIndex && setStep(s.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                active
                  ? "bg-violet-600 text-white"
                  : done
                  ? "bg-violet-100 text-violet-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {done && <Check size={11} />}
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Scrollable form body */}
      <div className="flex-1 overflow-y-auto pb-36">
        {/* ── BASICS ── */}
        {step === "basics" && (
          <div className="px-5 pt-6 space-y-5">
            <Field label="Event Title" required>
              <input
                type="text"
                placeholder="Give your event a great name…"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className={inputCls}
                maxLength={80}
              />
              <p className="text-right text-xs text-gray-400 mt-1">{form.title.length}/80</p>
            </Field>

            <Field label="Description">
              <textarea
                placeholder="What will attendees experience? Describe the highlights, schedule, what to bring…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                className={inputCls + " resize-none"}
                maxLength={1000}
              />
              <p className="text-right text-xs text-gray-400 mt-1">{form.description.length}/1000</p>
            </Field>

            <Field label="Category" required>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => set("categoryId", cat.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                      form.categoryId === cat.id
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    {cat.name}
                    {form.categoryId === cat.id && (
                      <Check size={13} className="ml-auto text-violet-600" />
                    )}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Tags">
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="ml-0.5">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag (e.g. jazz, outdoor)…"
                  value={form.tagInput}
                  onChange={(e) => set("tagInput", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                  className={inputCls + " flex-1"}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-violet-100 text-violet-700 font-semibold text-sm rounded-xl"
                >
                  Add
                </button>
              </div>
            </Field>

            <Field label="Visibility">
              <div className="space-y-2">
                {visibilityOptions.map(({ id, icon: Icon, label, sub }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => set("visibility", id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                      form.visibility === id
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Icon size={18} className={form.visibility === id ? "text-violet-600" : "text-gray-400"} />
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${form.visibility === id ? "text-violet-700" : "text-gray-700"}`}>{label}</p>
                      <p className="text-gray-400 text-xs">{sub}</p>
                    </div>
                    {form.visibility === id && (
                      <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ── DATE & TIME ── */}
        {step === "datetime" && (
          <div className="px-5 pt-6 space-y-5">
            <Field label="Date" required>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={inputCls + " pl-10"}
                />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Time" required>
                <div className="relative">
                  <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => set("startTime", e.target.value)}
                    className={inputCls + " pl-10"}
                  />
                </div>
              </Field>
              <Field label="End Time">
                <div className="relative">
                  <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => set("endTime", e.target.value)}
                    className={inputCls + " pl-10"}
                  />
                </div>
              </Field>
            </div>

            {/* Duration hint */}
            {form.startTime && form.endTime && (
              <div className="flex items-center gap-2 bg-violet-50 rounded-xl px-4 py-3">
                <Clock size={14} className="text-violet-500" />
                <span className="text-violet-700 text-sm font-semibold">
                  Duration: {getDuration(form.startTime, form.endTime)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── LOCATION ── */}
        {step === "location" && (
          <div className="px-5 pt-6 space-y-5">
            {/* Online toggle */}
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Globe size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">Online Event</p>
                  <p className="text-gray-400 text-xs">Stream via link or video call</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => set("isOnline", !form.isOnline)}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.isOnline ? "bg-violet-600" : "bg-gray-300"}`}
                role="switch"
                aria-checked={form.isOnline}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isOnline ? "-translate-x-5.5" : "translate-x-0.5"}`}
                />
              </button>
            </div>

            {form.isOnline ? (
              <Field label="Online Event Link">
                <div className="relative">
                  <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://meet.google.com/xxx-yyy-zzz"
                    value={form.onlineLink}
                    onChange={(e) => set("onlineLink", e.target.value)}
                    className={inputCls + " pl-10"}
                  />
                </div>
              </Field>
            ) : (
              <>
                <Field label="Venue Name" required>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Stade de France"
                      value={form.venue}
                      onChange={(e) => set("venue", e.target.value)}
                      className={inputCls + " pl-10"}
                    />
                  </div>
                </Field>
                <Field label="Address">
                  <input
                    type="text"
                    placeholder="Street address"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="City">
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    className={inputCls}
                  />
                </Field>

                {/* Map placeholder */}
                <div className="rounded-2xl overflow-hidden h-36 bg-gray-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop&auto=format"
                    alt="Map preview"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center shadow-lg">
                      <MapPin size={16} className="text-white" />
                    </div>
                    {form.venue && (
                      <span className="bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                        {form.venue}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TICKETS ── */}
        {step === "tickets" && (
          <div className="px-5 pt-6 space-y-5">
            <Field label="Ticket Type">
              <div className="space-y-2">
                {ticketTypeOptions.map(({ id, label, sub }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => set("ticketType", id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                      form.ticketType === id ? "border-violet-500 bg-violet-50" : "border-gray-200"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.ticketType === id ? "border-violet-600 bg-violet-600" : "border-gray-300"}`}>
                      {form.ticketType === id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${form.ticketType === id ? "text-violet-700" : "text-gray-700"}`}>{label}</p>
                      <p className="text-gray-400 text-xs">{sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Field>

            {form.ticketType === "paid" && (
              <>
                <Field label="Ticket Tiers">
                  <div className="space-y-3">
                    {form.ticketTiers.map((tier, i) => (
                      <div key={i} className="bg-gray-50 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-700 font-semibold text-sm">Tier {i + 1}</p>
                          {form.ticketTiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                set("ticketTiers", form.ticketTiers.filter((_, idx) => idx !== i))
                              }
                              className="text-red-400 text-xs font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Tier name (e.g. VIP, Early Bird)"
                          value={tier.name}
                          onChange={(e) => {
                            const updated = [...form.ticketTiers]
                            updated[i] = { ...updated[i], name: e.target.value }
                            set("ticketTiers", updated)
                          }}
                          className={inputCls}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">€</span>
                            <input
                              type="number"
                              placeholder="Price"
                              value={tier.price}
                              onChange={(e) => {
                                const updated = [...form.ticketTiers]
                                updated[i] = { ...updated[i], price: e.target.value }
                                set("ticketTiers", updated)
                              }}
                              className={inputCls + " pl-8"}
                              min="0"
                            />
                          </div>
                          <div className="relative">
                            <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="number"
                              placeholder="Qty"
                              value={tier.qty}
                              onChange={(e) => {
                                const updated = [...form.ticketTiers]
                                updated[i] = { ...updated[i], qty: e.target.value }
                                set("ticketTiers", updated)
                              }}
                              className={inputCls + " pl-10"}
                              min="1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        set("ticketTiers", [
                          ...form.ticketTiers,
                          { name: "", price: "", qty: "" },
                        ])
                      }
                      className="w-full py-3 border-2 border-dashed border-violet-300 rounded-xl text-violet-600 text-sm font-semibold"
                    >
                      + Add Another Tier
                    </button>
                  </div>
                </Field>
              </>
            )}

            {form.ticketType !== "paid" && (
              <Field label="Total Capacity">
                <div className="relative">
                  <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Max number of attendees"
                    value={form.capacity}
                    onChange={(e) => set("capacity", e.target.value)}
                    className={inputCls + " pl-10"}
                    min="1"
                  />
                </div>
              </Field>
            )}
          </div>
        )}

        {/* ── MEDIA ── */}
        {step === "media" && (
          <div className="px-5 pt-6 space-y-5">
            <Field label="Cover Image">
              {/* Current cover preview */}
              <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100 mb-3">
                {form.coverImage ? (
                  <>
                    <img
                      src={form.coverImage}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <button
                      onClick={() => set("coverImage", "")}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center"
                    >
                      <X size={14} className="text-white" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-black/40 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      Cover
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <ImagePlus size={28} className="text-gray-300" />
                    <p className="text-gray-400 text-sm">No image selected</p>
                  </div>
                )}
              </div>

              {/* Upload button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-violet-300 rounded-xl text-violet-600 font-semibold text-sm mb-5"
              >
                <ImagePlus size={17} />
                Upload from device
              </button>

              {/* Suggested images */}
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                Or pick a suggested image
              </p>
              <div className="grid grid-cols-3 gap-2">
                {suggestedImages.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => set("coverImage", src)}
                    className={`relative h-24 rounded-xl overflow-hidden transition-all ${
                      form.coverImage === src ? "ring-2 ring-violet-600 ring-offset-2" : ""
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {form.coverImage === src && (
                      <div className="absolute inset-0 bg-violet-600/30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ── REVIEW ── */}
        {step === "review" && (
          <div className="px-5 pt-6 space-y-4">
            {/* Event preview card */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="relative h-44 bg-gray-100">
                {form.coverImage && (
                  <img src={form.coverImage} alt="" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="bg-violet-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {categories.find((c) => c.id === form.categoryId)?.name ?? "Category"}
                  </span>
                  <h2 className="text-white font-extrabold text-lg leading-tight mt-1.5">
                    {form.title || "Your Event Title"}
                  </h2>
                </div>
              </div>
              <div className="p-4 space-y-2.5 bg-white">
                <ReviewRow icon={<Calendar size={14} className="text-violet-500" />} label={form.date ? formatReviewDate(form.date) : "—"} sub={form.startTime ? `${form.startTime}${form.endTime ? ` – ${form.endTime}` : ""}` : undefined} />
                <ReviewRow icon={<MapPin size={14} className="text-violet-500" />} label={form.isOnline ? "Online Event" : (form.venue || "—")} sub={!form.isOnline && form.city ? form.city : undefined} />
                <ReviewRow icon={<Ticket size={14} className="text-violet-500" />} label={
                  form.ticketType === "free" ? "Free entry" :
                  form.ticketType === "donation" ? "Pay what you want" :
                  form.ticketTiers[0]?.price ? `From €${form.ticketTiers[0].price}` : "Paid"
                } />
                <ReviewRow icon={<Globe size={14} className="text-violet-500" />} label={form.visibility === "public" ? "Public event" : "Private event"} />
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.tags.map((t) => (
                      <span key={t} className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
              <p className="text-gray-700 font-bold text-sm mb-1">Checklist</p>
              {[
                { label: "Title added", done: form.title.trim().length > 2 },
                { label: "Category selected", done: form.categoryId !== "" },
                { label: "Date & time set", done: form.date !== "" && form.startTime !== "" },
                { label: "Location configured", done: form.isOnline || form.venue.trim() !== "" },
                { label: "Cover image chosen", done: form.coverImage !== "" },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-green-500" : "bg-gray-200"}`}>
                    {done ? <Check size={11} className="text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                  </div>
                  <span className={`text-sm ${done ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
                </div>
              ))}
            </div>

            {/* Info note */}
            <div className="flex gap-2.5 bg-amber-50 rounded-xl px-4 py-3">
              <Sparkles size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs leading-relaxed">
                Your event will be reviewed and published within a few minutes. You can edit all details after publishing.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        {step !== "review" ? (
          <button
            onClick={next}
            disabled={!canAdvance}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white font-bold py-4 rounded-2xl disabled:opacity-40 active:bg-violet-800 transition-colors"
          >
            Continue
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white font-bold py-4 rounded-2xl disabled:opacity-60 active:bg-violet-800 transition-colors"
          >
            {publishing ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                Publish Event
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ── helpers ──

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
        {required && <span className="text-violet-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function ReviewRow({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-gray-900 text-sm font-semibold leading-tight">{label}</p>
        {sub && <p className="text-gray-400 text-xs">{sub}</p>}
      </div>
    </div>
  )
}

const inputCls =
  "w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-colors text-gray-900 placeholder:text-gray-400"

function getDuration(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  const mins = eh * 60 + em - (sh * 60 + sm)
  if (mins <= 0) return "—"
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ""}` : `${m}min`
}

function formatReviewDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
