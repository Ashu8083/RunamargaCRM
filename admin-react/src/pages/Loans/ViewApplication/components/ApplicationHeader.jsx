import React, {
    useEffect,
    useRef,
    useState,
} from 'react'

import { COLORS } from '../../../../constants/colors'


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
                    text-sm
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
       AGENTS

       Temporary local list for UI.

       Later this should come from your existing
       agents API / Redux state.
    -------------------------------------------------- */

    const agents = [
        {
            id: 1,
            name: 'Prashanth',
        },
        {
            id: 2,
            name: 'Rahul',
        },
        {
            id: 3,
            name: 'Suresh',
        },
    ]


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
                application?.loan_type ||
                '',

            customer_name:
                application?.customer?.name ||
                '',

            phone:
                application?.customer?.phone ||
                '',

            rm_name:
                application?.rm?.name ||
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
       STATUS CHANGE
    -------------------------------------------------- */

    const handleStatusSelect = (status) => {

        setSelectedStatus(status)

        setStatusOpen(false)


        if (onStatusChange) {

            onStatusChange({
                applicationId:
                    application?.id,

                status,
            })

        }

    }


    /* -------------------------------------------------
       AGENT CHANGE
    -------------------------------------------------- */

    const handleAgentSelect = (agent) => {

        setSelectedAgent(agent)

        setAgentOpen(false)


        if (onAgentChange) {

            onAgentChange({
                applicationId:
                    application?.id,

                agentId:
                    agent?.id,

                agent,
            })

        }

    }


    /* -------------------------------------------------
       EDIT
    -------------------------------------------------- */

    const handleEdit = () => {

        setEditData({

            loan_type:
                application?.loan_type_label ||
                application?.loan_type ||
                '',

            customer_name:
                application?.customer?.name ||
                '',

            phone:
                application?.customer?.phone ||
                '',

            rm_name:
                application?.rm?.name ||
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

    const handleSave = () => {

        const updatedData = {

            ...editData,

            status:
                selectedStatus,

            agent_id:
                selectedAgent?.id ||
                null,

        }


        console.log(
            'Updated application:',
            updatedData
        )


        /*
            Parent can connect this to backend.

            Example:

            onSave({
                applicationId: application.id,
                data: updatedData
            })
        */

        if (onSave) {

            onSave({

                applicationId:
                    application?.id,

                data:
                    updatedData,

            })

        }


        setIsEditing(false)

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
            shadow-sm
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
                                    application?.applied_at
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


                        {/* CHANGE */}

                        <button
                            type="button"
                            onClick={() =>
                                setAgentOpen(
                                    !agentOpen
                                )
                            }
                            className="
                                text-xs
                                font-semibold
                                hover:underline
                                shrink-0
                            "
                            style={{
                                color: '#0369a1',
                            }}
                        >
                            CHANGE
                        </button>

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
                                application?.loan_type ||
                                '-'
                            }
                        />


                        <InfoField
                            icon="●"
                            label="Customer"
                            value={
                                application?.customer?.name ||
                                '-'
                            }
                        />


                        <InfoField
                            icon="☎"
                            label="Phone"
                            value={
                                application?.customer?.phone ||
                                '-'
                            }
                        />


                        <InfoField
                            icon="♙"
                            label="RM"
                            value={
                                application?.rm?.name ||
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
                            label="Loan Type"
                            value={
                                editData.loan_type
                            }
                            onChange={(value) =>
                                handleEditChange(
                                    'loan_type',
                                    value
                                )
                            }
                        />


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
                            label="RM"
                            value={
                                editData.rm_name
                            }
                            onChange={(value) =>
                                handleEditChange(
                                    'rm_name',
                                    value
                                )
                            }
                        />


                        <EditField
                            label="Agent"
                            value={
                                editData.agent_name
                            }
                            onChange={(value) =>
                                handleEditChange(
                                    'agent_name',
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
                            STATUS DROPDOWN
                        ================================================== */}

                        <div
                            ref={statusRef}
                            className="
                                relative
                            "
                        >

                            <button
                                type="button"
                                onClick={() => {

                                    setStatusOpen(
                                        !statusOpen
                                    )

                                    setAgentOpen(
                                        false
                                    )

                                }}
                                className="
                                    h-12
                                    min-w-[170px]
                                    px-4
                                    rounded-xl
                                    border
                                    border-base-300
                                    bg-base-100
                                    flex
                                    items-center
                                    justify-between
                                    gap-5
                                    text-sm
                                    font-medium
                                    hover:bg-base-200
                                    transition-colors
                                "
                            >

                                <span>
                                    {status}
                                </span>


                                <span className="
                                    text-base-content/50
                                ">
                                    ▾
                                </span>

                            </button>


                            {statusOpen && (

                                <div className="
                                    absolute
                                    right-0
                                    bottom-full
                                    mb-2
                                    w-[190px]
                                    bg-base-100
                                    border
                                    border-base-300
                                    rounded-xl
                                    shadow-xl
                                    z-50
                                    p-1.5
                                ">


                                    <p className="
                                        px-3
                                        py-2
                                        text-[11px]
                                        uppercase
                                        tracking-wide
                                        text-base-content/40
                                        font-semibold
                                    ">
                                        Application Status
                                    </p>


                                    {STATUS_OPTIONS.map(
                                        (statusOption) => (

                                            <button
                                                key={
                                                    statusOption
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleStatusSelect(
                                                        statusOption
                                                    )
                                                }
                                                className={`
                                                    w-full
                                                    text-left
                                                    px-3
                                                    py-2.5
                                                    rounded-lg
                                                    text-sm
                                                    flex
                                                    items-center
                                                    justify-between
                                                    hover:bg-base-200
                                                    ${
                                                        selectedStatus ===
                                                        statusOption
                                                            ? 'font-semibold'
                                                            : ''
                                                    }
                                                `}
                                            >

                                                <span>
                                                    {statusOption}
                                                </span>


                                                {selectedStatus ===
                                                    statusOption && (

                                                    <span
                                                        style={{
                                                            color:
                                                                COLORS.GREEN,
                                                        }}
                                                    >
                                                        ✓
                                                    </span>

                                                )}

                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            AGENT DROPDOWN
                        ================================================== */}

                        <div
                            ref={agentRef}
                            className="
                                relative
                            "
                        >

                            <button
                                type="button"
                                onClick={() => {

                                    setAgentOpen(
                                        !agentOpen
                                    )

                                    setStatusOpen(
                                        false
                                    )

                                }}
                                className="
                                    h-12
                                    min-w-[220px]
                                    px-3
                                    rounded-xl
                                    border
                                    border-base-300
                                    bg-base-100
                                    flex
                                    items-center
                                    gap-3
                                    hover:bg-base-200
                                    transition-colors
                                "
                            >


                                {/* AGENT ICON */}

                                <span
                                    className="
                                        w-8
                                        h-8
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        text-white
                                        text-xs
                                        font-semibold
                                        shrink-0
                                    "
                                    style={{
                                        backgroundColor:
                                            COLORS.GREEN,
                                    }}
                                >

                                    {agentName
                                        .charAt(0)
                                        .toUpperCase()}

                                </span>


                                {/* AGENT INFO */}

                                <div className="
                                    flex-1
                                    text-left
                                    min-w-0
                                ">

                                    <p className="
                                        text-sm
                                        font-medium
                                        truncate
                                    ">
                                        {agentName}
                                    </p>


                                    {selectedAgent && (

                                        <p className="
                                            text-[10px]
                                            text-base-content/50
                                        ">
                                            Assigned
                                        </p>

                                    )}

                                </div>


                                <span className="
                                    text-base-content/50
                                ">
                                    ▾
                                </span>

                            </button>


                            {agentOpen && (

                                <div className="
                                    absolute
                                    right-0
                                    bottom-full
                                    mb-2
                                    w-[240px]
                                    bg-base-100
                                    border
                                    border-base-300
                                    rounded-xl
                                    shadow-xl
                                    z-50
                                    p-1.5
                                ">


                                    <p className="
                                        px-3
                                        py-2
                                        text-[11px]
                                        uppercase
                                        tracking-wide
                                        text-base-content/40
                                        font-semibold
                                    ">
                                        Assign Agent
                                    </p>


                                    {/* UNASSIGN */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAgentSelect(
                                                null
                                            )
                                        }
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-3
                                            py-2.5
                                            rounded-lg
                                            hover:bg-base-200
                                            text-left
                                        "
                                    >

                                        <span className="
                                            w-8
                                            h-8
                                            rounded-full
                                            bg-base-300
                                            flex
                                            items-center
                                            justify-center
                                            text-xs
                                        ">
                                            —
                                        </span>


                                        <span className="
                                            text-sm
                                        ">
                                            Unassigned
                                        </span>

                                    </button>


                                    {/* AGENTS */}

                                    {agents.map(
                                        (agent) => (

                                            <button
                                                key={
                                                    agent.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleAgentSelect(
                                                        agent
                                                    )
                                                }
                                                className="
                                                    w-full
                                                    flex
                                                    items-center
                                                    gap-3
                                                    px-3
                                                    py-2.5
                                                    rounded-lg
                                                    hover:bg-base-200
                                                    text-left
                                                "
                                            >

                                                <span
                                                    className="
                                                        w-8
                                                        h-8
                                                        rounded-full
                                                        flex
                                                        items-center
                                                        justify-center
                                                        text-white
                                                        text-xs
                                                        font-semibold
                                                    "
                                                    style={{
                                                        backgroundColor:
                                                            COLORS.GREEN,
                                                    }}
                                                >

                                                    {agent.name
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}

                                                </span>


                                                <span className="
                                                    flex-1
                                                    text-sm
                                                ">
                                                    {agent.name}
                                                </span>


                                                {selectedAgent?.id ===
                                                    agent.id && (

                                                    <span
                                                        style={{
                                                            color:
                                                                COLORS.GREEN,
                                                        }}
                                                    >
                                                        ✓
                                                    </span>

                                                )}

                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}


export default ApplicationHeader