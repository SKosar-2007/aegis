import { NextResponse } from 'next/server'
import { bookingCases } from '@/components/booking-data'
import { getDb } from '@/lib/db'
import { bookingDemoSubmissions } from '@/lib/db/schema'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin || new URL(origin).origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Requests must come from this site.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } })
  }

  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return NextResponse.json({ error: 'Expected a JSON request.' }, { status: 415, headers: { 'Cache-Control': 'no-store' } })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'Invalid booking selection.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }

  const data = payload as Record<string, unknown>
  if (typeof data.caseId !== 'string' || typeof data.extraSelected !== 'boolean' || typeof data.patternEnabled !== 'boolean' || (data.promoSelected !== undefined && typeof data.promoSelected !== 'boolean')) {
    return NextResponse.json({ error: 'Invalid booking selection.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }

  const booking = bookingCases.find((item) => item.id === data.caseId)
  if (!booking) {
    return NextResponse.json({ error: 'Unknown demo case.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }

  const promoSelected = data.promoSelected === true
  const totalCents = Math.round((booking.price + booking.fee + (data.extraSelected ? booking.extra.price : 0) - (promoSelected ? 10 : 0)) * 100)

  try {
    const db = getDb()
    const [submission] = await db
      .insert(bookingDemoSubmissions)
      .values({
        caseId: booking.id,
        patternEnabled: data.patternEnabled,
        extraSelected: data.extraSelected,
        totalCents,
      })
      .returning({ id: bookingDemoSubmissions.id })

    return NextResponse.json(
      { reference: submission.id.slice(0, 8).toUpperCase() },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json({ error: 'Unable to save this demo.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}
