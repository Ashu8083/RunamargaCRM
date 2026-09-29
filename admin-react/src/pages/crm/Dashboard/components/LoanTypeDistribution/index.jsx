// admin-react/src/pages/Dashboard/components/LoanTypeDistribution/index.jsx

import { useEffect, useMemo, useRef, useState } from "react";

import { getLoanTypeDistributionData } from "./API";
import { getActiveContext } from '../../../../../app/auth'
// const STATUS_OPTIONS = [
//     "In Process",
//     "Login",
//     "Sanctioned",
//     "Disbursed",
//     "Rejected",
// ];

const CHART_COLORS = [
    "#84CC16",
    "#2196F3",
    "#8E2DB5",
    "#4CAF50",
    "#F43F78",
    "#06B6D4",
    "#F59E0B",
    "#6366F1",
    "#14B8A6",
    "#F97316",
];

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

const createDonutGradient = (data, total) => {
    if (!data.length || total <= 0) {
        return "conic-gradient(#E5E7EB 0deg 360deg)";
    }

    let currentDegree = 0;

    const segments = data.map((item, index) => {
        const degree =
            (Number(item.count) / total) * 360;

        const startDegree = currentDegree;
        const endDegree =
            currentDegree + degree;

        currentDegree = endDegree;

        const color =
            CHART_COLORS[
            index % CHART_COLORS.length
            ];

        return `${color} ${startDegree}deg ${endDegree}deg`;
    });

    return `conic-gradient(${segments.join(", ")})`;
};

function LoanTypeDistribution() {
    const activeContext = getActiveContext();
    const contextId = activeContext?.id;
    const getToday = () => {
        const today = new Date();

        return today.toISOString().split("T")[0];
    };

    const getMonthStart = () => {
        const today = new Date();

        const monthStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        return monthStart.toISOString().split("T")[0];
    };

    const [fromDate, setFromDate] = useState(
        getMonthStart()
    );

    const [toDate, setToDate] = useState(
        getToday()
    );
    const [status, setStatus] =
        useState("Disbursed");

    const [response, setResponse] = useState({
        data: [],
        totalApplications: 0,
        totalAmount: 0,
        status: "In Process",
        loading: true,
        error: null,
    });

    const [hoveredItem, setHoveredItem] =
        useState(null);

    const donutRef = useRef(null);

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
                    await getLoanTypeDistributionData({
                        contextId: contextId,
                        fromDate,
                        toDate,
                        status,
                    });

                if (!active) {
                    return;
                }

                setResponse({
                    data: Array.isArray(result?.data)
                        ? result.data
                        : [],
                    totalApplications:
                        Number(
                            result?.totalApplications
                        ) || 0,
                    totalAmount:
                        Number(result?.totalAmount) ||
                        0,
                    status:
                        result?.status || status,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                if (!active) {
                    return;
                }

                setResponse({
                    data: [],
                    totalApplications: 0,
                    totalAmount: 0,
                    status,
                    loading: false,
                    error:
                        error?.message ||
                        "Unable to load loan type distribution.",
                });
            }
        };

        fetchData();

        return () => {
            active = false;
        };
    }, [contextId, fromDate, toDate, status]);

    const data = response.data;

    const totalApplications =
        response.totalApplications;

    const donutGradient = useMemo(
        () =>
            createDonutGradient(
                data,
                totalApplications
            ),
        [data, totalApplications]
    );

    const handleDonutMouseMove = (event) => {
        if (
            !donutRef.current ||
            !data.length ||
            !totalApplications
        ) {
            return;
        }

        const rect =
            donutRef.current.getBoundingClientRect();

        const centerX =
            rect.left + rect.width / 2;

        const centerY =
            rect.top + rect.height / 2;

        const deltaX =
            event.clientX - centerX;

        const deltaY =
            event.clientY - centerY;

        let angle =
            Math.atan2(
                deltaY,
                deltaX
            ) *
            (180 / Math.PI);

        angle += 90;

        if (angle < 0) {
            angle += 360;
        }

        let accumulatedDegree = 0;

        for (
            let index = 0;
            index < data.length;
            index++
        ) {
            const item = data[index];

            const sliceDegree =
                (Number(item.count) /
                    totalApplications) *
                360;

            const sliceStart =
                accumulatedDegree;

            const sliceEnd =
                accumulatedDegree +
                sliceDegree;

            if (
                angle >= sliceStart &&
                angle < sliceEnd
            ) {
                setHoveredItem({
                    ...item,
                    index,
                });

                return;
            }

            accumulatedDegree = sliceEnd;
        }
    };

    const handleDateChange =
        (setter) => (event) => {
            setter(event.target.value);
            setHoveredItem(null);
        };

    const handleClearFilters = () => {
        setFromDate(getMonthStart());
        setToDate(getToday());
        setStatus("Disbursed");
        setHoveredItem(null);
    };

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
                p-4
                shadow-sm
                dark:border-gray-700
                dark:bg-gray-900
                dark:shadow-black/20
            "
        >
            <div className="shrink-0">
                <h2
                    className="
                        m-0
                        text-[16px]
                        font-semibold
                        leading-5
                        text-gray-900
                        dark:text-gray-100
                    "
                >
                    Loan Type Distribution
                </h2>

                <div
                    className="
                        mt-3
                        flex
                        w-full
                        flex-wrap
                        items-center
                        gap-2
                    "
                >
                    <div className="min-w-[135px] flex-1">
                        <input
                            type="date"
                            value={fromDate}
                            max={toDate || undefined}
                            onChange={handleDateChange(
                                setFromDate
                            )}
                            aria-label="From date"
                            className="
                                h-8
                                w-full
                                rounded-md
                                border
                                border-gray-300
                                bg-white
                                px-2.5
                                text-[11px]
                                text-gray-700
                                outline-none
                                transition
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-100
                                dark:border-gray-600
                                dark:bg-gray-800
                                dark:text-gray-200
                                dark:[color-scheme:dark]
                                dark:focus:border-indigo-400
                                dark:focus:ring-indigo-900/40
                            "
                        />
                    </div>

                    <span
                        className="
                            shrink-0
                            text-[10px]
                            text-gray-400
                            dark:text-gray-500
                        "
                    >
                        to
                    </span>

                    <div className="min-w-[135px] flex-1">
                        <input
                            type="date"
                            value={toDate}
                            min={fromDate || undefined}
                            onChange={handleDateChange(
                                setToDate
                            )}
                            aria-label="To date"
                            className="
                                h-8
                                w-full
                                rounded-md
                                border
                                border-gray-300
                                bg-white
                                px-2.5
                                text-[11px]
                                text-gray-700
                                outline-none
                                transition
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-100
                                dark:border-gray-600
                                dark:bg-gray-800
                                dark:text-gray-200
                                dark:[color-scheme:dark]
                                dark:focus:border-indigo-400
                                dark:focus:ring-indigo-900/40
                            "
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="
        h-8
        shrink-0
        rounded-md
        border
        border-gray-300
        bg-white
        px-3
        text-[11px]
        font-medium
        text-gray-600
        transition
        hover:bg-gray-50
        hover:text-gray-900
        focus:border-indigo-500
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-100
        dark:border-gray-600
        dark:bg-gray-800
        dark:text-gray-300
        dark:hover:bg-gray-700
        dark:hover:text-gray-100
        dark:focus:border-indigo-400
        dark:focus:ring-indigo-900/40
    "
                    >
                        Clear Filters
                    </button>
                    {/* <div className="min-w-[155px] flex-1">
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            aria-label="Application status"
                            className="
                                h-8
                                w-full
                                cursor-pointer
                                rounded-md
                                border
                                border-gray-300
                                bg-white
                                px-2.5
                                text-[11px]
                                text-gray-700
                                outline-none
                                transition
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-100
                                dark:border-gray-600
                                dark:bg-gray-800
                                dark:text-gray-200
                                dark:[color-scheme:dark]
                                dark:focus:border-indigo-400
                                dark:focus:ring-indigo-900/40
                            "
                        >
                            {STATUS_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                )
                            )}
                        </select>
                    </div> */}
                </div>
            </div>

            <div
                className="
                    relative
                    flex
                    min-h-[280px]
                    flex-1
                    items-center
                    justify-center
                    py-3
                "
            >
                {response.loading ? (
                    <div
                        className="
                            flex
                            h-[250px]
                            w-[250px]
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-gray-200
                            bg-gray-50
                            text-center
                            text-[10px]
                            text-gray-400
                            dark:border-gray-700
                            dark:bg-gray-800
                            dark:text-gray-500
                        "
                    >
                        Loading...
                    </div>
                ) : response.error ? (
                    <div
                        className="
                            flex
                            h-[250px]
                            w-full
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
                ) : data.length > 0 ? (
                    <div
                        ref={donutRef}
                        className="
                            relative
                            h-[250px]
                            w-[250px]
                            shrink-0
                            cursor-pointer
                            rounded-full
                            transition-transform
                            duration-200
                        "
                        style={{
                            background:
                                donutGradient,
                            transform:
                                hoveredItem
                                    ? "scale(1.015)"
                                    : "scale(1)",
                        }}
                        onMouseMove={
                            handleDonutMouseMove
                        }
                        onMouseLeave={() =>
                            setHoveredItem(null)
                        }
                    >
                        <div
                            className="
                                absolute
                                inset-[50px]
                                z-10
                                flex
                                flex-col
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-center
                                shadow-sm
                                dark:bg-gray-900
                            "
                        >
                            <span
                                className="
                                    text-[9px]
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-gray-400
                                    dark:text-gray-500
                                "
                            >
                                {status}
                            </span>

                            <strong
                                className="
                                    mt-1
                                    text-[25px]
                                    font-bold
                                    leading-7
                                    text-gray-900
                                    dark:text-gray-100
                                "
                            >
                                {formatCount(
                                    totalApplications
                                )}
                            </strong>

                            <span
                                className="
                                    mt-1
                                    text-[8px]
                                    text-gray-400
                                    dark:text-gray-500
                                "
                            >
                                Applications
                            </span>
                        </div>

                        {hoveredItem && (
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    left-1/2
                                    top-1/2
                                    z-50
                                    w-[195px]
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-white
                                    p-3
                                    shadow-xl
                                    dark:border-gray-600
                                    dark:bg-gray-800
                                "
                            >
                                <div
                                    className="
                                        mb-2
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
                                                CHART_COLORS[
                                                hoveredItem
                                                    .index %
                                                CHART_COLORS.length
                                                ],
                                        }}
                                    />

                                    <div
                                        className="
                                            truncate
                                            text-xs
                                            font-semibold
                                            text-gray-900
                                            dark:text-gray-100
                                        "
                                    >
                                        {
                                            hoveredItem.loanType
                                        }
                                    </div>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        py-1
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
                                            hoveredItem.count
                                        )}
                                    </strong>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        py-1
                                        text-[10px]
                                    "
                                >
                                    <span
                                        className="
                                            text-gray-500
                                            dark:text-gray-400
                                        "
                                    >
                                        Amount
                                    </span>

                                    <strong
                                        className="
                                            text-gray-900
                                            dark:text-gray-100
                                        "
                                    >
                                        {formatAmount(
                                            hoveredItem.amount
                                        )}
                                    </strong>
                                </div>

                                <div
                                    className="
                                        mt-1
                                        border-t
                                        border-gray-100
                                        pt-1.5
                                        text-[9px]
                                        text-gray-400
                                        dark:border-gray-700
                                        dark:text-gray-500
                                    "
                                >
                                    {status} applications
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className="
                            flex
                            h-[250px]
                            w-full
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-dashed
                            border-gray-300
                            bg-gray-50
                            text-xs
                            text-gray-400
                            dark:border-gray-700
                            dark:bg-gray-800
                            dark:text-gray-500
                        "
                    >
                        No {status.toLowerCase()} loan
                        data available
                    </div>
                )}
            </div>

            <div
                className="
                    shrink-0
                    border-t
                    border-gray-200
                    pt-3
                    dark:border-gray-700
                "
            >
                <div className="grid grid-cols-2">
                    <div
                        className="
                            border-r
                            border-gray-200
                            px-3
                            py-1
                            text-center
                            dark:border-gray-700
                        "
                    >
                        <div
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
                        </div>

                        <div
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
                                totalApplications
                            )}
                        </div>
                    </div>

                    <div
                        className="
                            px-3
                            py-1
                            text-center
                        "
                    >
                        <div
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
                        </div>

                        <div
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LoanTypeDistribution;