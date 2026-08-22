import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js'

import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
)


function MonthlyDisbursement() {

    // ---------------------------------------------------------
    // CHART OPTIONS
    // ---------------------------------------------------------

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false,
            },

            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },

        scales: {
            y: {
                beginAtZero: true,

                ticks: {
                    callback: function (value) {
                        return `₹${value} L`
                    },
                },
            },

            x: {
                grid: {
                    display: false,
                },
            },
        },
    }


    // ---------------------------------------------------------
    // CHART DATA
    // ---------------------------------------------------------

    const labels = [
        'Mar 26',
        'Apr 26',
        'May 26',
        'Jun 26',
        'Jul 26',
        'Aug 26',
    ]


    const data = {
        labels,

        datasets: [
            {
                fill: true,

                label: 'Monthly Disbursement',

                data: [
                    330,
                    150,
                    95,
                    285,
                    240,
                    170,
                ],

                borderColor: 'rgb(143, 212, 0)',

                backgroundColor: 'rgba(143, 212, 0, 0.15)',

                pointBackgroundColor: 'rgb(143, 212, 0)',

                pointBorderColor: 'rgb(143, 212, 0)',

                pointRadius: 4,

                pointHoverRadius: 6,

                borderWidth: 2,

                tension: 0.4,
            },
        ],
    }


    return (

        <div className="card bg-base-100 shadow-md">

            <div className="card-body">

                {/* -------------------------------------------------
                    HEADER
                ------------------------------------------------- */}

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <h2 className="card-title text-base">
                            Monthly Disbursement Trend
                        </h2>

                        <span className="badge badge-success badge-outline">
                            Last 6 Months
                        </span>

                    </div>


                    <select className="select select-bordered select-sm">

                        <option>
                            Last 6 Months
                        </option>

                        <option>
                            Last 12 Months
                        </option>

                        <option>
                            This Year
                        </option>

                    </select>

                </div>


                {/* -------------------------------------------------
                    CHART
                ------------------------------------------------- */}

                <div className="h-[300px] mt-5">

                    <Line
                        data={data}
                        options={options}
                    />

                </div>


                {/* -------------------------------------------------
                    FOOTER
                ------------------------------------------------- */}

                <div className="divider"></div>

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-base-content/60">
                            Total Disbursed
                        </p>

                        <p className="text-xs text-base-content/40">
                            6 months with disbursements
                        </p>

                    </div>


                    <div className="text-success font-semibold">
                        ₹1306.99 L
                    </div>

                </div>

            </div>

        </div>

    )
}


export default MonthlyDisbursement