import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const bookingDemoSubmissions = pgTable('booking_demo_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  caseId: text('case_id').notNull(),
  patternEnabled: boolean('pattern_enabled').notNull().default(true),
  extraSelected: boolean('extra_selected').notNull(),
  totalCents: integer('total_cents').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
