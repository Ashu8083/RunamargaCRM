import { useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'


// =========================================================
// EMPLOYEE DATA
// =========================================================

const employees = [
    { id: 101, name: 'Prashanth' },
    { id: 102, name: 'Kasturi' },
    { id: 103, name: 'Nayana' },
]


// =========================================================
// INITIAL LOAN ASSIGNMENTS
// =========================================================
// Priority order:
// 1. Personal Loan
// 2. Business Loan
// 3. Home Loan
// 4. Loan Against Property
// 5. Vehicle Loan
// 6. Education Loan
// 7. Gold Loan
// 8. Credit Card
// 9. Agricultural Loan
// =========================================================

const INITIAL_ASSIGNMENTS = [

    {
        id: 1,
        name: 'Personal Loan',
        color: '#2196F3',
        employees: employees.map((employee) => ({
            ...employee,
            enabled: employee.id === 101,
        })),
    },

    {
        id: 2,
        name: 'Business Loan',
        color: '#FFB300',
        employees: employees.map((employee) => ({
            ...employee,
            enabled: false,
        })),
    },

    {
        id: 3,
        name: 'Home Loan',
        color: '#1DB5B5',
        employees: employees.map((employee) => ({
            ...employee,
            enabled: false,
        })),
    },

    {
        id: 4,
        name: 'Loan Against Property',
        color: '#F05AA8',
        employees: employees.map((employee) => ({
            ...employee,
            enabled: false,
        })),
    },

    {
        id: 5,
        name: 'Vehicle Loan',
        color: '#19B77A',
        employees: employees.map((employee) => ({
            ...employee,
            enabled: false,
        })),
    },

    {
        id: 6,
        name: 'Education Loan',
        color: '#8B2BE2',
        employees: employees.map((employee) => ({
            ...employee,
            enabled: false,
        })),
    },

    {
        id: 7,
        name: 'Gold Loan',
        color: '#FF8C00',
        employees: employees.map((employee) => ({
            ...employee,
            enabled: false,
        })),
    },

    {
        id: 8,
        name: 'Credit Card',
        color: '#F43F70',
        employees: employees.map((employee) => ({
            ...employee,
            enabled: false,
        })),
    },

    {
        id: 9,
        name: 'Agricultural Loan',
        color: '#2196F3',
        employees: employees.map((employee) => ({
            ...employee,
            enabled: false,
        })),
    },

]


function LoanAssignment() {

    // =========================================================
    // STATE
    // =========================================================

    const [loanAssignments, setLoanAssignments] =
        useState(INITIAL_ASSIGNMENTS)

    const [expandedLoans, setExpandedLoans] =
        useState(new Set([1]))


    // =========================================================
    // COUNTS
    // =========================================================

    const totalEmployees =
        loanAssignments.reduce(
            (total, loan) =>
                total + loan.employees.length,
            0
        )


    const enabledEmployees =
        loanAssignments.reduce(
            (total, loan) =>
                total +
                loan.employees.filter(
                    (employee) =>
                        employee.enabled
                ).length,
            0
        )


    // =========================================================
    // TOGGLE EXPAND / COLLAPSE
    // =========================================================

    const toggleExpanded = (loanId) => {

        setExpandedLoans((previous) => {

            const next = new Set(previous)

            if (next.has(loanId)) {
                next.delete(loanId)
            } else {
                next.add(loanId)
            }

            return next
        })

    }


    // =========================================================
    // TOGGLE ENTIRE LOAN
    // =========================================================

    const handleLoanToggle = (loanId) => {

        setLoanAssignments((previous) =>
            previous.map((loan) => {

                if (loan.id !== loanId) {
                    return loan
                }


                const allEnabled =
                    loan.employees.length > 0 &&
                    loan.employees.every(
                        (employee) =>
                            employee.enabled
                    )


                const nextEnabled =
                    !allEnabled


                return {
                    ...loan,

                    employees:
                        loan.employees.map(
                            (employee) => ({
                                ...employee,
                                enabled:
                                    nextEnabled,
                            })
                        ),
                }

            })
        )

    }


    // =========================================================
    // TOGGLE INDIVIDUAL EMPLOYEE
    // =========================================================

    const handleEmployeeToggle = (
        loanId,
        employeeId
    ) => {

        setLoanAssignments((previous) =>
            previous.map((loan) => {

                if (loan.id !== loanId) {
                    return loan
                }


                return {
                    ...loan,

                    employees:
                        loan.employees.map(
                            (employee) =>
                                employee.id ===
                                employeeId
                                    ? {
                                        ...employee,
                                        enabled:
                                            !employee.enabled,
                                    }
                                    : employee
                        ),
                }

            })
        )

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * API refresh will be connected later.
         */

        console.log(
            'Refresh Loan Assignment'
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
                            "
                        >

                            <ArrowPathIcon className="
                                h-4.5
                                w-4.5
                                text-base-content/60
                            " />

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

                {loanAssignments.map(
                    (loan, loanIndex) => {

                        const totalCount =
                            loan.employees.length


                        const enabledCount =
                            loan.employees.filter(
                                (employee) =>
                                    employee.enabled
                            ).length


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


                        // -------------------------------------------------
                        // STATUS
                        // -------------------------------------------------

                        let statusLabel =
                            'Paused'

                        if (allEnabled) {
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
                                                loan.id
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

                                            {loan.employees.map(
                                                (
                                                    employee,
                                                    employeeIndex
                                                ) => (

                                                    <div
                                                        key={
                                                            employee.id
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
                                                                    employee.id
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
                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>

                        )

                    }
                )}

            </div>

        </div>

    )

}


export default LoanAssignment