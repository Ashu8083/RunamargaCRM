// admin-react/src/pages/Loans/ShuffleLoans/components/AssignShuffleLoansModal.jsx

import { useEffect, useMemo, useRef, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'


function AssignShuffleLoansModal({
    open,
    applications = [],
    agents = [],
    rms = [],
    loanTypes = [],
    onClose,
    onSubmit,
}) {

    // =========================================================
    // FORM STATE
    // =========================================================

    const [selectedAgent, setSelectedAgent] =
        useState('')

    const [selectedRM, setSelectedRM] =
        useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')


    // =========================================================
    // DROPDOWN STATE
    // =========================================================

    const [openDropdown, setOpenDropdown] =
        useState(null)

    const [agentSearch, setAgentSearch] =
        useState('')

    const [rmSearch, setRMSearch] =
        useState('')

    const [loanTypeSearch, setLoanTypeSearch] =
        useState('')


    // =========================================================
    // DROPDOWN REF
    // =========================================================

    const dropdownRef = useRef(null)


    // =========================================================
    // LOAD DEFAULT VALUES
    // =========================================================

    useEffect(() => {

        if (!open) {

            setSelectedAgent('')
            setSelectedRM('')
            setSelectedLoanType('')

            setOpenDropdown(null)

            setAgentSearch('')
            setRMSearch('')
            setLoanTypeSearch('')

            return

        }


        /*
         * When multiple applications are selected,
         * only use a value if all selected applications
         * currently have the same value.
         */

        const getCommonValue = (items, getter) => {

            if (!items.length) {
                return ''
            }


            const values = items
                .map(getter)
                .filter(
                    (value) =>
                        value !== null &&
                        value !== undefined &&
                        value !== ''
                )
                .map((value) => String(value))


            if (!values.length) {
                return ''
            }


            const firstValue = values[0]


            if (
                values.every(
                    (value) =>
                        value === firstValue
                )
            ) {

                return firstValue

            }


            return ''

        }


        const commonAgent =
            getCommonValue(
                applications,
                (application) =>
                    application.agentId ??
                    application.agent_id ??
                    application.agent?.id ??
                    application.agentName ??
                    application.agent_name ??
                    application.agent?.name
            )


        const commonRM =
            getCommonValue(
                applications,
                (application) =>
                    application.rmId ??
                    application.rm_id ??
                    application.rm?.id ??
                    application.rmName ??
                    application.rm_name ??
                    application.rm?.name
            )


        const commonLoanType =
            getCommonValue(
                applications,
                (application) =>
                    application.loanType
            )


        setSelectedAgent(commonAgent)

        setSelectedRM(commonRM)

        setSelectedLoanType(commonLoanType)

    }, [open, applications])


    // =========================================================
    // CLOSE DROPDOWN ON OUTSIDE CLICK
    // =========================================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {

                setOpenDropdown(null)

            }

        }


        if (openDropdown) {

            document.addEventListener(
                'mousedown',
                handleOutsideClick
            )

        }


        return () => {

            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            )

        }

    }, [openDropdown])


    // =========================================================
    // FILTER AGENTS
    // =========================================================

    const filteredAgents = useMemo(() => {

        const value =
            agentSearch
                .trim()
                .toLowerCase()


        if (!value) {
            return agents
        }


        return agents.filter(
            (agent) =>
                String(
                    agent.name || ''
                )
                    .toLowerCase()
                    .includes(value)
        )

    }, [agents, agentSearch])


    // =========================================================
    // FILTER RMS
    // =========================================================

    const filteredRMs = useMemo(() => {

        const value =
            rmSearch
                .trim()
                .toLowerCase()


        if (!value) {
            return rms
        }


        return rms.filter(
            (rm) =>
                String(
                    rm.name || ''
                )
                    .toLowerCase()
                    .includes(value)
        )

    }, [rms, rmSearch])


    // =========================================================
    // FILTER LOAN TYPES
    // =========================================================

    const filteredLoanTypes = useMemo(() => {

        const value =
            loanTypeSearch
                .trim()
                .toLowerCase()


        if (!value) {
            return loanTypes
        }


        return loanTypes.filter(
            (loanType) =>
                String(loanType)
                    .toLowerCase()
                    .includes(value)
        )

    }, [loanTypes, loanTypeSearch])


    // =========================================================
    // SELECT AGENT
    // =========================================================

    const handleAgentSelect = (agent) => {

        setSelectedAgent(
            String(agent.id)
        )

        setOpenDropdown(null)

        setAgentSearch('')

    }


    // =========================================================
    // SELECT RM
    // =========================================================

    const handleRMSelect = (rm) => {

        setSelectedRM(
            String(rm.id)
        )

        setOpenDropdown(null)

        setRMSearch('')

    }


    // =========================================================
    // SELECT LOAN TYPE
    // =========================================================

    const handleLoanTypeSelect = (loanType) => {

        setSelectedLoanType(loanType)

        setOpenDropdown(null)

        setLoanTypeSearch('')

    }


    // =========================================================
    // GET SELECTED NAMES
    // =========================================================

    const selectedAgentName =
        agents.find(
            (agent) =>
                String(agent.id) ===
                String(selectedAgent)
        )?.name || ''


    const selectedRMName =
        rms.find(
            (rm) =>
                String(rm.id) ===
                String(selectedRM)
        )?.name || ''


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {

        event.preventDefault()


        if (
            !selectedAgent &&
            !selectedRM &&
            !selectedLoanType
        ) {
            return
        }


        onSubmit?.({

            agentId:
                selectedAgent || null,

            agentName:
                selectedAgentName || null,

            rmId:
                selectedRM || null,

            rmName:
                selectedRMName || null,

            loanType:
                selectedLoanType || null,

        })

    }


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        setOpenDropdown(null)

        onClose?.()

    }


    // =========================================================
    // MODAL
    // =========================================================

    if (!open) {
        return null
    }


    return (

        <dialog
            open
            className="
                modal
                modal-bottom
                sm:modal-middle
            "
        >

            <div className="
                modal-box
                w-11/12
                max-w-xl
                p-0
                border
                border-base-300
                bg-base-100
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-5
                    py-4
                ">

                    <div className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#8BCF00]/10
                        ">

                            <UserGroupIcon className="
                                h-5
                                w-5
                                text-[#78B300]
                            " />

                        </div>


                        <div className="min-w-0">

                            <h3 className="
                                text-lg
                                font-semibold
                                text-base-content
                            ">
                                Assign / Shuffle Loans
                            </h3>


                            <p className="
                                mt-0.5
                                text-xs
                                text-base-content/50
                            ">
                                Assign selected applications to an agent or RM.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            btn
                            btn-sm
                            btn-ghost
                            btn-circle
                        "
                        aria-label="Close"
                    >

                        <XMarkIcon className="
                            h-5
                            w-5
                        " />

                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="
                        space-y-5
                        p-5
                    ">

                        {/* =================================================
                            SELECTED APPLICATIONS
                        ================================================= */}

                        <div className="
                            rounded-xl
                            border
                            border-base-300
                            bg-base-200/30
                            px-4
                            py-3
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            ">

                                <div>

                                    <p className="
                                        text-xs
                                        text-base-content/50
                                    ">
                                        Selected Applications
                                    </p>


                                    <p className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-base-content
                                    ">
                                        {applications.length} application
                                        {applications.length !== 1
                                            ? 's'
                                            : ''
                                        }
                                    </p>

                                </div>


                                <UserIcon className="
                                    h-5
                                    w-5
                                    text-base-content/40
                                " />

                            </div>

                        </div>


                        {/* =================================================
                            AGENT
                        ================================================= */}

                        <div
                            ref={dropdownRef}
                            className="
                                relative
                            "
                        >

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-base-content
                            ">
                                Agent
                            </label>


                            <button
                                type="button"
                                onClick={() => {

                                    setOpenDropdown(
                                        openDropdown === 'agent'
                                            ? null
                                            : 'agent'
                                    )

                                    setRMSearch('')
                                    setLoanTypeSearch('')

                                }}
                                className="
                                    flex
                                    h-11
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-100
                                    px-3
                                    text-left
                                    transition
                                    hover:border-[#8BCF00]
                                "
                            >

                                <span className={`
                                    truncate
                                    text-sm
                                    ${
                                        selectedAgentName
                                            ? 'text-base-content'
                                            : 'text-base-content/45'
                                    }
                                `}>

                                    {selectedAgentName ||
                                        'Select Agent'
                                    }

                                </span>


                                <ChevronDownIcon className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-base-content/50
                                " />

                            </button>


                            {openDropdown === 'agent' && (

                                <div className="
                                    absolute
                                    left-0
                                    right-0
                                    top-full
                                    z-[100]
                                    mt-1
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-base-300
                                    bg-base-100
                                    shadow-xl
                                ">

                                    {/* SEARCH */}

                                    <div className="
                                        border-b
                                        border-base-300
                                        p-2
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-base-300
                                            px-3
                                        ">

                                            <MagnifyingGlassIcon className="
                                                h-4
                                                w-4
                                                shrink-0
                                                text-base-content/40
                                            " />


                                            <input
                                                type="text"
                                                value={agentSearch}
                                                onChange={(event) =>
                                                    setAgentSearch(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Search agent..."
                                                autoFocus
                                                className="
                                                    w-full
                                                    bg-transparent
                                                    py-2
                                                    text-sm
                                                    outline-none
                                                    placeholder:text-base-content/40
                                                "
                                            />

                                        </div>

                                    </div>


                                    {/* OPTIONS */}

                                    <div className="
                                        max-h-52
                                        overflow-y-auto
                                        p-1
                                    ">

                                        {filteredAgents.length === 0 ? (

                                            <div className="
                                                px-3
                                                py-6
                                                text-center
                                                text-xs
                                                text-base-content/45
                                            ">
                                                No agents found
                                            </div>

                                        ) : (

                                            filteredAgents.map((agent) => (

                                                <button
                                                    key={agent.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleAgentSelect(
                                                            agent
                                                        )
                                                    }
                                                    className={`
                                                        flex
                                                        w-full
                                                        items-center
                                                        justify-between
                                                        rounded-lg
                                                        px-3
                                                        py-2.5
                                                        text-left
                                                        text-sm
                                                        transition
                                                        hover:bg-base-200
                                                        ${
                                                            String(
                                                                selectedAgent
                                                            ) ===
                                                            String(agent.id)
                                                                ? 'bg-[#8BCF00]/10 text-[#398A2F]'
                                                                : 'text-base-content'
                                                        }
                                                    `}
                                                >

                                                    <span>
                                                        {agent.name}
                                                    </span>


                                                    {String(
                                                        selectedAgent
                                                    ) ===
                                                    String(agent.id) && (

                                                        <span className="
                                                            text-xs
                                                            font-medium
                                                        ">
                                                            Selected
                                                        </span>

                                                    )}

                                                </button>

                                            ))

                                        )}

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            RM
                        ================================================= */}

                        <div
                            className="
                                relative
                            "
                        >

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-base-content
                            ">
                                RM
                            </label>


                            <button
                                type="button"
                                onClick={() => {

                                    setOpenDropdown(
                                        openDropdown === 'rm'
                                            ? null
                                            : 'rm'
                                    )

                                    setAgentSearch('')
                                    setLoanTypeSearch('')

                                }}
                                className="
                                    flex
                                    h-11
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-100
                                    px-3
                                    text-left
                                    transition
                                    hover:border-[#8BCF00]
                                "
                            >

                                <span className={`
                                    truncate
                                    text-sm
                                    ${
                                        selectedRMName
                                            ? 'text-base-content'
                                            : 'text-base-content/45'
                                    }
                                `}>

                                    {selectedRMName ||
                                        'Select RM'
                                    }

                                </span>


                                <ChevronDownIcon className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-base-content/50
                                " />

                            </button>


                            {openDropdown === 'rm' && (

                                <div className="
                                    absolute
                                    left-0
                                    right-0
                                    z-[100]
                                    mt-1
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-base-300
                                    bg-base-100
                                    shadow-xl
                                ">

                                    <div className="
                                        border-b
                                        border-base-300
                                        p-2
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-base-300
                                            px-3
                                        ">

                                            <MagnifyingGlassIcon className="
                                                h-4
                                                w-4
                                                shrink-0
                                                text-base-content/40
                                            " />


                                            <input
                                                type="text"
                                                value={rmSearch}
                                                onChange={(event) =>
                                                    setRMSearch(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Search RM..."
                                                autoFocus
                                                className="
                                                    w-full
                                                    bg-transparent
                                                    py-2
                                                    text-sm
                                                    outline-none
                                                    placeholder:text-base-content/40
                                                "
                                            />

                                        </div>

                                    </div>


                                    <div className="
                                        max-h-52
                                        overflow-y-auto
                                        p-1
                                    ">

                                        {filteredRMs.length === 0 ? (

                                            <div className="
                                                px-3
                                                py-6
                                                text-center
                                                text-xs
                                                text-base-content/45
                                            ">
                                                No RMs found
                                            </div>

                                        ) : (

                                            filteredRMs.map((rm) => (

                                                <button
                                                    key={rm.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleRMSelect(
                                                            rm
                                                        )
                                                    }
                                                    className={`
                                                        flex
                                                        w-full
                                                        items-center
                                                        justify-between
                                                        rounded-lg
                                                        px-3
                                                        py-2.5
                                                        text-left
                                                        text-sm
                                                        transition
                                                        hover:bg-base-200
                                                        ${
                                                            String(
                                                                selectedRM
                                                            ) ===
                                                            String(rm.id)
                                                                ? 'bg-[#8BCF00]/10 text-[#398A2F]'
                                                                : 'text-base-content'
                                                        }
                                                    `}
                                                >

                                                    <span>
                                                        {rm.name}
                                                    </span>


                                                    {String(
                                                        selectedRM
                                                    ) ===
                                                    String(rm.id) && (

                                                        <span className="
                                                            text-xs
                                                            font-medium
                                                        ">
                                                            Selected
                                                        </span>

                                                    )}

                                                </button>

                                            ))

                                        )}

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            LOAN TYPE
                        ================================================= */}

                        <div className="
                            relative
                        ">

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-base-content
                            ">
                                Loan Type
                            </label>


                            <button
                                type="button"
                                onClick={() => {

                                    setOpenDropdown(
                                        openDropdown === 'loanType'
                                            ? null
                                            : 'loanType'
                                    )

                                    setAgentSearch('')
                                    setRMSearch('')

                                }}
                                className="
                                    flex
                                    h-11
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-100
                                    px-3
                                    text-left
                                    transition
                                    hover:border-[#8BCF00]
                                "
                            >

                                <span className={`
                                    truncate
                                    text-sm
                                    ${
                                        selectedLoanType
                                            ? 'text-base-content'
                                            : 'text-base-content/45'
                                    }
                                `}>

                                    {selectedLoanType ||
                                        'Select Loan Type'
                                    }

                                </span>


                                <ChevronDownIcon className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-base-content/50
                                " />

                            </button>


                            {openDropdown === 'loanType' && (

                                <div className="
                                    absolute
                                    left-0
                                    right-0
                                    z-[100]
                                    mt-1
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-base-300
                                    bg-base-100
                                    shadow-xl
                                ">

                                    <div className="
                                        border-b
                                        border-base-300
                                        p-2
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-base-300
                                            px-3
                                        ">

                                            <MagnifyingGlassIcon className="
                                                h-4
                                                w-4
                                                shrink-0
                                                text-base-content/40
                                            " />


                                            <input
                                                type="text"
                                                value={loanTypeSearch}
                                                onChange={(event) =>
                                                    setLoanTypeSearch(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Search loan type..."
                                                autoFocus
                                                className="
                                                    w-full
                                                    bg-transparent
                                                    py-2
                                                    text-sm
                                                    outline-none
                                                    placeholder:text-base-content/40
                                                "
                                            />

                                        </div>

                                    </div>


                                    <div className="
                                        max-h-52
                                        overflow-y-auto
                                        p-1
                                    ">

                                        {filteredLoanTypes.length === 0 ? (

                                            <div className="
                                                px-3
                                                py-6
                                                text-center
                                                text-xs
                                                text-base-content/45
                                            ">
                                                No loan types found
                                            </div>

                                        ) : (

                                            filteredLoanTypes.map(
                                                (loanType) => (

                                                    <button
                                                        key={loanType}
                                                        type="button"
                                                        onClick={() =>
                                                            handleLoanTypeSelect(
                                                                loanType
                                                            )
                                                        }
                                                        className={`
                                                            flex
                                                            w-full
                                                            items-center
                                                            justify-between
                                                            rounded-lg
                                                            px-3
                                                            py-2.5
                                                            text-left
                                                            text-sm
                                                            transition
                                                            hover:bg-base-200
                                                            ${
                                                                selectedLoanType ===
                                                                loanType
                                                                    ? 'bg-[#8BCF00]/10 text-[#398A2F]'
                                                                    : 'text-base-content'
                                                            }
                                                        `}
                                                    >

                                                        <span>
                                                            {loanType}
                                                        </span>


                                                        {selectedLoanType ===
                                                            loanType && (

                                                            <span className="
                                                                text-xs
                                                                font-medium
                                                            ">
                                                                Selected
                                                            </span>

                                                        )}

                                                    </button>

                                                )
                                            )

                                        )}

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            NOTE
                        ================================================= */}

                        <div className="
                            rounded-lg
                            border
                            border-[#8BCF00]/20
                            bg-[#8BCF00]/5
                            px-3
                            py-2.5
                        ">

                            <p className="
                                text-xs
                                leading-5
                                text-base-content/60
                            ">
                                Leave a field unchanged if you do not want
                                to update that assignment.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="
                        flex
                        justify-end
                        gap-2
                        border-t
                        border-base-300
                        p-4
                    ">

                        <button
                            type="button"
                            onClick={handleClose}
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                !selectedAgent &&
                                !selectedRM &&
                                !selectedLoanType
                            }
                            className="
                                btn
                                btn-sm
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
                        </button>

                    </div>

                </form>

            </div>


            {/* =================================================
                BACKDROP
            ================================================= */}

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={handleClose}
            >

                <button type="button">
                    close
                </button>

            </form>

        </dialog>

    )

}


export default AssignShuffleLoansModal
