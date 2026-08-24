// admin-react/src/pages/Loans/ShuffleLoans/index.jsx

import { useMemo, useState } from 'react'

import ShuffleLoansTable from './components/ShuffleLoansTable'
import AssignShuffleLoansModal from './components/AssignShuffleLoansModal'


function ShuffleLoans() {

    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [applications, setApplications] = useState([
        {
            id: 1,
            loanId: 'SL-2026-0001',
            name: 'Gowtham',
            phone: '9844882194',
            email: 'gowtham@example.com',
            loanType: 'Personal Loan',
            amount: '500000',
            agentId: 101,
            agentName: 'Prashanth',
            rmId: 201,
            rmName: 'Premalatha N',
            status: 'In Process',
            appliedDate: '2026-08-20',
        },
        {
            id: 2,
            loanId: 'SL-2026-0002',
            name: 'Mohammad',
            phone: '9980647870',
            email: 'mohammad@example.com',
            loanType: 'Personal Loan',
            amount: '400000',
            agentId: 102,
            agentName: 'Kasturi',
            rmId: 201,
            rmName: 'Premalatha N',
            status: 'In Process',
            appliedDate: '2026-08-20',
        },
        {
            id: 3,
            loanId: 'SL-2026-0003',
            name: 'Meghana',
            phone: '6362426300',
            email: 'meghana@example.com',
            loanType: 'Personal Loan',
            amount: '500000',
            agentId: 102,
            agentName: 'Kasturi',
            rmId: 202,
            rmName: 'Shubha',
            status: 'In Process',
            appliedDate: '2026-08-19',
        },
        {
            id: 4,
            loanId: 'SL-2026-0004',
            name: 'Rajesh Kumar',
            phone: '9876543210',
            email: 'rajesh@example.com',
            loanType: 'Business Loan',
            amount: '1000000',
            agentId: 103,
            agentName: 'Nayana',
            rmId: 203,
            rmName: 'Prasanna Y R',
            status: 'Docs Pending',
            appliedDate: '2026-08-18',
        },
        {
            id: 5,
            loanId: 'SL-2026-0005',
            name: 'Priya Sharma',
            phone: '9876543211',
            email: 'priya@example.com',
            loanType: 'Home Loan',
            amount: '2500000',
            agentId: 104,
            agentName: 'Prashanth',
            rmId: 202,
            rmName: 'Shubha',
            status: 'In Process',
            appliedDate: '2026-08-18',
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState('')

    const [selectedAgent, setSelectedAgent] =
        useState('')

    const [selectedRM, setSelectedRM] =
        useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')

    const [selectedStatus, setSelectedStatus] =
        useState('')


    // =========================================================
    // SELECTED APPLICATIONS
    // =========================================================

    const [
        selectedApplicationIds,
        setSelectedApplicationIds,
    ] = useState([])


    // =========================================================
    // ASSIGN MODAL
    // =========================================================

    const [showAssignModal, setShowAssignModal] =
        useState(false)


    // =========================================================
    // AGENTS
    // =========================================================

    const agents = useMemo(() => {

        const map = new Map()


        applications.forEach((application) => {

            const id =
                application.agentId ??
                application.agent_id ??
                application.agent?.id


            const name =
                application.agentName ??
                application.agent_name ??
                application.agent?.name


            if (!id && !name) {
                return
            }


            const key = String(id ?? name)


            if (!map.has(key)) {

                map.set(key, {
                    id: id ?? name,
                    name: name || 'Unknown Agent',
                })

            }

        })


        return [...map.values()]

    }, [applications])


    // =========================================================
    // RMS
    // =========================================================

    const rms = useMemo(() => {

        const map = new Map()


        applications.forEach((application) => {

            const id =
                application.rmId ??
                application.rm_id ??
                application.rm?.id


            const name =
                application.rmName ??
                application.rm_name ??
                application.rm?.name


            if (!id && !name) {
                return
            }


            const key = String(id ?? name)


            if (!map.has(key)) {

                map.set(key, {
                    id: id ?? name,
                    name: name || 'Unknown RM',
                })

            }

        })


        return [...map.values()]

    }, [applications])


    // =========================================================
    // LOAN TYPES
    // =========================================================

    const loanTypes = useMemo(() => {

        return [
            ...new Set(
                applications
                    .map(
                        (application) =>
                            application.loanType
                    )
                    .filter(Boolean)
            ),
        ]

    }, [applications])


    // =========================================================
    // STATUSES
    // =========================================================

    const statuses = useMemo(() => {

        return [
            ...new Set(
                applications
                    .map(
                        (application) =>
                            application.status
                    )
                    .filter(Boolean)
            ),
        ]

    }, [applications])


    // =========================================================
    // FILTER APPLICATIONS
    // =========================================================

    const filteredApplications = useMemo(() => {

        const value =
            search
                .trim()
                .toLowerCase()


        return applications.filter((application) => {

            // -----------------------------------------------------
            // SEARCH
            // -----------------------------------------------------

            if (
                value &&
                ![
                    application.name,
                    application.phone,
                    application.email,
                    application.loanId,
                    application.id,
                    application.loanType,
                    application.status,
                    application.agentName,
                    application.agent_name,
                    application.agent?.name,
                    application.rmName,
                    application.rm_name,
                    application.rm?.name,
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


            // -----------------------------------------------------
            // AGENT
            // -----------------------------------------------------

            if (selectedAgent) {

                const applicationAgent =
                    application.agentId ??
                    application.agent_id ??
                    application.agent?.id ??
                    application.agentName ??
                    application.agent_name ??
                    application.agent?.name


                if (
                    String(applicationAgent) !==
                    String(selectedAgent)
                ) {

                    return false

                }

            }


            // -----------------------------------------------------
            // RM
            // -----------------------------------------------------

            if (selectedRM) {

                const applicationRM =
                    application.rmId ??
                    application.rm_id ??
                    application.rm?.id ??
                    application.rmName ??
                    application.rm_name ??
                    application.rm?.name


                if (
                    String(applicationRM) !==
                    String(selectedRM)
                ) {

                    return false

                }

            }


            // -----------------------------------------------------
            // LOAN TYPE
            // -----------------------------------------------------

            if (
                selectedLoanType &&
                application.loanType !== selectedLoanType
            ) {

                return false

            }


            // -----------------------------------------------------
            // STATUS
            // -----------------------------------------------------

            if (
                selectedStatus &&
                application.status !== selectedStatus
            ) {

                return false

            }


            return true

        })

    }, [
        applications,
        search,
        selectedAgent,
        selectedRM,
        selectedLoanType,
        selectedStatus,
    ])


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearch('')
        setSelectedAgent('')
        setSelectedRM('')
        setSelectedLoanType('')
        setSelectedStatus('')

        setSelectedApplicationIds([])

    }


    // =========================================================
    // SELECT APPLICATION
    // =========================================================

    const handleSelectApplication = (applicationId) => {

        setSelectedApplicationIds((previous) => {

            if (previous.includes(applicationId)) {

                return previous.filter(
                    (id) =>
                        id !== applicationId
                )

            }


            return [
                ...previous,
                applicationId,
            ]

        })

    }


    // =========================================================
    // SELECT ALL
    // =========================================================

    const handleSelectAll = () => {

        const filteredIds =
            filteredApplications.map(
                (application) =>
                    application.id
            )


        const allSelected =
            filteredIds.length > 0 &&
            filteredIds.every(
                (id) =>
                    selectedApplicationIds.includes(id)
            )


        if (allSelected) {

            setSelectedApplicationIds(
                (previous) =>
                    previous.filter(
                        (id) =>
                            !filteredIds.includes(id)
                    )
            )

            return

        }


        setSelectedApplicationIds(
            (previous) => [
                ...new Set([
                    ...previous,
                    ...filteredIds,
                ]),
            ]
        )

    }


    // =========================================================
    // OPEN ASSIGN MODAL
    // =========================================================

    const handleOpenAssignModal = () => {

        if (
            selectedApplicationIds.length === 0
        ) {
            return
        }


        setShowAssignModal(true)

    }


    // =========================================================
    // CLOSE ASSIGN MODAL
    // =========================================================

    const handleCloseAssignModal = () => {

        setShowAssignModal(false)

    }


    // =========================================================
    // ASSIGN SUBMIT
    // =========================================================

    const handleAssignSubmit = (data) => {

        const {
            agentId,
            agentName,
            rmId,
            rmName,
            loanType,
        } = data


        setApplications((previous) =>
            previous.map((application) => {

                if (
                    !selectedApplicationIds.includes(
                        application.id
                    )
                ) {

                    return application

                }


                return {
                    ...application,

                    agentId:
                        agentId ??
                        application.agentId,

                    agentName:
                        agentName ??
                        application.agentName,

                    rmId:
                        rmId ??
                        application.rmId,

                    rmName:
                        rmName ??
                        application.rmName,

                    loanType:
                        loanType ||
                        application.loanType,

                    updatedAt:
                        new Date().toISOString(),
                }

            })
        )


        setSelectedApplicationIds([])

        handleCloseAssignModal()

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * API refresh will be added later.
         */

        console.log(
            'Refresh Shuffle Loans'
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

            {/* =================================================
                FILTERS + ASSIGN
            ================================================= */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                p-3
                shadow-sm
            ">

                <div className="
                    flex
                    flex-col
                    gap-3
                    lg:flex-row
                    lg:items-center
                ">

                    {/* SEARCH */}

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search"
                        className="
                            input
                            input-bordered
                            w-full
                            lg:flex-1
                            focus:border-[#8BCF00]
                            focus:outline-[#8BCF00]
                        "
                    />


                    {/* AGENT FILTER */}

                    <select
                        value={selectedAgent}
                        onChange={(event) =>
                            setSelectedAgent(
                                event.target.value
                            )
                        }
                        className="
                            select
                            select-bordered
                            w-full
                            lg:w-44
                            focus:border-[#8BCF00]
                            focus:outline-[#8BCF00]
                        "
                    >

                        <option value="">
                            All Agents
                        </option>


                        {agents.map((agent) => (

                            <option
                                key={agent.id}
                                value={agent.id}
                            >
                                {agent.name}
                            </option>

                        ))}

                    </select>


                    {/* RM FILTER */}

                    <select
                        value={selectedRM}
                        onChange={(event) =>
                            setSelectedRM(
                                event.target.value
                            )
                        }
                        className="
                            select
                            select-bordered
                            w-full
                            lg:w-44
                            focus:border-[#8BCF00]
                            focus:outline-[#8BCF00]
                        "
                    >

                        <option value="">
                            All RMs
                        </option>


                        {rms.map((rm) => (

                            <option
                                key={rm.id}
                                value={rm.id}
                            >
                                {rm.name}
                            </option>

                        ))}

                    </select>


                    {/* LOAN TYPE FILTER */}

                    <select
                        value={selectedLoanType}
                        onChange={(event) =>
                            setSelectedLoanType(
                                event.target.value
                            )
                        }
                        className="
                            select
                            select-bordered
                            w-full
                            lg:w-44
                            focus:border-[#8BCF00]
                            focus:outline-[#8BCF00]
                        "
                    >

                        <option value="">
                            All Loan Types
                        </option>


                        {loanTypes.map((loanType) => (

                            <option
                                key={loanType}
                                value={loanType}
                            >
                                {loanType}
                            </option>

                        ))}

                    </select>


                    {/* STATUS FILTER */}

                    <select
                        value={selectedStatus}
                        onChange={(event) =>
                            setSelectedStatus(
                                event.target.value
                            )
                        }
                        className="
                            select
                            select-bordered
                            w-full
                            lg:w-44
                            focus:border-[#8BCF00]
                            focus:outline-[#8BCF00]
                        "
                    >

                        <option value="">
                            All Statuses
                        </option>


                        {statuses.map((status) => (

                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>

                        ))}

                    </select>


                    {/* ASSIGN BUTTON */}

                    <button
                        type="button"
                        onClick={handleOpenAssignModal}
                        disabled={
                            selectedApplicationIds.length === 0
                        }
                        className="
                            btn
                            w-full
                            lg:w-auto
                            border-[#8BCF00]
                            bg-[#8BCF00]
                            text-white
                            hover:border-[#6FA800]
                            hover:bg-[#6FA800]
                            disabled:border-base-300
                            disabled:bg-base-300
                            disabled:text-base-content/40
                        "
                    >

                        Assign

                        {selectedApplicationIds.length > 0 && (
                            <>
                                {' '}
                                ({selectedApplicationIds.length})
                            </>
                        )}

                    </button>

                </div>


                {/* CLEAR FILTERS */}

                {(search ||
                    selectedAgent ||
                    selectedRM ||
                    selectedLoanType ||
                    selectedStatus) && (

                    <div className="
                        mt-3
                        flex
                        justify-end
                    ">

                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="
                                btn
                                btn-sm
                                btn-ghost
                                text-base-content/60
                                hover:bg-base-200
                            "
                        >
                            Clear Filters
                        </button>

                    </div>

                )}

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <ShuffleLoansTable
                applications={
                    filteredApplications
                }

                selectedApplicationIds={
                    selectedApplicationIds
                }

                onSelectApplication={
                    handleSelectApplication
                }

                onSelectAll={
                    handleSelectAll
                }

                onRefresh={
                    handleRefresh
                }
            />


            {/* =================================================
                ASSIGN MODAL
            ================================================= */}

            <AssignShuffleLoansModal
                open={showAssignModal}

                applications={
                    applications.filter(
                        (application) =>
                            selectedApplicationIds.includes(
                                application.id
                            )
                    )
                }

                agents={agents}

                rms={rms}

                loanTypes={loanTypes}

                onClose={
                    handleCloseAssignModal
                }

                onSubmit={
                    handleAssignSubmit
                }
            />

        </div>

    )

}


export default ShuffleLoans