import React from 'react'

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js'

import { Doughnut } from 'react-chartjs-2'


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)


function LoanTypeDistribution() {

    const loanTypes = [

        {
            name: 'Personal Loan',
            value: 25,
            color: '#8FD400',
        },

        {
            name: 'Business Loan',
            value: 15,
            color: '#2196F3',
        },

        {
            name: 'Home Loan',
            value: 12,
            color: '#FFC107',
        },

        {
            name: 'Loan Against Property',
            value: 30,
            color: '#FF4081',
        },

        {
            name: 'Education Loan',
            value: 5,
            color: '#9C27B0',
        },

        {
            name: 'Car Loan',
            value: 4,
            color: '#FF9800',
        },

        {
            name: 'Gold Loan',
            value: 3,
            color: '#00BCD4',
        },

        {
            name: 'Credit Card',
            value: 4,
            color: '#F44336',
        },

        {
            name: 'Agricultural Loan',
            value: 2,
            color: '#4CAF50',
        },

    ]


    const total = loanTypes.reduce(
        (sum, item) => sum + item.value,
        0
    )


    // =========================================================
    // DONUT DATA
    // =========================================================

    const data = {

        labels: loanTypes.map(
            item => item.name
        ),

        datasets: [

            {
                data: loanTypes.map(
                    item => item.value
                ),

                backgroundColor: loanTypes.map(
                    item => item.color
                ),

                borderColor: '#ffffff',

                borderWidth: 2,
            },

        ],
    }


    const options = {

        responsive: true,

        maintainAspectRatio: false,

        cutout: '62%',

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


    return (

        <div className="card bg-base-100 shadow-md rounded-2xl">

            <div className="card-body p-5">


                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <h2 className="card-title text-base">
                            Loan Type Distribution
                        </h2>

                        <span className="badge badge-success badge-outline">
                            Aug 2026
                        </span>

                    </div>

                </div>


                {/* =====================================================
                    MONTH SELECTOR
                ===================================================== */}

                <select className="select select-bordered select-sm w-full mt-3">

                    <option>
                        Aug 2026
                    </option>

                    <option>
                        Jul 2026
                    </option>

                    <option>
                        Jun 2026
                    </option>

                    <option>
                        May 2026
                    </option>

                </select>


                {/* =====================================================
                    DONUT
                ===================================================== */}

                <div className="flex justify-center py-5">

                    <div className="relative w-44 h-44">

                        <Doughnut
                            data={data}
                            options={options}
                        />


                        {/* CENTER */}

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                            <div className="text-center">

                                <p className="text-xs text-base-content/50">
                                    Total
                                </p>

                                <p className="text-xl font-semibold">
                                    {total}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    LEGEND
                ===================================================== */}

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">

                    {loanTypes.map((loan) => (

                        <div
                            key={loan.name}
                            className="flex items-center gap-2 text-xs"
                        >

                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{
                                    backgroundColor: loan.color,
                                }}
                            />

                            <span className="truncate">
                                {loan.name}
                            </span>

                        </div>

                    ))}

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <div className="divider my-3"></div>


                <div className="flex justify-between items-center">

                    <div>

                        <p className="text-sm text-base-content/60">
                            Total Disbursed
                        </p>

                        <p className="text-xs text-base-content/40">
                            25 loans
                        </p>

                    </div>


                    <div
                        className="font-semibold"
                        style={{
                            color: 'rgb(143, 212, 0)',
                        }}
                    >
                        ₹172.66 L
                    </div>

                </div>

            </div>

        </div>
    )
}


export default LoanTypeDistribution 