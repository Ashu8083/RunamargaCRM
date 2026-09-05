// admin-react/src/pages/Attendance/index.jsx

import { useEffect, useState } from 'react'

import AttendanceSummary from './components/AttendanceSummary'
import AttendanceCalendar from './components/AttendanceCalendar'
import AttendanceDetailsModal from './components/AttendanceDetailsModal'
import LeaveManagement from './components/LeaveManagement'

import { getMyAttendance } from './api'


function Attendance() {

    const today = new Date()

    const [currentMonth, setCurrentMonth] = useState(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        )
    )

    const [attendanceRecords, setAttendanceRecords] =
        useState([])

    const [selectedAttendance, setSelectedAttendance] =
        useState(null)

    const [loading, setLoading] = useState(true)


    // =============================================================
    // FETCH ATTENDANCE
    // =============================================================

    useEffect(() => {

        const fetchAttendance = async () => {

            try {

                setLoading(true)

                const response =
                    await getMyAttendance()

                setAttendanceRecords(
                    response?.data || []
                )

            } catch (error) {

                console.error(
                    'Failed to fetch attendance:',
                    error
                )

                setAttendanceRecords([])

            } finally {

                setLoading(false)

            }

        }

        fetchAttendance()

    }, [])


    return (

        <div className="p-4 sm:p-6 space-y-5">


            {/* =====================================================
                ATTENDANCE SUMMARY
            ===================================================== */}

            <AttendanceSummary
                attendanceRecords={attendanceRecords}
                currentMonth={currentMonth}
                loading={loading}
            />


            {/* =====================================================
                ATTENDANCE + LEAVE MANAGEMENT
            ===================================================== */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">


                {/* Attendance Calendar */}

                <div>

                    <AttendanceCalendar
                        attendanceRecords={attendanceRecords}
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                        loading={loading}
                        onDateSelect={(attendance) => {

                            setSelectedAttendance(
                                attendance
                            )

                        }}
                    />

                </div>


                {/* Leave Management */}

                <div>

                    <LeaveManagement />

                </div>

            </div>


            {/* =====================================================
                ATTENDANCE DETAILS MODAL
            ===================================================== */}

            {selectedAttendance && (

                <AttendanceDetailsModal
                    attendance={selectedAttendance}
                    onClose={() =>
                        setSelectedAttendance(null)
                    }
                />

            )}

        </div>

    )

}


export default Attendance