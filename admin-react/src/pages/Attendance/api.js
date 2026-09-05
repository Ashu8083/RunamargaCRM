// admin-react/src/pages/Attendance/api.js

import apiClient from '../../app/apiClient'


// =============================================================
// GET MY ATTENDANCE
// =============================================================

export const getMyAttendance = async () => {

    const response = await apiClient.get(
        '/attendance'
    )

    return response.data
}