// admin-react/src/pages/Analytics/AgentAnalytics/Trends/components/LoanStageDistribution.jsx

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts'

const STAGE_COLORS = {
    'In Process': '#3B82F6',
    Login: '#8B5CF6',
    Sanctioned: '#10B981',
    Disbursed: '#F59E0B',
    Rejected: '#EF4444',
}

const buildDistributionData = (stageDistribution = {}) => {
    const data = [
        {
            name: 'In Process',
            value: Number(stageDistribution?.inProcess ?? 0) || 0,
        },
        {
            name: 'Login',
            value: Number(stageDistribution?.login ?? 0) || 0,
        },
        {
            name: 'Sanctioned',
            value: Number(stageDistribution?.sanctioned ?? 0) || 0,
        },
        {
            name: 'Disbursed',
            value: Number(stageDistribution?.disbursed ?? 0) || 0,
        },
        {
            name: 'Rejected',
            value: Number(stageDistribution?.rejected ?? 0) || 0,
        },
    ]

    return data.filter((item) => item.value > 0)
}

const CenterLabel = ({ totalLeads }) => {
    return (
        <g>
            <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-900 text-[22px] font-semibold"
            >
                {totalLeads}
            </text>

            <text
                x="50%"
                y="56%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-500 text-[11px]"
            >
                Total Leads
            </text>
        </g>
    )
}

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
        return null
    }

    const item = payload[0]

    const total = Number(item?.payload?.total ?? 0) || 0
    const value = Number(item?.value ?? 0) || 0

    const percentage =
        total > 0
            ? ((value / total) * 100).toFixed(1)
            : '0.0'

    return (
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-sm font-medium text-gray-900">
                {item.name}
            </p>

            <p className="mt-1 text-xs text-gray-500">
                {value.toLocaleString()} applications
            </p>

            <p className="text-xs text-gray-500">
                {percentage}%
            </p>
        </div>
    )
}

const LoanStageDistribution = ({
    stageDistribution = {},
}) => {
    const distribution =
        buildDistributionData(stageDistribution)

    const totalLeads = Number(
        stageDistribution?.totalLeads ??
        stageDistribution?.total_leads ??
        0
    ) || 0

    const chartData = distribution.map((item) => ({
        ...item,
        total: totalLeads,
    }))

    return (
        <div className="w-full rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                    Loan Stage Distribution
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                    Current application stage distribution
                </p>
            </div>

            {chartData.length === 0 ? (
                <div className="flex h-[280px] items-center justify-center">
                    <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">
                            {totalLeads.toLocaleString()}
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                            Total Leads
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={78}
                                    outerRadius={105}
                                    paddingAngle={2}
                                    stroke="none"
                                    labelLine={false}
                                >
                                    {chartData.map((entry) => (
                                        <Cell
                                            key={`cell-${entry.name}`}
                                            fill={
                                                STAGE_COLORS[
                                                    entry.name
                                                ] ?? '#9CA3AF'
                                            }
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    content={<CustomTooltip />}
                                />

                                <CenterLabel
                                    totalLeads={totalLeads}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-3">
                        {chartData.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center gap-2"
                            >
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{
                                        backgroundColor:
                                            STAGE_COLORS[
                                                item.name
                                            ] ?? '#9CA3AF',
                                    }}
                                />

                                <span className="text-xs text-gray-600">
                                    {item.name}
                                </span>

                                <span className="text-xs font-semibold text-gray-900">
                                    {item.value.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LoanStageDistribution