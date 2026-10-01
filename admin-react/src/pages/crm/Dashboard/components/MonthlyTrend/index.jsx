// admin-react/src/pages/Dashboard/components/MonthlyTrend/index.jsx

import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    CalendarDaysIcon,
    ChevronDownIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";
import { getActiveContext } from "../../../../../app/auth";
import { getMonthlyTrendData } from "./API";

const STATUS_OPTIONS = [
    "In Process",
    "Login",
    "Sanctioned",
    "Disbursed",
    "Rejected",
];

const PERIOD_OPTIONS = [
    { label: "Last 3 Months", value: 3 },
    { label: "Last 6 Months", value: 6 },
    { label: "Last 12 Months", value: 12 },
];

const STATUS_STYLES = {
    "In Process": {
        line: "#f59e0b",
        dot: "#f59e0b",
    },
    Login: {
        line: "#3b82f6",
        dot: "#3b82f6",
    },
    Sanctioned: {
        line: "#8b5cf6",
        dot: "#8b5cf6",
    },
    Disbursed: {
        line: "#10b981",
        dot: "#10b981",
    },
    Rejected: {
        line: "#ef4444",
        dot: "#ef4444",
    },
};

const formatAmount = (amount) => {
    const value = Number(amount) || 0;

    if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(1)} Cr`;
    }

    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)} L`;
    }

    return `₹${value.toLocaleString("en-IN")}`;
};

const formatYAxisAmount = (amount) => {
    const value = Number(amount) || 0;

    if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(1)} Cr`;
    }

    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(0)} L`;
    }

    if (value >= 1000) {
        return `₹${Math.round(value / 1000)}K`;
    }

    return `₹${Math.round(value)}`;
};

const formatCount = (count) =>
    Number(count || 0).toLocaleString("en-IN");

function MonthlyTrend() {
    const [status, setStatus] = useState("Disbursed");
    const [period, setPeriod] = useState(3);
    const activeContext = getActiveContext();
    const contextId = activeContext?.id;
    const [response, setResponse] = useState({
        data: [],
        status: "Disbursed",
        period: 3,
        totalApplications: 0,
        totalAmount: 0,
        loading: true,
        error: null,
    });

    const [hoveredIndex, setHoveredIndex] =
        useState(null);

    const [chartSize, setChartSize] = useState({
        width: 600,
        height: 250,
    });

    const chartContainerRef = useRef(null);

    useEffect(() => {
        let active = true;

        const fetchData = async () => {
            setResponse((previous) => ({
                ...previous,
                loading: true,
                error: null,
            }));

            try {
                const result =
                    await getMonthlyTrendData({
                        contextId,
                        period,
                    });

                if (!active) {
                    return;
                }

                setResponse({
                    data: Array.isArray(result?.data)
                        ? result.data
                        : [],
                    status:
                        result?.status || status,
                    period:
                        Number(result?.period) ||
                        period,
                    totalApplications:
                        Number(
                            result?.totalApplications
                        ) || 0,
                    totalAmount:
                        Number(result?.totalAmount) ||
                        0,
                    loading: false,
                    error: null,
                });

                setHoveredIndex(null);
            } catch (error) {
                if (!active) {
                    return;
                }

                setResponse({
                    data: [],
                    status,
                    period,
                    totalApplications: 0,
                    totalAmount: 0,
                    loading: false,
                    error:
                        error?.message ||
                        "Unable to load monthly disbursement trend data.",
                });
            }
        };

        fetchData();

        return () => {
            active = false;
        };
    }, [status, period]);

    useEffect(() => {
        const element = chartContainerRef.current;

        if (
            !element ||
            typeof ResizeObserver === "undefined"
        ) {
            return undefined;
        }

        const updateSize = () => {
            const rect =
                element.getBoundingClientRect();

            setChartSize({
                width: Math.max(rect.width, 320),
                height: Math.max(rect.height, 220),
            });
        };

        updateSize();

        const observer =
            new ResizeObserver(updateSize);

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const data = response.data || [];

    const chart = useMemo(() => {
        if (!data.length) {
            return {
                points: [],
                path: "",
                areaPath: "",
                maxAmount: 0,
                graphMax: 0,
                gridValues: [],
                padding: {
                    top: 24,
                    right: 20,
                    bottom: 34,
                    left: 64,
                },
                chartWidth: 0,
                chartHeight: 0,
            };
        }

        const width = chartSize.width;
        const height = chartSize.height;

        const padding = {
            top: 24,
            right: 20,
            bottom: 34,
            left: 64,
        };

        const chartWidth =
            width -
            padding.left -
            padding.right;

        const chartHeight =
            height -
            padding.top -
            padding.bottom;

        const amounts = data.map(
            (item) => Number(item.amount) || 0
        );

        const maxAmount = Math.max(
            ...amounts,
            1
        );

        const graphMax =
            maxAmount * 1.15;

        const points = data.map(
            (item, index) => {
                const x =
                    data.length === 1
                        ? padding.left +
                        chartWidth / 2
                        : padding.left +
                        (index /
                            (data.length - 1)) *
                        chartWidth;

                const y =
                    padding.top +
                    chartHeight -
                    ((Number(item.amount) || 0) /
                        graphMax) *
                    chartHeight;

                return {
                    ...item,
                    x,
                    y,
                };
            }
        );

        const path = points
            .map((point, index) => {
                if (index === 0) {
                    return `M ${point.x} ${point.y}`;
                }

                const previous =
                    points[index - 1];

                const controlX =
                    (previous.x + point.x) / 2;

                return `C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
            })
            .join(" ");

        const bottomY =
            padding.top + chartHeight;

        const areaPath =
            points.length > 0
                ? `${path} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`
                : "";

        const gridSteps = 4;

        const gridValues = Array.from(
            { length: gridSteps + 1 },
            (_, index) =>
                graphMax -
                (graphMax / gridSteps) *
                index
        );

        return {
            points,
            path,
            areaPath,
            maxAmount,
            graphMax,
            gridValues,
            padding,
            chartWidth,
            chartHeight,
        };
    }, [data, chartSize]);

    const activeStyle =
        STATUS_STYLES[status] ||
        STATUS_STYLES["Disbursed"]

    const hoveredPoint =
        hoveredIndex !== null
            ? chart.points[hoveredIndex]
            : null;

    return (
        <section
            className="
                flex
                h-full
                min-h-0
                w-full
                min-w-0
                flex-col
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-white
                shadow-sm
                dark:border-gray-700
                dark:bg-gray-900
                dark:shadow-black/20
            "
        >
            {/* Header */}
            <div
                className="
                    shrink-0
                    border-b
                    border-gray-100
                    px-4
                    py-4
                    dark:border-gray-700
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-indigo-50
                                dark:bg-indigo-950/40
                            "
                        >
                            <ChartBarIcon
                                className="
                                    h-5
                                    w-5
                                    text-indigo-600
                                    dark:text-indigo-400
                                "
                            />
                        </div>

                        <h2
                            className="
                                truncate
                                text-[16px]
                                font-semibold
                                leading-5
                                text-gray-900
                                dark:text-gray-100
                            "
                        >
                            Monthly Disbursement Trend
                        </h2>
                    </div>

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >


                        {/* Period */}
                        <div className="relative">
                            <CalendarDaysIcon
                                className="
                                    pointer-events-none
                                    absolute
                                    left-2.5
                                    top-1/2
                                    h-3.5
                                    w-3.5
                                    -translate-y-1/2
                                    text-gray-400
                                    dark:text-gray-500
                                "
                            />

                            <select
                                value={period}
                                onChange={(event) =>
                                    setPeriod(
                                        Number(
                                            event.target
                                                .value
                                        )
                                    )
                                }
                                className="
                                    h-8
                                    min-w-[142px]
                                    cursor-pointer
                                    appearance-none
                                    rounded-md
                                    border
                                    border-gray-300
                                    bg-white
                                    py-0
                                    pl-8
                                    pr-8
                                    text-[11px]
                                    font-medium
                                    text-gray-700
                                    outline-none
                                    transition
                                    hover:border-gray-400
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                    dark:border-gray-600
                                    dark:bg-gray-800
                                    dark:text-gray-200
                                    dark:[color-scheme:dark]
                                    dark:hover:border-gray-500
                                    dark:focus:border-indigo-400
                                    dark:focus:ring-indigo-900/40
                                "
                            >
                                {PERIOD_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {option.label}
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDownIcon
                                className="
                                    pointer-events-none
                                    absolute
                                    right-2
                                    top-1/2
                                    h-3.5
                                    w-3.5
                                    -translate-y-1/2
                                    text-gray-400
                                    dark:text-gray-500
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="min-h-0 flex-1 px-4 pb-3 pt-3 sm:px-5">
                <div
                    className="
                        relative
                        h-[270px]
                        w-full
                        overflow-x-auto
                        overflow-y-hidden
                        scrollbar-thin
                        scrollbar-track-transparent
                        scrollbar-thumb-gray-300
                        dark:scrollbar-thumb-gray-600
                    "
                >
                    <div
                        ref={chartContainerRef}
                        className="
                            relative
                            h-full
                            min-w-[700px]
                            w-full
                        "
                    >
                        {response.loading ? (
                            <div
                                className="
                                    flex
                                    h-full
                                    items-center
                                    justify-center
                                "
                            >
                                <div
                                    className="
                                        text-xs
                                        text-gray-400
                                        dark:text-gray-500
                                    "
                                >
                                    Loading...
                                </div>
                            </div>
                        ) : response.error ? (
                            <div
                                className="
                                    flex
                                    h-full
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-dashed
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    text-center
                                    text-xs
                                    text-red-500
                                    dark:border-red-900
                                    dark:bg-red-950/30
                                    dark:text-red-400
                                "
                            >
                                {response.error}
                            </div>
                        ) : data.length === 0 ? (
                            <div
                                className="
                                    flex
                                    h-full
                                    items-center
                                    justify-center
                                "
                            >
                                <div className="text-center">
                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-gray-600
                                            dark:text-gray-300
                                        "
                                    >
                                        No trend data available
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-gray-400
                                            dark:text-gray-500
                                        "
                                    >
                                        Try changing the
                                        selected filters.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <svg
                                    width="100%"
                                    height="100%"
                                    viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
                                    preserveAspectRatio="none"
                                    className="
                                        block
                                        overflow-visible
                                    "
                                    role="img"
                                    aria-label="Disbursed monthly trend"
                                >
                                    <defs>
                                        <linearGradient
                                            id="monthlyTrendAreaGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor={
                                                    activeStyle.line
                                                }
                                                stopOpacity="0.14"
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor={
                                                    activeStyle.line
                                                }
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid */}
                                    {chart.gridValues.map(
                                        (
                                            value,
                                            index
                                        ) => {
                                            const y =
                                                chart
                                                    .padding
                                                    .top +
                                                (index /
                                                    4) *
                                                chart.chartHeight;

                                            return (
                                                <g
                                                    key={`grid-${index}`}
                                                >
                                                    <line
                                                        x1={
                                                            chart
                                                                .padding
                                                                .left
                                                        }
                                                        x2={
                                                            chart
                                                                .padding
                                                                .left +
                                                            chart.chartWidth
                                                        }
                                                        y1={y}
                                                        y2={y}
                                                        className="
                                                            stroke-gray-200
                                                            dark:stroke-gray-700
                                                        "
                                                        strokeWidth="1"
                                                        strokeDasharray="3 4"
                                                        vectorEffect="non-scaling-stroke"
                                                    />

                                                    <text
                                                        x={
                                                            chart
                                                                .padding
                                                                .left -
                                                            10
                                                        }
                                                        y={
                                                            y +
                                                            4
                                                        }
                                                        textAnchor="end"
                                                        className="
                                                            fill-gray-400
                                                            text-[10px]
                                                            dark:fill-gray-500
                                                        "
                                                    >
                                                        {formatYAxisAmount(
                                                            value
                                                        )}
                                                    </text>
                                                </g>
                                            );
                                        }
                                    )}

                                    {/* Area */}
                                    <path
                                        d={
                                            chart.areaPath
                                        }
                                        fill="url(#monthlyTrendAreaGradient)"
                                        stroke="none"
                                    />

                                    {/* Line */}
                                    <path
                                        d={
                                            chart.path
                                        }
                                        fill="none"
                                        stroke={
                                            activeStyle.line
                                        }
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        vectorEffect="non-scaling-stroke"
                                    />

                                    {/* Month labels */}
                                    {chart.points.map(
                                        (
                                            point,
                                            index
                                        ) => (
                                            <text
                                                key={`label-${point.month}-${index}`}
                                                x={
                                                    point.x
                                                }
                                                y={
                                                    chart
                                                        .padding
                                                        .top +
                                                    chart.chartHeight +
                                                    23
                                                }
                                                textAnchor="middle"
                                                className="
                                                    fill-gray-400
                                                    text-[10px]
                                                    font-medium
                                                    dark:fill-gray-500
                                                "
                                            >
                                                {point.shortMonth ||
                                                    point.month}
                                            </text>
                                        )
                                    )}

                                    {/* Points */}
                                    {chart.points.map(
                                        (
                                            point,
                                            index
                                        ) => {
                                            const isHovered =
                                                hoveredIndex ===
                                                index;

                                            return (
                                                <g
                                                    key={`point-${point.month}-${index}`}
                                                    onMouseEnter={() =>
                                                        setHoveredIndex(
                                                            index
                                                        )
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoveredIndex(
                                                            null
                                                        )
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    <circle
                                                        cx={
                                                            point.x
                                                        }
                                                        cy={
                                                            point.y
                                                        }
                                                        r="13"
                                                        fill="transparent"
                                                    />

                                                    {isHovered && (
                                                        <circle
                                                            cx={
                                                                point.x
                                                            }
                                                            cy={
                                                                point.y
                                                            }
                                                            r="7"
                                                            fill={
                                                                activeStyle.line
                                                            }
                                                            fillOpacity="0.12"
                                                            stroke="none"
                                                        />
                                                    )}

                                                    <circle
                                                        cx={
                                                            point.x
                                                        }
                                                        cy={
                                                            point.y
                                                        }
                                                        r={
                                                            isHovered
                                                                ? 4.5
                                                                : 3.5
                                                        }
                                                        className="
                                                            fill-white
                                                            dark:fill-gray-900
                                                        "
                                                        stroke={
                                                            activeStyle.line
                                                        }
                                                        strokeWidth="2"
                                                        vectorEffect="non-scaling-stroke"
                                                    />
                                                </g>
                                            );
                                        }
                                    )}
                                </svg>

                                {/* Tooltip */}
                                {hoveredPoint && (
                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            z-20
                                            w-[190px]
                                            rounded-lg
                                            border
                                            border-gray-200
                                            bg-white
                                            p-3
                                            shadow-xl
                                            dark:border-gray-600
                                            dark:bg-gray-800
                                        "
                                        style={{
                                            left:
                                                Math.min(
                                                    Math.max(
                                                        (hoveredPoint.x / chartSize.width) * 100,
                                                        16
                                                    ),
                                                    84
                                                ) + "%",

                                            top:
                                                Math.max(
                                                    4,
                                                    (hoveredPoint.y / chartSize.height) * 100
                                                ) + "%",

                                            transform:
                                                hoveredPoint.x > chartSize.width * 0.72
                                                    ? "translate(-100%, -100%)"
                                                    : hoveredPoint.x < chartSize.width * 0.28
                                                        ? "translate(0, -100%)"
                                                        : "translate(-50%, -100%)",
                                        }}
                                    >
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                border-b
                                                border-gray-100
                                                pb-2
                                                dark:border-gray-700
                                            "
                                        >
                                            <span
                                                className="h-2 w-2 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        activeStyle.dot,
                                                }}
                                            />

                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                        truncate
                                                        text-xs
                                                        font-semibold
                                                        text-gray-900
                                                        dark:text-gray-100
                                                    "
                                                >
                                                    {
                                                        hoveredPoint.month
                                                    }
                                                </p>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-[10px]
                                                        text-gray-500
                                                        dark:text-gray-400
                                                    "
                                                >
                                                    {
                                                        status
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-2.5 space-y-2">
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >
                                                <span
                                                    className="
                                                        text-[11px]
                                                        text-gray-500
                                                        dark:text-gray-400
                                                    "
                                                >
                                                    Applications
                                                </span>

                                                <span
                                                    className="
                                                        text-xs
                                                        font-semibold
                                                        text-gray-900
                                                        dark:text-gray-100
                                                    "
                                                >
                                                    {formatCount(
                                                        hoveredPoint.count
                                                    )}
                                                </span>
                                            </div>

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >
                                                <span
                                                    className="
                                                        text-[11px]
                                                        text-gray-500
                                                        dark:text-gray-400
                                                    "
                                                >
                                                    Amount
                                                </span>

                                                <span
                                                    className="
                                                        text-xs
                                                        font-semibold
                                                        text-gray-900
                                                        dark:text-gray-100
                                                    "
                                                >
                                                    {formatAmount(
                                                        hoveredPoint.amount
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div
                className="
                    grid
                    shrink-0
                    grid-cols-2
                    border-t
                    border-gray-200
                    dark:border-gray-700
                "
            >
                <div
                    className="
                        border-r
                        border-gray-200
                        px-4
                        py-3
                        text-center
                        dark:border-gray-700
                    "
                >
                    <p
                        className="
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-wide
                            text-gray-500
                            dark:text-gray-400
                        "
                    >
                        Total Applications
                    </p>

                    <p
                        className="
                            mt-1
                            text-lg
                            font-bold
                            leading-6
                            text-gray-900
                            dark:text-gray-100
                        "
                    >
                        {formatCount(
                            response.totalApplications
                        )}
                    </p>
                </div>

                <div
                    className="
                        px-4
                        py-3
                        text-center
                    "
                >
                    <p
                        className="
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-wide
                            text-gray-500
                            dark:text-gray-400
                        "
                    >
                        Total Amount
                    </p>

                    <p
                        className="
                            mt-1
                            text-lg
                            font-bold
                            leading-6
                            text-gray-900
                            dark:text-gray-100
                        "
                    >
                        {formatAmount(
                            response.totalAmount
                        )}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default MonthlyTrend;