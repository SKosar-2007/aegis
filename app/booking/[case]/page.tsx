import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookingCasePage } from '@/components/booking-pages'
import { bookingCases } from '@/components/booking-data'

type PageProps = { params: Promise<{ case: string }> }

export function generateStaticParams() {
  return bookingCases.map(({ id }) => ({ case: id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { case: caseId } = await params
  const booking = bookingCases.find(({ id }) => id === caseId)
  return { title: booking ? `${booking.category} booking test case` : 'Booking test case' }
}

export default async function Page({ params }: PageProps) {
  const { case: caseId } = await params
  if (!bookingCases.some(({ id }) => id === caseId)) notFound()
  return <BookingCasePage caseId={caseId} key={caseId} />
}
