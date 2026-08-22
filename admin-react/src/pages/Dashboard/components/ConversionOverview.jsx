import React from 'react'

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js'

import { Pie } from 'react-chartjs-2'

import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import WifiIcon from '@heroicons/react/24/outline/WifiIcon'


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)


function ConversionOverview() {

    // =========================================================
    // PIE CHART
    // =========================================================

    const pieData = {
        labels: [
            'Inprocess',
            'Login',
            'Sanctioned',
            'Disbursed',
            'Rejected',
        ],

        datasets: [
            {
                data: [
                    3699,
                    509,
                    18,
                    25,
                    3113,
                ],

                backgroundColor: [
                    '#f9a311',
                    '#4285f4',
                    '#20c997',
                    '#00a878',
                    '#f04444',
                ],

                borderColor: '#ffffff',

                borderWidth: 3,
            },
        ],
    }


    const pieOptions = {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false,
            },

            tooltip: {
                callbacks: {
                    label: function (context) {
                        return ` ${context.label}: ${context.raw}`
                    },
                },
            },

        },
    }


    // =========================================================
    // STATUS DATA
    // =========================================================

    const statusData = [

        {
            label: 'Inprocess',
            value: '3,699',
            amount: '₹149.3 Cr',
            width: '100%',

            icon: ClockIcon,

            iconClass: 'bg-[#f9a311]',
            barClass: 'bg-[#f9a311]',
            trackClass: 'bg-[#fdf0d7]',
            amountClass: 'bg-[#fff4df] text-[#f9a311]',
        },

        {
            label: 'Login',
            value: '509',
            amount: '₹185.2 Cr',
            width: '25%',

            icon: ArrowRightOnRectangleIcon,

            iconClass: 'bg-[#4285f4]',
            barClass: 'bg-[#4285f4]',
            trackClass: 'bg-[#e4edfc]',
            amountClass: 'bg-[#edf3ff] text-[#4285f4]',
        },

        {
            label: 'Sanctioned',
            value: '18',
            amount: '₹2.9 Cr',
            width: '1%',

            icon: CheckCircleIcon,

            iconClass: 'bg-[#20c997]',
            barClass: 'bg-[#20c997]',
            trackClass: 'bg-[#e3f7f0]',
            amountClass: 'bg-[#e8faf4] text-[#00a878]',
        },

        {
            label: 'Disbursed',
            value: '25',
            amount: '₹1.7 Cr',
            width: '1%',

            icon: null,

            iconClass: 'bg-[#00a878]',
            barClass: 'bg-[#00a878]',
            trackClass: 'bg-[#e1f4ee]',
            amountClass: 'bg-[#e7f8f2] text-[#00a878]',
        },

        {
            label: 'Rejected',
            value: '3,113',
            amount: '₹191.9 Cr',
            width: '90%',

            icon: XCircleIcon,

            iconClass: 'bg-[#f04444]',
            barClass: 'bg-[#f04444]',
            trackClass: 'bg-[#fde5e5]',
            amountClass: 'bg-[#fff0f0] text-[#f04444]',
        },

    ]


    return (

        <div className="card bg-base-100 shadow-md rounded-2xl">

            <div className="card-body p-4 sm:p-5">


                {/* =====================================================
                    TOP FILTER BAR
                ===================================================== */}

                <div className="flex flex-wrap items-center justify-end gap-2 mb-4">

                    <button
                        type="button"
                        className="text-sm text-base-content/40 hover:text-base-content mr-1"
                    >
                        Clear Dates
                    </button>


                    {/* FROM */}

                    <div className="relative">

                        <label className="absolute -top-2 left-3 px-1 bg-base-100 text-xs text-base-content/50">
                            From
                        </label>

                        <input
                            type="date"
                            className="input input-bordered input-sm h-11 w-40 rounded-xl"
                        />

                    </div>


                    {/* TO */}

                    <div className="relative">

                        <label className="absolute -top-2 left-3 px-1 bg-base-100 text-xs text-base-content/50">
                            To
                        </label>

                        <input
                            type="date"
                            className="input input-bordered input-sm h-11 w-40 rounded-xl"
                        />

                    </div>


                    {/* WIFI */}

                    <button
                        type="button"
                        className="btn btn-circle btn-ghost btn-sm border border-base-300 relative"
                    >

                        <WifiIcon className="w-5 h-5 text-success" />

                        <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-success"></span>

                    </button>


                    {/* REFRESH */}

                    <button
                        type="button"
                        className="btn btn-circle btn-ghost btn-sm border border-base-300"
                    >

                        <ArrowPathIcon className="w-5 h-5 text-success" />

                    </button>

                </div>


                {/* =====================================================
                    CHART + STATUS
                ===================================================== */}

                <div className="rounded-2xl border border-base-200 shadow-sm p-4">

                    <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-3 items-center">


                        {/* PIE CHART */}

                        <div className="flex items-center justify-center">

                            <div className="w-[220px] h-[220px]">

                                <Pie
                                    data={pieData}
                                    options={pieOptions}
                                />

                            </div>

                        </div>


                        {/* STATUS */}

                        <div className="space-y-4">

                            {statusData.map((item) => {

                                const Icon = item.icon

                                return (

                                    <div
                                        key={item.label}
                                        className="flex items-center gap-3"
                                    >

                                        {/* ICON */}

                                        <div
                                            className={`
                                                w-12
                                                h-12
                                                shrink-0
                                                rounded-xl
                                                ${item.iconClass}
                                                flex
                                                items-center
                                                justify-center
                                                shadow-sm
                                            `}
                                        >

                                            {Icon ? (

                                                <Icon className="w-6 h-6 text-white" />

                                            ) : (

                                                <span className="text-xl font-bold text-white">
                                                    ₹
                                                </span>

                                            )}

                                        </div>


                                        {/* CONTENT */}

                                        <div className="flex-1 min-w-0">

                                            <div className="flex items-center justify-between gap-2 mb-1">

                                                <span className="text-sm text-base-content/70">
                                                    {item.label}
                                                </span>

                                                <div className="flex items-center gap-2">

                                                    <span className="text-base font-bold">
                                                        {item.value}
                                                    </span>

                                                    <span
                                                        className={`
                                                            px-2
                                                            py-1
                                                            rounded-md
                                                            text-xs
                                                            font-semibold
                                                            whitespace-nowrap
                                                            ${item.amountClass}
                                                        `}
                                                    >
                                                        {item.amount}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* PROGRESS */}

                                            <div
                                                className={`
                                                    w-full
                                                    h-2
                                                    rounded-full
                                                    overflow-hidden
                                                    ${item.trackClass}
                                                `}
                                            >

                                                <div
                                                    className={`
                                                        h-full
                                                        rounded-full
                                                        ${item.barClass}
                                                    `}
                                                    style={{
                                                        width: item.width
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    </div>

                                )

                            })}

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    LOAN FILTERS
                ===================================================== */}

                <div className="flex flex-wrap justify-center gap-2 pt-4">

                    <FilterButton active>
                        All
                    </FilterButton>

                    <FilterButton>
                        Personal Loan
                    </FilterButton>

                    <FilterButton>
                        Business Loan
                    </FilterButton>

                    <FilterButton>
                        Home Loan
                    </FilterButton>

                    <FilterButton>
                        Loan Against Property
                    </FilterButton>

                    <FilterButton>
                        Education Loan
                    </FilterButton>

                    <FilterButton>
                        Car Loan
                    </FilterButton>

                    <FilterButton>
                        Gold Loan
                    </FilterButton>

                    <FilterButton>
                        Credit Card
                    </FilterButton>

                    <FilterButton>
                        Agricultural Loan
                    </FilterButton>

                </div>

            </div>

        </div>
    )
}


/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({ children, active = false }) {

    return (

        <button
            type="button"

            className={`
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                border
                transition
                whitespace-nowrap

                ${active
                    ? 'text-white border-0 shadow-sm'
                    : 'bg-base-100 text-base-content/70 border-base-300 hover:bg-base-200'
                }
            `}

            style={
                active
                    ? {
                        backgroundColor: 'rgb(143, 212, 0)',
                    }
                    : {}
            }
        >
            {children}
        </button>

    )
}


export default ConversionOverview