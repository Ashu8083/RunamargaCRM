// admin-react/src/pages/Analytics/CallAnalytics/Trends/components/AdNumberCallTrend.jsx

import { useMemo, useState } from 'react'

import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import PhoneArrowDownLeftIcon from '@heroicons/react/24/outline/PhoneArrowDownLeftIcon'
import PhoneArrowUpRightIcon from '@heroicons/react/24/outline/PhoneArrowUpRightIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'

// =============================================================
// CONSTANTS
// =============================================================

const GRAPH_HEIGHT = 320
const DAY_WIDTH = 120
const MIN_GRAPH_WIDTH = 720

const METRICS = [
  { key: 'received', label: 'Received', color: '#3B82F6', icon: PhoneArrowDownLeftIcon },
  { key: 'called', label: 'Called', color: '#8B5CF6', icon: PhoneArrowUpRightIcon },
  { key: 'missed', label: 'Missed', color: '#EF4444', icon: PhoneXMarkIcon },
  { key: 'unique', label: 'Unique', color: '#8BCF00', icon: UserGroupIcon },
]

const AD_COLORS = [
  '#8BCF00', '#3B82F6', '#8B5CF6', '#F59E0B',
  '#06B6D4', '#EC4899', '#10B981', '#EF4444',
]

// =============================================================
// HELPERS
// =============================================================

const getToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const parseLocalDate = (value) => {
  if (!value) return null
  const [year, month, day] = String(value).split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

const formatDate = (value) => {
  const date = parseLocalDate(value)
  return date ? date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'
}

const getCallDate = (call) =>
  call?.date || call?.createdAt?.slice(0, 10) || call?.created_at?.slice(0, 10) || ''

const getPhone = (call) =>
  String(call?.phone || call?.phoneNumber || call?.phone_number || call?.number || '').trim()

const getAdNumber = (call) =>
  String(call?.adNumber || call?.ad_number || call?.adNo || call?.ad_no || 'Unknown')

const getType = (call) => String(call?.type || call?.direction || '').trim().toLowerCase()
const getStatus = (call) => String(call?.status || '').trim().toLowerCase()

const getAdColor = (index) => AD_COLORS[index % AD_COLORS.length]

// =============================================================
// COMPONENT
// =============================================================

function AdNumberCallTrend({ calls = [] }) {
  const today = useMemo(() => getToday(), [])
  const [fromDate, setFromDate] = useState(today)
  const [toDate, setToDate] = useState(today)

  // -----------------------------------------------------------
  // FILTERED CALLS
  // -----------------------------------------------------------
  const filteredCalls = useMemo(() => {
    if (!Array.isArray(calls)) return []
    return calls.filter((call) => {
      const date = getCallDate(call)
      if (!date) return false
      if (fromDate && date < fromDate) return false
      if (toDate && date > toDate) return false
      return true
    })
  }, [calls, fromDate, toDate])

  // -----------------------------------------------------------
  // AD NUMBERS
  // -----------------------------------------------------------
  const adNumbers = useMemo(
    () => Array.from(new Set(filteredCalls.map(getAdNumber))).sort((a, b) => a.localeCompare(b)),
    [filteredCalls]
  )

  // -----------------------------------------------------------
  // DATES
  // -----------------------------------------------------------
  const dates = useMemo(() => {
    if (!fromDate || !toDate || fromDate > toDate) return []
    const start = parseLocalDate(fromDate)
    const end = parseLocalDate(toDate)
    if (!start || !end) return []

    const result = []
    const current = new Date(start)
    while (current <= end) {
      const y = current.getFullYear()
      const m = String(current.getMonth() + 1).padStart(2, '0')
      const d = String(current.getDate()).padStart(2, '0')
      result.push(`${y}-${m}-${d}`)
      current.setDate(current.getDate() + 1)
    }
    return result
  }, [fromDate, toDate])

  // -----------------------------------------------------------
  // GRAPH DATA
  // -----------------------------------------------------------
  const graphData = useMemo(() => {
    return dates.map((date) => {
      const row = { date, total: 0 }
      adNumbers.forEach((ad) => {
        row[ad] = { received: 0, called: 0, missed: 0, unique: 0 }
      })

      const dayCalls = filteredCalls.filter((call) => getCallDate(call) === date)
      const uniqueByAd = {}

      dayCalls.forEach((call) => {
        const ad = getAdNumber(call)
        const type = getType(call)
        const status = getStatus(call)

        if (!row[ad]) {
          row[ad] = { received: 0, called: 0, missed: 0, unique: 0 }
        }

        if (type === 'incoming' || type === 'received') row[ad].received += 1
        if (type === 'outgoing' || type === 'called') row[ad].called += 1
        if (status === 'missed' || type === 'missed') row[ad].missed += 1

        const phone = getPhone(call)
        if (phone) {
          if (!uniqueByAd[ad]) uniqueByAd[ad] = new Set()
          uniqueByAd[ad].add(phone)
        }
      })

      Object.entries(uniqueByAd).forEach(([ad, numbers]) => {
        row[ad].unique = numbers.size
      })

      row.total = dayCalls.length
      return row
    })
  }, [dates, adNumbers, filteredCalls])

  // -----------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------
  const summary = useMemo(() => {
    const uniqueNumbers = new Set()
    let received = 0
    let called = 0
    let missed = 0

    filteredCalls.forEach((call) => {
      const type = getType(call)
      const status = getStatus(call)

      if (type === 'incoming' || type === 'received') received += 1
      if (type === 'outgoing' || type === 'called') called += 1
      if (status === 'missed' || type === 'missed') missed += 1

      const phone = getPhone(call)
      if (phone) uniqueNumbers.add(phone)
    })

    return {
      total: filteredCalls.length,
      received,
      called,
      missed,
      unique: uniqueNumbers.size,
    }
  }, [filteredCalls])

  // -----------------------------------------------------------
  // MAX VALUE & SCALE
  // -----------------------------------------------------------
  const maxValue = useMemo(() => {
    let max = 0
    graphData.forEach((row) => {
      adNumbers.forEach((ad) => {
        const data = row[ad]
        if (!data) return
        METRICS.forEach((metric) => {
          max = Math.max(max, data[metric.key] || 0)
        })
      })
    })
    return Math.max(max, 1)
  }, [graphData, adNumbers])

  const yStep = Math.max(Math.ceil(maxValue / 5), 1)
  const yMax = yStep * 5
  const graphWidth = Math.max(dates.length * DAY_WIDTH, MIN_GRAPH_WIDTH)

  // -----------------------------------------------------------
  // RESET
  // -----------------------------------------------------------
  const handleReset = () => {
    setFromDate(today)
    setToDate(today)
  }

  // -----------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-base-300 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8BCF00]/10">
            <PhoneIcon className="h-5 w-5 text-[#6FA800]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-base-content">Ad Number Call Analytics</h2>
            <p className="mt-0.5 text-xs text-base-content/45">
              Call volume and unique numbers by ad number.
            </p>
          </div>
        </div>

        {/* DATE FILTER */}
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto] lg:w-auto">
          <DateInput label="From" value={fromDate} onChange={setFromDate} />
          <DateInput label="To" value={toDate} onChange={setToDate} />
          <button
            type="button"
            onClick={handleReset}
            className="h-9 rounded-lg border border-base-300 bg-base-100 px-4 text-xs font-medium text-base-content/60 transition hover:bg-base-200 hover:text-base-content sm:self-end"
          >
            Reset
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 border-b border-base-300 md:grid-cols-5">
        <MetricCard label="Total Calls" value={summary.total} color="#0F172A" icon={PhoneIcon} />
        <MetricCard label="Received" value={summary.received} color="#3B82F6" icon={PhoneArrowDownLeftIcon} />
        <MetricCard label="Called" value={summary.called} color="#8B5CF6" icon={PhoneArrowUpRightIcon} />
        <MetricCard label="Missed" value={summary.missed} color="#EF4444" icon={PhoneXMarkIcon} />
        <MetricCard label="Unique Calls" value={summary.unique} color="#8BCF00" icon={UserGroupIcon} last />
      </div>

      {/* GRAPH LEGEND */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-base-300 px-4 py-3 sm:px-5">
        {METRICS.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.key} className="flex items-center gap-1.5 text-xs text-base-content/60">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: metric.color }} />
              <Icon className="h-3.5 w-3.5" />
              {metric.label}
            </div>
          )
        })}
      </div>

      {/* AD NUMBER LEGEND */}
      {adNumbers.length > 0 && (
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-base-300 px-4 py-3 sm:px-5">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-base-content/35">
            Ad Numbers
          </span>
          {adNumbers.map((adNumber, index) => (
            <div key={adNumber} className="flex items-center gap-1.5 text-xs text-base-content/60">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getAdColor(index) }} />
              {adNumber}
            </div>
          ))}
        </div>
      )}

      {/* GRAPH */}
      <div className="w-full overflow-x-auto overflow-y-hidden">
        {graphData.length && adNumbers.length && filteredCalls.length ? (
          <div className="px-4 pb-5 pt-6" style={{ minWidth: `${graphWidth + 65}px` }}>
            <div className="relative" style={{ height: `${GRAPH_HEIGHT}px` }}>
              {/* Y AXIS */}
              <div className="absolute bottom-0 left-0 top-0 flex w-9 flex-col justify-between">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span key={index} className="text-right text-[10px] font-medium text-base-content/35">
                    {yMax - index * yStep}
                  </span>
                ))}
              </div>

              {/* PLOT */}
              <div className="absolute bottom-0 left-11 right-0 top-0">
                {/* GRID */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="border-t border-dashed border-base-300" />
                  ))}
                </div>

                {/* DATE GROUPS */}
                <div className="absolute inset-0 flex items-end" style={{ width: `${graphWidth}px` }}>
                  {graphData.map((row) => (
                    <div key={row.date} className="group relative h-full shrink-0" style={{ width: `${DAY_WIDTH}px` }}>
                      {/* BAR AREA */}
                      <div className="absolute bottom-0 left-1/2 flex h-[calc(100%-25px)] w-[82px] -translate-x-1/2 items-end justify-center gap-1">
                        {adNumbers.map((adNumber, adIndex) => {
                          const adData = row[adNumber] || {}
                          const adTotal = METRICS.reduce((total, metric) => total + (adData[metric.key] || 0), 0)

                          return (
                            <div key={adNumber} className="relative flex h-full flex-1 max-w-[22px] items-end">
                              <div
                                className="w-full rounded-t-md opacity-85 transition-all duration-200 hover:opacity-100"
                                style={{
                                  height: adTotal
                                    ? `${Math.max((adTotal / yMax) * 100, 4)}%`
                                    : '2px',
                                  backgroundColor: getAdColor(adIndex),
                                }}
                              />
                            </div>
                          )
                        })}
                      </div>

                      {/* DATE LABEL */}
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-base-content/45">
                        {formatDate(row.date)}
                      </span>

                      {/* TOOLTIP */}
                      <div className="pointer-events-none absolute bottom-7 left-1/2 z-40 hidden w-[185px] -translate-x-1/2 rounded-xl border border-base-300 bg-base-100 p-3 shadow-xl group-hover:block">
                        <div className="mb-2 flex items-center justify-between border-b border-base-300 pb-2">
                          <span className="text-xs font-semibold text-base-content">{formatDate(row.date)}</span>
                          <span className="text-[10px] text-base-content/40">Daily</span>
                        </div>

                        {adNumbers.map((adNumber, index) => {
                          const data = row[adNumber] || {}
                          return (
                            <div key={adNumber} className="mb-2 last:mb-0">
                              <div className="mb-1 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getAdColor(index) }} />
                                <span className="truncate text-[10px] font-semibold text-base-content/70">{adNumber}</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1">
                                {METRICS.map((metric) => (
                                  <div key={metric.key} className="rounded bg-base-200/50 px-1 py-1 text-center">
                                    <div className="text-[8px] text-base-content/40">{metric.label}</div>
                                    <div className="mt-0.5 text-[10px] font-semibold text-base-content">
                                      {data[metric.key] || 0}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AXIS LABEL */}
            <div className="mt-7 flex items-center justify-center gap-1.5 text-[10px] text-base-content/35">
              <CalendarDaysIcon className="h-3.5 w-3.5" />
              Date
            </div>

            {/* SCROLL INFO */}
            {dates.length > 6 && (
              <p className="mt-2 text-center text-[10px] text-base-content/30">
                Scroll horizontally to view all dates
              </p>
            )}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex min-h-[350px] items-center justify-center px-5 text-center">
            <div>
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-base-200">
                <PhoneIcon className="h-5 w-5 text-base-content/30" />
              </div>
              <p className="mt-3 text-sm font-medium text-base-content/60">No call activity</p>
              <p className="mt-1 max-w-[300px] text-xs text-base-content/40">
                No calls were found for the selected date range.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// =============================================================
// DATE INPUT
// =============================================================

function DateInput({ label, value, onChange }) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-[10px] font-medium text-base-content/50">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input input-bordered h-9 min-h-9 w-full min-w-0 text-xs"
      />
    </div>
  )
}

// =============================================================
// METRIC CARD
// =============================================================

function MetricCard({ label, value, color, icon: Icon, last = false }) {
  return (
    <div
      className={[
        'relative min-w-0 border-base-300 px-4 py-3.5 transition hover:bg-base-200/30',
        !last ? 'border-r' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </span>
        <p className="truncate text-[10px] font-medium uppercase tracking-wide text-base-content/40">
          {label}
        </p>
      </div>
      <p className="mt-2 text-xl font-semibold leading-none text-base-content">
        {value.toLocaleString()}
      </p>
    </div>
  )
}

export default AdNumberCallTrend