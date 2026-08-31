// admin-react\src\pages\CallManagement\PhoneNumbers\index.jsx
import { useMemo, useState } from 'react'

import PhoneNumberSummary from './components/PhoneNumberSummary'
import PhoneNumberTable from './components/PhoneNumberTable'
import AddPhoneNumber from './components/AddPhoneNumber'
import PhoneNumberDetails from './components/PhoneNumberDetails'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'


function PhoneNumbers() {

    // =========================================================
    // MOCK EMPLOYEES
    // =========================================================

    const employees = [
        {
            id: 101,
            name: 'Rahul Sharma',
            employeeId: 'EMP101',
            phone: '9876543210',
            email: 'rahul@runamarga.com',
            teamId: 1,
            teamName: 'Team A',
        },
        {
            id: 102,
            name: 'Anil Kumar',
            employeeId: 'EMP102',
            phone: '9845671234',
            email: 'anil@runamarga.com',
            teamId: 2,
            teamName: 'Team B',
        },
        {
            id: 103,
            name: 'Priya Singh',
            employeeId: 'EMP103',
            phone: '9988776655',
            email: 'priya@runamarga.com',
            teamId: 1,
            teamName: 'Team A',
        },
        {
            id: 104,
            name: 'Vikram Rao',
            employeeId: 'EMP104',
            phone: '9123456789',
            email: 'vikram@runamarga.com',
            teamId: 3,
            teamName: 'Team C',
        },
        {
            id: 105,
            name: 'Sneha Reddy',
            employeeId: 'EMP105',
            phone: '9012345678',
            email: 'sneha@runamarga.com',
            teamId: 2,
            teamName: 'Team B',
        },
    ]


    // =========================================================
    // MOCK PHONE NUMBER DATA
    // =========================================================

    const [phoneNumbers, setPhoneNumbers] = useState([
        {
            id: 1,
            number: '9876543210',
            employeeId: 101,
            employeeName: 'Rahul Sharma',
            teamId: 1,
            teamName: 'Team A',
            status: 'Active',
            trackable: true,
            assignedAt: '12 Aug 2026',
            createdAt: '12 Aug 2026',
            updatedAt: '12 Aug 2026',
            assignmentHistory: [
                {
                    id: 1,
                    employeeId: 101,
                    employeeName: 'Rahul Sharma',
                    date: '12 Aug 2026',
                    action: 'Assigned',
                },
            ],
        },

        {
            id: 2,
            number: '9845671234',
            employeeId: 102,
            employeeName: 'Anil Kumar',
            teamId: 2,
            teamName: 'Team B',
            status: 'Active',
            trackable: false,
            assignedAt: '13 Aug 2026',
            createdAt: '13 Aug 2026',
            updatedAt: '13 Aug 2026',
            assignmentHistory: [
                {
                    id: 2,
                    employeeId: 102,
                    employeeName: 'Anil Kumar',
                    date: '13 Aug 2026',
                    action: 'Assigned',
                },
            ],
        },

        {
            id: 3,
            number: '9988776655',
            employeeId: null,
            employeeName: null,
            teamId: null,
            teamName: null,
            status: 'Inactive',
            trackable: true,
            assignedAt: null,
            createdAt: '14 Aug 2026',
            updatedAt: '20 Aug 2026',
            assignmentHistory: [],
        },

        {
            id: 4,
            number: '9123456789',
            employeeId: 103,
            employeeName: 'Priya Singh',
            teamId: 1,
            teamName: 'Team A',
            status: 'Active',
            trackable: true,
            assignedAt: '15 Aug 2026',
            createdAt: '15 Aug 2026',
            updatedAt: '15 Aug 2026',
            assignmentHistory: [
                {
                    id: 3,
                    employeeId: 103,
                    employeeName: 'Priya Singh',
                    date: '15 Aug 2026',
                    action: 'Assigned',
                },
            ],
        },

        {
            id: 5,
            number: '9012345678',
            employeeId: 105,
            employeeName: 'Sneha Reddy',
            teamId: 2,
            teamName: 'Team B',
            status: 'Inactive',
            trackable: false,
            assignedAt: '16 Aug 2026',
            createdAt: '16 Aug 2026',
            updatedAt: '22 Aug 2026',
            assignmentHistory: [
                {
                    id: 4,
                    employeeId: 105,
                    employeeName: 'Sneha Reddy',
                    date: '16 Aug 2026',
                    action: 'Assigned',
                },
            ],
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState('')

    const [employeeId, setEmployeeId] = useState('')

    const [status, setStatus] = useState('')

    const [trackable, setTrackable] = useState('')


    // =========================================================
    // ADD / EDIT DRAWER STATE
    // =========================================================

    const [showNumberDrawer, setShowNumberDrawer] =
        useState(false)

    const [editingPhoneNumber, setEditingPhoneNumber] =
        useState(null)


    // =========================================================
    // DETAILS STATE
    // =========================================================

    const [selectedPhoneNumber, setSelectedPhoneNumber] =
        useState(null)

    const [showDetails, setShowDetails] =
        useState(false)


    // =========================================================
    // FILTER PHONE NUMBERS
    // =========================================================

    const filteredPhoneNumbers = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase()


        return phoneNumbers.filter(
            (phoneNumber) => {

                // -------------------------------------------------
                // SEARCH
                // -------------------------------------------------

                const matchesSearch =
                    !searchValue ||
                    phoneNumber.number
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    phoneNumber.employeeName
                        ?.toLowerCase()
                        .includes(searchValue)


                // -------------------------------------------------
                // EMPLOYEE
                // -------------------------------------------------

                const matchesEmployee =
                    !employeeId ||
                    String(phoneNumber.employeeId) ===
                        String(employeeId)


                // -------------------------------------------------
                // STATUS
                // -------------------------------------------------

                const matchesStatus =
                    !status ||
                    phoneNumber.status === status


                // -------------------------------------------------
                // TRACKABLE
                // -------------------------------------------------

                const matchesTrackable =
                    !trackable ||
                    (
                        trackable === 'Yes' &&
                        phoneNumber.trackable === true
                    ) ||
                    (
                        trackable === 'No' &&
                        phoneNumber.trackable === false
                    )


                return (
                    matchesSearch &&
                    matchesEmployee &&
                    matchesStatus &&
                    matchesTrackable
                )

            }
        )

    }, [
        phoneNumbers,
        search,
        employeeId,
        status,
        trackable,
    ])


    // =========================================================
    // SUMMARY
    // =========================================================

    const summary = useMemo(() => {

        return {

            totalNumbers:
                phoneNumbers.length,

            activeNumbers:
                phoneNumbers.filter(
                    (item) =>
                        item.status === 'Active'
                ).length,

            inactiveNumbers:
                phoneNumbers.filter(
                    (item) =>
                        item.status === 'Inactive'
                ).length,

            trackableNumbers:
                phoneNumbers.filter(
                    (item) =>
                        item.trackable === true
                ).length,

        }

    }, [phoneNumbers])


    // =========================================================
    // RESET FILTERS
    // =========================================================

    const handleReset = () => {

        setSearch('')

        setEmployeeId('')

        setStatus('')

        setTrackable('')

    }


    // =========================================================
    // OPEN ADD DRAWER
    // =========================================================

    const handleAddPhoneNumber = () => {

        setEditingPhoneNumber(null)

        setShowNumberDrawer(true)

    }


    // =========================================================
    // OPEN EDIT DRAWER
    // =========================================================

    const handleEditPhoneNumber = (phoneNumber) => {

        setEditingPhoneNumber(phoneNumber)

        setShowNumberDrawer(true)

    }


    // =========================================================
    // CLOSE ADD / EDIT DRAWER
    // =========================================================

    const handleCloseNumberDrawer = () => {

        setShowNumberDrawer(false)

        setEditingPhoneNumber(null)

    }


    // =========================================================
    // SAVE PHONE NUMBER
    //
    // Same handler is used for:
    //
    // 1. Adding a new number
    // 2. Updating an existing number
    // =========================================================

    const handleSavePhoneNumber = (data) => {

        // =====================================================
        // EDIT EXISTING PHONE NUMBER
        // =====================================================

        if (editingPhoneNumber) {

            const employee =
                employees.find(
                    (item) =>
                        String(item.id) ===
                        String(data.employeeId)
                )


            setPhoneNumbers((previous) => {

                return previous.map(
                    (phoneNumber) => {

                        if (
                            phoneNumber.id !==
                            editingPhoneNumber.id
                        ) {
                            return phoneNumber
                        }


                        const employeeChanged =
                            String(
                                phoneNumber.employeeId || ''
                            ) !==
                            String(
                                data.employeeId || ''
                            )


                        let assignmentHistory =
                            phoneNumber.assignmentHistory ||
                            []


                        // -----------------------------------------
                        // ADD ASSIGNMENT HISTORY
                        // -----------------------------------------

                        if (
                            employeeChanged &&
                            employee
                        ) {

                            assignmentHistory = [
                                ...assignmentHistory,

                                {
                                    id:
                                        Date.now(),

                                    employeeId:
                                        employee.id,

                                    employeeName:
                                        employee.name,

                                    date:
                                        new Date()
                                            .toLocaleDateString(
                                                'en-IN',
                                                {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                }
                                            ),

                                    action:
                                        phoneNumber.employeeId
                                            ? 'Reassigned'
                                            : 'Assigned',
                                },
                            ]

                        }


                        const now =
                            new Date()
                                .toLocaleString(
                                    'en-IN',
                                    {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    }
                                )


                        return {

                            ...phoneNumber,

                            number:
                                data.number,

                            employeeId:
                                employee?.id ||
                                null,

                            employeeName:
                                employee?.name ||
                                null,

                            teamId:
                                employee?.teamId ||
                                null,

                            teamName:
                                employee?.teamName ||
                                null,

                            status:
                                data.status,

                            trackable:
                                data.trackable,

                            assignedAt:
                                employee
                                    ? (
                                        phoneNumber.assignedAt ||
                                        now
                                    )
                                    : null,

                            updatedAt:
                                now,

                            assignmentHistory,

                        }

                    }
                )

            })


            handleCloseNumberDrawer()

            return

        }


        // =====================================================
        // ADD NEW PHONE NUMBER
        // =====================================================

        const employee =
            employees.find(
                (item) =>
                    String(item.id) ===
                    String(data.employeeId)
            )


        const now =
            new Date()
                .toLocaleString(
                    'en-IN',
                    {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                    }
                )


        const newPhoneNumber = {

            id:
                Date.now(),

            number:
                data.number,

            employeeId:
                employee?.id ||
                null,

            employeeName:
                employee?.name ||
                null,

            teamId:
                employee?.teamId ||
                null,

            teamName:
                employee?.teamName ||
                null,

            status:
                data.status,

            trackable:
                data.trackable,

            assignedAt:
                employee
                    ? now
                    : null,

            createdAt:
                now,

            updatedAt:
                now,

            assignmentHistory:
                employee
                    ? [
                        {
                            id:
                                Date.now(),

                            employeeId:
                                employee.id,

                            employeeName:
                                employee.name,

                            date:
                                now,

                            action:
                                'Assigned',
                        },
                    ]
                    : [],

        }


        setPhoneNumbers((previous) => [
            ...previous,
            newPhoneNumber,
        ])


        handleCloseNumberDrawer()

    }


    // =========================================================
    // VIEW DETAILS
    // =========================================================

    const handleViewDetails = (phoneNumber) => {

        setSelectedPhoneNumber(
            phoneNumber
        )

        setShowDetails(true)

    }


    // =========================================================
    // CLOSE DETAILS
    // =========================================================

    const handleCloseDetails = () => {

        setShowDetails(false)

        setSelectedPhoneNumber(null)

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        // Replace with API call later.

        console.log(
            'Refresh phone numbers'
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

            {/* =================================================
                FILTERS + ADD BUTTON
            ================================================= */}

            <div className="
                card
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    card-body
                    p-4
                ">

                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        lg:grid-cols-12
                    ">

                        {/* =====================================
                            SEARCH
                        ===================================== */}

                        <div className="
                            lg:col-span-3
                        ">

                            <label className="
                                input
                                input-bordered
                                flex
                                w-full
                                items-center
                                gap-3
                            ">

                                <span className="
                                    text-xs
                                    text-base-content/40
                                ">
                                    Search
                                </span>


                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Number or employee..."
                                    className="grow"
                                />

                            </label>

                        </div>


                        {/* =====================================
                            EMPLOYEE
                        ===================================== */}

                        <div className="
                            lg:col-span-2
                        ">

                            <EmployeeDropdown
                                value={employeeId}
                                onChange={setEmployeeId}
                                employees={employees}
                            />

                        </div>


                        {/* =====================================
                            STATUS
                        ===================================== */}

                        <div className="
                            lg:col-span-2
                        ">

                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value
                                    )
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                "
                            >

                                <option value="">
                                    All Status
                                </option>

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        {/* =====================================
                            TRACKABLE
                        ===================================== */}

                        <div className="
                            lg:col-span-2
                        ">

                            <select
                                value={trackable}
                                onChange={(event) =>
                                    setTrackable(
                                        event.target.value
                                    )
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                "
                            >

                                <option value="">
                                    All Trackable
                                </option>

                                <option value="Yes">
                                    Trackable
                                </option>

                                <option value="No">
                                    Not Trackable
                                </option>

                            </select>

                        </div>


                        {/* =====================================
                            RESET
                        ===================================== */}

                        <div className="
                            lg:col-span-1
                        ">

                            <button
                                type="button"
                                onClick={handleReset}
                                className="
                                    btn
                                    btn-ghost
                                    w-full
                                "
                            >
                                Reset
                            </button>

                        </div>


                        {/* =====================================
                            ADD PHONE NUMBER
                        ===================================== */}

                        <div className="
                            lg:col-span-2
                        ">

                            <button
                                type="button"
                                onClick={
                                    handleAddPhoneNumber
                                }
                                className="
                                    btn
                                    w-full
                                    border-[#8BCF00]
                                    bg-[#8BCF00]
                                    text-white
                                    hover:border-[#6FA800]
                                    hover:bg-[#6FA800]
                                "
                            >

                                <span className="
                                    text-lg
                                    leading-none
                                ">
                                    +
                                </span>

                                Add Phone Number

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <PhoneNumberSummary
                totalNumbers={
                    summary.totalNumbers
                }
                activeNumbers={
                    summary.activeNumbers
                }
                inactiveNumbers={
                    summary.inactiveNumbers
                }
                trackableNumbers={
                    summary.trackableNumbers
                }
            />


            {/* =================================================
                TABLE
            ================================================= */}

            <PhoneNumberTable
                phoneNumbers={
                    filteredPhoneNumbers
                }
                employees={
                    employees
                }
                onEdit={
                    handleEditPhoneNumber
                }
                onViewDetails={
                    handleViewDetails
                }
                onRefresh={
                    handleRefresh
                }
                EmployeeDropdown={
                    EmployeeDropdown
                }
            />


            {/* =================================================
                ADD / EDIT PHONE NUMBER DRAWER
            ================================================= */}

            <AddPhoneNumber
                open={
                    showNumberDrawer
                }
                phoneNumber={
                    editingPhoneNumber
                }
                employees={
                    employees
                }
                EmployeeDropdown={
                    EmployeeDropdown
                }
                onClose={
                    handleCloseNumberDrawer
                }
                onSubmit={
                    handleSavePhoneNumber
                }
            />


            {/* =================================================
                PHONE NUMBER DETAILS
            ================================================= */}

            <PhoneNumberDetails
                open={
                    showDetails
                }
                phoneNumber={
                    selectedPhoneNumber
                }
                onClose={
                    handleCloseDetails
                }
            />

        </div>

    )

}


export default PhoneNumbers