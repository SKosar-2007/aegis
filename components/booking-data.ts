import { Hotel, Plane, Ticket } from 'lucide-react'

type BookingCase = {
  id: string
  number: string
  category: string
  title: string
  subtitle: string
  item: string
  details: string
  dates: string
  price: number
  fee: number
  feeLabel: string
  icon: typeof Hotel
  pattern: string
  patternDetail: string
  initialExtraSelected: boolean
  patternToggle: { label: string; enabledByDefault: boolean }
  extra: { label: string; description: string; price: number }
  urgency?: string
}

export const bookingCases: BookingCase[] = [
  {
    id: 'hotel', number: '01', category: 'STAY / HOTEL', title: 'A weekend in the city', subtitle: 'Review a hotel checkout with a preselected protection add-on and tester-only bypass.', item: 'The Linden House', details: 'Queen room · 2 guests · Breakfast included', dates: 'Fri, May 21 – Sun, May 23, 2027', price: 428, fee: 38, feeLabel: 'Property & service fees', icon: Hotel,
    pattern: 'Preselected add-on', patternDetail: 'Trip protection starts selected and locked. Its $24 cost is included in the total; the clearly labeled tester bypass unlocks the choice and lets you remove it.', initialExtraSelected: true, patternToggle: { label: 'Show trip protection preselected in this scenario', enabledByDefault: true }, extra: { label: 'Trip protection', description: 'Cancellation coverage for this stay', price: 24 },
  },
  {
    id: 'flight', number: '02', category: 'AIR / FLIGHT', title: 'A nonstop to the coast', subtitle: 'Review an airfare checkout with optional seat selection.', item: 'Northstar Air · NS 204', details: 'Nonstop · Economy · 1 traveler', dates: 'Tue, Jun 15, 2027 · 9:20 AM – 12:05 PM', price: 286, fee: 42, feeLabel: 'Taxes & carrier fees', icon: Plane,
    pattern: 'Urgency language', patternDetail: 'A low-seat claim adds pressure. This simulated message is labeled as unverified and does not affect availability or price.', initialExtraSelected: false, patternToggle: { label: 'Show the low-seat urgency message', enabledByDefault: true }, extra: { label: 'Preferred seat', description: 'Choose a standard aisle or window seat', price: 18 }, urgency: 'Only 3 seats left at this fare',
  },
  {
    id: 'event', number: '03', category: 'LIVE / EVENT', title: 'An evening worth keeping', subtitle: 'Review an event reservation with fees shown before continuing.', item: 'After Hours · Saturday show', details: 'General admission · 2 tickets', dates: 'Sat, Aug 07, 2027 · Doors at 7:30 PM', price: 96, fee: 16, feeLabel: 'Venue & service fees', icon: Ticket,
    pattern: 'Late fee disclosure', patternDetail: 'Fees are itemized in the order summary before the next step, so the displayed total is visible before continuing.', initialExtraSelected: false, patternToggle: { label: 'Show itemized fees before continuing', enabledByDefault: true }, extra: { label: 'Ticket protection', description: 'One-time flexible cancellation cover', price: 12 },
  },
]
