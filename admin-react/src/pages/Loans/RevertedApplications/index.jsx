// admin-react/src/pages/Loans/RevertedApplications/index.jsx

import { useMemo, useState } from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'

import AgentDropdown from '../../../components/GlobalModels/Filters/AgentDropdown'
import LoanTypeDropdown from '../../../components/GlobalModels/Filters/LoanTypeDropdown'

import RevertedApplicationsTable from './components/RevertedApplicationsTable'
import RevertDateModal from './components/RevertDateModal'
import RevertHistoryModal from './components/RevertHistoryModal'


function RevertedApplications() {

    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [applications, setApplications] = useState([
        {
            id: 1,
            applicantName: 'Sahil',
            loanType: 'Personal Loan',
            revertedDate: '2026-12-31T00:00:00',
            remarks: 'SAHIL KUMAR 79751566 rejected due to low credit score. Customer requested a revised date.',
            revertedBy: 'Asma Banu',
            revertedById: 201,
            originalDate: '2026-12-20T00:00:00',
            changeHistory: [
                {
                    id: 1,
                    changedBy: 'Asma Banu',
                    changedAt: '2026-08-24T10:30:00',
                    fromDate: '2026-12-20T00:00:00',
                    toDate: '2026-12-31T00:00:00',
                    remarks: 'Customer requested a revised date.',
                },
            ],
        },

        {
            id: 2,
            applicantName: 'jeevan',
            loanType: 'Personal Loan',
            revertedDate: '2027-02-18T00:00:00',
            remarks: 'High fojr',
            revertedBy: 'Asma Banu',
            revertedById: 201,
            originalDate: '2027-02-10T00:00:00',
            changeHistory: [],
        },

        {
            id: 3,
            applicantName: 'Govinda',
            loanType: 'Personal Loan',
            revertedDate: '2026-10-28T00:00:00',
            remarks: 'GOVINDADAS REJECT Mo...',
            revertedBy: 'Asma Banu',
            revertedById: 201,
            originalDate: '2026-10-20T00:00:00',
            changeHistory: [],
        },

        {
            id: 4,
            applicantName: 'Indrajit',
            loanType: 'Personal Loan',
            revertedDate: '2026-10-24T00:00:00',
            remarks: 'CUSTOMER RECENTLY LO...',
            revertedBy: 'Nayana',
            revertedById: 202,
            originalDate: '2026-10-15T00:00:00',
            changeHistory: [],
        },

        {
            id: 5,
            applicantName: 'jeevan',
            loanType: 'Personal Loan',
            revertedDate: '2026-11-26T00:00:00',
            remarks: '3 MONTHS REVERTING T...',
            revertedBy: 'Lokesh A',
            revertedById: 203,
            originalDate: '2026-11-18T00:00:00',
            changeHistory: [],
        },

        {
            id: 6,
            applicantName: 'Sharath',
            loanType: 'Personal Loan',
            revertedDate: '2026-11-24T00:00:00',
            remarks: 'CUSTOMER RECENTLY LO...',
            revertedBy: 'Nayana',
            revertedById: 202,
            originalDate: '2026-11-15T00:00:00',
            changeHistory: [],
        },

        {
            id: 7,
            applicantName: 'Charwin',
            loanType: 'Personal Loan',
            revertedDate: '2026-11-24T00:00:00',
            remarks: '3 MONTHS AFTER PROCE...',
            revertedBy: 'Lokesh A',
            revertedById: 203,
            originalDate: '2026-11-16T00:00:00',
            changeHistory: [],
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')

    const [selectedAgent, setSelectedAgent] =
        useState('')

    const [selectedDate, setSelectedDate] =
        useState('')


    // =========================================================
    // MODAL STATE
    // =========================================================

    const [selectedApplication, setSelectedApplication] =
        useState(null)

    const [showRevertDateModal, setShowRevertDateModal] =
        useState(false)

    const [showRevertHistoryModal, setShowRevertHistoryModal] =
        useState(false)


    // =========================================================
    // LOAN TYPES
    // =========================================================

    const loanTypes = useMemo(() => {

        return [
            ...new Set(
                applications
                    .map(
                        (application) =>
                            application.loanType ??
                            application.loan_type
                    )
                    .filter(Boolean)
            ),
        ]

    }, [applications])


    // =========================================================
    // REVERTED BY / AGENTS
    // =========================================================

    const agents = useMemo(() => {

        const map = new Map()


        applications.forEach((application) => {

            const id =
                application.revertedById ??
                application.reverted_by_id ??
                application.revertedBy ??
                application.reverted_by


            const name =
                application.revertedBy ??
                application.reverted_by ??
                'Unknown User'


            if (!id && !name) {
                return
            }


            const key =
                String(id ?? name)


            if (!map.has(key)) {

                map.set(key, {
                    id: id ?? name,
                    name,
                })

            }

        })


        return [...map.values()]

    }, [applications])


    // =========================================================
    // DATE FORMATTER
    // =========================================================

    const formatDateForFilter = (value) => {

        if (!value) {
            return ''
        }


        const date =
            new Date(value)


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return ''
        }


        const year =
            date.getFullYear()


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, '0')


        const day =
            String(
                date.getDate()
            ).padStart(2, '0')


        return `${year}-${month}-${day}`

    }


    // =========================================================
    // FILTER APPLICATIONS
    // =========================================================

    const filteredApplications = useMemo(() => {

        const value =
            search
                .trim()
                .toLowerCase()


        return applications.filter(
            (application) => {

                // -------------------------------------------------
                // SEARCH
                // -------------------------------------------------

                if (
                    value &&
                    ![
                        application.applicantName,
                        application.applicant_name,
                        application.name,
                        application.phone,
                        application.loanId,
                        application.loan_id,
                        application.loanType,
                        application.loan_type,
                        application.remarks,
                        application.remark,
                        application.revertedBy,
                        application.reverted_by,
                        application.id,
                    ].some(
                        (field) =>
                            field !== null &&
                            field !== undefined &&
                            String(field)
                                .toLowerCase()
                                .includes(value)
                    )
                ) {

                    return false

                }


                // -------------------------------------------------
                // LOAN TYPE
                // -------------------------------------------------

                const applicationLoanType =
                    application.loanType ??
                    application.loan_type


                if (
                    selectedLoanType &&
                    applicationLoanType !==
                        selectedLoanType
                ) {

                    return false

                }


                // -------------------------------------------------
                // REVERTED BY / AGENT
                // -------------------------------------------------

                if (selectedAgent) {

                    const revertedById =
                        application.revertedById ??
                        application.reverted_by_id ??
                        application.revertedBy ??
                        application.reverted_by


                    if (
                        String(revertedById) !==
                        String(selectedAgent)
                    ) {

                        return false

                    }

                }


                // -------------------------------------------------
                // REVERTED DATE
                // -------------------------------------------------

                if (selectedDate) {

                    const applicationDate =
                        formatDateForFilter(
                            application.revertedDate ??
                            application.reverted_date
                        )


                    if (
                        applicationDate !==
                        selectedDate
                    ) {

                        return false

                    }

                }


                return true

            }
        )

    }, [
        applications,
        search,
        selectedLoanType,
        selectedAgent,
        selectedDate,
    ])


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearch('')

        setSelectedLoanType('')

        setSelectedAgent('')

        setSelectedDate('')

    }


    // =========================================================
    // CHANGE REVERTED DATE
    // =========================================================

    const handleChangeDate = (application) => {

        setSelectedApplication(application)

        setShowRevertDateModal(true)

    }


    const handleCloseDateModal = () => {

        setShowRevertDateModal(false)

        setSelectedApplication(null)

    }


    const handleDateSubmit = (data) => {

        setApplications((previous) =>
            previous.map((application) => {

                if (
                    application.id !==
                    data.id
                ) {

                    return application

                }


                const previousDate =
                    application.revertedDate


                const newDate =
                    data.revertedDate


                const historyEntry = {

                    id: Date.now(),

                    changedBy:
                        data.changedBy ||
                        'Current User',

                    changedAt:
                        new Date().toISOString(),

                    fromDate:
                        previousDate,

                    toDate:
                        newDate,

                    remarks:
                        data.remarks ||
                        '',
                }


                return {

                    ...application,

                    revertedDate:
                        newDate,

                    remarks:
                        data.remarks ||
                        application.remarks,

                    changeHistory: [
                        ...(application.changeHistory ||
                            []),
                        historyEntry,
                    ],

                }

            })
        )


        handleCloseDateModal()

    }


    // =========================================================
    // VIEW CHANGE HISTORY
    // =========================================================

    const handleViewHistory = (
        application
    ) => {

        setSelectedApplication(
            application
        )

        setShowRevertHistoryModal(
            true
        )

    }


    const handleCloseHistoryModal = () => {

        setShowRevertHistoryModal(
            false
        )

        setSelectedApplication(
            null
        )

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * API refresh will be added later.
         */

        console.log(
            'Refresh Reverted Applications'
        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            p-4
            sm:p-6
            space-y-5
        ">

            {/* =====================================================
                FILTER SECTION
            ===================================================== */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    px-5
                    pt-5
                    pb-4
                ">

                    {/* FILTER HEADER */}

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-base-content/70
                        ">
                            Filter Options
                        </p>


                        {(search ||
                            selectedLoanType ||
                            selectedAgent ||
                            selectedDate) && (

                            <button
                                type="button"
                                onClick={
                                    handleClearFilters
                                }
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    text-xs
                                    font-medium
                                    text-[#78B300]
                                    hover:text-[#5f9000]
                                "
                            >

                                <XMarkIcon className="
                                    h-3.5
                                    w-3.5
                                " />

                                Clear Filters

                            </button>

                        )}

                    </div>


                    {/* FILTER CONTROLS */}

                    <div className="
                        mt-4
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-2
                        xl:grid-cols-4
                    ">

                        {/* =================================================
                            SEARCH
                        ================================================= */}

                        <div className="
                            relative
                        ">

                            <MagnifyingGlassIcon className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-5
                                w-5
                                -translate-y-1/2
                                text-base-content/45
                            " />


                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by name, phone, loan ID..."
                                className="
                                    input
                                    input-bordered
                                    w-full
                                    pl-10
                                "
                            />

                        </div>


                        {/* =================================================
                            LOAN TYPE
                        ================================================= */}

                        <LoanTypeDropdown
                            value={
                                selectedLoanType
                            }
                            onChange={
                                setSelectedLoanType
                            }
                            options={loanTypes}
                            showLabel={false}
                            className="min-w-0"
                            buttonClassName="h-12 min-h-12 px-4"
                        />


                        {/* =================================================
                            AGENT SEARCH DROPDOWN
                        ================================================= */}

                        <AgentDropdown
                            value={selectedAgent}
                            onChange={setSelectedAgent}
                            options={agents}
                            showLabel={false}
                            className="min-w-0"
                            buttonClassName="h-12 min-h-12 px-4"
                        />


                        {/* =================================================
                            DATE
                        ================================================= */}

                        <div className="
                            relative
                        ">

                            <input
                                type="date"
                                value={
                                    selectedDate
                                }
                                onChange={(event) =>
                                    setSelectedDate(
                                        event.target.value
                                    )
                                }
                                className="
                                    input
                                    input-bordered
                                    w-full
                                "
                            />

                        </div>

                    </div>


                    {/* =================================================
                        RESULT COUNT
                    ================================================= */}

                    <p className="
                        mt-4
                        text-xs
                        font-medium
                        text-base-content/60
                    ">

                        {filteredApplications.length}{' '}

                        {filteredApplications.length === 1
                            ? 'result'
                            : 'results'}{' '}

                        found

                    </p>

                </div>

            </div>


            {/* =====================================================
                TABLE SECTION
            ===================================================== */}

            <RevertedApplicationsTable
                applications={
                    filteredApplications
                }
                onChangeDate={
                    handleChangeDate
                }
                onViewHistory={
                    handleViewHistory
                }
                onRefresh={
                    handleRefresh
                }
            />


            {/* =====================================================
                CHANGE DATE MODAL
            ===================================================== */}

            <RevertDateModal
                open={
                    showRevertDateModal
                }
                application={
                    selectedApplication
                }
                onClose={
                    handleCloseDateModal
                }
                onSubmit={
                    handleDateSubmit
                }
            />


            {/* =====================================================
                CHANGE HISTORY MODAL
            ===================================================== */}

            <RevertHistoryModal
                open={
                    showRevertHistoryModal
                }
                application={
                    selectedApplication
                }
                onClose={
                    handleCloseHistoryModal
                }
            />

        </div>

    )

}


export default RevertedApplications
