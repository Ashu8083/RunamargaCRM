// admin-react/src/pages/EmployeeManagement/Attendance/index.jsx

import { useEffect, useMemo, useState } from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'

import AttendanceTable from './components/AttendanceTable'
import AttendanceHistoryModal from './components/AttendanceHistoryModal'
import TodayAttendance from './components/TodayAttendance'


// =============================================================
// DEFAULT PROFILE IMAGES
// =============================================================

const DEFAULT_PROFILE_IMAGES = {
    male: '/default/male_profile.png',
    female: '/default/female_profile.png',
}


// =============================================================
// GET PROFILE IMAGE
// =============================================================

const getProfileImage = (employee) => {

    if (
        employee?.profileImage &&
        String(employee.profileImage).trim()
    ) {
        return employee.profileImage
    }


    return String(employee?.gender || '')
        .trim()
        .toLowerCase() === 'female'
        ? DEFAULT_PROFILE_IMAGES.female
        : DEFAULT_PROFILE_IMAGES.male

}


// =============================================================
// MONTH OPTIONS
// =============================================================

const MONTHS = [
    {
        value: '2026-01',
        label: 'January 2026',
    },
    {
        value: '2026-02',
        label: 'February 2026',
    },
    {
        value: '2026-03',
        label: 'March 2026',
    },
    {
        value: '2026-04',
        label: 'April 2026',
    },
    {
        value: '2026-05',
        label: 'May 2026',
    },
    {
        value: '2026-06',
        label: 'June 2026',
    },
    {
        value: '2026-07',
        label: 'July 2026',
    },
    {
        value: '2026-08',
        label: 'August 2026',
    },
]


// =============================================================
// MOCK ATTENDANCE DATA
// =============================================================

const INITIAL_ATTENDANCE = [

    // -----------------------------------------------------------
    // EMPLOYEE 001
    // -----------------------------------------------------------

    {
        id: 1,

        employeeId: 'EMP001',

        name: 'Aravind Kumar',

        email: 'aravind@runamarga.com',

        gender: 'male',

        profileImage: '',

        date: '2026-08-26',

        checkIn: {
            time: '09:42 AM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        checkOut: {
            time: '06:18 PM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        status: 'present',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 002
    // -----------------------------------------------------------

    {
        id: 2,

        employeeId: 'EMP002',

        name: 'Priya Sharma',

        email: 'priya@runamarga.com',

        gender: 'female',

        profileImage: '',

        date: '2026-08-26',

        checkIn: {
            time: '09:18 AM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        checkOut: {
            time: '06:05 PM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        status: 'present',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 003
    // -----------------------------------------------------------

    {
        id: 3,

        employeeId: 'EMP003',

        name: 'Suresh Kumar',

        email: 'suresh@runamarga.com',

        gender: 'male',

        profileImage: '',

        date: '2026-08-26',

        checkIn: {
            time: '10:16 AM',
            location: 'Bengaluru Client Location',
            locationType: 'outside',
            latitude: 12.9352,
            longitude: 77.6245,
        },

        checkOut: {
            time: '07:02 PM',
            location: 'Bengaluru Client Location',
            locationType: 'outside',
            latitude: 12.9352,
            longitude: 77.6245,
        },

        status: 'late',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 004
    // -----------------------------------------------------------

    {
        id: 4,

        employeeId: 'EMP004',

        name: 'Nayana Rao',

        email: 'nayana@runamarga.com',

        gender: 'female',

        profileImage: '',

        date: '2026-08-26',

        checkIn: {
            time: '09:35 AM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        checkOut: {
            time: '',
            location: '',
            locationType: '',
            latitude: null,
            longitude: null,
        },

        status: 'present',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 005
    // -----------------------------------------------------------

    {
        id: 5,

        employeeId: 'EMP005',

        name: 'Manoj Rao',

        email: 'manoj@runamarga.com',

        gender: 'male',

        profileImage: '',

        date: '2026-08-26',

        checkIn: {
            time: '',
            location: '',
            locationType: '',
            latitude: null,
            longitude: null,
        },

        checkOut: {
            time: '',
            location: '',
            locationType: '',
            latitude: null,
            longitude: null,
        },

        status: 'absent',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 006
    // -----------------------------------------------------------

    {
        id: 6,

        employeeId: 'EMP006',

        name: 'Asma Banu',

        email: 'asma@runamarga.com',

        gender: 'female',

        profileImage: '',

        date: '2026-08-26',

        checkIn: {
            time: '09:54 AM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        checkOut: {
            time: '06:20 PM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        status: 'present',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 007
    // -----------------------------------------------------------

    {
        id: 7,

        employeeId: 'EMP007',

        name: 'Rahul Verma',

        email: 'rahul@runamarga.com',

        gender: 'male',

        profileImage: '',

        date: '2026-08-26',

        checkIn: {
            time: '09:58 AM',
            location: 'Home',
            locationType: 'outside',
            latitude: 12.9850,
            longitude: 77.6050,
        },

        checkOut: {
            time: '06:10 PM',
            location: 'Home',
            locationType: 'outside',
            latitude: 12.9850,
            longitude: 77.6050,
        },

        status: 'wfh',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 008
    // -----------------------------------------------------------

    {
        id: 8,

        employeeId: 'EMP008',

        name: 'Sneha Reddy',

        email: 'sneha@runamarga.com',

        gender: 'female',

        profileImage: '',

        date: '2026-08-24',

        checkIn: {
            time: '09:32 AM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        checkOut: {
            time: '06:12 PM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        status: 'present',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 009
    // -----------------------------------------------------------

    {
        id: 9,

        employeeId: 'EMP009',

        name: 'Vikram Singh',

        email: 'vikram@runamarga.com',

        gender: 'male',

        profileImage: '',

        date: '2026-08-24',

        checkIn: {
            time: '',
            location: '',
            locationType: '',
            latitude: null,
            longitude: null,
        },

        checkOut: {
            time: '',
            location: '',
            locationType: '',
            latitude: null,
            longitude: null,
        },

        status: 'absent',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 010
    // -----------------------------------------------------------

    {
        id: 10,

        employeeId: 'EMP010',

        name: 'Deepa Nair',

        email: 'deepa@runamarga.com',

        gender: 'female',

        profileImage: '',

        date: '2026-08-23',

        checkIn: {
            time: '10:12 AM',
            location: 'Bengaluru Client Location',
            locationType: 'outside',
            latitude: 12.9352,
            longitude: 77.6245,
        },

        checkOut: {
            time: '06:40 PM',
            location: 'Bengaluru Client Location',
            locationType: 'outside',
            latitude: 12.9352,
            longitude: 77.6245,
        },

        status: 'late',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 011
    // -----------------------------------------------------------

    {
        id: 11,

        employeeId: 'EMP011',

        name: 'Karthik Rao',

        email: 'karthik@runamarga.com',

        gender: 'male',

        profileImage: '',

        date: '2026-08-23',

        checkIn: {
            time: '09:20 AM',
            location: 'Home',
            locationType: 'outside',
            latitude: 12.9810,
            longitude: 77.5900,
        },

        checkOut: {
            time: '06:00 PM',
            location: 'Home',
            locationType: 'outside',
            latitude: 12.9810,
            longitude: 77.5900,
        },

        status: 'wfh',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 012
    // -----------------------------------------------------------

    {
        id: 12,

        employeeId: 'EMP012',

        name: 'Meghana Joshi',

        email: 'meghana@runamarga.com',

        gender: 'female',

        profileImage: '',

        date: '2026-08-22',

        checkIn: {
            time: '09:28 AM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        checkOut: {
            time: '06:08 PM',
            location: 'Runamarga Head Office',
            locationType: 'office',
            latitude: 12.9716,
            longitude: 77.5946,
        },

        status: 'present',
    },


    // -----------------------------------------------------------
    // EMPLOYEE 013
    // -----------------------------------------------------------

    {
        id: 13,

        employeeId: 'EMP013',

        name: 'Rohit Kumar',

        email: 'rohit@runamarga.com',

        gender: 'male',

        profileImage: '',

        date: '2026-08-22',

        checkIn: {
            time: '10:05 AM',
            location: 'Client Location',
            locationType: 'outside',
            latitude: 12.9200,
            longitude: 77.6100,
        },

        checkOut: {
            time: '06:30 PM',
            location: 'Client Location',
            locationType: 'outside',
            latitude: 12.9200,
            longitude: 77.6100,
        },

        status: 'late',
    },

]


// =============================================================
// MOCK MONTHLY HISTORY
// =============================================================

const generateMonthlyHistory = (
    employee,
    monthValue
) => {

    const [year, month] =
        monthValue
            .split('-')
            .map(Number)


    const daysInMonth =
        new Date(
            year,
            month,
            0
        ).getDate()


    const history = []


    for (
        let day = 1;
        day <= daysInMonth;
        day += 1
    ) {

        const date =
            new Date(
                year,
                month - 1,
                day
            )


        const dayOfWeek =
            date.getDay()


        const formattedDate =
            `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`


        // -------------------------------------------------------
        // WEEKENDS
        // -------------------------------------------------------

        if (
            dayOfWeek === 0 ||
            dayOfWeek === 6
        ) {

            history.push({

                date: formattedDate,

                day:
                    date.toLocaleDateString(
                        'en-IN',
                        {
                            weekday: 'short',
                        }
                    ),

                checkIn: null,

                checkOut: null,

                status: 'weekend',

            })

            continue

        }


        // -------------------------------------------------------
        // ABSENT
        // -------------------------------------------------------

        if (
            day % 11 === 0
        ) {

            history.push({

                date: formattedDate,

                day:
                    date.toLocaleDateString(
                        'en-IN',
                        {
                            weekday: 'short',
                        }
                    ),

                checkIn: null,

                checkOut: null,

                status: 'absent',

            })

            continue

        }


        // -------------------------------------------------------
        // WFH
        // -------------------------------------------------------

        if (
            day % 9 === 0
        ) {

            history.push({

                date: formattedDate,

                day:
                    date.toLocaleDateString(
                        'en-IN',
                        {
                            weekday: 'short',
                        }
                    ),

                checkIn: '09:20 AM',

                checkOut: '06:10 PM',

                status: 'wfh',

                checkInLocation: 'Home',

                checkOutLocation: 'Home',

                checkInLocationType: 'outside',

                checkOutLocationType: 'outside',

            })

            continue

        }


        // -------------------------------------------------------
        // LATE
        // -------------------------------------------------------

        const late =
            day % 7 === 3


        history.push({

            date: formattedDate,

            day:
                date.toLocaleDateString(
                    'en-IN',
                    {
                        weekday: 'short',
                    }
                ),

            checkIn:
                late
                    ? '10:18 AM'
                    : '09:35 AM',

            checkOut:
                '06:15 PM',

            status:
                late
                    ? 'late'
                    : 'present',

            checkInLocation:
                late
                    ? 'Client Location'
                    : 'Runamarga Head Office',

            checkOutLocation:
                'Runamarga Head Office',

            checkInLocationType:
                late
                    ? 'outside'
                    : 'office',

            checkOutLocationType:
                'office',

        })

    }


    return {

        employee: {

            id:
                employee.employeeId,

            name:
                employee.name,

            email:
                employee.email,

            gender:
                employee.gender,

            profileImage:
                getProfileImage(
                    employee
                ),

        },

        month:
            monthValue,

        records:
            history,

    }

}


// =============================================================
// MOCK API — TODAY
// =============================================================

const fetchTodayAttendance = async () => {

    return new Promise(
        (resolve) => {

            setTimeout(() => {

                resolve(
                    INITIAL_ATTENDANCE
                )

            }, 400)

        }
    )

}


// =============================================================
// MOCK API — MONTHLY HISTORY
// =============================================================

const fetchEmployeeHistory = async (
    employee,
    month
) => {

    return new Promise(
        (resolve) => {

            setTimeout(() => {

                resolve(
                    generateMonthlyHistory(
                        employee,
                        month
                    )
                )

            }, 350)

        }
    )

}


// =============================================================
// COMPONENT
// =============================================================

function Attendance() {

    // =========================================================
    // DATA
    // =========================================================

    const [entries, setEntries] =
        useState([])


    const [loading, setLoading] =
        useState(true)


    const [error, setError] =
        useState('')


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [fromDate, setFromDate] =
        useState('')


    const [toDate, setToDate] =
        useState('')


    const [selectedStatus, setSelectedStatus] =
        useState('')


    const [selectedEmployeeId, setSelectedEmployeeId] =
        useState('')


    const [employeeSearch, setEmployeeSearch] =
        useState('')


    const [showEmployeeDropdown, setShowEmployeeDropdown] =
        useState(false)


    // =========================================================
    // HISTORY
    // =========================================================

    const [showHistoryModal, setShowHistoryModal] =
        useState(false)


    const [selectedEmployee, setSelectedEmployee] =
        useState(null)


    const [history, setHistory] =
        useState(null)


    const [selectedMonth, setSelectedMonth] =
        useState('2026-08')


    const [historyLoading, setHistoryLoading] =
        useState(false)


    // =========================================================
    // TODAY ATTENDANCE
    // =========================================================

    const [showTodayAttendance, setShowTodayAttendance] =
        useState(false)


    // =========================================================
    // LOAD ATTENDANCE
    // =========================================================

    const loadAttendance = async () => {

        try {

            setLoading(true)

            setError('')


            const response =
                await fetchTodayAttendance()


            setEntries(
                Array.isArray(response)
                    ? response
                    : []
            )

        } catch (err) {

            setError(
                err?.message ||
                'Unable to load attendance.'
            )

        } finally {

            setLoading(false)

        }

    }


    useEffect(() => {

        loadAttendance()

    }, [])


    // =========================================================
    // EMPLOYEE OPTIONS
    // =========================================================

    const employeeOptions =
        useMemo(() => {

            const uniqueEmployees =
                new Map()


            entries.forEach(
                (entry) => {

                    if (
                        !entry.employeeId
                    ) {
                        return
                    }


                    if (
                        !uniqueEmployees.has(
                            entry.employeeId
                        )
                    ) {

                        uniqueEmployees.set(
                            entry.employeeId,
                            {
                                id:
                                    entry.employeeId,

                                name:
                                    entry.name,

                                email:
                                    entry.email,

                                gender:
                                    entry.gender,

                                profileImage:
                                    getProfileImage(
                                        entry
                                    ),
                            }
                        )

                    }

                }
            )


            return Array.from(
                uniqueEmployees.values()
            ).sort(
                (a, b) =>
                    String(a.name)
                        .localeCompare(
                            String(b.name)
                        )
            )

        }, [
            entries,
        ])


    // =========================================================
    // FILTERED EMPLOYEE OPTIONS
    // =========================================================

    const filteredEmployeeOptions =
        useMemo(() => {

            const value =
                employeeSearch
                    .trim()
                    .toLowerCase()


            if (!value) {
                return employeeOptions
            }


            return employeeOptions.filter(
                (employee) => {

                    const searchableValues = [

                        employee.name,

                        employee.id,

                        employee.email,

                    ]


                    return searchableValues.some(
                        (item) =>
                            item !== null &&
                            item !== undefined &&
                            String(item)
                                .toLowerCase()
                                .includes(value)
                    )

                }
            )

        }, [
            employeeOptions,
            employeeSearch,
        ])


    // =========================================================
    // SELECTED EMPLOYEE
    // =========================================================

    const selectedEmployeeOption =
        useMemo(() => {

            return employeeOptions.find(
                (employee) =>
                    employee.id ===
                    selectedEmployeeId
            )

        }, [
            employeeOptions,
            selectedEmployeeId,
        ])


    // =========================================================
    // FILTERED ATTENDANCE
    // =========================================================

    const filteredEntries =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase()


            return entries.filter(
                (entry) => {

                    // -------------------------------------------------
                    // GENERAL SEARCH
                    // -------------------------------------------------

                    if (
                        searchValue
                    ) {

                        const searchableValues = [

                            entry.name,

                            entry.employeeId,

                            entry.email,

                            entry.date,

                        ]


                        const matchesSearch =
                            searchableValues.some(
                                (value) =>
                                    value !== null &&
                                    value !== undefined &&
                                    String(value)
                                        .toLowerCase()
                                        .includes(
                                            searchValue
                                        )
                            )


                        if (
                            !matchesSearch
                        ) {
                            return false
                        }

                    }


                    // -------------------------------------------------
                    // FROM DATE
                    // -------------------------------------------------

                    if (
                        fromDate &&
                        entry.date < fromDate
                    ) {
                        return false
                    }


                    // -------------------------------------------------
                    // TO DATE
                    // -------------------------------------------------

                    if (
                        toDate &&
                        entry.date > toDate
                    ) {
                        return false
                    }


                    // -------------------------------------------------
                    // STATUS
                    // -------------------------------------------------

                    if (
                        selectedStatus &&
                        entry.status !==
                            selectedStatus
                    ) {
                        return false
                    }


                    // -------------------------------------------------
                    // EMPLOYEE
                    // -------------------------------------------------

                    if (
                        selectedEmployeeId &&
                        entry.employeeId !==
                            selectedEmployeeId
                    ) {
                        return false
                    }


                    return true

                }
            )

        }, [
            entries,
            search,
            fromDate,
            toDate,
            selectedStatus,
            selectedEmployeeId,
        ])


    // =========================================================
    // ACTIVE FILTER CHECK
    // =========================================================

    const hasActiveFilters =
        Boolean(
            search ||
            fromDate ||
            toDate ||
            selectedStatus ||
            selectedEmployeeId
        )


    // =========================================================
    // RESET FILTERS
    // =========================================================

    const handleResetFilters = () => {

        setSearch('')

        setFromDate('')

        setToDate('')

        setSelectedStatus('')

        setSelectedEmployeeId('')

        setEmployeeSearch('')

        setShowEmployeeDropdown(false)

    }


    // =========================================================
    // VIEW EMPLOYEE HISTORY
    // =========================================================

    const handleViewHistory = async (
        entry
    ) => {

        setSelectedEmployee(
            entry
        )

        setShowHistoryModal(
            true
        )

        setHistoryLoading(
            true
        )

        try {

            const response =
                await fetchEmployeeHistory(
                    entry,
                    selectedMonth
                )


            setHistory(
                response
            )

        } catch (err) {

            console.error(
                'Unable to load attendance history:',
                err
            )

            setHistory(null)

        } finally {

            setHistoryLoading(
                false
            )

        }

    }


    // =========================================================
    // CHANGE HISTORY MONTH
    // =========================================================

    const handleMonthChange = async (
        month
    ) => {

        setSelectedMonth(
            month
        )


        if (
            !selectedEmployee
        ) {
            return
        }


        setHistoryLoading(
            true
        )


        try {

            const response =
                await fetchEmployeeHistory(
                    selectedEmployee,
                    month
                )


            setHistory(
                response
            )

        } catch (err) {

            console.error(
                'Unable to load attendance history:',
                err
            )

            setHistory(null)

        } finally {

            setHistoryLoading(
                false
            )

        }

    }


    // =========================================================
    // CLOSE HISTORY
    // =========================================================

    const handleCloseHistory = () => {

        setShowHistoryModal(
            false
        )

        setSelectedEmployee(
            null
        )

        setHistory(
            null
        )

    }


    // =========================================================
    // TODAY'S ATTENDANCE
    // =========================================================
    //
    // IMPORTANT:
    //
    // Do NOT filter only check-in records here.
    //
    // We want the Today Attendance modal to receive:
    //
    // - Present employees
    // - Late employees
    // - WFH employees
    // - Absent employees
    //
    // The modal itself handles the presentation.
    //
    // =========================================================

    const todayAttendance =
        useMemo(() => {

            if (
                !Array.isArray(entries)
            ) {
                return []
            }


            // Use the latest attendance date
            // from the loaded data as the demo "today".
            //
            // This keeps the mock data useful even if
            // the browser's actual date is different.

            const attendanceDates =
                entries
                    .map(
                        (entry) =>
                            entry?.date
                    )
                    .filter(Boolean)
                    .sort()


            const latestDate =
                attendanceDates[
                    attendanceDates.length - 1
                ]


            if (!latestDate) {
                return []
            }


            return entries.filter(
                (entry) =>
                    entry.date ===
                    latestDate
            )

        }, [
            entries,
        ])


    // =========================================================
    // TODAY ATTENDANCE COUNT
    // =========================================================

    const todayAttendanceCount =
        todayAttendance.length


    // =========================================================
    // ERROR
    // =========================================================

    if (
        error &&
        !loading
    ) {

        return (

            <div className="
                space-y-5
                p-4
                sm:p-6
            ">

                <div className="
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    p-8
                    text-center
                    shadow-sm
                ">

                    <p className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        Unable to load attendance
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/50
                    ">
                        {error}
                    </p>


                    <button
                        type="button"
                        onClick={
                            loadAttendance
                        }
                        className="
                            mt-4
                            inline-flex
                            h-9
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            bg-[#8BCF00]
                            px-4
                            text-xs
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                        "
                    >

                        <ArrowPathIcon className="
                            h-4
                            w-4
                        " />

                        Try Again

                    </button>

                </div>

            </div>

        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            space-y-5
            p-4
            sm:p-6
        ">


            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">


                {/* =================================================
                    PAGE TITLE
                ================================================= */}

                <div>

                    <h1 className="
                        text-lg
                        font-semibold
                        text-base-content
                    ">
                        Attendance
                    </h1>


                    <p className="
                        mt-0.5
                        text-xs
                        text-base-content/50
                    ">
                        Manage employee attendance,
                        check-ins and check-outs.
                    </p>

                </div>


                {/* =================================================
                    PAGE ACTIONS
                ================================================= */}

                <div className="
                    flex
                    flex-wrap
                    gap-2
                ">


                    {/* =============================================
                        REFRESH
                    ============================================= */}

                    <button
                        type="button"
                        onClick={
                            loadAttendance
                        }
                        disabled={
                            loading
                        }
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            border
                            border-base-300
                            bg-base-100
                            px-4
                            text-xs
                            font-medium
                            text-base-content/70
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        <ArrowPathIcon
                            className={[
                                'h-4',
                                'w-4',
                                loading
                                    ? 'animate-spin'
                                    : '',
                            ].join(' ')}
                        />

                        Refresh

                    </button>


                    {/* =============================================
                        TODAY'S ATTENDANCE
                    ============================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowTodayAttendance(
                                true
                            )
                        }
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            bg-[#8BCF00]
                            px-4
                            text-xs
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#8BCF00]/30
                        "
                    >

                        <CalendarDaysIcon className="
                            h-4
                            w-4
                        " />

                        Today's Attendance


                        {/* RECORD COUNT */}

                        {todayAttendanceCount > 0 && (

                            <span className="
                                ml-0.5
                                rounded-full
                                bg-white/20
                                px-1.5
                                py-0.5
                                text-[9px]
                                font-semibold
                            ">
                                {
                                    todayAttendanceCount
                                }
                            </span>

                        )}

                    </button>

                </div>

            </div>


            {/* =====================================================
                FILTER CARD
            ===================================================== */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    p-4
                    sm:p-5
                ">


                    {/* =================================================
                        FILTER GRID
                    ================================================= */}

                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-2
                        xl:grid-cols-[minmax(260px,1.5fr)_150px_150px_150px_230px]
                    ">


                        {/* =================================================
                            SEARCH
                        ================================================= */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                Search
                            </label>


                            <div className="
                                relative
                            ">

                                <MagnifyingGlassIcon className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-base-content/35
                                " />


                                <input
                                    type="text"
                                    value={
                                        search
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Search name, employee ID, email or date..."
                                    className="
                                        input
                                        input-bordered
                                        h-10
                                        min-h-10
                                        w-full
                                        pl-9
                                    "
                                />

                            </div>

                        </div>


                        {/* =================================================
                            FROM DATE
                        ================================================= */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                From Date
                            </label>


                            <input
                                type="date"
                                value={
                                    fromDate
                                }
                                onChange={(
                                    event
                                ) =>
                                    setFromDate(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="
                                    input
                                    input-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                "
                            />

                        </div>


                        {/* =================================================
                            TO DATE
                        ================================================= */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                To Date
                            </label>


                            <input
                                type="date"
                                value={
                                    toDate
                                }
                                min={
                                    fromDate ||
                                    undefined
                                }
                                onChange={(
                                    event
                                ) =>
                                    setToDate(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="
                                    input
                                    input-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                "
                            />

                        </div>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                Status
                            </label>


                            <select
                                value={
                                    selectedStatus
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSelectedStatus(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="
                                    select
                                    select-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                "
                            >

                                <option value="">
                                    All Status
                                </option>

                                <option value="present">
                                    Present
                                </option>

                                <option value="absent">
                                    Absent
                                </option>

                                <option value="wfh">
                                    WFH
                                </option>

                                <option value="late">
                                    Late
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            EMPLOYEE DROPDOWN
                        ================================================= */}

                        <div className="
                            relative
                        ">

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                Employee
                            </label>


                            <button
                                type="button"
                                onClick={() =>
                                    setShowEmployeeDropdown(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="
                                    flex
                                    h-10
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-100
                                    px-3
                                    text-left
                                    text-sm
                                    text-base-content
                                    transition
                                    hover:bg-base-200/40
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-[#8BCF00]/20
                                "
                            >

                                <span className="
                                    truncate
                                ">

                                    {
                                        selectedEmployeeOption
                                            ? selectedEmployeeOption.name
                                            : 'All Employees'
                                    }

                                </span>


                                <span className="
                                    ml-2
                                    shrink-0
                                    text-xs
                                    text-base-content/40
                                ">

                                    {
                                        showEmployeeDropdown
                                            ? '▲'
                                            : '▼'
                                    }

                                </span>

                            </button>


                            {showEmployeeDropdown && (

                                <div className="
                                    absolute
                                    left-0
                                    right-0
                                    z-40
                                    mt-1
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-base-300
                                    bg-base-100
                                    shadow-xl
                                ">


                                    {/* =================================
                                        SEARCH EMPLOYEES
                                    ================================= */}

                                    <div className="
                                        border-b
                                        border-base-300
                                        p-2
                                    ">

                                        <div className="
                                            relative
                                        ">

                                            <MagnifyingGlassIcon className="
                                                pointer-events-none
                                                absolute
                                                left-2.5
                                                top-1/2
                                                h-4
                                                w-4
                                                -translate-y-1/2
                                                text-base-content/35
                                            " />


                                            <input
                                                type="text"
                                                value={
                                                    employeeSearch
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setEmployeeSearch(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Search employee..."
                                                autoFocus
                                                className="
                                                    input
                                                    input-bordered
                                                    h-9
                                                    min-h-9
                                                    w-full
                                                    pl-8
                                                    text-xs
                                                "
                                                onClick={(
                                                    event
                                                ) =>
                                                    event.stopPropagation()
                                                }
                                            />

                                        </div>

                                    </div>


                                    {/* =================================
                                        EMPLOYEE OPTIONS
                                    ================================= */}

                                    <div className="
                                        max-h-64
                                        overflow-y-auto
                                        p-1
                                    ">


                                        {/* ALL EMPLOYEES */}

                                        <button
                                            type="button"
                                            onClick={() => {

                                                setSelectedEmployeeId(
                                                    ''
                                                )

                                                setShowEmployeeDropdown(
                                                    false
                                                )

                                                setEmployeeSearch(
                                                    ''
                                                )

                                            }}
                                            className={[
                                                'flex',
                                                'w-full',
                                                'items-center',
                                                'rounded-lg',
                                                'px-3',
                                                'py-2.5',
                                                'text-left',
                                                'text-xs',
                                                'transition',

                                                selectedEmployeeId === ''
                                                    ? 'bg-[#8BCF00]/10 text-[#6FA800]'
                                                    : 'text-base-content/70 hover:bg-base-200',
                                            ].join(' ')}
                                        >
                                            All Employees
                                        </button>


                                        {filteredEmployeeOptions.length > 0 ? (

                                            filteredEmployeeOptions.map(
                                                (
                                                    employee
                                                ) => (

                                                    <button
                                                        type="button"
                                                        key={
                                                            employee.id
                                                        }
                                                        onClick={() => {

                                                            setSelectedEmployeeId(
                                                                employee.id
                                                            )

                                                            setShowEmployeeDropdown(
                                                                false
                                                            )

                                                            setEmployeeSearch(
                                                                ''
                                                            )

                                                        }}
                                                        className={[
                                                            'flex',
                                                            'w-full',
                                                            'items-center',
                                                            'gap-3',
                                                            'rounded-lg',
                                                            'px-3',
                                                            'py-2.5',
                                                            'text-left',
                                                            'transition',

                                                            selectedEmployeeId === employee.id
                                                                ? 'bg-[#8BCF00]/10'
                                                                : 'hover:bg-base-200',
                                                        ].join(' ')}
                                                    >

                                                        <img
                                                            src={
                                                                employee.profileImage
                                                            }
                                                            alt={
                                                                employee.name
                                                            }
                                                            className="
                                                                h-7
                                                                w-7
                                                                shrink-0
                                                                rounded-full
                                                                object-cover
                                                            "
                                                        />


                                                        <div className="
                                                            min-w-0
                                                            flex-1
                                                        ">

                                                            <p className="
                                                                truncate
                                                                text-xs
                                                                font-medium
                                                                text-base-content
                                                            ">
                                                                {
                                                                    employee.name
                                                                }
                                                            </p>


                                                            <p className="
                                                                truncate
                                                                text-[10px]
                                                                text-base-content/45
                                                            ">
                                                                {
                                                                    employee.id
                                                                }

                                                                {' • '}

                                                                {
                                                                    employee.email
                                                                }
                                                            </p>

                                                        </div>

                                                    </button>

                                                )
                                            )

                                        ) : (

                                            <div className="
                                                px-3
                                                py-6
                                                text-center
                                            ">

                                                <p className="
                                                    text-xs
                                                    text-base-content/45
                                                ">
                                                    No employees found
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        FILTER FOOTER
                    ================================================= */}

                    <div className="
                        mt-4
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-base-300
                        pt-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">


                        {/* RESULT COUNT */}

                        <p className="
                            text-xs
                            font-medium
                            text-base-content/50
                        ">

                            {filteredEntries.length}{' '}

                            {
                                filteredEntries.length === 1
                                    ? 'attendance record'
                                    : 'attendance records'
                            }

                            {' '}found

                        </p>


                        <div className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        ">


                            {/* SELECTED EMPLOYEE */}

                            {selectedEmployeeOption && (

                                <span className="
                                    rounded-full
                                    bg-base-200
                                    px-3
                                    py-1.5
                                    text-[11px]
                                    font-medium
                                    text-base-content/60
                                ">
                                    {
                                        selectedEmployeeOption.name
                                    }
                                </span>

                            )}


                            {/* RESET */}

                            {hasActiveFilters && (

                                <button
                                    type="button"
                                    onClick={
                                        handleResetFilters
                                    }
                                    className="
                                        inline-flex
                                        h-9
                                        items-center
                                        justify-center
                                        gap-1
                                        rounded-lg
                                        px-3
                                        text-xs
                                        font-medium
                                        text-base-content/60
                                        transition
                                        hover:bg-base-200
                                        hover:text-base-content
                                    "
                                >

                                    <XMarkIcon className="
                                        h-4
                                        w-4
                                    " />

                                    Reset Filters

                                </button>

                            )}

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                ATTENDANCE TABLE
            ===================================================== */}

            <AttendanceTable
                entries={
                    filteredEntries
                }
                loading={
                    loading
                }
                onView={
                    handleViewHistory
                }
            />


            {/* =====================================================
                EMPLOYEE HISTORY MODAL
            ===================================================== */}

            <AttendanceHistoryModal
                open={
                    showHistoryModal
                }
                employee={
                    selectedEmployee
                }
                history={
                    history
                }
                loading={
                    historyLoading
                }
                month={
                    selectedMonth
                }
                months={
                    MONTHS
                }
                onMonthChange={
                    handleMonthChange
                }
                onClose={
                    handleCloseHistory
                }
            />


            {/* =====================================================
                TODAY ATTENDANCE MODAL
            ===================================================== */}

            <TodayAttendance
                open={
                    showTodayAttendance
                }
                entries={
                    todayAttendance
                }
                onClose={() =>
                    setShowTodayAttendance(
                        false
                    )
                }
            />

        </div>

    )

}


export default Attendance