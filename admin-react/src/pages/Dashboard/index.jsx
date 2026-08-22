import React from 'react'

import ConversionOverview from './components/ConversionOverview'
import ConversionFunnel from './components/ConversionFunnel'
import MonthlyDisbursement from './components/MonthlyDisbursement'
import LoanTypeDistribution from './components/LoanTypeDistribution'

function Dashboard() {
    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <ConversionOverview />

                <ConversionFunnel />
                <MonthlyDisbursement />
                <LoanTypeDistribution />



            </div>

        </div>
    )
}

export default Dashboard