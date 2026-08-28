// admin-react/src/pages/CallManagement/CallLogs/components/CallLogsTable.jsx

import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import PhoneArrowDownLeftIcon from '@heroicons/react/24/outline/PhoneArrowDownLeftIcon'
import PhoneArrowUpRightIcon from '@heroicons/react/24/outline/PhoneArrowUpRightIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'


// =============================================================
// FORMAT CALL TYPE
// =============================================================

const formatCallType = (type) => {

    const normalized =
        String(type || '')
            .trim()
            .toLowerCase()


    if (normalized === 'incoming') {
        return 'Incoming'
    }


    if (normalized === 'outgoing') {
        return 'Outgoing'
    }


    if (normalized === 'missed') {
        return 'Missed'
    }


    return 'Unknown'

}


// =============================================================
// CALL TYPE ICON
// =============================================================

const CallTypeIcon = ({
    type,
}) => {

    const normalized =
        String(type || '')
            .trim()
            .toLowerCase()


    if (normalized === 'incoming') {

        return (
            <PhoneArrowDownLeftIcon
                className="
                    h-4
                    w-4
                    text-[#6FA800]
                "
            />
        )

    }


    if (normalized === 'outgoing') {

        return (
            <PhoneArrowUpRightIcon
                className="
                    h-4
                    w-4
                    text-blue-500
                "
            />
        )

    }


    if (normalized === 'missed') {

        return (
            <PhoneXMarkIcon
                className="
                    h-4
                    w-4
                    text-red-500
                "
            />
        )

    }


    return (
        <PhoneIcon
            className="
                h-4
                w-4
                text-base-content/40
            "
        />
    )

}


// =============================================================
// CALL TYPE STYLES
// =============================================================

const getCallTypeClasses = (
    type
) => {

    const normalized =
        String(type || '')
            .trim()
            .toLowerCase()


    if (normalized === 'incoming') {

        return [
            'border-[#8BCF00]/30',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }


    if (normalized === 'outgoing') {

        return [
            'border-blue-200',
            'bg-blue-50',
            'text-blue-600',
        ].join(' ')

    }


    if (normalized === 'missed') {

        return [
            'border-red-200',
            'bg-red-50',
            'text-red-600',
        ].join(' ')

    }


    return [
        'border-base-300',
        'bg-base-200',
        'text-base-content/50',
    ].join(' ')

}


// =============================================================
// FORMAT STATUS
// =============================================================

const formatStatus = (
    status
) => {

    const normalized =
        String(status || '')
            .trim()
            .toLowerCase()


    if (normalized === 'received') {
        return 'Received'
    }


    if (normalized === 'missed') {
        return 'Missed'
    }


    if (normalized === 'rejected') {
        return 'Rejected'
    }


    return 'Unknown'

}


// =============================================================
// STATUS STYLES
// =============================================================

const getStatusClasses = (
    status
) => {

    const normalized =
        String(status || '')
            .trim()
            .toLowerCase()


    if (normalized === 'received') {

        return [
            'border-[#8BCF00]/30',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }


    if (normalized === 'missed') {

        return [
            'border-amber-300',
            'bg-amber-50',
            'text-amber-600',
        ].join(' ')

    }


    if (normalized === 'rejected') {

        return [
            'border-red-200',
            'bg-red-50',
            'text-red-600',
        ].join(' ')

    }


    return [
        'border-base-300',
        'bg-base-200',
        'text-base-content/50',
    ].join(' ')

}


// =============================================================
// CALL LOGS TABLE
// =============================================================

function CallLogsTable({
    entries = [],
    onView,
}) {

    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!entries.length) {

        return (

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    flex
                    min-h-[280px]
                    flex-col
                    items-center
                    justify-center
                    px-6
                    py-12
                    text-center
                ">

                    <div className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-base-200
                    ">

                        <PhoneIcon className="
                            h-6
                            w-6
                            text-base-content/25
                        " />

                    </div>


                    <p className="
                        mt-4
                        text-sm
                        font-semibold
                        text-base-content/70
                    ">
                        No call logs found
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/45
                    ">
                        Try changing your filters or search.
                    </p>

                </div>

            </div>

        )

    }


    // =========================================================
    // TABLE
    // =========================================================

    return (

        <div className="
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            <div className="
                w-full
                overflow-x-auto
            ">

                <table className="
                    w-full
                    min-w-[1200px]
                    border-collapse
                ">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <thead>

                        <tr className="
                            border-b
                            border-base-300
                            bg-base-200/40
                        ">

                            {/* ID */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                ID
                            </th>


                            {/* NAME */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Name
                            </th>


                            {/* CONTACT */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Contact
                            </th>


                            {/* TYPE */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Type
                            </th>


                            {/* STATUS */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Status
                            </th>


                            {/* DATE */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Date & Time
                            </th>


                            {/* DURATION */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Duration
                            </th>


                            {/* TOTAL CALLS */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-center
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Total Calls
                            </th>


                            {/* ACTION */}

                            <th className="
                                w-[90px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-center
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Action
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        BODY
                    ================================================= */}

                    <tbody>

                        {entries.map(
                            (entry, index) => {

                                const callType =
                                    String(
                                        entry.callType ||
                                        ''
                                    )
                                        .trim()
                                        .toLowerCase()


                                const status =
                                    String(
                                        entry.status ||
                                        ''
                                    )
                                        .trim()
                                        .toLowerCase()


                                /*
                                 * Total calls is normally supplied
                                 * by the backend.
                                 *
                                 * For the mock data, if it isn't
                                 * available, show 1 because this
                                 * row represents one call.
                                 */

                                const totalCalls =
                                    entry.totalCalls ??
                                    1


                                return (

                                    <tr
                                        key={
                                            entry.id ??
                                            index
                                        }
                                        className="
                                            border-b
                                            border-base-300
                                            last:border-b-0
                                            transition-colors
                                            hover:bg-base-200/30
                                        "
                                    >

                                        {/* =================================
                                            ID
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span className="
                                                font-mono
                                                text-xs
                                                font-medium
                                                text-base-content/60
                                            ">
                                                {
                                                    entry.id ||
                                                    '—'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            NAME
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <div>

                                                <p className="
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                ">
                                                    {
                                                        entry.name ||
                                                        'Unknown'
                                                    }
                                                </p>


                                                <p className="
                                                    mt-0.5
                                                    text-xs
                                                    text-base-content/45
                                                ">
                                                    {
                                                        entry.phone ||
                                                        '—'
                                                    }
                                                </p>

                                            </div>

                                        </td>


                                        {/* =================================
                                            CONTACT
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                                text-base-content/75
                                            ">
                                                {
                                                    entry.contactNumber ||
                                                    entry.phone ||
                                                    '—'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            TYPE
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span className={[
                                                'inline-flex',
                                                'items-center',
                                                'gap-1.5',
                                                'rounded-full',
                                                'border',
                                                'px-2.5',
                                                'py-1.5',
                                                'text-xs',
                                                'font-medium',
                                                getCallTypeClasses(
                                                    callType
                                                ),
                                            ].join(' ')}>

                                                <CallTypeIcon
                                                    type={
                                                        callType
                                                    }
                                                />

                                                {
                                                    formatCallType(
                                                        callType
                                                    )
                                                }

                                            </span>

                                        </td>


                                        {/* =================================
                                            STATUS
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span className={[
                                                'inline-flex',
                                                'rounded-full',
                                                'border',
                                                'px-2.5',
                                                'py-1.5',
                                                'text-xs',
                                                'font-medium',
                                                getStatusClasses(
                                                    status
                                                ),
                                            ].join(' ')}>

                                                {
                                                    formatStatus(
                                                        status
                                                    )
                                                }

                                            </span>

                                        </td>


                                        {/* =================================
                                            DATE & TIME
                                        ================================= */}

                                        <td className="
                                            whitespace-nowrap
                                            px-5
                                            py-4
                                        ">

                                            <div>

                                                <p className="
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                ">
                                                    {
                                                        entry.date ||
                                                        '—'
                                                    }
                                                </p>


                                                <p className="
                                                    mt-0.5
                                                    text-xs
                                                    text-base-content/45
                                                ">
                                                    {
                                                        entry.time ||
                                                        '—'
                                                    }
                                                </p>

                                            </div>

                                        </td>


                                        {/* =================================
                                            DURATION
                                        ================================= */}

                                        <td className="
                                            whitespace-nowrap
                                            px-5
                                            py-4
                                        ">

                                            <span className="
                                                font-mono
                                                text-sm
                                                text-base-content/75
                                            ">
                                                {
                                                    entry.duration ||
                                                    '00:00'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            TOTAL CALLS
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                            text-center
                                        ">

                                            <span className="
                                                inline-flex
                                                min-w-8
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-base-200
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                text-base-content/65
                                            ">
                                                {
                                                    totalCalls
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            ACTION
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                            text-center
                                        ">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView?.(
                                                        entry
                                                    )
                                                }
                                                className="
                                                    inline-flex
                                                    h-9
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    border
                                                    border-base-300
                                                    bg-base-100
                                                    px-3.5
                                                    text-xs
                                                    font-medium
                                                    text-base-content/70
                                                    transition
                                                    hover:border-[#8BCF00]/40
                                                    hover:bg-[#8BCF00]/10
                                                    hover:text-[#6FA800]
                                                    focus:outline-none
                                                    focus:ring-2
                                                    focus:ring-[#8BCF00]/30
                                                "
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                )

                            }
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default CallLogsTable