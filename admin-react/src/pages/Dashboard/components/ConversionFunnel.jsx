import React from 'react'

function ConversionFunnel() {

    const funnelData = [
        {
            label: 'Total Leads',
            value: '1,899',
            percentage: '100%',
            width: '100%',
        },
        {
            label: 'In Process',
            value: '723',
            percentage: '38.1%',
            width: '70%',
        },
        {
            label: 'Login',
            value: '80',
            percentage: '4.2%',
            width: '25%',
        },
        {
            label: 'Sanctioned',
            value: '19',
            percentage: '1.0%',
            width: '15%',
        },
        {
            label: 'Rejected',
            value: '1,077',
            percentage: '56.7%',
            width: '60%',
        },
        {
            label: 'Disbursed',
            value: '12',
            percentage: '0.6%',
            width: '12%',
        },
    ]

    return (
        <div className="card bg-base-100 shadow-md">

            <div className="card-body">

                {/* Header */}
                <div className="flex items-center justify-between">

                    <h2 className="card-title text-base">
                        Conversion Funnel
                    </h2>

                    <select className="select select-bordered select-sm">
                        <option>August 2026</option>
                        <option>July 2026</option>
                        <option>June 2026</option>
                    </select>

                </div>


                {/* Funnel rows */}
                <div className="mt-5 space-y-4">

                    {funnelData.map((item) => (

                        <div
                            key={item.label}
                            className="flex items-center gap-3"
                        >

                            <div className="w-24 text-sm font-medium">
                                {item.label}
                            </div>

                            <div className="flex-1">

                                <div className="h-6 w-full rounded-md bg-base-200 overflow-hidden">

                                    <div
                                        className="h-full rounded-md"
                                        style={{
                                            width: item.width,
                                            backgroundColor: 'rgb(143, 212, 0)',
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="w-12 text-right text-sm font-semibold">
                                {item.value}
                            </div>

                            <div className="w-12 text-right text-xs text-base-content/50">
                                {item.percentage}
                            </div>

                        </div>

                    ))}

                </div>


                <div className="divider"></div>


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

export default ConversionFunnel