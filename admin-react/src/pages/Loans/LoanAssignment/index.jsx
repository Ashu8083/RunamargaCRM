// admin-react/src/pages/Loans/LoanAssignment/index.jsx

import {
    useCallback,
    useEffect,
    useState,
} from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'

import {
    getLoanAssignments,
    toggleLoanAssignment,
    toggleLoanForEmployees,
    getApiErrorMessage,
} from './API'

import FeedbackModal from '../../../components/GlobalModels/FeedbackModal'


// =========================================================
// LOAN COLORS
// =========================================================
//
// The backend controls:
//     id
//     name
//     permission
//     employees
//
// The UI controls only the display color.
//
// =========================================================

const LOAN_COLORS = {
    personal: '#2196F3',
    business: '#FFB300',
    home: '#1DB5B5',
    lap: '#F05AA8',
    vehicle: '#19B77A',
    education: '#8B2BE2',
    gold: '#FF8C00',
    'credit card': '#F43F70',
    agricultural: '#2196F3',
}


// =========================================================
// NORMALIZE LOAN NAME FOR COLOR
// =========================================================

const normalizeLoanName = (
    name
) => {

    return String(
        name || ''
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            ' '
        )
}


// =========================================================
// GET LOAN COLOR
// =========================================================

const getLoanColor = (
    loanName
) => {

    const normalizedName =
        normalizeLoanName(
            loanName
        )


    return (
        LOAN_COLORS[
            normalizedName
        ] ||
        '#2196F3'
    )
}


// =========================================================
// ADD UI COLOR
// =========================================================

const addLoanColor = (
    loan
) => {

    return {
        ...loan,

        color:
            getLoanColor(
                loan.name
            ),
    }
}


// =========================================================
// INITIAL STATE
// =========================================================

function LoanAssignment() {

    // =========================================================
    // STATE
    // =========================================================

    const [
        loanAssignments,
        setLoanAssignments,
    ] = useState([])


    // =========================================================
    // LOADING
    // =========================================================

    const [
        loading,
        setLoading,
    ] = useState(true)


    // =========================================================
    // REFRESHING
    // =========================================================

    const [
        refreshing,
        setRefreshing,
    ] = useState(false)


    // =========================================================
    // TOGGLE LOADING
    // =========================================================
    //
    // Stores the currently updating assignment.
    //
    // Example:
    //
    // "3-1"
    //
    // employee_context_id = 3
    // loan_type_id = 1
    //
    // =========================================================

    const [
        updatingAssignment,
        setUpdatingAssignment,
    ] = useState(null)


    // =========================================================
    // EXPANDED LOANS
    // =========================================================

    const [
        expandedLoans,
        setExpandedLoans,
    ] = useState(
        new Set()
    )


    // =========================================================
    // FEEDBACK MODAL
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
    // OPEN FEEDBACK MODAL
    // =========================================================

    const showFeedback = ({
        type = 'info',
        title = '',
        message = '',
    }) => {

        setFeedback({
            open: true,
            type,
            title,
            message,
        })
    }


    // =========================================================
    // CLOSE FEEDBACK MODAL
    // =========================================================

    const closeFeedback = () => {

        setFeedback(
            (previous) => ({
                ...previous,
                open: false,
            })
        )
    }


    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadLoanAssignments = useCallback(
        async ({
            showRefreshLoading = false,
        } = {}) => {

            try {

                if (
                    showRefreshLoading
                ) {

                    setRefreshing(
                        true
                    )

                } else {

                    setLoading(
                        true
                    )
                }


                const data =
                    await getLoanAssignments()


                const normalizedData =
                    Array.isArray(
                        data
                    )
                        ? data.map(
                            addLoanColor
                        )
                        : []


                setLoanAssignments(
                    normalizedData
                )


                // -------------------------------------------------
                // Keep the first loan expanded after initial load.
                // -------------------------------------------------

                if (
                    normalizedData.length > 0 &&
                    !showRefreshLoading
                ) {

                    setExpandedLoans(
                        new Set([
                            normalizedData[0].id,
                        ])
                    )
                }

            } catch (
                error
            ) {

                showFeedback({
                    type: 'error',
                    title: 'Unable to Load Loan Assignments',
                    message:
                        getApiErrorMessage(
                            error,
                            'Unable to load loan assignments.'
                        ),
                })

            } finally {

                setLoading(
                    false
                )

                setRefreshing(
                    false
                )
            }

        },
        []
    )


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(
        () => {

            loadLoanAssignments()

        },
        [
            loadLoanAssignments,
        ]
    )


    // =========================================================
    // COUNTS
    // =========================================================

    const totalEmployees =
        loanAssignments.reduce(
            (
                total,
                loan
            ) =>
                total +
                (
                    Array.isArray(
                        loan.employees
                    )
                        ? loan.employees.length
                        : 0
                ),
            0
        )


    const enabledEmployees =
        loanAssignments.reduce(
            (
                total,
                loan
            ) =>
                total +
                (
                    Array.isArray(
                        loan.employees
                    )
                        ? loan.employees.filter(
                            (employee) =>
                                employee.enabled
                        ).length
                        : 0
                ),
            0
        )


    // =========================================================
    // TOGGLE EXPAND / COLLAPSE
    // =========================================================

    const toggleExpanded = (
        loanId
    ) => {

        setExpandedLoans(
            (previous) => {

                const next =
                    new Set(
                        previous
                    )


                if (
                    next.has(
                        loanId
                    )
                ) {

                    next.delete(
                        loanId
                    )

                } else {

                    next.add(
                        loanId
                    )
                }


                return next
            }
        )
    }


    // =========================================================
    // UPDATE LOCAL EMPLOYEE STATUS
    // =========================================================

    const updateLocalEmployeeStatus = (
        loanId,
        employeeContextId,
        enabled
    ) => {

        setLoanAssignments(
            (previous) =>
                previous.map(
                    (loan) => {

                        if (
                            loan.id !==
                            loanId
                        ) {

                            return loan
                        }


                        return {
                            ...loan,

                            employees:
                                loan.employees.map(
                                    (employee) =>
                                        employee.employeeContextId ===
                                        employeeContextId
                                            ? {
                                                ...employee,
                                                enabled,
                                            }
                                            : employee
                                ),
                        }
                    }
                )
        )
    }


    // =========================================================
    // UPDATE LOCAL WHOLE LOAN STATUS
    // =========================================================

    const updateLocalLoanStatus = (
        loanId,
        enabled
    ) => {

        setLoanAssignments(
            (previous) =>
                previous.map(
                    (loan) => {

                        if (
                            loan.id !==
                            loanId
                        ) {

                            return loan
                        }


                        return {
                            ...loan,

                            employees:
                                loan.employees.map(
                                    (employee) => ({
                                        ...employee,
                                        enabled,
                                    })
                                ),
                        }
                    }
                )
        )
    }


    // =========================================================
    // TOGGLE INDIVIDUAL EMPLOYEE
    // =========================================================

    const handleEmployeeToggle = async (
        loanId,
        employee
    ) => {

        if (
            !employee?.employeeContextId
        ) {

            return
        }


        const nextEnabled =
            !employee.enabled


        const updateKey =
            `${employee.employeeContextId}-${loanId}`


        try {

            setUpdatingAssignment(
                updateKey
            )


            // -------------------------------------------------
            // Update backend first.
            // -------------------------------------------------

            const result =
                await toggleLoanAssignment({
                    employeeContextId:
                        employee.employeeContextId,

                    loanTypeId:
                        loanId,

                    enabled:
                        nextEnabled,
                })


            // -------------------------------------------------
            // Use backend response as source of truth.
            // -------------------------------------------------

            updateLocalEmployeeStatus(
                loanId,
                employee.employeeContextId,
                result.enabled
            )


            // -------------------------------------------------
            // SUCCESS FEEDBACK
            // -------------------------------------------------

            showFeedback({
                type: 'success',
                title:
                    result.enabled
                        ? 'Assignment Enabled'
                        : 'Assignment Disabled',
                message:
                    result.enabled
                        ? `${employee.name} can now receive ${loanAssignments.find(
                            (loan) =>
                                loan.id === loanId
                        )?.name || 'this loan'}.`
                        : `${employee.name} can no longer receive ${loanAssignments.find(
                            (loan) =>
                                loan.id === loanId
                        )?.name || 'this loan'}.`,
            })

        } catch (
            error
        ) {

            showFeedback({
                type: 'error',
                title: 'Assignment Update Failed',
                message:
                    getApiErrorMessage(
                        error,
                        `Unable to update ${employee.name}'s assignment.`
                    ),
            })

        } finally {

            setUpdatingAssignment(
                null
            )
        }
    }


    // =========================================================
    // TOGGLE ENTIRE LOAN
    // =========================================================

    const handleLoanToggle = async (
        loan
    ) => {

        if (
            !loan ||
            !Array.isArray(
                loan.employees
            ) ||
            loan.employees.length === 0
        ) {

            showFeedback({
                type: 'info',
                title: 'No Eligible Employees',
                message:
                    `There are no eligible employees available for ${loan?.name || 'this loan type'}.`,
            })

            return
        }


        const allEnabled =
            loan.employees.every(
                (employee) =>
                    employee.enabled
            )


        const nextEnabled =
            !allEnabled


        try {

            setUpdatingAssignment(
                `loan-${loan.id}`
            )


            // -------------------------------------------------
            // Update every eligible agent.
            //
            // Only agents returned by the backend are here.
            // -------------------------------------------------

            const results =
                await toggleLoanForEmployees({
                    loanTypeId:
                        loan.id,

                    employees:
                        loan.employees,

                    enabled:
                        nextEnabled,
                })


            // -------------------------------------------------
            // Update local state from successful responses.
            // -------------------------------------------------

            if (
                results.length ===
                loan.employees.length
            ) {

                updateLocalLoanStatus(
                    loan.id,
                    nextEnabled
                )


                // -------------------------------------------------
                // SUCCESS FEEDBACK
                // -------------------------------------------------

                showFeedback({
                    type: 'success',
                    title:
                        nextEnabled
                            ? `${loan.name} Enabled`
                            : `${loan.name} Disabled`,
                    message:
                        nextEnabled
                            ? `${loan.employees.length} eligible employee${loan.employees.length === 1 ? '' : 's'} can now receive ${loan.name}.`
                            : `${loan.employees.length} eligible employee${loan.employees.length === 1 ? '' : 's'} can no longer receive ${loan.name}.`,
                })

            } else {

                // -------------------------------------------------
                // At least one update was skipped.
                // Refresh from backend so the UI represents the
                // actual database state.
                // -------------------------------------------------

                await loadLoanAssignments()


                showFeedback({
                    type: 'warning',
                    title: 'Assignment Partially Updated',
                    message:
                        `Some ${loan.name} assignments could not be updated. The current database state has been loaded.`,
                })
            }

        } catch (
            error
        ) {

            showFeedback({
                type: 'error',
                title:
                    `Unable to Update ${loan.name}`,
                message:
                    getApiErrorMessage(
                        error,
                        `Unable to update ${loan.name} assignments.`
                    ),
            })


            // -------------------------------------------------
            // Refresh after failure because some previous
            // individual requests may already have succeeded.
            // -------------------------------------------------

            await loadLoanAssignments()

        } finally {

            setUpdatingAssignment(
                null
            )
        }
    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {

        await loadLoanAssignments({
            showRefreshLoading: true,
        })
    }


    // =========================================================
    // LOADING STATE
    // =========================================================

    if (
        loading
    ) {

        return (

            <div className="
                space-y-4
                p-3
                sm:p-5
            ">

                <div className="
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    px-5
                    py-8
                    text-center
                ">

                    <span className="
                        loading
                        loading-spinner
                        loading-md
                        text-base-content/50
                    " />

                    <p className="
                        mt-3
                        text-sm
                        text-base-content/55
                    ">
                        Loading loan assignments...
                    </p>

                </div>


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
                    onClose={
                        closeFeedback
                    }
                />

            </div>
        )
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            space-y-4
            p-3
            sm:p-5
        ">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
            ">

                <div className="
                    flex
                    flex-col
                    gap-4
                    px-4
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
                    sm:py-4
                ">

                    {/* TITLE */}

                    <div className="
                        min-w-0
                    ">

                        <h1 className="
                            text-lg
                            font-semibold
                            text-base-content
                            sm:text-xl
                        ">
                            Loan Assignment
                        </h1>


                        <p className="
                            mt-1
                            text-xs
                            text-base-content/55
                            sm:text-sm
                        ">
                            Manage which employees can receive each loan type.
                        </p>

                    </div>


                    {/* HEADER ACTIONS */}

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-2
                        sm:justify-end
                    ">

                        <span className="
                            rounded-full
                            bg-[#2F8132]
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-white
                        ">
                            {enabledEmployees}/
                            {totalEmployees}
                            {' '}
                            Enabled
                        </span>


                        <button
                            type="button"
                            onClick={
                                handleRefresh
                            }
                            title="Refresh"
                            aria-label="Refresh loan assignments"
                            disabled={
                                refreshing ||
                                Boolean(
                                    updatingAssignment
                                )
                            }
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                transition
                                hover:bg-base-200
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <ArrowPathIcon
                                className={[
                                    'h-4.5',
                                    'w-4.5',
                                    'text-base-content/60',
                                    refreshing
                                        ? 'animate-spin'
                                        : '',
                                ].join(' ')}
                            />

                        </button>

                    </div>

                </div>

            </div>


            {/* =====================================================
                LOAN LIST
            ===================================================== */}

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-base-300
                bg-base-100
            ">

                {loanAssignments.length === 0 && (

                    <div className="
                        px-5
                        py-10
                        text-center
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-base-content/60
                        ">
                            No loan assignments available.
                        </p>

                    </div>
                )}


                {loanAssignments.map(
                    (
                        loan,
                        loanIndex
                    ) => {

                        const totalCount =
                            Array.isArray(
                                loan.employees
                            )
                                ? loan.employees.length
                                : 0


                        const enabledCount =
                            Array.isArray(
                                loan.employees
                            )
                                ? loan.employees.filter(
                                    (employee) =>
                                        employee.enabled
                                ).length
                                : 0


                        const allEnabled =
                            totalCount > 0 &&
                            enabledCount ===
                                totalCount


                        const partiallyEnabled =
                            enabledCount > 0 &&
                            enabledCount <
                                totalCount


                        const isExpanded =
                            expandedLoans.has(
                                loan.id
                            )


                        const loanUpdating =
                            updatingAssignment ===
                            `loan-${loan.id}`


                        // -------------------------------------------------
                        // STATUS
                        // -------------------------------------------------

                        let statusLabel =
                            'Paused'

                        if (
                            allEnabled
                        ) {

                            statusLabel =
                                'Enabled'

                        } else if (
                            partiallyEnabled
                        ) {

                            statusLabel =
                                'Partial'
                        }


                        return (

                            <div
                                key={
                                    loan.id
                                }
                                className={
                                    loanIndex > 0
                                        ? 'border-t border-base-300'
                                        : ''
                                }
                            >

                                {/* =================================================
                                    LOAN HEADER
                                ================================================= */}

                                <div className="
                                    flex
                                    min-h-[68px]
                                    items-center
                                    gap-2
                                    px-3
                                    py-3
                                    sm:gap-3
                                    sm:px-5
                                ">

                                    {/* EXPAND BUTTON */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleExpanded(
                                                loan.id
                                            )
                                        }
                                        aria-label={
                                            isExpanded
                                                ? `Collapse ${loan.name}`
                                                : `Expand ${loan.name}`
                                        }
                                        className="
                                            flex
                                            h-7
                                            w-7
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-md
                                            hover:bg-base-200
                                        "
                                    >

                                        <ChevronDownIcon
                                            className={[
                                                'h-4',
                                                'w-4',
                                                'text-base-content/45',
                                                'transition-transform',
                                                isExpanded
                                                    ? 'rotate-180'
                                                    : '',
                                            ].join(' ')}
                                        />

                                    </button>


                                    {/* LOAN COLOR */}

                                    <span
                                        className="
                                            h-2.5
                                            w-2.5
                                            shrink-0
                                            rounded-full
                                        "
                                        style={{
                                            backgroundColor:
                                                loan.color,
                                        }}
                                    />


                                    {/* LOAN INFORMATION */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleExpanded(
                                                loan.id
                                            )
                                        }
                                        className="
                                            min-w-0
                                            flex-1
                                            text-left
                                        "
                                    >

                                        <div className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                        ">

                                            <span className="
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-base-content
                                                sm:text-base
                                            ">
                                                {
                                                    loan.name
                                                }
                                            </span>


                                            {/* STATUS */}

                                            <span
                                                className={[
                                                    'rounded-full',
                                                    'border',
                                                    'px-2',
                                                    'py-0.5',
                                                    'text-[10px]',
                                                    'font-medium',
                                                    allEnabled
                                                        ? 'border-green-300 bg-green-50 text-green-700'
                                                        : partiallyEnabled
                                                            ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                                                            : 'border-orange-300 bg-orange-50 text-orange-600',
                                                ].join(' ')}
                                            >
                                                {
                                                    statusLabel
                                                }
                                            </span>

                                        </div>


                                        <p className="
                                            mt-0.5
                                            text-[11px]
                                            text-base-content/45
                                        ">
                                            {
                                                enabledCount
                                            }{' '}
                                            of{' '}
                                            {
                                                totalCount
                                            }{' '}
                                            employees enabled
                                        </p>

                                    </button>


                                    {/* =================================================
                                        LOAN TOGGLE
                                    ================================================= */}

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={
                                            allEnabled
                                        }
                                        onClick={() =>
                                            handleLoanToggle(
                                                loan
                                            )
                                        }
                                        disabled={
                                            loanUpdating ||
                                            totalCount === 0 ||
                                            Boolean(
                                                updatingAssignment
                                            )
                                        }
                                        aria-label={
                                            `Toggle all employees for ${loan.name}`
                                        }
                                        className={[
                                            'relative',
                                            'h-5',
                                            'w-9',
                                            'shrink-0',
                                            'rounded-full',
                                            'transition-colors',
                                            'duration-200',
                                            'focus:outline-none',
                                            'focus:ring-2',
                                            'focus:ring-[#8BCF00]/30',
                                            'disabled:cursor-not-allowed',
                                            'disabled:opacity-50',
                                            allEnabled
                                                ? 'bg-[#8BCF00]'
                                                : partiallyEnabled
                                                    ? 'bg-[#8BCF00]/60'
                                                    : 'bg-base-300',
                                        ].join(' ')}
                                    >

                                        <span
                                            className={[
                                                'absolute',
                                                'left-0.5',
                                                'top-0.5',
                                                'h-4',
                                                'w-4',
                                                'rounded-full',
                                                'bg-white',
                                                'shadow-sm',
                                                'transition-transform',
                                                'duration-200',
                                                allEnabled ||
                                                partiallyEnabled
                                                    ? 'translate-x-4'
                                                    : 'translate-x-0',
                                            ].join(' ')}
                                        />

                                    </button>

                                </div>


                                {/* =================================================
                                    EMPLOYEE LIST
                                ================================================= */}

                                {isExpanded && (

                                    <div className="
                                        border-t
                                        border-base-300
                                        bg-base-200/20
                                    ">

                                        <div className="
                                            px-3
                                            py-2
                                            sm:pl-16
                                            sm:pr-5
                                        ">

                                            {totalCount === 0 && (

                                                <div className="
                                                    px-2
                                                    py-4
                                                ">

                                                    <p className="
                                                        text-xs
                                                        text-base-content/45
                                                    ">
                                                        No eligible employees have the required permission for this loan type.
                                                    </p>

                                                </div>
                                            )}


                                            {loan.employees.map(
                                                (
                                                    employee,
                                                    employeeIndex
                                                ) => {

                                                    const updateKey =
                                                        `${employee.employeeContextId}-${loan.id}`


                                                    const employeeUpdating =
                                                        updatingAssignment ===
                                                        updateKey


                                                    return (

                                                        <div
                                                            key={
                                                                employee.employeeContextId
                                                            }
                                                            className={[
                                                                'flex',
                                                                'min-h-[52px]',
                                                                'items-center',
                                                                'justify-between',
                                                                'gap-3',
                                                                'px-2',
                                                                'py-2',
                                                                employeeIndex >
                                                                0
                                                                    ? 'border-t border-base-300'
                                                                    : '',
                                                            ].join(' ')}
                                                        >

                                                            {/* EMPLOYEE */}

                                                            <div className="
                                                                flex
                                                                min-w-0
                                                                items-center
                                                                gap-3
                                                            ">

                                                                <div className="
                                                                    flex
                                                                    h-8
                                                                    w-8
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-base-200
                                                                ">

                                                                    <span className="
                                                                        text-xs
                                                                        font-semibold
                                                                        text-base-content/55
                                                                    ">
                                                                        {employee.name
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </span>

                                                                </div>


                                                                <div className="
                                                                    min-w-0
                                                                ">

                                                                    <p className="
                                                                        truncate
                                                                        text-sm
                                                                        font-medium
                                                                        text-base-content
                                                                    ">
                                                                        {
                                                                            employee.name
                                                                        }
                                                                    </p>


                                                                    <p className="
                                                                        text-[10px]
                                                                        text-base-content/40
                                                                    ">
                                                                        ID:{' '}
                                                                        {
                                                                            employee.id
                                                                        }
                                                                    </p>

                                                                </div>

                                                            </div>


                                                            {/* EMPLOYEE TOGGLE */}

                                                            <button
                                                                type="button"
                                                                role="switch"
                                                                aria-checked={
                                                                    employee.enabled
                                                                }
                                                                onClick={() =>
                                                                    handleEmployeeToggle(
                                                                        loan.id,
                                                                        employee
                                                                    )
                                                                }
                                                                disabled={
                                                                    employeeUpdating ||
                                                                    Boolean(
                                                                        updatingAssignment
                                                                    )
                                                                }
                                                                aria-label={
                                                                    `Toggle ${employee.name} for ${loan.name}`
                                                                }
                                                                className={[
                                                                    'relative',
                                                                    'h-5',
                                                                    'w-9',
                                                                    'shrink-0',
                                                                    'rounded-full',
                                                                    'transition-colors',
                                                                    'duration-200',
                                                                    'focus:outline-none',
                                                                    'focus:ring-2',
                                                                    'focus:ring-[#8BCF00]/30',
                                                                    'disabled:cursor-not-allowed',
                                                                    'disabled:opacity-50',
                                                                    employee.enabled
                                                                        ? 'bg-[#8BCF00]'
                                                                        : 'bg-base-300',
                                                                ].join(' ')}
                                                            >

                                                                <span
                                                                    className={[
                                                                        'absolute',
                                                                        'left-0.5',
                                                                        'top-0.5',
                                                                        'h-4',
                                                                        'w-4',
                                                                        'rounded-full',
                                                                        'bg-white',
                                                                        'shadow-sm',
                                                                        'transition-transform',
                                                                        'duration-200',
                                                                        employee.enabled
                                                                            ? 'translate-x-4'
                                                                            : 'translate-x-0',
                                                                    ].join(' ')}
                                                                />

                                                            </button>

                                                        </div>
                                                    )
                                                }
                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>

                        )

                    }
                )}

            </div>


            {/* =====================================================
                FEEDBACK MODAL
            ===================================================== */}

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
                onClose={
                    closeFeedback
                }
            />

        </div>
    )
}


export default LoanAssignment