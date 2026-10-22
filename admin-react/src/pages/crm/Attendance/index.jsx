
// admin-react/src/pages/Attendance/index.jsx

import { lazy, Suspense, useEffect, useState } from 'react'

import AttendanceSummary from './components/AttendanceSummary'
import AttendanceCalendar from './components/AttendanceCalendar'
import LeaveManagement from './components/LeaveManagement'

import { getMyAttendance } from './api'

const AttendanceDetailsModal = lazy(
    () => import('./components/AttendanceDetailsModal')
)

// =============================================================
// FORMAT MONTH FOR API: YYYY-MM
// =============================================================

const getMonthKey = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')

    return `${year}-${month}`
}

// =============================================================
// COMPONENT
// =============================================================

function Attendance() {
    const today = new Date()

    const [currentMonth, setCurrentMonth] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    )

    const [attendanceRecords, setAttendanceRecords] = useState([])
    const [dailySummary, setDailySummary] = useState([])
    const [monthlySummary, setMonthlySummary] = useState(null)

    const [selectedAttendance, setSelectedAttendance] = useState(null)
    const [loading, setLoading] = useState(true)

    const selectedMonthKey = getMonthKey(currentMonth)

    // =============================================================
    // FETCH ATTENDANCE FOR SELECTED MONTH
    // =============================================================

    useEffect(() => {
        let isActive = true

        const fetchAttendance = async () => {
            setLoading(true)

            try {
                const response = await getMyAttendance(selectedMonthKey)

                // The API helper normally returns the backend response
                // body directly. This also supports an Axios response.
                const payload =
                    response?.data && !Array.isArray(response.data)
                        ? response.data
                        : response

                const records = Array.isArray(payload?.data)
                    ? payload.data
                    : Array.isArray(payload?.attendance)
                        ? payload.attendance
                        : Array.isArray(payload?.attendance_records)
                            ? payload.attendance_records
                            : []

                const dailyRecords = Array.isArray(payload?.daily_summary)
                    ? payload.daily_summary
                    : []

                if (!isActive) return

                setAttendanceRecords(records)
                setDailySummary(dailyRecords)
                setMonthlySummary(payload?.monthly_summary ?? null)
            } catch (error) {
                if (!isActive) return

                console.error(
                    `Failed to fetch attendance for ${selectedMonthKey}:`,
                    error
                )

                setAttendanceRecords([])
                setDailySummary([])
                setMonthlySummary(null)
            } finally {
                if (isActive) {
                    setLoading(false)
                }
            }
        }

        fetchAttendance()

        return () => {
            isActive = false
        }
    }, [selectedMonthKey])

    // =============================================================
    // MONTH CHANGE
    // =============================================================

    const handleMonthChange = (nextMonth) => {
        setCurrentMonth(
            new Date(
                nextMonth.getFullYear(),
                nextMonth.getMonth(),
                1
            )
        )

        setSelectedAttendance(null)
    }

    // =============================================================
    // RENDER
    // =============================================================

    return (
        <div className="p-4 sm:p-6 space-y-5">
            {/* =====================================================
                ATTENDANCE SUMMARY
            ===================================================== */}

            <AttendanceSummary
                attendanceRecords={attendanceRecords}
                dailySummary={dailySummary}
                monthlySummary={monthlySummary}
                currentMonth={currentMonth}
                loading={loading}
            />

            {/* =====================================================
                ATTENDANCE CALENDAR + LEAVE MANAGEMENT
            ===================================================== */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {/* Attendance Calendar */}

                <div>
                    <AttendanceCalendar
                        attendanceRecords={attendanceRecords}
                        dailySummary={dailySummary}
                        monthlySummary={monthlySummary}
                        currentMonth={currentMonth}
                        setCurrentMonth={handleMonthChange}
                        loading={loading}
                        onDateSelect={setSelectedAttendance}
                    />
                </div>

                {/* Leave Management stays independent */}

                <div>
                    <LeaveManagement />
                </div>
            </div>

            {/* =====================================================
                ATTENDANCE DETAILS MODAL
            ===================================================== */}

            <Suspense fallback={null}>
                {selectedAttendance && (
                    <AttendanceDetailsModal
                        attendance={selectedAttendance}
                        onClose={() => setSelectedAttendance(null)}
                    />
                )}
            </Suspense>
        </div>
    )
}

export default Attendance
