// admin-react\src\pages\Attendance\components\AttendanceSummary.jsx
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'

function AttendanceSummary() {

    const summary = [
        {
            label: 'Present Days',
            value: '18',
            description: 'This month',
            icon: CheckCircleIcon,
            iconClass: 'text-success',
            iconBg: 'bg-success/10',
        },
        {
            label: 'Absent Days',
            value: '2',
            description: 'This month',
            icon: XCircleIcon,
            iconClass: 'text-error',
            iconBg: 'bg-error/10',
        },
        {
            label: 'Working Days',
            value: '20',
            description: 'This month',
            icon: CalendarDaysIcon,
            iconClass: 'text-primary',
            iconBg: 'bg-primary/10',
        },
        {
            label: 'Average Hours',
            value: '8h 34m',
            description: 'Per working day',
            icon: ClockIcon,
            iconClass: 'text-info',
            iconBg: 'bg-info/10',
        },
    ]


    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

            {summary.map((item) => {

                const Icon = item.icon

                return (
                    <div
                        key={item.label}
                        className="card bg-base-100 border border-base-300 shadow-sm"
                    >

                        <div className="card-body p-4">

                            <div className="flex items-start justify-between gap-3">

                                <div>

                                    <p className="text-xs font-medium text-base-content/60">
                                        {item.label}
                                    </p>

                                    <p className="text-xl sm:text-2xl font-semibold mt-1">
                                        {item.value}
                                    </p>

                                    <p className="text-[11px] text-base-content/50 mt-1">
                                        {item.description}
                                    </p>

                                </div>


                                <div
                                    className={`
                                        w-9 h-9
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                        ${item.iconBg}
                                    `}
                                >

                                    <Icon
                                        className={`w-5 h-5 ${item.iconClass}`}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>
                )

            })}

        </div>
    )
}

export default AttendanceSummary