// admin-react/src/pages/Analytics/AgentAnalytics/Trends/components/ApplicationTrend.jsx

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

const ApplicationTrend = ({ analytics = [] }) => {
    return (
        <div className="w-full rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                    Application Trend
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                    Daily application stage movement
                </p>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs text-gray-600">
                        Applications Created
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <span className="text-xs text-gray-600">
                        In Process
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <span className="text-xs text-gray-600">
                        Login
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-gray-600">
                        Sanctioned
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs text-gray-600">
                        Disbursed
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="text-xs text-gray-600">
                        Rejected
                    </span>
                </div>
            </div>

            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={analytics}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                        />

                        <XAxis
                            dataKey="date"
                            tick={{
                                fontSize: 11,
                                fill: '#6B7280',
                            }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            allowDecimals={false}
                            tick={{
                                fontSize: 11,
                                fill: '#6B7280',
                            }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            contentStyle={{
                                borderRadius: '10px',
                                border: '1px solid #E5E7EB',
                                boxShadow:
                                    '0 4px 12px rgba(0, 0, 0, 0.08)',
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="applicationCreated"
                            name="Applications Created"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="inProcess"
                            name="In Process"
                            stroke="#6366F1"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="login"
                            name="Login"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="sanctioned"
                            name="Sanctioned"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="disbursed"
                            name="Disbursed"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="rejected"
                            name="Rejected"
                            stroke="#EF4444"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default ApplicationTrend
