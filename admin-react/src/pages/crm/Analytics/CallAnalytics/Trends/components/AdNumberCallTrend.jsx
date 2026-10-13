import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import PhoneArrowDownLeftIcon from '@heroicons/react/24/outline/PhoneArrowDownLeftIcon'
import PhoneArrowUpRightIcon from '@heroicons/react/24/outline/PhoneArrowUpRightIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'

import ActiveAdNumberDropdown from '../../../../../../components/GlobalModels/Filters/ActiveAdNumberDropdown'
import { fetchAdNumberCallTrend } from '../api/AdNumberCallTrend'


// =============================================================
// CONSTANTS
// =============================================================

const GRAPH_HEIGHT = 320
const DAY_WIDTH = 120
const MIN_GRAPH_WIDTH = 720

const METRICS = [
    {
        key: 'received',
        label: 'Received',
        color: '#3B82F6',
        icon: PhoneArrowDownLeftIcon,
    },
    {
        key: 'called',
        label: 'Called',
        color: '#8B5CF6',
        icon: PhoneArrowUpRightIcon,
    },
    {
        key: 'missed',
        label: 'Missed',
        color: '#EF4444',
        icon: PhoneXMarkIcon,
    },
    {
        key: 'unique',
        label: 'Unique',
        color: '#8BCF00',
        icon: UserGroupIcon,
    },
]

const AD_COLORS = [
    '#8BCF00',
    '#3B82F6',
    '#8B5CF6',
    '#F59E0B',
    '#06B6D4',
    '#EC4899',
    '#10B981',
    '#EF4444',
]


// =============================================================
// DATE HELPERS
// =============================================================

const getToday = () => {

    const date = new Date()

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-')
}


const parseLocalDate = (value) => {

    if (!value) {
        return null
    }

    const [year, month, day] = String(value)
        .split('-')
        .map(Number)

    if (!year || !month || !day) {
        return null
    }

    return new Date(
        year,
        month - 1,
        day
    )
}


const formatDate = (value) => {

    const date = parseLocalDate(value)

    return date
        ? date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
        })
        : '—'
}


// =============================================================
// COMPONENT
// =============================================================

function AdNumberCallTrend() {

    const today = useMemo(
        () => getToday(),
        []
    )


    // =========================================================
    // STATE
    // =========================================================

    const [trends, setTrends] = useState([])

    const [summary, setSummary] = useState({
        total: 0,
        received: 0,
        called: 0,
        missed: 0,
        unique: 0,
    })

    const [phoneOptions, setPhoneOptions] = useState([])

    const [loading, setLoading] = useState(true)

    const [refreshing, setRefreshing] = useState(false)

    const [phoneId, setPhoneId] = useState('')

    const [hoveredRow, setHoveredRow] = useState(null)

    const hoverTimeoutRef = useRef(null)

    const [fromDate, setFromDate] = useState(today)

    const [toDate, setToDate] = useState(today)


    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadData = useCallback(
        async (isRefresh = false) => {

            try {

                if (isRefresh) {
                    setRefreshing(true)
                } else {
                    setLoading(true)
                }


                const response =
                    await fetchAdNumberCallTrend({
                        fromDate,
                        toDate,
                        phoneId,
                    })


                // -------------------------------------------------
                // BACKEND RESPONSE
                //
                // {
                //   summary: {...},
                //   trends: [...]
                // }
                // -------------------------------------------------

                const responseTrends =
                    Array.isArray(response?.trends)
                        ? response.trends
                        : []


                const responseSummary =
                    response?.summary || {}


                setTrends(responseTrends)


                setSummary({
                    total: Number(
                        responseSummary.total || 0
                    ),

                    received: Number(
                        responseSummary.received || 0
                    ),

                    called: Number(
                        responseSummary.called || 0
                    ),

                    missed: Number(
                        responseSummary.missed || 0
                    ),

                    unique: Number(
                        responseSummary.unique || 0
                    ),
                })


                // -------------------------------------------------
                // BUILD PHONE DROPDOWN OPTIONS
                //
                // Backend returns:
                //
                // phone_id
                // phone_number
                // -------------------------------------------------

                setPhoneOptions((previousOptions) => {

                    const optionMap = new Map()

                    previousOptions.forEach((option) => {

                        optionMap.set(
                            String(option.id),
                            option
                        )

                    })


                    responseTrends.forEach((trend) => {

                        if (
                            trend.phone_id === null ||
                            trend.phone_id === undefined
                        ) {
                            return
                        }


                        optionMap.set(
                            String(trend.phone_id),
                            {
                                id: trend.phone_id,
                                number:
                                    trend.phone_number ||
                                    String(trend.phone_id),
                            }
                        )

                    })


                    return Array.from(
                        optionMap.values()
                    )

                })

            } catch (error) {

                console.error(
                    'Failed to load ad number call trends:',
                    error
                )


                setTrends([])

                setSummary({
                    total: 0,
                    received: 0,
                    called: 0,
                    missed: 0,
                    unique: 0,
                })

            } finally {

                setLoading(false)

                setRefreshing(false)

            }

        },
        [
            fromDate,
            toDate,
            phoneId,
        ]
    )


    // =========================================================
    // INITIAL LOAD / FILTER CHANGE
    // =========================================================

    useEffect(() => {

        loadData()

    }, [loadData])


    // =========================================================
    // PHONE OPTIONS
    // =========================================================

    const adNumbers = useMemo(() => {

        return phoneOptions

    }, [phoneOptions])


    // =========================================================
    // DATES
    // =========================================================

    const dates = useMemo(() => {

        if (
            !fromDate ||
            !toDate ||
            fromDate > toDate
        ) {
            return []
        }


        const start = parseLocalDate(fromDate)

        const end = parseLocalDate(toDate)


        if (!start || !end) {
            return []
        }


        const result = []

        const current = new Date(start)


        while (current <= end) {

            result.push(
                [
                    current.getFullYear(),
                    String(
                        current.getMonth() + 1
                    ).padStart(2, '0'),
                    String(
                        current.getDate()
                    ).padStart(2, '0'),
                ].join('-')
            )


            current.setDate(
                current.getDate() + 1
            )

        }


        return result

    }, [
        fromDate,
        toDate,
    ])


    // =========================================================
    // GROUP BACKEND TRENDS BY DATE
    // =========================================================

    const graphData = useMemo(() => {

        const grouped = {}


        // -------------------------------------------------------
        // Create one row for every date in selected range
        // -------------------------------------------------------

        dates.forEach((date) => {

            grouped[date] = {
                date,
                total: 0,
            }

        })


        // -------------------------------------------------------
        // Add backend trend data
        //
        // Backend:
        //
        // {
        //   phone_id: 2,
        //   phone_number: "9000000003",
        //   date: "2026-10-01",
        //   total: 4,
        //   received: 2,
        //   called: 1,
        //   missed: 1,
        //   unique: 3
        // }
        // -------------------------------------------------------

        trends.forEach((trend) => {

            const date = trend.date

            if (!date) {
                return
            }


            if (!grouped[date]) {

                grouped[date] = {
                    date,
                    total: 0,
                }

            }


            const key =
                String(trend.phone_id)


            grouped[date][key] = {

                phone_id:
                    trend.phone_id,

                phone_number:
                    trend.phone_number,

                total:
                    Number(trend.total || 0),

                received:
                    Number(trend.received || 0),

                called:
                    Number(trend.called || 0),

                missed:
                    Number(trend.missed || 0),

                unique:
                    Number(trend.unique || 0),

            }


            grouped[date].total +=
                Number(trend.total || 0)

        })


        return Object.values(grouped)

    }, [
        dates,
        trends,
    ])


    // =========================================================
    // MAX GRAPH VALUE
    // =========================================================

    const maxValue = useMemo(() => {

        let max = 0


        graphData.forEach((row) => {

            phoneOptions.forEach((phone) => {

                const data =
                    row[String(phone.id)]


                if (!data) {
                    return
                }


                METRICS.forEach((metric) => {

                    max = Math.max(
                        max,
                        data[metric.key] || 0
                    )

                })

            })

        })


        return Math.max(
            max,
            1
        )

    }, [
        graphData,
        phoneOptions,
    ])


    const yStep =
        Math.max(
            Math.ceil(maxValue / 5),
            1
        )


    const yMax =
        yStep * 5


    const graphWidth =
        Math.max(
            dates.length * DAY_WIDTH,
            MIN_GRAPH_WIDTH
        )


    // =========================================================
    // TOOLTIP HOVER
    // =========================================================

    const showTooltip = (row) => {

        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
        }

        setHoveredRow(row)
    }


    const hideTooltip = () => {

        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
        }

        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredRow(null)
        }, 120)
    }


    const keepTooltipOpen = () => {

        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
        }
    }


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setPhoneId('')

        setFromDate(today)

        setToDate(today)

    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">

                <div className="h-[500px] w-full animate-pulse bg-base-200/40" />

            </section>

        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section className="w-full min-w-0 overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="flex flex-col gap-4 border-b border-base-300 px-4 py-4 sm:px-5 lg:flex-row lg:items-end lg:justify-between">


                {/* TITLE */}

                <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8BCF00]/10">

                        <PhoneIcon className="h-5 w-5 text-[#6FA800]" />

                    </div>


                    <div className="min-w-0">

                        <h2 className="text-sm font-semibold text-base-content">

                            Ad Number Call Analytics

                        </h2>


                        <p className="mt-0.5 text-xs text-base-content/45">

                            Call volume and unique numbers by ad number.

                        </p>

                    </div>

                </div>


                {/* FILTERS */}

                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto lg:min-w-[650px] lg:grid-cols-[1.4fr_1fr_1fr_auto_auto] lg:items-end">


                    {/* PHONE / AD NUMBER */}

                    <div className="min-w-0">

                        <ActiveAdNumberDropdown
                            value={phoneId}
                            onChange={setPhoneId}
                            options={adNumbers}
                        />

                    </div>


                    {/* FROM */}

                    <DateInput
                        label="From"
                        value={fromDate}
                        onChange={setFromDate}
                    />


                    {/* TO */}

                    <DateInput
                        label="To"
                        value={toDate}
                        onChange={setToDate}
                    />


                    {/* RESET */}

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={refreshing}
                        className="h-9 rounded-lg border border-base-300 bg-base-100 px-4 text-xs font-medium text-base-content/60 transition hover:bg-base-200 hover:text-base-content disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        Reset

                    </button>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#8BCF00] px-4 text-xs font-medium text-white transition hover:bg-[#78B300] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <ArrowPathIcon
                            className={`h-4 w-4 shrink-0 ${refreshing
                                    ? 'animate-spin'
                                    : ''
                                }`}
                        />

                        Refresh

                    </button>

                </div>

            </div>


            {/* =====================================================
                SUMMARY
            ====================================================== */}

            <div className="grid grid-cols-2 border-b border-base-300 md:grid-cols-5">

                <MetricCard
                    label="Total Calls"
                    value={summary.total}
                    color="#0F172A"
                    icon={PhoneIcon}
                />


                <MetricCard
                    label="Received"
                    value={summary.received}
                    color="#3B82F6"
                    icon={PhoneArrowDownLeftIcon}
                />


                <MetricCard
                    label="Called"
                    value={summary.called}
                    color="#8B5CF6"
                    icon={PhoneArrowUpRightIcon}
                />


                <MetricCard
                    label="Missed"
                    value={summary.missed}
                    color="#EF4444"
                    icon={PhoneXMarkIcon}
                />


                <MetricCard
                    label="Unique Calls"
                    value={summary.unique}
                    color="#8BCF00"
                    icon={UserGroupIcon}
                    last
                />

            </div>


            {/* =====================================================
                METRIC LEGEND
            ====================================================== */}

            <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-base-300 px-4 py-3 sm:px-5">

                {METRICS.map((metric) => {

                    const Icon = metric.icon


                    return (

                        <div
                            key={metric.key}
                            className="flex items-center gap-1.5 text-xs text-base-content/60"
                        >

                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                                style={{
                                    backgroundColor:
                                        metric.color,
                                }}
                            />

                            <Icon className="h-3.5 w-3.5" />

                            {metric.label}

                        </div>

                    )

                })}

            </div>


            {/* =====================================================
                PHONE LEGEND
            ====================================================== */}

            {phoneOptions.length > 0 && (

                <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-base-300 px-4 py-3 sm:px-5">

                    <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-base-content/35">

                        Ad Numbers

                    </span>


                    {phoneOptions.map((phone, index) => (

                        <div
                            key={phone.id}
                            className="flex items-center gap-1.5 text-xs text-base-content/60"
                        >

                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                    backgroundColor:
                                        getAdColor(index),
                                }}
                            />

                            {phone.number}

                        </div>

                    ))}

                </div>

            )}


            {/* =====================================================
                GRAPH
            ====================================================== */}

            <div className="relative w-full min-h-[430px]">

                {/* HORIZONTAL GRAPH SCROLL AREA */}

                <div className="w-full overflow-x-auto">

                    {graphData.length &&
                    phoneOptions.length &&
                    trends.length ? (

                    <div
                        className="px-4 pb-5 pt-6"
                        style={{
                            minWidth:
                                `${graphWidth + 65}px`,
                        }}
                    >


                        <div
                            className="relative"
                            style={{
                                height:
                                    `${GRAPH_HEIGHT}px`,
                            }}
                        >


                            {/* Y AXIS */}

                            <div className="absolute bottom-0 left-0 top-0 flex w-9 flex-col justify-between">

                                {Array.from({
                                    length: 6,
                                }).map(
                                    (_, index) => (

                                        <span
                                            key={index}
                                            className="text-right text-[10px] font-medium text-base-content/35"
                                        >
                                            {
                                                yMax -
                                                index *
                                                yStep
                                            }
                                        </span>

                                    )
                                )}

                            </div>


                            {/* GRAPH AREA */}

                            <div className="absolute bottom-0 left-11 right-0 top-0">


                                {/* GRID */}

                                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">

                                    {Array.from({
                                        length: 6,
                                    }).map(
                                        (_, index) => (

                                            <div
                                                key={index}
                                                className="border-t border-dashed border-base-300"
                                            />

                                        )
                                    )}

                                </div>


                                {/* BARS */}

                                <div
                                    className="absolute inset-0 flex items-end"
                                    style={{
                                        width:
                                            `${graphWidth}px`,
                                    }}
                                >

                                    {graphData.map((row) => (

                                        <div
                                            key={row.date}
                                            className="relative h-full shrink-0"
                                            style={{
                                                width:
                                                    `${DAY_WIDTH}px`,
                                            }}
                                            onMouseEnter={() =>
                                                showTooltip(row)
                                            }
                                            onMouseLeave={hideTooltip}
                                        >


                                            <div className="absolute bottom-0 left-1/2 flex h-[calc(100%-25px)] w-[82px] -translate-x-1/2 items-end justify-center gap-1">


                                                {phoneOptions.map(
                                                    (
                                                        phone,
                                                        phoneIndex
                                                    ) => {

                                                        const data =
                                                            row[
                                                            String(
                                                                phone.id
                                                            )
                                                            ] || {}


                                                        const phoneTotal =
                                                            (
                                                                data.received ||
                                                                0
                                                            ) +
                                                            (
                                                                data.called ||
                                                                0
                                                            ) +
                                                            (
                                                                data.missed ||
                                                                0
                                                            )


                                                        return (

                                                            <div
                                                                key={
                                                                    phone.id
                                                                }
                                                                className="relative flex h-full max-w-[22px] flex-1 items-end"
                                                            >

                                                                <div
                                                                    className="w-full rounded-t-md opacity-85 transition-all duration-200 hover:opacity-100"
                                                                    style={{
                                                                        height:
                                                                            phoneTotal
                                                                                ? `${Math.max(
                                                                                    (
                                                                                        phoneTotal /
                                                                                        yMax
                                                                                    ) *
                                                                                    100,
                                                                                    4
                                                                                )}%`
                                                                                : '2px',

                                                                        backgroundColor:
                                                                            getAdColor(
                                                                                phoneIndex
                                                                            ),
                                                                    }}
                                                                />

                                                            </div>

                                                        )

                                                    }
                                                )}

                                            </div>


                                            {/* DATE */}

                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-base-content/45">

                                                {formatDate(
                                                    row.date
                                                )}

                                            </span>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>


                        {/* DATE LABEL */}

                        <div className="mt-7 flex items-center justify-center gap-1.5 text-[10px] text-base-content/35">

                            <CalendarDaysIcon className="h-3.5 w-3.5" />

                            Date

                        </div>


                        {dates.length > 6 && (

                            <p className="mt-2 text-center text-[10px] text-base-content/30">

                                Scroll horizontally to view all dates

                            </p>

                        )}

                    </div>

                ) : (

                    <div className="flex min-h-[350px] items-center justify-center px-5 text-center">

                        <div>

                            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-base-200">

                                <PhoneIcon className="h-5 w-5 text-base-content/30" />

                            </div>


                            <p className="mt-3 text-sm font-medium text-base-content/60">

                                No call activity

                            </p>


                            <p className="mt-1 max-w-[300px] text-xs text-base-content/40">

                                No calls were found for the selected ad number or date range.

                            </p>

                        </div>

                    </div>

                )}

                </div>

                {/* =====================================================
                    HOVER DETAILS PANEL
                ====================================================== */}

                {hoveredRow && (
                    <div
                        className="
                            absolute
                            right-5
                            top-5
                            z-50
                            w-[340px]
                            max-w-[calc(100%-40px)]
                            overflow-hidden
                            rounded-xl
                            border
                            border-base-300
                            bg-base-100
                            shadow-2xl
                        "
                        onMouseEnter={keepTooltipOpen}
                        onMouseLeave={hideTooltip}
                    >

                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">

                            <div className="min-w-0">

                                <p className="text-xs font-semibold text-base-content">

                                    {formatDate(hoveredRow.date)}

                                </p>

                                <p className="mt-0.5 text-[10px] text-base-content/40">

                                    Daily call activity

                                </p>

                            </div>

                            <span className="shrink-0 rounded-full bg-base-200 px-2.5 py-1 text-[9px] font-medium text-base-content/50">

                                {phoneOptions.length} numbers

                            </span>

                        </div>


                        {/* SCROLLABLE PHONE LIST */}

                        <div className="max-h-[300px] overflow-y-auto px-3 py-3">

                            {phoneOptions.map(
                                (phone, index) => {

                                    const data =
                                        hoveredRow[
                                            String(phone.id)
                                        ] || {}


                                    return (

                                        <div
                                            key={phone.id}
                                            className="mb-3 last:mb-0"
                                        >

                                            <div className="mb-1.5 flex items-center gap-2">

                                                <span
                                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            getAdColor(index),
                                                    }}
                                                />

                                                <span className="truncate text-xs font-semibold text-base-content">

                                                    {phone.number}

                                                </span>

                                            </div>


                                            <div className="grid grid-cols-4 gap-1.5">

                                                {METRICS.map(
                                                    (metric) => (

                                                        <div
                                                            key={
                                                                metric.key
                                                            }
                                                            className="rounded-lg bg-base-200/50 px-2 py-2 text-center"
                                                        >

                                                            <div className="text-[9px] text-base-content/40">

                                                                {
                                                                    metric.label
                                                                }

                                                            </div>

                                                            <div
                                                                className="mt-1 text-sm font-semibold"
                                                                style={{
                                                                    color:
                                                                        metric.color,
                                                                }}
                                                            >

                                                                {
                                                                    data[
                                                                        metric.key
                                                                    ] || 0
                                                                }

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )

                                }
                            )}

                        </div>


                        <div className="border-t border-base-300 px-4 py-2.5">

                            <p className="text-[9px] text-base-content/35">

                                Scroll to view all numbers

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

function DateInput({
    label,
    value,
    onChange,
}) {

    return (

        <div className="min-w-0">

            <label className="mb-1 block text-[10px] font-medium text-base-content/50">

                {label}

            </label>


            <input
                type="date"
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="input input-bordered h-9 min-h-9 w-full min-w-0 text-xs"
            />

        </div>

    )
}


// =============================================================
// METRIC CARD
// =============================================================

function MetricCard({
    label,
    value,
    color,
    icon: Icon,
    last = false,
}) {

    return (

        <div
            className={[
                'relative min-w-0 border-base-300 px-4 py-3.5 transition hover:bg-base-200/30',
                !last
                    ? 'border-r'
                    : '',
            ].join(' ')}
        >

            <div className="flex items-center gap-2">

                <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                    style={{
                        backgroundColor:
                            `${color}15`,
                    }}
                >

                    <Icon
                        className="h-3.5 w-3.5"
                        style={{
                            color,
                        }}
                    />

                </span>


                <p className="truncate text-[10px] font-medium uppercase tracking-wide text-base-content/40">

                    {label}

                </p>

            </div>


            <p className="mt-2 text-xl font-semibold leading-none text-base-content">

                {Number(
                    value || 0
                ).toLocaleString('en-IN')}

            </p>

        </div>

    )
}


// =============================================================
// COLOR
// =============================================================

function getAdColor(index) {

    return AD_COLORS[
        index % AD_COLORS.length
    ]

}


export default AdNumberCallTrend