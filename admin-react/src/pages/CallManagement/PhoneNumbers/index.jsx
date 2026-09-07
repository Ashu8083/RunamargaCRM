// admin-react/src/pages/CallManagement/PhoneNumbers/index.jsx

import {
    useEffect,
    useMemo,
    useState,
} from 'react'


// =============================================================
// PHONE NUMBER COMPONENTS
// =============================================================

import PhoneNumberSummary from './components/PhoneNumberSummary'
import PhoneNumberTable from './components/PhoneNumberTable'
import AddPhoneNumber from './components/AddPhoneNumber'
import PhoneNumberDetails from './components/PhoneNumberDetails'


// =============================================================
// API
// =============================================================

import {
    getPhoneNumbers,
    createPhoneNumber,
    updatePhoneNumber,
} from './Api'


// =============================================================
// GLOBAL COMPONENTS
// =============================================================

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'
import FeedbackModal from '../../../components/GlobalModels/FeedbackModal'


// =============================================================
// COMPONENT
// =============================================================

function PhoneNumbers() {


    // =========================================================
    // PHONE NUMBERS STATE
    // =========================================================

    const [
        phoneNumbers,
        setPhoneNumbers,
    ] = useState([])


    const [
        loading,
        setLoading,
    ] = useState(false)


    const [
        error,
        setError,
    ] = useState('')


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [
        search,
        setSearch,
    ] = useState('')


    const [
        employeeId,
        setEmployeeId,
    ] = useState('')


    const [
        status,
        setStatus,
    ] = useState('')


    const [
        trackable,
        setTrackable,
    ] = useState('')


    // =========================================================
    // ADD / EDIT DRAWER STATE
    // =========================================================

    const [
        showNumberDrawer,
        setShowNumberDrawer,
    ] = useState(false)


    const [
        editingPhoneNumber,
        setEditingPhoneNumber,
    ] = useState(null)


    // =========================================================
    // DETAILS STATE
    // =========================================================

    const [
        selectedPhoneNumber,
        setSelectedPhoneNumber,
    ] = useState(null)


    const [
        showDetails,
        setShowDetails,
    ] = useState(false)


    // =========================================================
    // FEEDBACK MODAL STATE
    // =========================================================

    const [
        feedback,
        setFeedback,
    ] = useState({

        open: false,

        type: 'success',

        title: '',

        message: '',

    })


    // =========================================================
    // NORMALIZE STATUS
    // =========================================================

    const normalizeStatus = (value) => {

        if (
            value === 1 ||
            value === '1' ||
            value === 'active' ||
            value === 'Active'
        ) {

            return 'Active'

        }


        if (
            value === 0 ||
            value === '0' ||
            value === 'inactive' ||
            value === 'Inactive'
        ) {

            return 'Inactive'

        }


        return value || 'Inactive'

    }


    // =========================================================
    // NORMALIZE PHONE NUMBER
    // =========================================================

    const normalizePhoneNumber = (item) => {

        if (!item) {
            return item
        }


        return {

            ...item,

            // -------------------------------------------------
            // ID
            // -------------------------------------------------

            id:
                item.id,


            // -------------------------------------------------
            // PHONE NUMBER
            // -------------------------------------------------

            number:
                item.number ??
                item.phone ??
                '',


            // -------------------------------------------------
            // EMPLOYEE
            // -------------------------------------------------

            employeeId:
                item.employeeId ??
                item.employee_id ??
                null,


            employeeName:
                item.employeeName ??
                item.employee_name ??
                null,


            // -------------------------------------------------
            // TEAM
            // -------------------------------------------------

            teamId:
                item.teamId ??
                item.team_id ??
                null,


            teamName:
                item.teamName ??
                item.team_name ??
                null,


            // -------------------------------------------------
            // STATUS
            // -------------------------------------------------

            status:
                normalizeStatus(
                    item.status
                ),


            // -------------------------------------------------
            // TRACKABLE
            // -------------------------------------------------

            trackable:
                item.trackable === true ||
                item.trackable === 'true' ||
                item.trackable === '1' ||
                item.trackable === 1 ||
                item.trackable === 'Yes',


            // -------------------------------------------------
            // DATES
            // -------------------------------------------------

            assignedAt:
                item.assignedAt ??
                item.assigned_at ??
                null,


            createdAt:
                item.createdAt ??
                item.created_at ??
                null,


            updatedAt:
                item.updatedAt ??
                item.updated_at ??
                null,


            // -------------------------------------------------
            // HISTORY
            // -------------------------------------------------

            assignmentHistory:
                item.assignmentHistory ??
                item.assignment_history ??
                [],

        }

    }


    // =========================================================
    // CLOSE FEEDBACK
    // =========================================================

    const closeFeedback = () => {

        setFeedback((previous) => ({

            ...previous,

            open: false,

        }))

    }


    // =========================================================
    // SHOW SUCCESS
    // =========================================================

    const showSuccess = (
        title,
        message
    ) => {

        setFeedback({

            open: true,

            type: 'success',

            title,

            message,

        })

    }


    // =========================================================
    // SHOW ERROR
    // =========================================================

    const showError = (
        title,
        message
    ) => {

        setFeedback({

            open: true,

            type: 'error',

            title,

            message,

        })

    }


    // =========================================================
    // EXTRACT API ERROR
    // =========================================================

    const getErrorMessage = (error) => {

        const detail =
            error?.response?.data?.detail


        if (typeof detail === 'string') {

            return detail

        }


        if (Array.isArray(detail)) {

            return detail
                .map(
                    (item) =>
                        item?.msg ||
                        String(item)
                )
                .join(', ')

        }


        if (
            detail &&
            typeof detail === 'object'
        ) {

            return (
                detail.message ||
                detail.error ||
                JSON.stringify(detail)
            )

        }


        return (
            error?.response?.data?.message ||
            error?.message ||
            'The operation could not be completed. Please try again.'
        )

    }


    // =========================================================
    // LOAD PHONE NUMBERS
    // =========================================================

    const loadPhoneNumbers = async () => {

        try {

            setLoading(true)

            setError('')


            const data =
                await getPhoneNumbers()


            const records =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : []


            setPhoneNumbers(
                records.map(
                    normalizePhoneNumber
                )
            )


        } catch (error) {

            console.error(
                'Failed to load phone numbers:',
                error
            )


            const message =
                getErrorMessage(error)


            setError(message)


            showError(
                'Unable to Load Phone Numbers',
                message
            )


        } finally {

            setLoading(false)

        }

    }


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadPhoneNumbers()

    }, [])


    // =========================================================
    // FILTER PHONE NUMBERS
    // =========================================================

    const filteredPhoneNumbers =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase()


            return phoneNumbers.filter(
                (phoneNumber) => {


                    // -------------------------------------------------
                    // SEARCH
                    // -------------------------------------------------

                    if (searchValue) {

                        const searchableValues = [

                            phoneNumber.number,

                            phoneNumber.phone,

                            phoneNumber.employeeName,

                            phoneNumber.employee_name,

                            phoneNumber.teamName,

                            phoneNumber.team_name,

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


                        if (!matchesSearch) {

                            return false

                        }

                    }


                    // -------------------------------------------------
                    // EMPLOYEE
                    // -------------------------------------------------

                    if (employeeId) {

                        if (
                            String(
                                phoneNumber.employeeId
                            ) !==
                            String(
                                employeeId
                            )
                        ) {

                            return false

                        }

                    }


                    // -------------------------------------------------
                    // STATUS
                    // -------------------------------------------------

                    if (status) {

                        if (
                            normalizeStatus(
                                phoneNumber.status
                            ) !==
                            status
                        ) {

                            return false

                        }

                    }


                    // -------------------------------------------------
                    // TRACKABLE
                    // -------------------------------------------------

                    if (trackable) {

                        const isTrackable =
                            phoneNumber.trackable === true


                        if (
                            trackable === 'Yes' &&
                            !isTrackable
                        ) {

                            return false

                        }


                        if (
                            trackable === 'No' &&
                            isTrackable
                        ) {

                            return false

                        }

                    }


                    return true

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

    const summary =
        useMemo(() => {

            return {

                totalNumbers:
                    phoneNumbers.length,


                activeNumbers:
                    phoneNumbers.filter(
                        (item) =>
                            normalizeStatus(
                                item.status
                            ) === 'Active'
                    ).length,


                inactiveNumbers:
                    phoneNumbers.filter(
                        (item) =>
                            normalizeStatus(
                                item.status
                            ) === 'Inactive'
                    ).length,


                trackableNumbers:
                    phoneNumbers.filter(
                        (item) =>
                            item.trackable === true
                    ).length,

            }

        }, [
            phoneNumbers,
        ])


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

    const handleEditPhoneNumber = (
        phoneNumber
    ) => {

        setEditingPhoneNumber(
            phoneNumber
        )

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
    // Used for:
    //
    // 1. CREATE
    // 2. UPDATE
    // =========================================================

    const handleSavePhoneNumber = async (
        data
    ) => {

        try {

            setError('')


            // =====================================================
            // PREPARE DATA
            // =====================================================

            const payload = {

                number:
                    data.number?.trim() || '',

                employeeId:
                    data.employeeId
                        ? Number(
                            data.employeeId
                        )
                        : null,

                trackable:
                    Boolean(
                        data.trackable
                    ),

                status:
                    normalizeStatus(
                        data.status
                    ),

            }


            // =====================================================
            // EDIT
            // =====================================================

            if (editingPhoneNumber) {

                await updatePhoneNumber(

                    editingPhoneNumber.id,

                    payload

                )


                // -------------------------------------------------
                // Reload from backend
                // -------------------------------------------------

                await loadPhoneNumbers()


                // -------------------------------------------------
                // Close drawer
                // -------------------------------------------------

                handleCloseNumberDrawer()


                // -------------------------------------------------
                // Success
                // -------------------------------------------------

                showSuccess(

                    'Phone Number Updated',

                    'The phone number was updated successfully.'

                )

            }


            // =====================================================
            // ADD
            // =====================================================

            else {

                await createPhoneNumber(
                    payload
                )


                // -------------------------------------------------
                // Reload from backend
                // -------------------------------------------------

                await loadPhoneNumbers()


                // -------------------------------------------------
                // Close drawer
                // -------------------------------------------------

                handleCloseNumberDrawer()


                // -------------------------------------------------
                // Success
                // -------------------------------------------------

                showSuccess(

                    'Phone Number Added',

                    'The phone number was added successfully.'

                )

            }


        } catch (error) {

            console.error(
                'Failed to save phone number:',
                error
            )


            const message =
                getErrorMessage(error)


            setError(message)


            // -------------------------------------------------
            // ADD ERROR
            // -------------------------------------------------

            if (!editingPhoneNumber) {

                showError(

                    'Unable to Add Phone Number',

                    message

                )

            }


            // -------------------------------------------------
            // UPDATE ERROR
            // -------------------------------------------------

            else {

                showError(

                    'Unable to Update Phone Number',

                    message

                )

            }

        }

    }


    // =========================================================
    // VIEW DETAILS
    // =========================================================

    const handleViewDetails = (
        phoneNumber
    ) => {

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

    const handleRefresh = async () => {

        await loadPhoneNumbers()

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
                                value={
                                    employeeId
                                }
                                onChange={
                                    setEmployeeId
                                }
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
                                onClick={
                                    handleReset
                                }
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
                ERROR STATE
            ================================================= */}

            {error && !loading && (

                <div className="
                    rounded-xl
                    border
                    border-error/20
                    bg-error/5
                    px-4
                    py-3
                    text-sm
                    text-error
                ">

                    {error}

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div className="
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    py-10
                    text-sm
                    text-base-content/50
                ">

                    Loading phone numbers...

                </div>

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            {!loading && (

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

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            {!loading && (

                <PhoneNumberTable

                    phoneNumbers={
                        filteredPhoneNumbers
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

            )}


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


            {/* =================================================
                FEEDBACK MODAL
            ================================================= */}

            <FeedbackModal

                open={
                    feedback.open
                }

                type={
                    feedback.type
                }

                title={
                    feedback.title
                }

                message={
                    feedback.message
                }

                autoClose={
                    feedback.type === 'success'
                }

                autoCloseDuration={2500}

                showCloseButton={
                    feedback.type !== 'success'
                }

                onClose={
                    closeFeedback
                }

            />

        </div>

    )

}


export default PhoneNumbers