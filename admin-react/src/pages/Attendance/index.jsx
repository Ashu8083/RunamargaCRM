// admin-react\src\pages\Attendance\index.jsx
import { useState } from 'react'

import AttendanceSummary from './components/AttendanceSummary'
import AttendanceCalendar from './components/AttendanceCalendar'
import AttendanceDetailsModal from './components/AttendanceDetailsModal'
import LeaveManagement from './components/LeaveManagement'


function Attendance() {

    const [selectedAttendance, setSelectedAttendance] = useState(null)


    return (
        <div className="p-4 sm:p-6 space-y-5">


            {/* =====================================================
                ATTENDANCE SUMMARY
            ===================================================== */}

            <AttendanceSummary />


            {/* =====================================================
                ATTENDANCE + LEAVE MANAGEMENT
            ===================================================== */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                {/* Attendance Calendar */}

                <div>

                    <AttendanceCalendar
                        onDateSelect={(attendance) => {
                            setSelectedAttendance(attendance)
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
                    onClose={() => setSelectedAttendance(null)}
                />

            )}

        </div>
    )
}

export default Attendance