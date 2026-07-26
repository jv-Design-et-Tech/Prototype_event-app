export interface User {
  id: string
  name: string
  email: string
  avatar: string
  phone?: string
  location?: string
  bio?: string
  followersCount: number
  followingCount: number
  eventsAttended: number
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  bgColor: string
  count: number
}

export interface Organizer {
  id: string
  name: string
  avatar: string
  verified: boolean
  followersCount: number
  eventsCount: number
}

export interface Event {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  images: string[]
  date: string
  time: string
  endTime: string
  location: string
  address: string
  city: string
  price: number
  originalPrice?: number
  currency: string
  category: string
  categoryId: string
  organizer: Organizer
  attendeesCount: number
  maxAttendees: number
  rating: number
  reviewsCount: number
  isFeatured: boolean
  isOnline: boolean
  tags: string[]
  lat?: number
  lng?: number
}

export interface Ticket {
  id: string
  eventId: string
  event: Event
  userId: string
  type: "standard" | "vip" | "premium"
  price: number
  purchaseDate: string
  qrCode: string
  seatInfo?: string
  status: "upcoming" | "past" | "cancelled"
}

export interface Notification {
  id: string
  type: "reminder" | "new_event" | "booking" | "promo" | "follow"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  eventId?: string
  image?: string
}

export interface Review {
  id: string
  userId: string
  user: User
  eventId: string
  rating: number
  comment: string
  date: string
  likes: number
}
