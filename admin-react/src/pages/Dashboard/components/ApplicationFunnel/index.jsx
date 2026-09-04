// admin-react/src/pages/Dashboard/components/ApplicationFunnel/index.jsx

import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowDownTrayIcon,
    CheckBadgeIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";

import LoanTypeDropdown from "../../../../components/GlobalModels/Filters/LoanTypeDropdown";
import { getApplicationFunnelData } from "./API";

const STAGE_CONFIG = {
    "In Process": {
        icon: ClockIcon,
        iconClass: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-50 dark:bg-amber-950/40",
        border: "border-amber-100 dark:border-amber-900/60",
        accent: "bg-amber-500",
    },

    Login: {
        icon: ClipboardDocumentCheckIcon,
        iconClass: "text-blue-600 dark:text-blue-400",
        iconBg: "bg-blue-50 dark:bg-blue-950/40",
        border: "border-blue-100 dark:border-blue-900/60",
        accent: "bg-blue-500",
    },

    Sanctioned: {
        icon: CheckBadgeIcon,
        iconClass: "text-violet-600 dark:text-violet-400",
        iconBg: "bg-violet-50 dark:bg-violet-950/40",
        border: "border-violet-100 dark:border-violet-900/60",
        accent: "bg-violet-500",
    },

    Disbursed: {
        icon: ArrowDownTrayIcon,
        iconClass: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
        border: "border-emerald-100 dark:border-emerald-900/60",
        accent: "bg-emerald-500",
    },

    Rejected: {
        icon: ExclamationTriangleIcon,
        iconClass: "text-rose-600 dark:text-rose-400",
        iconBg: "bg-rose-50 dark:bg-rose-950/40",
        border: "border-rose-100 dark:border-rose-900/60",
        accent: "bg-rose-500",
    },
};

const SUCCESS_STAGES = [
    "In Process",
    "Login",
    "Sanctioned",
    "Disbursed",
];

const formatCount = (value) =>
    Number(value || 0).toLocaleString("en-IN");

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

function ApplicationFunnel() {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [loanType, setLoanType] = useState("");

    const [response, setResponse] = useState({
        data: [],
        totalApplications: 0,
        totalAmount: 0,
        loading: true,
        error: null,
    });

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
                    await getApplicationFunnelData({
                        fromDate,
                        toDate,
                        loanType,
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
                        Number(result?.totalAmount) || 0,
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
                    loading: false,
                    error:
                        error?.message ||
                        "Unable to load application funnel data.",
                });
            }
        };

        fetchData();

        return () => {
            active = false;
        };
    }, [fromDate, toDate, loanType]);

    const data = response.data || [];

    const stageMap = useMemo(() => {
        return data.reduce((accumulator, item) => {
            accumulator[item.status] = item;
            return accumulator;
        }, {});
    }, [data]);

    const successStages = useMemo(() => {
        return SUCCESS_STAGES.map((status) => ({
            status,
            ...(stageMap[status] || {
                count: 0,
                amount: 0,
            }),
        }));
    }, [stageMap]);

    const rejectedStage = stageMap["Rejected"] || {
        status: "Rejected",
        count: 0,
        amount: 0,
    };

    const renderStage = (
        stage,
        compact = false
    ) => {
        const config =
            STAGE_CONFIG[stage.status] ||
            STAGE_CONFIG["In Process"];

        const Icon = config.icon;

        return (
            <div
                className={[
                    "relative w-full overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-900",
                    config.border,
                    compact
                        ? "min-h-[112px] sm:min-h-[124px]"
                        : "min-h-[118px] sm:min-h-[132px]",
                ].join(" ")}
            >
                {/* Accent */}
                <div
                    className={`absolute inset-x-0 top-0 h-1 rounded-t-xl ${config.accent}`}
                />

                <div
                    className={[
                        "flex h-full flex-col items-center justify-center text-center",
                        compact
                            ? "px-3 py-4"
                            : "px-4 py-4",
                    ].join(" ")}
                >
                    {/* Status Icon */}
                    <div
                        className={[
                            "mb-2 flex h-9 w-9 items-center justify-center rounded-lg",
                            config.iconBg,
                        ].join(" ")}
                    >
                        <Icon
                            className={[
                                "h-5 w-5",
                                config.iconClass,
                            ].join(" ")}
                        />
                    </div>

                    {/* Status */}
                    <p
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.08em]
                            text-gray-500
                            dark:text-gray-400
                            sm:text-[11px]
                        "
                    >
                        {stage.status}
                    </p>

                    {/* Count */}
                    <p
                        className="
                            mt-1
                            text-lg
                            font-bold
                            leading-tight
                            text-gray-900
                            dark:text-gray-100
                            sm:text-xl
                        "
                    >
                        {formatCount(stage.count)}
                    </p>

                    {/* Amount */}
                    <p
                        className="
                            mt-0.5
                            text-xs
                            font-semibold
                            text-gray-500
                            dark:text-gray-400
                            sm:text-sm
                        "
                    >
                        {formatAmount(stage.amount)}
                    </p>
                </div>
            </div>
        );
    };

    const renderHorizontalConnector = () => (
        <div
            className="
                hidden
                shrink-0
                items-center
                justify-center
                px-2
                lg:flex
            "
        >
            <div
                className="
                    h-px
                    w-7
                    bg-gray-300
                    dark:bg-gray-700
                    xl:w-10
                "
            />
        </div>
    );

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
                        xl:flex-row
                        xl:items-center
                        xl:justify-between
                    "
                >
                    {/* Title */}
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
                            Application Funnel
                        </h2>
                    </div>

                    {/* Filters */}
                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >
                        {/* From Date */}
                        <div
                            className="
                                flex
                                h-8
                                items-center
                                rounded-md
                                border
                                border-gray-300
                                bg-white
                                px-2.5
                                transition
                                hover:border-gray-400
                                focus-within:border-indigo-500
                                focus-within:ring-2
                                focus-within:ring-indigo-100
                                dark:border-gray-600
                                dark:bg-gray-800
                                dark:hover:border-gray-500
                                dark:focus-within:border-indigo-400
                                dark:focus-within:ring-indigo-900/40
                            "
                        >
                            <input
                                type="date"
                                value={fromDate}
                                max={
                                    toDate ||
                                    undefined
                                }
                                onChange={(event) =>
                                    setFromDate(
                                        event.target.value
                                    )
                                }
                                className="
                                    w-[118px]
                                    bg-transparent
                                    text-[11px]
                                    font-medium
                                    text-gray-700
                                    outline-none
                                    dark:text-gray-200
                                    dark:[color-scheme:dark]
                                "
                                aria-label="From Date"
                            />
                        </div>

                        {/* To Date */}
                        <div
                            className="
                                flex
                                h-8
                                items-center
                                rounded-md
                                border
                                border-gray-300
                                bg-white
                                px-2.5
                                transition
                                hover:border-gray-400
                                focus-within:border-indigo-500
                                focus-within:ring-2
                                focus-within:ring-indigo-100
                                dark:border-gray-600
                                dark:bg-gray-800
                                dark:hover:border-gray-500
                                dark:focus-within:border-indigo-400
                                dark:focus-within:ring-indigo-900/40
                            "
                        >
                            <input
                                type="date"
                                value={toDate}
                                min={
                                    fromDate ||
                                    undefined
                                }
                                onChange={(event) =>
                                    setToDate(
                                        event.target.value
                                    )
                                }
                                className="
                                    w-[118px]
                                    bg-transparent
                                    text-[11px]
                                    font-medium
                                    text-gray-700
                                    outline-none
                                    dark:text-gray-200
                                    dark:[color-scheme:dark]
                                "
                                aria-label="To Date"
                            />
                        </div>

                        {/* Loan Type */}
                        <div className="min-w-[150px]">
                            <LoanTypeDropdown
                                label=""
                                value={loanType}
                                onChange={setLoanType}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Funnel */}
            <div
                className="
                    min-h-0
                    flex-1
                    px-4
                    py-4
                    sm:px-5
                "
            >
                {response.loading ? (
                    <div
                        className="
                            flex
                            min-h-[300px]
                            items-center
                            justify-center
                        "
                    >
                        <span
                            className="
                                text-xs
                                text-gray-400
                                dark:text-gray-500
                            "
                        >
                            Loading...
                        </span>
                    </div>
                ) : response.error ? (
                    <div
                        className="
                            flex
                            min-h-[300px]
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
                ) : (
                    <div
                        className="
                            rounded-xl
                            bg-gray-50/70
                            p-4
                            dark:bg-gray-800/50
                            sm:p-5
                        "
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-full max-w-5xl">
                                {/* Desktop Funnel */}
                                <div
                                    className="
                                        hidden
                                        lg:flex
                                        lg:items-center
                                        lg:justify-center
                                    "
                                >
                                    {successStages.map(
                                        (
                                            stage,
                                            index
                                        ) => (
                                            <React.Fragment
                                                key={
                                                    stage.status
                                                }
                                            >
                                                <div className="w-[180px] xl:w-[200px]">
                                                    {renderStage(
                                                        stage
                                                    )}
                                                </div>

                                                {index <
                                                    successStages.length -
                                                        1 &&
                                                    renderHorizontalConnector()}
                                            </React.Fragment>
                                        )
                                    )}
                                </div>

                                {/* Mobile / Tablet Funnel */}
                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        lg:hidden
                                    "
                                >
                                    {successStages.map(
                                        (
                                            stage,
                                            index
                                        ) => (
                                            <React.Fragment
                                                key={
                                                    stage.status
                                                }
                                            >
                                                <div className="w-full max-w-[340px]">
                                                    {renderStage(
                                                        stage,
                                                        true
                                                    )}
                                                </div>

                                                {index <
                                                    successStages.length -
                                                        1 && (
                                                    <div
                                                        className="
                                                            flex
                                                            h-9
                                                            items-center
                                                            justify-center
                                                        "
                                                    >
                                                        <ChevronDownIcon
                                                            className="
                                                                h-4
                                                                w-4
                                                                text-gray-400
                                                                dark:text-gray-500
                                                            "
                                                        />
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        )
                                    )}
                                </div>

                                {/* Unsuccessful Separator */}
                                <div
                                    className="
                                        my-5
                                        flex
                                        items-center
                                        gap-3
                                        sm:my-6
                                    "
                                >
                                    <div
                                        className="
                                            h-px
                                            flex-1
                                            bg-gray-200
                                            dark:bg-gray-700
                                        "
                                    />

                                    <span
                                        className="
                                            rounded-full
                                            border
                                            border-gray-200
                                            bg-white
                                            px-3
                                            py-1
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-gray-400
                                            dark:border-gray-700
                                            dark:bg-gray-900
                                            dark:text-gray-500
                                        "
                                    >
                                        Unsuccessful
                                    </span>

                                    <div
                                        className="
                                            h-px
                                            flex-1
                                            bg-gray-200
                                            dark:bg-gray-700
                                        "
                                    />
                                </div>

                                {/* Rejected */}
                                <div className="mx-auto w-full max-w-[300px]">
                                    {renderStage(
                                        rejectedStage,
                                        true
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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

export default ApplicationFunnel;