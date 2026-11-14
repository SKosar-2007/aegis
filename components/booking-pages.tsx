'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, CircleHelp, Clock3, ShieldCheck, TriangleAlert } from 'lucide-react'
import { bookingCases } from './booking-data'
import { SiteFooter, SiteHeader } from './landing-page'
import { cn } from '@/lib/utils'
import styles from './booking-pages.module.css'

export function BookingIndexPage() {
  return (
    <div className="site">
      <SiteHeader />
      <main className="booking-page wrap">
        <Link href="/sandbox" className="booking-back"><ArrowLeft size={14} /> Back to sandbox</Link>
        <div className="booking-kicker"><span className="eyebrow-dot" /> AEGISDOM / BOOKING TEST CASES</div>
        <h1 className="booking-index-title">Three checkouts.<br /><em>Three things to notice.</em></h1>
        <p className="booking-index-copy">Explore fictional booking scenarios with adjustable interface patterns. Your choices are saved as anonymous test records; no real inventory or payment is connected.</p>
        <div className="booking-case-grid">
          {bookingCases.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.id} href={`/booking/${item.id}`} className="booking-case-card">
                <div className="booking-card-top"><span>TEST CASE {item.number}</span><Icon size={18} /></div>
                <div className="booking-card-category">{item.category}</div>
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
                <div className="booking-card-pattern"><TriangleAlert size={14} /><span><small>Pattern in focus</small><b>{item.pattern}</b></span><ArrowRight size={15} /></div>
                <span className="booking-card-link">Open booking page <ArrowRight size={14} /></span>
              </Link>
            )
          })}
        </div>
        <div className="booking-disclaimer"><ShieldCheck size={16} /><span><b>Safe to explore</b> — all names, dates, and prices are fictional. Test selections are stored without personal details; no booking or payment is possible.</span></div>
      </main>
      <SiteFooter />
    </div>
  )
}

export function BookingCasePage({ caseId }: { caseId: string }) {
  const booking = bookingCases.find((item) => item.id === caseId) ?? bookingCases[0]
  const [extraSelected, setExtraSelected] = useState(booking.initialExtraSelected)
  const [patternEnabled, setPatternEnabled] = useState(booking.patternToggle.enabledByDefault)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [showPattern, setShowPattern] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [confirmationReference, setConfirmationReference] = useState('')
  const Icon = booking.icon
  const total = booking.price + booking.fee + (extraSelected ? booking.extra.price : 0)
  const steps = ['Review trip', 'Guest details', 'Confirmation'] as const

  function updatePatternToggle(enabled: boolean) {
    setPatternEnabled(enabled)
    if (booking.id === 'hotel' && enabled) setExtraSelected(true)
  }

  async function saveDemoBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/booking-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: booking.id, patternEnabled, extraSelected }),
      })
      const result = await response.json() as { reference?: string }

      if (!response.ok || !result.reference) throw new Error('Unable to save this demo right now.')
      setConfirmationReference(result.reference)
      setStep(3)
    } catch {
      setSubmitError('We couldn’t save this demo just now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetDemo() {
    setExtraSelected(booking.initialExtraSelected)
    setPatternEnabled(booking.patternToggle.enabledByDefault)
    setConfirmationReference('')
    setSubmitError('')
    setShowPattern(false)
    setStep(1)
  }

  return (
    <div className="site">
      <SiteHeader />
      <main className="booking-page wrap">
        <Link href="/booking" className="booking-back"><ArrowLeft size={14} /> All booking test cases</Link>
        <div className="booking-case-heading">
          <div>
            <div className="booking-kicker"><span className="eyebrow-dot" /> TEST CASE {booking.number} / {booking.category}</div>
            <h1>{booking.title}</h1>
            <p>{booking.subtitle}</p>
          </div>
          <span className="booking-demo-pill"><span className="live-dot" /> SIMULATION ONLY</span>
        </div>
        <div className={`booking-stepper ${styles.stepper}`} aria-label="Booking progress">
          {steps.map((label, index) => {
            const number = index + 1
            return (
              <span key={label} className={cn(step === number && 'active', step > number && styles.completedStep)} aria-current={step === number ? 'step' : undefined}>
                <b>{step > number ? <Check size={12} /> : number}</b> {label}
              </span>
            )
          }).flatMap((item, index) => index < steps.length - 1 ? [item, <i key={`divider-${index}`} />] : [item])}
        </div>

        <div className="booking-columns">
          <section className="booking-main" aria-label={`Booking step ${step}: ${steps[step - 1]}`}>
            {step !== 3 && (
              <div className="booking-card booking-reservation">
                <div className="booking-card-eyebrow">YOUR RESERVATION <span>DETAILS</span></div>
                <div className="booking-reservation-content">
                  <div className="booking-item-icon"><Icon size={21} /></div>
                  <div className="booking-item-copy">
                    <h2>{booking.item}</h2>
                    <p>{booking.details}</p>
                    <div className="booking-date"><Clock3 size={13} /> {booking.dates}</div>
                  </div>
                </div>
                {patternEnabled && (
                  <div className="booking-urgency">
                    <TriangleAlert size={15} />
                    <span>
                      <b>{booking.urgency ?? (booking.id === 'hotel' ? 'Trip protection is preselected' : 'Fees are itemized before you continue')}</b>
                      <small>{booking.urgency ? 'Example claim only · inventory is not connected' : 'Demo pattern preview · your choices and total stay in your control'}</small>
                    </span>
                    <span className="booking-pattern-tag">{booking.urgency ? 'URGENCY' : booking.id === 'hotel' ? 'PRESELECTED' : 'FEES'}</span>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="booking-card booking-option-card">
                <div className="booking-card-eyebrow">OPTIONAL EXTRAS <span>YOU CAN CHANGE THIS</span></div>
                <label className="booking-extra">
                  <input type="checkbox" checked={extraSelected} onChange={(event) => setExtraSelected(event.target.checked)} />
                  <span className="booking-checkbox" aria-hidden="true">{extraSelected && <Check size={12} />}</span>
                  <span className="booking-extra-copy"><b>{booking.extra.label}</b><small>{booking.extra.description}</small></span>
                  <strong>+${booking.extra.price.toFixed(2)}</strong>
                </label>
                <p className="booking-control-note">{extraSelected ? 'Selected — uncheck to remove it from the total.' : 'Not selected — continue without this extra.'}</p>
                <label className={styles.patternToggle}>
                  <input
                    className={styles.switchInput}
                    type="checkbox"
                    role="switch"
                    checked={patternEnabled}
                    onChange={(event) => updatePatternToggle(event.target.checked)}
                    aria-describedby="pattern-toggle-description"
                  />
                  <span className={styles.switchTrack} aria-hidden="true"><span className={styles.switchKnob} /></span>
                  <span className={styles.switchCopy}>
                    <b>Test scenario</b>
                    <small id="pattern-toggle-description">{booking.patternToggle.label}</small>
                  </span>
                  <span className={styles.switchState}>{patternEnabled ? 'On' : 'Off'}</span>
                </label>
                {booking.id === 'event' && !patternEnabled && (
                  <p className={styles.feeDisclosure}>Fees are still included in the total; this view groups them with admission.</p>
                )}
              </div>
            )}

            {step === 2 && (
              <form id="booking-guest-form" className="booking-card booking-guest-card" onSubmit={saveDemoBooking}>
                <div className="booking-card-eyebrow">PRIMARY GUEST <span>DEMO FORM</span></div>
                <div className="booking-fields">
                  <label>First name<input type="text" name="firstName" placeholder="Alex" autoComplete="given-name" maxLength={80} required /></label>
                  <label>Last name<input type="text" name="lastName" placeholder="Morgan" autoComplete="family-name" maxLength={80} required /></label>
                  <label className="booking-email">Email address<input type="email" name="email" placeholder="alex@example.com" autoComplete="email" maxLength={254} required /></label>
                </div>
                <p className={styles.privacyNote}><ShieldCheck size={14} /> These fictional details stay in this form. Only your test case, toggle choices, and calculated total are saved.</p>
                {submitError && <p className={styles.errorMessage} role="alert">{submitError}</p>}
                <button type="button" className={styles.backButton} onClick={() => setStep(1)}><ArrowLeft size={14} /> Back to review</button>
              </form>
            )}

            {step === 3 && (
              <div className={`booking-card ${styles.confirmation}`} role="status" aria-live="polite">
                <div className={styles.confirmationIcon}><Check size={19} /></div>
                <div className="booking-kicker">DEMO SUBMISSION SAVED</div>
                <h2>That&apos;s a wrap.</h2>
                <p>Your fictional booking choices were saved for this test case. No supplier was contacted and no payment was taken.</p>
                <div className={styles.referenceRow}><span>TEST REFERENCE</span><b>{confirmationReference}</b></div>
                <p className={styles.privacyNote}><ShieldCheck size={14} /> Guest details were not saved.</p>
              </div>
            )}
          </section>

          <aside className="booking-sidebar">
            <div className="booking-card booking-summary">
              <div className="booking-card-eyebrow">PRICE SUMMARY <span>USD</span></div>
              {booking.id === 'event' && !patternEnabled ? (
                <>
                  <div className="booking-line"><span>Admission + fees</span><b>${(booking.price + booking.fee).toFixed(2)}</b></div>
                  <p className={styles.feeDisclosure}>Includes {booking.feeLabel.toLowerCase()}: ${booking.fee.toFixed(2)}</p>
                </>
              ) : (
                <>
                  <div className="booking-line"><span>{booking.item}</span><b>${booking.price.toFixed(2)}</b></div>
                  <div className="booking-line"><span>{booking.feeLabel} <CircleHelp size={12} /></span><b>${booking.fee.toFixed(2)}</b></div>
                </>
              )}
              {extraSelected && <div className="booking-line"><span>{booking.extra.label}</span><b>${booking.extra.price.toFixed(2)}</b></div>}
              <div className="booking-total"><span>Total for this booking</span><b>${total.toFixed(2)}</b></div>
              {step === 1 && (
                <button className="booking-continue" type="button" onClick={() => setStep(2)}>
                  Continue to guest details <ArrowRight size={15} />
                </button>
              )}
              {step === 2 && (
                <button className="booking-continue" type="submit" form="booking-guest-form" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving choices…' : 'Save demo booking'} {isSubmitting ? <span className={styles.spinner} aria-hidden="true" /> : <ArrowRight size={15} />}
                </button>
              )}
              {step === 3 && (
                <button className="booking-continue" type="button" onClick={resetDemo}>
                  Run this test again <ArrowRight size={15} />
                </button>
              )}
              <p className="booking-secure-note"><ShieldCheck size={13} /> No payment will be collected</p>
            </div>
            <div className="booking-insight">
              <button onClick={() => setShowPattern(!showPattern)} aria-expanded={showPattern}>
                <span className="booking-insight-icon"><TriangleAlert size={15} /></span>
                <span><small>AEGISDOM PATTERN NOTE</small><b>{booking.pattern}</b></span>
                <ArrowRight size={14} className={showPattern ? 'booking-insight-arrow expanded' : 'booking-insight-arrow'} />
              </button>
              {showPattern && <p>{booking.patternDetail}</p>}
            </div>
            <div className="booking-fineprint">Fictional test only. Names and email are never sent to the backend.</div>
          </aside>
        </div>

        <div className="booking-case-switcher">
          <span>MORE TEST CASES</span>
          {bookingCases.filter((item) => item.id !== booking.id).map((item) => <Link key={item.id} href={`/booking/${item.id}`}>{item.category} <ArrowRight size={13} /></Link>)}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
