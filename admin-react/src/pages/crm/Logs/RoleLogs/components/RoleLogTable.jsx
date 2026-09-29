import React from 'react'


function RoleLogTable({ logs = [] }) {

    // =========================================================
    // EVENT LABELS
    // =========================================================

    const eventLabels = {
        CREATED: 'Created',
        UPDATED: 'Updated',
        ACTIVATED: 'Activated',
        DEACTIVATED: 'Deactivated',
        DELETED: 'Deleted',
    }


    // =========================================================
    // EVENT BADGE CLASS
    // =========================================================

    const getEventClass = (event) => {

        switch (event) {

            case 'CREATED':
                return `
                    border
                    border-emerald-200
                    bg-emerald-50
                    text-emerald-700
                `

            case 'UPDATED':
                return `
                    border
                    border-blue-200
                    bg-blue-50
                    text-blue-700
                `

            case 'ACTIVATED':
                return `
                    border
                    border-green-200
                    bg-green-50
                    text-green-700
                `

            case 'DEACTIVATED':
                return `
                    border
                    border-orange-200
                    bg-orange-50
                    text-orange-700
                `

            case 'DELETED':
                return `
                    border
                    border-red-200
                    bg-red-50
                    text-red-700
                `

            default:
                return `
                    border
                    border-base-300
                    bg-base-200
                    text-base-content/70
                `
        }

    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!logs.length) {

        return (

            <div className="
                w-full
                min-w-0
                overflow-hidden
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    flex
                    min-h-52
                    items-center
                    justify-center
                    px-4
                    py-10
                ">

                    <div className="
                        text-center
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-base-content
                        ">
                            No role logs found
                        </p>

                        <p className="
                            mt-1
                            text-xs
                            text-base-content/50
                        ">
                            Try changing your filters.
                        </p>

                    </div>

                </div>

            </div>

        )

    }


    // =========================================================
    // TABLE
    // =========================================================

    return (

        <div className="
            w-full
            min-w-0
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">


            {/* =====================================================
                TABLE HEADER
            ===================================================== */}

            <div className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-base-300
                px-4
                py-3
                sm:px-5
            ">


                {/* =================================================
                    LOG COUNT
                ================================================= */}

                <div className="
                    shrink-0
                    rounded-full
                    bg-base-200
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-base-content/60
                ">

                    {logs.length} logs

                </div>

            </div>


            {/* =====================================================
                RESPONSIVE TABLE WRAPPER
            ===================================================== */}

            <div className="
                w-full
                min-w-0
                overflow-x-auto
            ">

                <table className="
                    w-full
                    min-w-[760px]
                    table-auto
                ">


                    {/* =================================================
                        TABLE HEAD
                    ================================================= */}

                    <thead>

                        <tr className="
                            border-b
                            border-base-300
                            bg-base-200/50
                        ">


                            {/* =========================================
                                ID
                            ========================================= */}

                            <th className="
                                w-[90px]
                                whitespace-nowrap
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/60
                                sm:px-5
                            ">
                                ID
                            </th>


                            {/* =========================================
                                ROLE
                            ========================================= */}

                            <th className="
                                min-w-[190px]
                                whitespace-nowrap
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/60
                            ">
                                Role
                            </th>


                            {/* =========================================
                                ACTION BY
                            ========================================= */}

                            <th className="
                                min-w-[190px]
                                whitespace-nowrap
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/60
                            ">
                                Action By
                            </th>


                            {/* =========================================
                                ACTION ROLE
                            ========================================= */}

                            <th className="
                                min-w-[140px]
                                whitespace-nowrap
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/60
                            ">
                                Action Role
                            </th>


                            {/* =========================================
                                EVENT
                            ========================================= */}

                            <th className="
                                min-w-[150px]
                                whitespace-nowrap
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/60
                            ">
                                Event
                            </th>


                            {/* =========================================
                                DATE
                            ========================================= */}

                            <th className="
                                min-w-[190px]
                                whitespace-nowrap
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/60
                            ">
                                Date
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        TABLE BODY
                    ================================================= */}

                    <tbody>

                        {logs.map((log) => (

                            <tr
                                key={log.id}
                                className="
                                    border-b
                                    border-base-200
                                    transition-colors
                                    last:border-b-0
                                    hover:bg-base-200/30
                                "
                            >


                                {/* =====================================
                                    ID
                                ===================================== */}

                                <td className="
                                    whitespace-nowrap
                                    px-4
                                    py-4
                                    sm:px-5
                                ">

                                    <span className="
                                        font-mono
                                        text-xs
                                        font-medium
                                        text-base-content/70
                                    ">
                                        #{log.id}
                                    </span>

                                </td>


                                {/* =====================================
                                    ROLE
                                ===================================== */}

                                <td className="
                                    px-4
                                    py-4
                                ">

                                    <div className="
                                        flex
                                        flex-col
                                        gap-1
                                    ">

                                        <span className="
                                            text-sm
                                            font-medium
                                            text-base-content
                                        ">
                                            {log.roleName}
                                        </span>

                                        <span className="
                                            text-xs
                                            text-base-content/50
                                        ">
                                            Role ID: {log.roleId}
                                        </span>

                                    </div>

                                </td>


                                {/* =====================================
                                    ACTION BY
                                ===================================== */}

                                <td className="
                                    px-4
                                    py-4
                                ">

                                    <div className="
                                        flex
                                        flex-col
                                        gap-1
                                    ">

                                        <span className="
                                            text-sm
                                            font-medium
                                            text-base-content
                                        ">
                                            {log.actionByName}
                                        </span>

                                        <span className="
                                            text-xs
                                            text-base-content/50
                                        ">
                                            {log.actionByEmployeeId}
                                        </span>

                                    </div>

                                </td>


                                {/* =====================================
                                    ACTION ROLE
                                ===================================== */}

                                <td className="
                                    whitespace-nowrap
                                    px-4
                                    py-4
                                ">

                                    <span className="
                                        inline-flex
                                        items-center
                                        rounded-full
                                        border
                                        border-base-300
                                        bg-base-200
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-medium
                                        text-base-content/70
                                    ">
                                        {log.actionByRole}
                                    </span>

                                </td>


                                {/* =====================================
                                    EVENT
                                ===================================== */}

                                <td className="
                                    whitespace-nowrap
                                    px-4
                                    py-4
                                ">

                                    <span className={`
                                        inline-flex
                                        items-center
                                        rounded-full
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-medium
                                        ${getEventClass(
                                            log.event
                                        )}
                                    `}>

                                        {
                                            eventLabels[
                                                log.event
                                            ] ||
                                            log.event
                                        }

                                    </span>

                                </td>


                                {/* =====================================
                                    DATE
                                ===================================== */}

                                <td className="
                                    whitespace-nowrap
                                    px-4
                                    py-4
                                ">

                                    <div className="
                                        flex
                                        flex-col
                                        gap-1
                                    ">

                                        <span className="
                                            text-sm
                                            text-base-content
                                        ">
                                            {log.createdAt}
                                        </span>


                                        {/* =================================
                                            DELETED DATE
                                        ================================= */}

                                        {log.deletedAt && (

                                            <span className="
                                                text-xs
                                                text-red-500
                                            ">

                                                Deleted: {log.deletedAt}

                                            </span>

                                        )}

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default RoleLogTable