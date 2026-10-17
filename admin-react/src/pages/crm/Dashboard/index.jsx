// admin-react/src/pages/Dashboard/index.jsx

import { lazy, Suspense } from "react";

const ApplicationStatus = lazy(
    () => import("./components/ApplicationStatus")
);

const LoanTypeDistribution = lazy(
    () => import("./components/LoanTypeDistribution")
);

const MonthlyTrend = lazy(
    () => import("./components/MonthlyTrend")
);

const ApplicationFunnel = lazy(
    () => import("./components/ApplicationFunnel")
);

function Dashboard() {
    return (
        <div className="w-full space-y-6 p-5">

            <Suspense fallback={null}>

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

            </Suspense>

        </div>
    );
}

export default Dashboard;