// admin-react/src/pages/Dashboard/index.jsx

import React from "react";

import ApplicationStatus from "./components/ApplicationStatus";
import LoanTypeDistribution from "./components/LoanTypeDistribution";
import MonthlyTrend from "./components/MonthlyTrend";
import ApplicationFunnel from "./components/ApplicationFunnel";

function Dashboard() {
    return (
        <div className="w-full space-y-6 p-5">

            {/* Top row */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ApplicationStatus />
                <LoanTypeDistribution />
            </div>

            {/* Monthly Trend */}
            <div className="w-full">
                <MonthlyTrend />
            </div>

            {/* Application Funnel */}
            <div className="w-full">
                <ApplicationFunnel />
            </div>

        </div>
    );
}

export default Dashboard;