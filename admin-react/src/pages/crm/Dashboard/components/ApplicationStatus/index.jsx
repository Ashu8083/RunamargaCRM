// admin-react/src/pages/Dashboard/components/ApplicationStatus/index.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

import LoanTypeDropdown from "../../../../../components/GlobalModels/Filters/LoanTypeDropdown";
import { getApplicationStatusData } from "./API";
import { getActiveContext } from "../../../../../app/auth";

/* =============================================================
   STATUS CONFIGURATION
   ============================================================= */

const STATUS_CONFIG = {
    "In Process": {
        background: "rgb(232 245 208 / 0.95)",
        darkBackground: "rgb(63 88 28 / 0.55)",
        border: "#C8E89A",
        darkBorder: "#6B8F32",
        accent: "#84CC16",
        text: "#365314",
        darkText: "#D9F99D",
    },

    Rejected: {
        background: "rgb(253 231 239 / 0.95)",
        darkBackground: "rgb(100 35 57 / 0.55)",
        border: "#F8B4CC",
        darkBorder: "#A84C70",
        accent: "#F43F78",
        text: "#9D174D",
        darkText: "#FBCFE8",
    },

    Login: {
        background: "rgb(231 240 252 / 0.95)",
        darkBackground: "rgb(28 61 104 / 0.55)",
        border: "#B9D4F5",
        darkBorder: "#4C78B5",
        accent: "#2196F3",
        text: "#1E40AF",
        darkText: "#BFDBFE",
    },

    Sanctioned: {
        background: "rgb(241 232 248 / 0.95)",
        darkBackground: "rgb(76 42 91 / 0.55)",
        border: "#D9BFE9",
        darkBorder: "#8B5AA3",
        accent: "#8E2DB5",
        text: "#6B21A8",
        darkText: "#E9D5FF",
    },

    Disbursed: {
        background: "rgb(231 245 236 / 0.95)",
        darkBackground: "rgb(31 78 49 / 0.55)",
        border: "#B8DFC5",
        darkBorder: "#4E9366",
        accent: "#4CAF50",
        text: "#166534",
        darkText: "#BBF7D0",
    },
};

const DEFAULT_STATUS_CONFIG = {
    background: "rgb(243 244 246 / 0.95)",
    darkBackground: "rgb(55 65 81 / 0.55)",
    border: "#D1D5DB",
    darkBorder: "#6B7280",
    accent: "#6B7280",
    text: "#374151",
    darkText: "#E5E7EB",
};

/* =============================================================
   TREEMAP SETTINGS
   ============================================================= */

const MIN_WEIGHT = 0.88;
const MAX_WEIGHT = 1.12;
const FIRST_ROW_RATIO = 0.52;

const STATUS_ORDER = [
    "In Process",
    "Rejected",
    "Login",
    "Sanctioned",
    "Disbursed",
];

/* =============================================================
   HELPERS
   ============================================================= */

const formatAmount = (amount = 0) => {
    const value = Number(amount) || 0;

    if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(1)} Cr`;
    }

    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)} L`;
    }

    return `₹${value.toLocaleString("en-IN")}`;
};

const formatCount = (count = 0) =>
    (Number(count) || 0).toLocaleString("en-IN");

const getControlledWeight = (
    count,
    minCount,
    maxCount
) => {
    const safeCount = Math.max(Number(count) || 0, 0);
    const safeMin = Math.max(Number(minCount) || 0, 0);
    const safeMax = Math.max(Number(maxCount) || 0, 1);

    if (safeMax === safeMin) {
        return 1;
    }

    const normalized =
        (Math.log1p(safeCount) - Math.log1p(safeMin)) /
        (Math.log1p(safeMax) - Math.log1p(safeMin));

    return (
        MIN_WEIGHT +
        normalized * (MAX_WEIGHT - MIN_WEIGHT)
    );
};

/* =============================================================
   TREEMAP CALCULATION
   ============================================================= */

const calculateTreemap = (items, width, height) => {
    if (
        !Array.isArray(items) ||
        !items.length ||
        width <= 0 ||
        height <= 0
    ) {
        return [];
    }

    const sortedItems = [...items]
        .map((item) => ({
            ...item,
            count: Math.max(Number(item.count) || 0, 0),
            amount: Number(item.amount) || 0,
        }))
        .sort(
            (a, b) =>
                STATUS_ORDER.indexOf(a.status) -
                STATUS_ORDER.indexOf(b.status)
        );

    const firstRow = sortedItems.slice(0, 2);
    const secondRow = sortedItems.slice(2);

    const firstRowHeight =
        height * FIRST_ROW_RATIO;

    const secondRowHeight =
        height - firstRowHeight;

    const result = [];

    const createRow = (
        row,
        y,
        rowHeight
    ) => {
        if (!row.length) {
            return;
        }

        const counts = row.map(
            (item) => item.count
        );

        const minCount = Math.min(
            ...counts
        );

        const maxCount = Math.max(
            ...counts
        );

        const weighted = row.map(
            (item) => ({
                ...item,
                weight:
                    getControlledWeight(
                        item.count,
                        minCount,
                        maxCount
                    ),
            })
        );

        const totalWeight =
            weighted.reduce(
                (sum, item) =>
                    sum + item.weight,
                0
            );

        let currentX = 0;

        weighted.forEach(
            (item, index) => {
                const isLast =
                    index ===
                    weighted.length - 1;

                const itemWidth = isLast
                    ? Math.max(
                        width - currentX,
                        0
                    )
                    : width *
                    (item.weight /
                        totalWeight);

                result.push({
                    x: currentX,
                    y,
                    width: itemWidth,
                    height: rowHeight,
                    item,
                });

                currentX += itemWidth;
            }
        );
    };

    createRow(
        firstRow,
        0,
        firstRowHeight
    );

    createRow(
        secondRow,
        firstRowHeight,
        secondRowHeight
    );

    return result;
};

/* =============================================================
   COMPONENT
   ============================================================= */

function ApplicationStatus() {
    const navigate = useNavigate();
    const chartRef = useRef(null);

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const [loanType, setLoanType] =
        useState("");

    const [hoveredStatus, setHoveredStatus] =
        useState(null);

    const activeContext =
        getActiveContext();

    const contextId =
        activeContext?.id;

    const [chartSize, setChartSize] =
        useState({
            width: 0,
            height: 0,
        });

    const [apiState, setApiState] =
        useState({
            data: [],
            summary: {
                totalApplications: 0,
                pendingApplications: 0,
                totalAmount: 0,
            },
            loading: true,
            error: null,
        });

    /* =========================================================
       OBSERVE TREEMAP SIZE
       ========================================================= */

    useEffect(() => {
        const element =
            chartRef.current;

        if (
            !element ||
            typeof ResizeObserver ===
                "undefined"
        ) {
            return undefined;
        }

        const updateSize = () => {
            const rect =
                element.getBoundingClientRect();

            setChartSize({
                width: rect.width,
                height: rect.height,
            });
        };

        updateSize();

        const observer =
            new ResizeObserver(
                updateSize
            );

        observer.observe(element);

        return () =>
            observer.disconnect();
    }, []);

    /* =========================================================
       API REQUEST
       ========================================================= */

    useEffect(() => {
        let active = true;

        if (!contextId) {
            return () => {
                active = false;
            };
        }

        const fetchData = async () => {
            setApiState(
                (previous) => ({
                    ...previous,
                    loading: true,
                    error: null,
                })
            );

            try {
                const response =
                    await getApplicationStatusData(
                        {
                            fromDate,
                            toDate,
                            loanType,
                            contextId,
                        }
                    );

                if (!active) {
                    return;
                }

                setApiState({
                    data:
                        Array.isArray(
                            response?.data
                        )
                            ? response.data
                            : [],

                    summary: {
                        totalApplications:
                            Number(
                                response
                                    ?.summary
                                    ?.totalApplications
                            ) || 0,

                        pendingApplications:
                            Number(
                                response
                                    ?.summary
                                    ?.pendingApplications
                            ) || 0,

                        totalAmount:
                            Number(
                                response
                                    ?.summary
                                    ?.totalAmount
                            ) || 0,
                    },

                    loading: false,
                    error: null,
                });
            } catch (error) {
                if (!active) {
                    return;
                }

                setApiState({
                    data: [],

                    summary: {
                        totalApplications: 0,
                        pendingApplications: 0,
                        totalAmount: 0,
                    },

                    loading: false,

                    error:
                        error?.message ||
                        "Unable to load application status.",
                });
            }
        };

        fetchData();

        return () => {
            active = false;
        };
    }, [
        contextId,
        fromDate,
        toDate,
        loanType,
    ]);

    /* =========================================================
       DATA
       ========================================================= */

    const data =
        apiState.data;

    const treemap =
        useMemo(() => {
            if (
                !chartSize.width ||
                !chartSize.height ||
                !data.length
            ) {
                return [];
            }

            return calculateTreemap(
                data,
                chartSize.width,
                chartSize.height
            );
        }, [
            data,
            chartSize,
        ]);

    /* =========================================================
       FILTER CLEAR
       ========================================================= */

    const handleClearFilters =
        () => {
            setFromDate("");
            setToDate("");
            setLoanType("");
            setHoveredStatus(null);
        };

    /* =========================================================
       NAVIGATION
       ========================================================= */

    const handleApplicationNavigation =
        (status = "") => {
            const params =
                new URLSearchParams();

            if (fromDate) {
                params.set(
                    "fromDate",
                    fromDate
                );
            }

            if (toDate) {
                params.set(
                    "toDate",
                    toDate
                );
            }

            if (loanType) {
                params.set(
                    "loanType",
                    loanType
                );
            }

            if (status) {
                params.set(
                    "status",
                    status
                );
            }

            const queryString =
                params.toString();

            navigate(
                `/crm/application-status${
                    queryString
                        ? `?${queryString}`
                        : ""
                }`
            );
        };

    const handleCardClick =
        (status) => {
            handleApplicationNavigation(
                status
            );
        };

    const handleCardKeyDown =
        (
            event,
            status
        ) => {
            if (
                event.key ===
                    "Enter" ||
                event.key ===
                    " "
            ) {
                event.preventDefault();

                handleCardClick(
                    status
                );
            }
        };

    /* =========================================================
       RENDER
       ========================================================= */

    return (
        <section
            className="
                flex
                h-full
                min-h-0
                w-full
                min-w-0
                flex-col
                overflow-visible
                rounded-2xl
                border
                border-gray-200/80
                bg-white
                shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]
                dark:border-gray-700/80
                dark:bg-gray-900
                dark:shadow-black/20
            "
        >
            {/* =================================================
                HEADER
               ================================================= */}

            <div
                className="
                    shrink-0
                    px-4
                    pt-4
                    pb-3
                "
            >
                {/* TITLE */}

                <div
                    className="
                        flex
                        min-h-[32px]
                        items-start
                        justify-between
                        gap-3
                    "
                >
                    <div className="min-w-0">
                        <h2
                            className="
                                m-0
                                text-[16px]
                                font-semibold
                                leading-5
                                tracking-[-0.01em]
                                text-gray-900
                                dark:text-gray-100
                            "
                        >
                            Application Status
                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                leading-4
                                text-gray-400
                                dark:text-gray-500
                            "
                        >
                            Application pipeline overview
                        </p>
                    </div>

                    <div
                        className="
                            hidden
                            h-7
                            shrink-0
                            items-center
                            rounded-md
                            border
                            border-gray-200
                            bg-gray-50
                            px-2
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-wide
                            text-gray-500
                            sm:flex
                            dark:border-gray-700
                            dark:bg-gray-800
                            dark:text-gray-400
                        "
                    >
                        Live Overview
                    </div>
                </div>

                {/* FILTER BAR */}

                <div
                    className="
                        mt-3
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50/80
                        p-2
                        dark:border-gray-700
                        dark:bg-gray-800/60
                    "
                >
                    <div
                        className="
                            grid
                            w-full
                            grid-cols-1
                            gap-2
                            sm:grid-cols-[minmax(130px,1fr)_minmax(130px,1fr)]
                            lg:grid-cols-[minmax(135px,1fr)_minmax(135px,1fr)_minmax(155px,1.1fr)_36px]
                            lg:items-center
                        "
                    >
                        {/* FROM DATE */}

                        <div
                            className="
                                min-w-0
                                w-full
                            "
                        >
                            <input
                                type="date"
                                value={fromDate}
                                max={
                                    toDate ||
                                    undefined
                                }
                                onChange={(
                                    event
                                ) => {
                                    setFromDate(
                                        event
                                            .target
                                            .value
                                    );

                                    setHoveredStatus(
                                        null
                                    );
                                }}
                                aria-label="From date"
                                className="
                                    block
                                    h-9
                                    w-full
                                    appearance-none
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-white
                                    px-3
                                    text-[11px]
                                    font-medium
                                    leading-none
                                    text-gray-700
                                    outline-none
                                    transition-all
                                    duration-150
                                    hover:border-gray-300
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
                            />
                        </div>

                        {/* TO DATE */}

                        <div
                            className="
                                min-w-0
                                w-full
                            "
                        >
                            <input
                                type="date"
                                value={toDate}
                                min={
                                    fromDate ||
                                    undefined
                                }
                                onChange={(
                                    event
                                ) => {
                                    setToDate(
                                        event
                                            .target
                                            .value
                                    );

                                    setHoveredStatus(
                                        null
                                    );
                                }}
                                aria-label="To date"
                                className="
                                    block
                                    h-9
                                    w-full
                                    appearance-none
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-white
                                    px-3
                                    text-[11px]
                                    font-medium
                                    leading-none
                                    text-gray-700
                                    outline-none
                                    transition-all
                                    duration-150
                                    hover:border-gray-300
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
                            />
                        </div>

                        {/* LOAN TYPE */}

                        <div
                            className="
                                min-w-0
                                w-full
                            "
                        >
                            <div
                                className="
                                    h-9
                                    w-full
                                "
                            >
                                <LoanTypeDropdown
                                    label=""
                                    value={
                                        loanType
                                    }
                                    onChange={(
                                        value
                                    ) => {
                                        setLoanType(
                                            value
                                        );

                                        setHoveredStatus(
                                            null
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        {/* CLEAR */}

                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                            aria-label="Clear all filters"
                            title="Clear all filters"
                            className="
                                group
                                flex
                                h-9
                                w-full
                                shrink-0
                                items-center
                                justify-center
                                self-center
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                text-gray-500
                                shadow-sm
                                outline-none
                                transition-all
                                duration-150
                                hover:border-red-200
                                hover:bg-red-50
                                hover:text-red-500
                                hover:shadow-sm
                                focus:border-indigo-500
                                focus:outline-none
                                focus:ring-2
                                focus:ring-indigo-100
                                active:scale-95
                                lg:w-9
                                dark:border-gray-600
                                dark:bg-gray-800
                                dark:text-gray-400
                                dark:hover:border-red-900/60
                                dark:hover:bg-red-950/40
                                dark:hover:text-red-400
                                dark:focus:border-indigo-400
                                dark:focus:ring-indigo-900/40
                            "
                        >
                            <TrashIcon
                                className="
                                    h-4
                                    w-4
                                    transition-transform
                                    duration-150
                                    group-hover:scale-105
                                "
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* =================================================
                SUMMARY
               ================================================= */}

            <div
                className="
                    mx-4
                    mt-0
                    grid
                    shrink-0
                    grid-cols-2
                    gap-px
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-200
                    shadow-sm
                    dark:border-gray-700
                    dark:bg-gray-700
                "
            >
                <div
                    className="
                        bg-gray-50
                        px-3.5
                        py-2.5
                        transition-colors
                        dark:bg-gray-800
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-2
                        "
                    >
                        <div
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            Total Applications
                        </div>

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-indigo-500/80
                            "
                        />
                    </div>

                    <div
                        className="
                            mt-1
                            text-lg
                            font-bold
                            leading-6
                            tracking-tight
                            text-gray-900
                            dark:text-gray-100
                        "
                    >
                        {formatCount(
                            apiState
                                .summary
                                .totalApplications
                        )}
                    </div>
                </div>

                <div
                    className="
                        bg-gray-50
                        px-3.5
                        py-2.5
                        transition-colors
                        dark:bg-gray-800
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-2
                        "
                    >
                        <div
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            Pending Applications
                        </div>

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-amber-500/80
                            "
                        />
                    </div>

                    <div
                        className="
                            mt-1
                            text-lg
                            font-bold
                            leading-6
                            tracking-tight
                            text-gray-900
                            dark:text-gray-100
                        "
                    >
                        {formatCount(
                            apiState
                                .summary
                                .pendingApplications
                        )}
                    </div>
                </div>
            </div>

            {/* =================================================
                TREEMAP
               ================================================= */}

            <div
                ref={chartRef}
                className="
                    relative
                    mx-4
                    mt-3
                    mb-4
                    min-h-[300px]
                    flex-1
                    w-auto
                    overflow-visible
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50/40
                    shadow-inner
                    dark:border-gray-700
                    dark:bg-gray-950/30
                "
            >
                {apiState.loading ? (
                    <div
                        className="
                            flex
                            h-full
                            min-h-[300px]
                            flex-col
                            items-center
                            justify-center
                            gap-2
                            text-xs
                            text-gray-400
                            dark:text-gray-500
                        "
                    >
                        <div
                            className="
                                h-5
                                w-5
                                animate-spin
                                rounded-full
                                border-2
                                border-gray-200
                                border-t-indigo-500
                                dark:border-gray-700
                                dark:border-t-indigo-400
                            "
                        />

                        <span>
                            Loading application status...
                        </span>
                    </div>
                ) : apiState.error ? (
                    <div
                        className="
                            flex
                            h-full
                            min-h-[300px]
                            items-center
                            justify-center
                            px-4
                            text-center
                            text-xs
                            text-red-500
                            dark:text-red-400
                        "
                    >
                        <div
                            className="
                                rounded-lg
                                border
                                border-red-100
                                bg-red-50
                                px-4
                                py-3
                                dark:border-red-900/40
                                dark:bg-red-950/20
                            "
                        >
                            {apiState.error}
                        </div>
                    </div>
                ) : treemap.length ? (
                    treemap.map(
                        (tile) => {
                            const item =
                                tile.item;

                            const config =
                                STATUS_CONFIG[
                                    item.status
                                ] ||
                                DEFAULT_STATUS_CONFIG;

                            const isHovered =
                                hoveredStatus ===
                                item.status;

                            const area =
                                tile.width *
                                tile.height;

                            const isLarge =
                                area >=
                                18000;

                            const isMedium =
                                area >=
                                8000;

                            return (
                                <div
                                    key={
                                        item.status
                                    }
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View ${item.status} applications`}
                                    className="
                                        absolute
                                        cursor-pointer
                                        outline-none
                                    "
                                    style={{
                                        left: `${tile.x}px`,
                                        top: `${tile.y}px`,
                                        width: `${tile.width}px`,
                                        height: `${tile.height}px`,
                                        zIndex:
                                            isHovered
                                                ? 50
                                                : 1,
                                    }}
                                    onClick={() =>
                                        handleCardClick(
                                            item.status
                                        )
                                    }
                                    onKeyDown={(
                                        event
                                    ) =>
                                        handleCardKeyDown(
                                            event,
                                            item.status
                                        )
                                    }
                                    onMouseEnter={() =>
                                        setHoveredStatus(
                                            item.status
                                        )
                                    }
                                    onMouseLeave={() =>
                                        setHoveredStatus(
                                            null
                                        )
                                    }
                                >
                                    <div
                                        className="
                                            relative
                                            flex
                                            h-full
                                            w-full
                                            flex-col
                                            items-center
                                            justify-center
                                            overflow-hidden
                                            border
                                            text-center
                                            transition-all
                                            duration-200
                                        "
                                        style={{
                                            backgroundColor:
                                                `light-dark(${config.background}, ${config.darkBackground})`,

                                            borderColor:
                                                `light-dark(${config.border}, ${config.darkBorder})`,

                                            boxShadow:
                                                isHovered
                                                    ? `inset 0 0 0 2px ${config.accent}, 0 8px 20px rgba(0,0,0,0.16)`
                                                    : "none",

                                            transform:
                                                isHovered
                                                    ? "scale(0.995)"
                                                    : "scale(1)",
                                        }}
                                    >
                                        <div
                                            className="
                                                flex
                                                max-w-[90%]
                                                items-center
                                                justify-center
                                                gap-1.5
                                            "
                                        >
                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    shrink-0
                                                    rounded-full
                                                    shadow-sm
                                                "
                                                style={{
                                                    backgroundColor:
                                                        config.accent,
                                                }}
                                            />

                                            <span
                                                className="
                                                    truncate
                                                    font-bold
                                                    uppercase
                                                    tracking-wide
                                                "
                                                style={{
                                                    color:
                                                        `light-dark(${config.text}, ${config.darkText})`,

                                                    fontSize:
                                                        isLarge
                                                            ? "11px"
                                                            : isMedium
                                                                ? "10px"
                                                                : "8px",
                                                }}
                                            >
                                                {
                                                    item.status
                                                }
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                mt-1
                                                font-bold
                                                leading-none
                                                tracking-tight
                                            "
                                            style={{
                                                color:
                                                    `light-dark(${config.text}, ${config.darkText})`,

                                                fontSize:
                                                    isLarge
                                                        ? "22px"
                                                        : isMedium
                                                            ? "17px"
                                                            : "12px",
                                            }}
                                        >
                                            {formatCount(
                                                item.count
                                            )}
                                        </div>

                                        <div
                                            className="
                                                mt-1
                                                max-w-[90%]
                                                truncate
                                                font-medium
                                            "
                                            style={{
                                                color:
                                                    `light-dark(${config.text}, ${config.darkText})`,

                                                opacity:
                                                    0.72,

                                                fontSize:
                                                    isLarge
                                                        ? "10px"
                                                        : "8px",
                                            }}
                                        >
                                            {formatAmount(
                                                item.amount
                                            )}
                                        </div>

                                        <div
                                            className="
                                                absolute
                                                bottom-0
                                                left-0
                                                right-0
                                                h-[3px]
                                            "
                                            style={{
                                                backgroundColor:
                                                    config.accent,
                                            }}
                                        />
                                    </div>

                                    {isHovered && (
                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                bottom-[calc(100%+8px)]
                                                left-1/2
                                                z-[100]
                                                w-[200px]
                                                -translate-x-1/2
                                                rounded-xl
                                                border
                                                border-gray-200
                                                bg-white/95
                                                p-3
                                                text-left
                                                shadow-[0_12px_32px_rgba(0,0,0,0.16)]
                                                backdrop-blur-sm
                                                dark:border-gray-600
                                                dark:bg-gray-800/95
                                            "
                                        >
                                            <div
                                                className="
                                                    mb-2
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-2
                                                    border-b
                                                    border-gray-100
                                                    pb-2
                                                    dark:border-gray-700
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        min-w-0
                                                        items-center
                                                        gap-1.5
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            h-1.5
                                                            w-1.5
                                                            shrink-0
                                                            rounded-full
                                                        "
                                                        style={{
                                                            backgroundColor:
                                                                config.accent,
                                                        }}
                                                    />

                                                    <span
                                                        className="
                                                            truncate
                                                            text-[10px]
                                                            font-semibold
                                                            text-gray-900
                                                            dark:text-gray-100
                                                        "
                                                    >
                                                        {
                                                            item.status
                                                        }
                                                    </span>
                                                </div>

                                                <span
                                                    className="
                                                        shrink-0
                                                        rounded
                                                        bg-gray-100
                                                        px-1.5
                                                        py-0.5
                                                        text-[8px]
                                                        font-medium
                                                        text-gray-400
                                                        dark:bg-gray-700
                                                        dark:text-gray-500
                                                    "
                                                >
                                                    View
                                                </span>
                                            </div>

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-2
                                                    py-0.5
                                                    text-[10px]
                                                "
                                            >
                                                <span
                                                    className="
                                                        text-gray-500
                                                        dark:text-gray-400
                                                    "
                                                >
                                                    Applications
                                                </span>

                                                <strong
                                                    className="
                                                        text-gray-900
                                                        dark:text-gray-100
                                                    "
                                                >
                                                    {formatCount(
                                                        item.count
                                                    )}
                                                </strong>
                                            </div>

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-2
                                                    py-0.5
                                                    text-[10px]
                                                "
                                            >
                                                <span
                                                    className="
                                                        text-gray-500
                                                        dark:text-gray-400
                                                    "
                                                >
                                                    Loan Amount
                                                </span>

                                                <strong
                                                    className="
                                                        text-gray-900
                                                        dark:text-gray-100
                                                    "
                                                >
                                                    {formatAmount(
                                                        item.amount
                                                    )}
                                                </strong>
                                            </div>

                                            {loanType && (
                                                <div
                                                    className="
                                                        mt-1.5
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-2
                                                        border-t
                                                        border-gray-100
                                                        pt-1.5
                                                        text-[10px]
                                                        dark:border-gray-700
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            text-gray-500
                                                            dark:text-gray-400
                                                        "
                                                    >
                                                        Loan Type
                                                    </span>

                                                    <strong
                                                        className="
                                                            max-w-[110px]
                                                            truncate
                                                            text-gray-900
                                                            dark:text-gray-100
                                                        "
                                                    >
                                                        {
                                                            loanType
                                                        }
                                                    </strong>
                                                </div>
                                            )}

                                            <div
                                                className="
                                                    mt-2
                                                    border-t
                                                    border-gray-100
                                                    pt-1.5
                                                    text-[8px]
                                                    font-medium
                                                    text-gray-400
                                                    dark:border-gray-700
                                                    dark:text-gray-500
                                                "
                                            >
                                                Click to view applications
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    )
                ) : (
                    <div
                        className="
                            flex
                            h-full
                            min-h-[300px]
                            flex-col
                            items-center
                            justify-center
                            gap-2
                            text-xs
                            text-gray-400
                            dark:text-gray-500
                        "
                    >
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-gray-200
                                bg-white
                                dark:border-gray-700
                                dark:bg-gray-800
                            "
                        >
                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-gray-300
                                    dark:bg-gray-600
                                "
                            />
                        </div>

                        <span>
                            No application data available
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ApplicationStatus;