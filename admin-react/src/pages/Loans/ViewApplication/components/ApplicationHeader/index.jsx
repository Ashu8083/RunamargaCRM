// admin-react/src/pages/Loans/ViewApplication/components/ApplicationHeader/index.jsx
import React, {
    useEffect,
    useRef,
    useState,
} from 'react'

import { COLORS } from '../../../../../constants/colors'

import AgentDropdown from '../../../../../components/GlobalModels/Filters/AgentDropdown'
import { updateApplicationHeader } from '../ApplicationHeader/Api'
/* -------------------------------------------------
   STATUS CONFIG
-------------------------------------------------- */

const STATUS_OPTIONS = [
    'INPROCESS',
    'LOGIN',
    'REJECTED',
    'SANCTIONED',
    'DISBURSED',
]


const getStatusColor = (status) => {

    switch (status) {

        case 'LOGIN':
            return '#2563eb'

        case 'REJECTED':
            return '#dc2626'

        case 'SANCTIONED':
            return '#16a34a'

        case 'DISBURSED':
            return '#7c3aed'

        case 'INPROCESS':
        default:
            return '#f97316'
    }
}


/* -------------------------------------------------
   DATE FORMATTER
-------------------------------------------------- */

const formatAppliedDate = (date) => {

    if (!date) {
        return '-'
    }


    const parsedDate = new Date(date)


    if (Number.isNaN(parsedDate.getTime())) {
        return date
    }


    return parsedDate.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}


/* -------------------------------------------------
   INFO FIELD
-------------------------------------------------- */

function InfoField({
    icon,
    label,
    value,
}) {

    return (

        <div className="flex items-center gap-3 min-w-0">

            <div
                className="
                    w-8
                    h-8
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    shrink-0
                    bg-base-200
                    text-base-content/60
                "
            >
                {icon}
            </div>


            <div className="min-w-0">

                <p className="text-[11px] text-base-content/50">
                    {label}
                </p>


                <p className="
                    text-[15px]
                    font-semibold
                    mt-0.5
                    truncate
                ">
                    {value || '-'}
                </p>

            </div>

        </div>
    )
}


/* -------------------------------------------------
   EDIT FIELD
-------------------------------------------------- */

function EditField({
    label,
    value,
    onChange,
}) {

    return (

        <div>

            <label className="text-xs text-base-content/50">
                {label}
            </label>


            <input
                type="text"
                value={value || ''}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="
                    input
                    input-bordered
                    input-sm
                    w-full
                    mt-1
                "
            />

        </div>
    )
}


/* -------------------------------------------------
   COMPONENT
-------------------------------------------------- */

function ApplicationHeader({

    application,

    /*
        These callbacks are optional.

        We can connect them to your existing
        backend API without changing this UI.
    */

    onStatusChange,

    onAgentChange,

    onSave,

    onRefresh,

    onViewTimeline,

    onSendMail,

}) {


    /* -------------------------------------------------
       DROPDOWN STATE
    -------------------------------------------------- */

    const [statusOpen, setStatusOpen] =
        useState(false)


    const [agentOpen, setAgentOpen] =
        useState(false)


    /* -------------------------------------------------
       EDIT STATE
    -------------------------------------------------- */

    const [isEditing, setIsEditing] =
        useState(false)


    const [editData, setEditData] =
        useState({})


    /* -------------------------------------------------
       SELECTED STATE
    -------------------------------------------------- */

    const [selectedStatus, setSelectedStatus] =
        useState(
            application?.status ||
            'INPROCESS'
        )


    const [selectedAgent, setSelectedAgent] =
        useState(
            application?.agent || null
        )


    /* -------------------------------------------------
       DROPDOWN REFS
    -------------------------------------------------- */

    const statusRef = useRef(null)

    const agentRef = useRef(null)


    


    /* -------------------------------------------------
       SYNC APPLICATION DATA
    -------------------------------------------------- */

    useEffect(() => {

        setSelectedStatus(
            application?.status ||
            'INPROCESS'
        )


        setSelectedAgent(
            application?.agent ||
            null
        )


        setEditData({
            loan_type:
                application?.loan_type_label ||
                application?.loan_type?.name ||
                '',

            customer_name:
                application?.name ||
                '',

            phone:
                application?.phone ||
                '',

            referral:
                application?.referral ||
                '',

            agent_name:
                application?.agent?.name ||
                '',

            status:
                application?.status ||
                'INPROCESS',
        })

    }, [application])


    /* -------------------------------------------------
       CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
    -------------------------------------------------- */

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                statusRef.current &&
                !statusRef.current.contains(event.target)
            ) {

                setStatusOpen(false)

            }


            if (
                agentRef.current &&
                !agentRef.current.contains(event.target)
            ) {

                setAgentOpen(false)

            }

        }


        document.addEventListener(
            'mousedown',
            handleOutsideClick
        )


        return () => {

            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            )

        }

    }, [])


   
    /* -------------------------------------------------
       EDIT
    -------------------------------------------------- */

    const handleEdit = () => {

        setEditData({

            loan_type:
                application?.loan_type_label ||
                application?.loan_type?.name ||
                '',

            customer_name:
                application?.name ||
                '',

            phone:
                application?.phone ||
                '',

            referral:
                application?.referral ||
                '',

            agent_name:
                selectedAgent?.name ||
                application?.agent?.name ||
                '',

            status:
                selectedStatus ||
                application?.status ||
                'INPROCESS',

        })


        setIsEditing(true)

    }


    /* -------------------------------------------------
       EDIT CHANGE
    -------------------------------------------------- */

    const handleEditChange = (
        field,
        value
    ) => {

        setEditData((previous) => ({

            ...previous,

            [field]: value,

        }))

    }


    /* -------------------------------------------------
       SAVE
    -------------------------------------------------- */

    const handleSave = async () => {

        try {

            const data = {
                name: editData.customer_name,
                phone: editData.phone,
                referral: editData.referral,
            }

            const response = await updateApplicationHeader(
                application?.unique_id,
                data
            )

            console.log('Header updated:', response)

            // response.data contains the actual updated fields
            if (onSave) {
                onSave(response?.data)
            }

            setIsEditing(false)

        } catch (error) {

            console.error(
                'Failed to update application header:',
                error
            )

        }
    }

    /* -------------------------------------------------
       CANCEL
    -------------------------------------------------- */

    const handleCancel = () => {

        setIsEditing(false)

    }


    /* -------------------------------------------------
       AGENT NAME
    -------------------------------------------------- */

    const agentName =
        selectedAgent?.name ||
        'Unassigned'


    /* -------------------------------------------------
       STATUS
    -------------------------------------------------- */

    const status =
        selectedStatus ||
        'INPROCESS'


    return (

        <div className="
            card
            bg-base-100
            border
            border-base-300
            shadow-sm m-5   
        ">

            <div className="card-body">


                {/* =================================================
                    TOP ROW
                ================================================== */}

                <div className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-4
                ">


                    {/* STATUS + DATE */}

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">


                        {/* STATUS BADGE */}

                        <span
                            className="
                                px-3
                                py-1.5
                                rounded-full
                                text-xs
                                font-semibold
                                text-white
                                whitespace-nowrap
                            "
                            style={{
                                backgroundColor:
                                    getStatusColor(
                                        status
                                    ),
                            }}
                        >
                            {status}
                        </span>


                        {/* DATE + TIME */}

                        <div className="
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            text-base-content/50
                        ">

                            <span>
                                ◷
                            </span>


                            <span>
                                {formatAppliedDate(
                                    application?.applied_date
                                )}
                            </span>

                        </div>

                    </div>


                    {/* TOP ACTIONS */}

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">


                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={onRefresh}
                            className="
                                btn
                                btn-sm
                                btn-outline
                            "
                        >

                            ↻

                            <span>
                                Refresh
                            </span>

                        </button>


                        {/* VIEW TIMELINE */}

                        <button
                            type="button"
                            onClick={onViewTimeline}
                            className="
                                btn
                                btn-sm
                                btn-outline
                            "
                            style={{
                                borderColor:
                                    COLORS.GREEN,

                                color:
                                    '#15803d',
                            }}
                        >

                            ⌁

                            <span>
                                View Timeline
                            </span>

                        </button>

                    </div>

                </div>


                <div className="
                    border-t
                    border-base-300
                    mt-2
                "></div>


                {/* =================================================
                    AGENT ASSIGNED BANNER
                ================================================== */}

                <div
                    className="
                        mt-4
                        rounded-xl
                        px-4
                        py-3
                    "
                    style={{
                        backgroundColor:
                            'rgba(14, 165, 233, 0.10)',
                    }}
                >

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-4
                    ">


                        {/* LEFT */}

                        <div className="
                            flex
                            items-center
                            gap-3
                            min-w-0
                        ">


                            {/* ICON */}

                            <div
                                className="
                                    w-9
                                    h-9
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                "
                                style={{
                                    backgroundColor:
                                        'rgba(14, 165, 233, 0.12)',
                                }}
                            >

                                <span className="text-lg">
                                    👤
                                </span>

                            </div>


                            {/* TEXT */}

                            <div className="
                                text-sm
                                min-w-0
                            ">

                                <span className="font-semibold">
                                    Agent Assigned:
                                </span>


                                <span className="ml-1">

                                    {agentName === 'Unassigned'
                                        ? 'No agent assigned'
                                        : `${agentName} is handling this lead`}

                                </span>

                            </div>

                        </div>



                    </div>

                </div>


                {/* =================================================
                    INFORMATION ROW
                ================================================== */}

                {!isEditing ? (

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-5
                        mt-5
                    ">


                        <InfoField
                            icon="▣"
                            label="Loan Type"
                            value={
                                application?.loan_type_label ||
                                application?.loan_type?.name ||
                                '-'
                            }
                        />


                        <InfoField
                            icon="●"
                            label="Customer"
                            value={
                                application?.name ||
                                '-'
                            }
                        />


                        <InfoField
                            icon="☎"
                            label="Phone"
                            value={
                                application?.phone ||
                                '-'
                            }
                        />


                        <InfoField
                            icon="♙"
                            label="Reference Name"
                            value={
                                application?.referral ||
                                'N/A'
                            }
                        />

                    </div>

                ) : (

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-5
                        mt-5
                    ">





                        <EditField
                            label="Customer"
                            value={
                                editData.customer_name
                            }
                            onChange={(value) =>
                                handleEditChange(
                                    'customer_name',
                                    value
                                )
                            }
                        />


                        <EditField
                            label="Phone"
                            value={
                                editData.phone
                            }
                            onChange={(value) =>
                                handleEditChange(
                                    'phone',
                                    value
                                )
                            }
                        />


                        <EditField
                            label="Reference Name"
                            value={
                                editData.referral
                            }
                            onChange={(value) =>
                                handleEditChange(
                                    'referral',
                                    value
                                )
                            }
                        />




                    </div>

                )}


                <div className="
                    border-t
                    border-base-300
                    mt-5
                "></div>


                {/* =================================================
                    BOTTOM ROW
                ================================================== */}

                <div className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-4
                    mt-4
                ">


                    {/* LEFT ACTIONS */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    ">


                        {!isEditing ? (

                            <>

                                {/* EDIT */}

                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="
                                        btn
                                        btn-sm
                                        text-black
                                        border-none
                                        shadow-sm
                                    "
                                    style={{
                                        backgroundColor:
                                            COLORS.GREEN,
                                    }}
                                >

                                    ✎

                                    <span>
                                        Edit
                                    </span>

                                </button>


                                {/* SEND MAIL */}

                                <button
                                    type="button"
                                    onClick={onSendMail}
                                    className="
                                        btn
                                        btn-sm
                                        btn-outline
                                    "
                                    style={{
                                        borderColor:
                                            COLORS.GREEN,

                                        color:
                                            '#15803d',
                                    }}
                                >

                                    ✉

                                    <span>
                                        Send Mail
                                    </span>

                                </button>

                            </>

                        ) : (

                            <>

                                {/* CANCEL */}

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="
                                        btn
                                        btn-sm
                                        btn-outline
                                    "
                                >
                                    Cancel
                                </button>


                                {/* SAVE */}

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="
                                        btn
                                        btn-sm
                                        text-black
                                        border-none
                                    "
                                    style={{
                                        backgroundColor:
                                            COLORS.GREEN,
                                    }}
                                >
                                    ✓ Save Changes
                                </button>

                            </>

                        )}

                    </div>


                    {/* RIGHT CONTROLS */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                    ">





                        {/* =================================================
                            AGENT DROPDOWN
                        ================================================== */}



                    </div>

                </div>

            </div>

        </div>
    )
}


export default ApplicationHeader