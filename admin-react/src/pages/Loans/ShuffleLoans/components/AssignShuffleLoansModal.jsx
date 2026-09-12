// admin-react/src/pages/Loans/ShuffleLoans/components/AssignShuffleLoansModal.jsx

import { useEffect, useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'

import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'
import LoanTypeDropdown from '../../../../components/GlobalModels/Filters/LoanTypeDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'


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
        .map(String)

    if (!values.length) {
        return ''
    }

    const firstValue = values[0]

    return values.every(
        (value) => value === firstValue
    )
        ? firstValue
        : ''
}


const getAgentValue = (agent) =>
    agent?.id ??
    agent?.agentId ??
    agent?.employeeId ??
    ''


const getRmValue = (rm) =>
    rm?.id ??
    rm?.rmId ??
    rm?.employeeId ??
    ''


const getLoanTypeValue = (loanType) => {

    if (
        typeof loanType === 'string' ||
        typeof loanType === 'number'
    ) {
        return loanType
    }

    return (
        loanType?.id ??
        loanType?.loanTypeId ??
        loanType?.loan_type_id ??
        ''
    )
}


function AssignShuffleLoansModal({
    open,
    applications = [],
    agents = [],
    rms = [],
    loanTypes = [],
    onClose,
    onSubmit,
}) {

    const [selectedAgent, setSelectedAgent] =
        useState('')

    const [selectedRM, setSelectedRM] =
        useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')


    // =========================================================
    // INITIAL VALUES
    // =========================================================

    useEffect(() => {

        if (!open) {

            setSelectedAgent('')
            setSelectedRM('')
            setSelectedLoanType('')

            return
        }


        setSelectedAgent(
            getCommonValue(
                applications,
                (application) =>
                    application.agentId ??
                    application.agent_id ??
                    application.agent?.id
            )
        )


        setSelectedRM(
            getCommonValue(
                applications,
                (application) =>
                    application.rmId ??
                    application.rm_id ??
                    application.rm?.id
            )
        )


        setSelectedLoanType(
            getCommonValue(
                applications,
                (application) =>
                    application.loanTypeId ??
                    application.loan_type_id ??
                    application.loanType?.id ??
                    application.loan_type?.id
            )
        )

    }, [
        open,
        applications,
    ])


    // =========================================================
    // SELECTED AGENT NAME
    // =========================================================

    const selectedAgentName = useMemo(() => {

        if (!selectedAgent) {
            return ''
        }

        return (
            agents.find(
                (agent) =>
                    String(
                        getAgentValue(agent)
                    ) === String(selectedAgent)
            )?.name || ''
        )

    }, [
        agents,
        selectedAgent,
    ])


    // =========================================================
    // SELECTED RM NAME
    // =========================================================

    const selectedRMName = useMemo(() => {

        if (!selectedRM) {
            return ''
        }

        return (
            rms.find(
                (rm) =>
                    String(
                        getRmValue(rm)
                    ) === String(selectedRM)
            )?.name || ''
        )

    }, [
        rms,
        selectedRM,
    ])


    // =========================================================
    // SUBMIT STATE
    // =========================================================

    const canSubmit =
        Boolean(selectedAgent) ||
        Boolean(selectedRM) ||
        Boolean(selectedLoanType)


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {

        event.preventDefault()

        if (!canSubmit) {
            return
        }

        onSubmit?.({

            applicationIds:
                applications.map(
                    (application) =>
                        Number(application.id)
                ),

            agentId:
                selectedAgent
                    ? Number(selectedAgent)
                    : null,

            rmId:
                selectedRM
                    ? Number(selectedRM)
                    : null,

            loanTypeId:
                selectedLoanType
                    ? Number(selectedLoanType)
                    : null,

            // Display values are retained for UI compatibility.
            agentName:
                selectedAgentName || null,

            rmName:
                selectedRMName || null,

        })
    }


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {
        onClose?.()
    }


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
                border
                border-base-300
                bg-base-100
                p-0
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
                            btn-circle
                            btn-ghost
                            btn-sm
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

                        {/* SELECTED APPLICATIONS */}

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
                                            : ''}
                                    </p>

                                </div>


                                <UserIcon className="
                                    h-5
                                    w-5
                                    text-base-content/40
                                " />

                            </div>

                        </div>


                        {/* AGENT */}

                        <AgentDropdown
                            label="Agent"
                            value={selectedAgent}
                            onChange={setSelectedAgent}
                            options={agents}
                            placeholder="Select Agent"
                            searchPlaceholder="Search agent"
                            emptyMessage="No agents found"
                            includeAllOption={false}
                            className="min-w-0"
                            buttonClassName="
                                h-11
                                min-h-11
                                hover:border-[#8BCF00]
                            "
                            getOptionValue={(agent) =>
                                String(
                                    getAgentValue(agent)
                                )
                            }
                        />


                        {/* RM */}

                        <RmDropdown
                            label="RM"
                            value={selectedRM}
                            onChange={setSelectedRM}
                            options={rms}
                            placeholder="Select RM"
                            searchPlaceholder="Search RM"
                            emptyMessage="No RMs found"
                            includeAllOption={false}
                            className="min-w-0"
                            buttonClassName="
                                h-11
                                min-h-11
                                hover:border-[#8BCF00]
                            "
                            getOptionValue={(rm) =>
                                String(
                                    getRmValue(rm)
                                )
                            }
                        />


                        {/* LOAN TYPE */}

                        <LoanTypeDropdown
                            label="Loan Type"
                            value={selectedLoanType}
                            onChange={setSelectedLoanType}
                            options={loanTypes}
                            placeholder="Select Loan Type"
                            searchPlaceholder="Search loan type"
                            emptyMessage="No loan types found"
                            includeAllOption={false}
                            className="min-w-0"
                            buttonClassName="
                                h-11
                                min-h-11
                                hover:border-[#8BCF00]
                            "
                            getOptionValue={(loanType) =>
                                String(
                                    getLoanTypeValue(
                                        loanType
                                    )
                                )
                            }
                        />


                        {/* INFO */}

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
                                btn-ghost
                                btn-sm
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={!canSubmit}
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


            {/* BACKDROP */}

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