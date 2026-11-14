import type { Metadata } from 'next'
import { BookingIndexPage } from '@/components/booking-pages'

export const metadata: Metadata = {
  title: 'Booking test cases',
  description: 'Explore three fictional booking checkout scenarios in the AegisDOM demo.',
}

export default function Page() {
  return <BookingIndexPage />
}
