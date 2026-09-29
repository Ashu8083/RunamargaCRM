import React, { useState, useEffect } from 'react'
import AssignBankModal from '../../modals/AssignBankModal'
import {
    assignBank,
    getBankProcessing, updateBankProcessingWorkflow, deleteApplicationBankProcessing
} from './Api'
/* -------------------------------------------------
   HELPERS
-------------------------------------------------- */
import { COLORS } from '../../../../../../constants/colors'
import BankProcessingWorkflowModal from '../../modals/BankProcessingWorkflowModal'


const formatAmount = (amount) => {

    if (
        amount === null ||
        amount === undefined ||
        amount === ''
    ) {
        return '-'
    }

    return `₹ ${Number(amount).toLocaleString('en-IN')}`
}


const formatDate = (date) => {

    if (!date) {
        return '-'
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
        return date
    }

    return parsedDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
    })
}


/* -------------------------------------------------
   TIMELINE ITEM
-------------------------------------------------- */

function TimelineItem({
    label,
    date,
    active,
}) {

    return (

        <div className="flex flex-col items-center text-center">

            <div
                className={`
                    w-5
                    h-5
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-[10px]
                    font-bold
                    z-10
                    ${active
                        ? 'text-white'
                        : 'bg-base-300 text-base-content/40'
                    }
                `}
                style={
                    active
                        ? {
                            backgroundColor: COLORS.GREEN,
                        }
                        : {}
                }
            >

                {active ? '✓' : ''}

            </div>


            <p className="text-[10px] text-base-content/60 mt-2">
                {label}
            </p>


            <p className="text-[10px] font-medium mt-1">
                {formatDate(date)}
            </p>

        </div>
    )
}


/* -------------------------------------------------
   BANK CARD
-------------------------------------------------- */

function BankCard({ bank, onWorkflowUpdate, onDelete }) {
    const [workflowAction, setWorkflowAction] = useState(null)
    const status =
        bank?.status
            ? bank.status.charAt(0).toUpperCase() +
            bank.status.slice(1)
            : 'Login'


    return (

        <div className="border border-base-300 rounded-xl bg-base-100 p-4">

            {/* -----------------------------------------
                BANK HEADER
            ------------------------------------------ */}

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-9
                            h-9
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-xs
                            font-bold
                            text-white
                        "
                        style={{
                            backgroundColor: COLORS.GREEN,
                        }}
                    >

                        {bank?.bank_name
                            ?.charAt(0)
                            ?.toUpperCase() || 'B'}

                    </div>


                    <div>

                        <h3 className="text-sm font-semibold">
                            {bank?.bank_name || '-'}
                        </h3>

                        <div className="mt-0.5">
                            <p className="text-xs text-base-content/50">
                                DSA: {bank?.dsa_name || '-'}
                            </p>

                            {bank?.dsa_code && (
                                <p className="text-[11px] text-base-content/40 mt-0.5">
                                    Code: {bank.dsa_code}
                                </p>
                            )}
                        </div>
                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-ghost btn-xs text-error"
                    title="Remove bank" onClick={() => onDelete(bank)}
                >
                    🗑
                </button>

            </div>


            {/* -----------------------------------------
                STATUS + STEP
            ------------------------------------------ */}

            <div className="flex items-center justify-between mt-4">

                <span
                    className="
                        px-2
                        py-1
                        rounded-md
                        text-xs
                        font-medium
                    "
                    style={{
                        backgroundColor:
                            'rgba(143, 212, 0, 0.12)',

                        color:
                            'rgb(100, 160, 0)',
                    }}
                >
                    {status}
                </span>


                <span className="text-xs text-base-content/50">

                    Step {bank?.current_step || 0}/
                    {bank?.total_steps || 3}

                </span>

            </div>


            {/* -----------------------------------------
                AMOUNTS
            ------------------------------------------ */}

            <div className="grid grid-cols-2 gap-2 mt-4">

                <div className="rounded-lg border border-base-300 px-3 py-2">

                    <p className="text-[11px] text-base-content/50">
                        Offered
                    </p>

                    <p className="text-sm font-semibold mt-1">
                        {formatAmount(
                            bank?.offered_amount
                        )}
                    </p>

                </div>


                <div className="rounded-lg border border-base-300 px-3 py-2">

                    <p className="text-[11px] text-base-content/50">
                        Disbursed
                    </p>

                    <p className="text-sm font-semibold mt-1">
                        {formatAmount(
                            bank?.disbursement_amount
                        )}
                    </p>

                </div>

            </div>


            {/* -----------------------------------------
                TIMELINE
            ------------------------------------------ */}

            <div className="mt-5">

                <p className="text-xs font-semibold mb-3">
                    Timeline
                </p>


                <div className="relative">

                    <div
                        className="
                            absolute
                            left-[12%]
                            right-[12%]
                            top-2.5
                            h-px
                        "
                        style={{
                            backgroundColor:
                                'rgba(143, 212, 0, 0.35)',
                        }}
                    />


                    <div className="relative grid grid-cols-4">

                        <TimelineItem
                            label="Assigned"
                            date={bank?.assigned_at}
                            active={
                                Boolean(
                                    bank?.assigned_at
                                )
                            }
                        />


                        <TimelineItem
                            label="Login"
                            date={bank?.login_at}
                            active={
                                Boolean(
                                    bank?.login_at
                                )
                            }
                        />


                        <TimelineItem
                            label="Sanction"
                            date={bank?.sanction_at}
                            active={
                                Boolean(
                                    bank?.sanction_at
                                )
                            }
                        />


                        <TimelineItem
                            label="Disburse"
                            date={bank?.disbursement_at}
                            active={
                                Boolean(
                                    bank?.disbursement_at
                                )
                            }
                        />

                    </div>

                </div>

            </div>
            {bank?.status === 'login' && (
                <div className="flex gap-2 mt-4">
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => setWorkflowAction('sanction')}
                    >
                        Sanction
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => setWorkflowAction('reject')}
                    >
                        Reject
                    </button>
                </div>
            )}

            {bank?.status === 'sanctioned' && (
                <div className="mt-4">
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => setWorkflowAction('disburse')}
                    >
                        Disburse
                    </button>
                </div>
            )}
            <BankProcessingWorkflowModal
                isOpen={!!workflowAction}
                onClose={() => setWorkflowAction(null)}
                action={workflowAction}
                bank={bank}
                onSubmit={onWorkflowUpdate}
            />
        </div>
    )
}


/* -------------------------------------------------
   BANK PROCESSING
-------------------------------------------------- */

function BankProcessingSection({
    application,
    onRefresh,
}) {


    const [banks, setBanks] = useState([])
    const [loadingBanks, setLoadingBanks] = useState(false)
    const [showAssignBank, setShowAssignBank] =
        useState(false)
    const fetchBankProcessing = async () => {
        if (!application?.unique_id) {
            return
        }

        try {
            setLoadingBanks(true)

            const response = await getBankProcessing(
                application.unique_id
            )
            // console.log(response)
            setBanks(response?.data || [])
        } catch (error) {
            console.error(
                'BANK PROCESSING FETCH ERROR:',
                error
            )
            console.error(
                'ERROR RESPONSE:',
                error?.response
            )
            console.error(
                'ERROR DATA:',
                error?.response?.data
            )
        } finally {
            setLoadingBanks(false)
        }
    }
    useEffect(() => {
        fetchBankProcessing()
    }, [application?.unique_id])
    const handleDeleteBank = async (bank) => {
        if (bank?.status === 'disbursed' || bank?.status === 'rejected') {
            alert('Cannot delete a disbursed or rejected bank processing')
            return
        }

        const confirmed = window.confirm(
            `Remove ${bank?.bank_name || 'this bank'}?`
        )

        if (!confirmed) return

        try {
            await deleteApplicationBankProcessing(
                application?.unique_id,
                bank.id
            )

            await fetchBankProcessing()

            if (onRefresh) {
                await onRefresh()
            }
        } catch (error) {
            console.error('DELETE BANK PROCESSING ERROR:', error)
            console.error('ERROR RESPONSE:', error?.response)
            console.error('ERROR DATA:', error?.response?.data)
        }
    }
    return (

        <div className="card bg-base-100 border border-base-300 shadow-sm m-5">

            <div className="card-body">

                {/* -----------------------------------------
                    SECTION HEADER
                ------------------------------------------ */}

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    <div>

                        <div className="flex items-center gap-2">

                            <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: COLORS.GREEN,
                                }}
                            />

                            <h2 className="text-lg font-semibold">
                                Bank Processing
                            </h2>

                        </div>


                        <p className="text-sm text-base-content/50 mt-1">
                            Manage bank assignments and workflow
                        </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex items-center gap-2">

                        <button
                            type="button"
                            className="btn btn-outline btn-sm"
                        >
                            ⟳ Refresh
                        </button>


                        <button
                            type="button"
                            onClick={() => setShowAssignBank(true)}
                            className="
                                btn
                                btn-sm
                                text-black
                                border-none
                            "
                            style={{
                                backgroundColor: COLORS.GREEN,
                            }}
                        >
                            + Assign Bank
                        </button>

                    </div>

                </div>


                {/* -----------------------------------------
                    BANK LIST
                ------------------------------------------ */}

                {banks.length === 0 ? (

                    <div className="mt-5 border border-base-300 rounded-xl p-10 text-center">

                        <p className="text-sm text-base-content/50">
                            No banks assigned to this application yet
                        </p>
                    </div>

                ) : (

                    <div
                        className="
                            grid    
                            grid-cols-1
                            md:grid-cols-2
                            xl:grid-cols-3
                            gap-4
                            mt-5
                        "
                    >

                        {banks.map((bank) => (
                            <BankCard
                                key={bank.id}
                                bank={bank}
                                onDelete={handleDeleteBank}
                                onWorkflowUpdate={async ({ action, data }) => {
                                    try {
                                        await updateBankProcessingWorkflow(
                                            application?.unique_id,
                                            bank.id,
                                            {
                                                action,
                                                data,
                                            }
                                        )

                                        await fetchBankProcessing()

                                        if (onRefresh) {
                                            await onRefresh()
                                        }
                                    } catch (error) {
                                        console.error('WORKFLOW UPDATE ERROR:', error)
                                        console.error('ERROR RESPONSE:', error?.response)
                                        console.error('ERROR DATA:', error?.response?.data)

                                        throw error
                                    }
                                }}
                            />
                        ))}

                    </div>

                )}

            </div>
            <AssignBankModal
                isOpen={showAssignBank}
                onClose={() => setShowAssignBank(false)}
                applicationId={application?.unique_id}
                onSubmit={async (bank) => {
                    try {
                        await assignBank(
                            application?.unique_id,
                            {
                                bank_id: bank.id,
                                dsa_code: bank.dsa_code || null,
                                dsa_name: bank.dsa_name || null,
                            }
                        )

                        await fetchBankProcessing()
                        setShowAssignBank(false)

                        // We'll connect the refresh properly in the next step
                    } catch (error) {
                        console.error('ASSIGN BANK ERROR:', error)
                        console.error('ERROR RESPONSE:', error?.response)
                        console.error('ERROR DATA:', error?.response?.data)

                        alert(
                            error?.response?.data?.detail ||
                            'Failed to assign bank'
                        )

                        throw error
                    }
                }}
            />

        </div>
    )
}


export default BankProcessingSection