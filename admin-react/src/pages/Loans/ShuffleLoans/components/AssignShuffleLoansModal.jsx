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
        .map((value) => String(value))


    if (!values.length) {
        return ''
    }


    const firstValue = values[0]


    return values.every((value) => value === firstValue)
        ? firstValue
        : ''

}


const getAgentValue = (agent) =>
    agent?.id ??
    agent?.agentId ??
    agent?.employeeId ??
    agent?.name ??
    ''


const getRmValue = (rm) =>
    rm?.id ??
    rm?.rmId ??
    rm?.employeeId ??
    rm?.name ??
    ''


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
                    application.agent?.id ??
                    application.agentName ??
                    application.agent_name ??
                    application.agent?.name
            )
        )


        setSelectedRM(
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
        )


        setSelectedLoanType(
            getCommonValue(
                applications,
                (application) =>
                    application.loanType ??
                    application.loan_type
            )
        )

    }, [
        open,
        applications,
    ])


    const selectedAgentName = useMemo(() => {

        if (!selectedAgent) {
            return ''
        }


        return agents.find(
            (agent) =>
                String(getAgentValue(agent)) ===
                String(selectedAgent)
        )?.name || ''

    }, [
        agents,
        selectedAgent,
    ])


    const selectedRMName = useMemo(() => {

        if (!selectedRM) {
            return ''
        }


        return rms.find(
            (rm) =>
                String(getRmValue(rm)) ===
                String(selectedRM)
        )?.name || ''

    }, [
        rms,
        selectedRM,
    ])


    const canSubmit =
        Boolean(selectedAgent) ||
        Boolean(selectedRM) ||
        Boolean(selectedLoanType)


    const handleSubmit = (event) => {

        event.preventDefault()


        if (!canSubmit) {
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


                <form onSubmit={handleSubmit}>

                    <div className="
                        space-y-5
                        p-5
                    ">

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
                            buttonClassName="h-11 min-h-11 hover:border-[#8BCF00]"
                            getOptionValue={(agent) =>
                                String(getAgentValue(agent))
                            }
                        />


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
                            buttonClassName="h-11 min-h-11 hover:border-[#8BCF00]"
                            getOptionValue={(rm) =>
                                String(getRmValue(rm))
                            }
                        />


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
                            buttonClassName="h-11 min-h-11 hover:border-[#8BCF00]"
                        />


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
