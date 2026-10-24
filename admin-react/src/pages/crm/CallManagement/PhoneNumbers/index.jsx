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

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'
import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'

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
    // SUMMARY
    // =========================================================

    const summary = useMemo(() => {

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
    // 1. CREATE
    // 2. UPDATE
    // =========================================================

    const handleSavePhoneNumber = async (
        data
    ) => {

        try {

            setError('')

            // -------------------------------------------------
            // PREPARE DATA
            // -------------------------------------------------

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

            // -------------------------------------------------
            // EDIT
            // -------------------------------------------------

            if (editingPhoneNumber) {

                await updatePhoneNumber(
                    editingPhoneNumber.id,
                    payload
                )

                await loadPhoneNumbers()

                handleCloseNumberDrawer()

                showSuccess(
                    'Phone Number Updated',
                    'The phone number was updated successfully.'
                )

            }

            // -------------------------------------------------
            // ADD
            // -------------------------------------------------

            else {

                await createPhoneNumber(
                    payload
                )

                await loadPhoneNumbers()

                handleCloseNumberDrawer()

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

            if (!editingPhoneNumber) {

                showError(
                    'Unable to Add Phone Number',
                    message
                )

            } else {

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
                TABLE WITH FILTERS
            ================================================= */}

            {!loading && (

                <PhoneNumberTable
                    phoneNumbers={
                        phoneNumbers
                    }
                    onEdit={
                        handleEditPhoneNumber
                    }
                    onViewDetails={
                        handleViewDetails
                    }
                    onAdd={
                        handleAddPhoneNumber
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