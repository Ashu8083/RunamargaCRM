// admin-react/src/pages/Roles&Teams/Agents/components/AgentTable.jsx

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'


function AgentTable({
    agents = [],
    search,
    setSearch,
    onCreate,
    onDelete,
    onRefresh,
    onViewTeamLeads,
    onManagePermissions,
    onStatusChange,
}) {

    // =========================================================
    // STATUS STYLE
    // =========================================================

    const getStatusClass = (status) => {

        if (status === 'Active') {

            return `
                text-[#78B300]
                border-[#8BCF00]/40
                bg-[#8BCF00]/10
            `

        }


        if (status === 'Absent') {

            return `
                text-warning
                border-warning/30
                bg-warning/10
            `

        }


        return `
            text-error
            border-error/30
            bg-error/10
        `

    }


    return (

        <div className="space-y-5">

            {/* =====================================================
                FILTER / ACTION SECTION
            ===================================================== */}

            <div className="
                card
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="card-body p-4">

                    <div className="
                        flex
                        flex-col
                        gap-3
                        xl:flex-row
                        xl:items-center
                    ">

                        {/* =================================================
                            SEARCH
                        ================================================= */}

                        <div className="min-w-0 flex-1">

                            <label className="
                                input
                                input-bordered
                                flex
                                w-full
                                items-center
                                gap-3
                            ">

                                <SearchIcon className="
                                    h-5
                                    w-5
                                    shrink-0
                                    text-base-content/40
                                " />


                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search agents..."
                                    className="grow"
                                />

                            </label>

                        </div>


                        {/* =================================================
                            SEARCH BUTTON
                        ================================================= */}

                        <button
                            type="button"
                            onClick={() => {
                                /*
                                 * Search is already reactive.
                                 * Button is kept for UI consistency.
                                 */
                                setSearch(search.trim())
                            }}
                            className="
                                btn
                                border-[#8BCF00]
                                text-[#78B300]
                                hover:bg-[#8BCF00]
                                hover:text-white
                            "
                        >

                            <SearchIcon className="
                                h-5
                                w-5
                            " />

                            Search

                        </button>


                        {/* =================================================
                            CLEAR
                        ================================================= */}

                        <button
                            type="button"
                            onClick={() =>
                                setSearch('')
                            }
                            className="
                                btn
                                btn-ghost
                            "
                        >
                            Clear
                        </button>


                        {/* =================================================
                            DIVIDER
                        ================================================= */}

                        <div className="
                            hidden
                            h-8
                            border-l
                            border-base-300
                            xl:block
                        " />


                        {/* =================================================
                            CREATE
                        ================================================= */}

                        <button
                            type="button"
                            onClick={onCreate}
                            className="
                                btn
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:border-[#6FA800]
                                hover:bg-[#6FA800]
                            "
                        >

                            <PlusIcon className="
                                h-5
                                w-5
                            " />

                            Add Agent

                        </button>


                        {/* =================================================
                            REFRESH
                        ================================================= */}

                        <button
                            type="button"
                            onClick={onRefresh}
                            className="
                                btn
                                border-[#8BCF00]
                                text-[#78B300]
                                hover:bg-[#8BCF00]
                                hover:text-white
                            "
                        >

                            <ArrowPathIcon className="
                                h-5
                                w-5
                            " />

                            Refresh

                        </button>

                    </div>

                </div>

            </div>


            {/* =====================================================
                AGENT TABLE
            ===================================================== */}

            <div className="
                card
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="overflow-x-auto">

                    <table className="table">

                        <thead>

                            <tr>

                                <th className="w-16 text-center">
                                    #
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Contact Info
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Created / Updated
                                </th>

                                <th className="text-right">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {agents.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            py-12
                                            text-center
                                        "
                                    >

                                        <p className="
                                            text-sm
                                            font-medium
                                        ">
                                            No agents found
                                        </p>


                                        <p className="
                                            mt-1
                                            text-xs
                                            text-base-content/50
                                        ">
                                            Try changing your search or add a new agent.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                agents.map(
                                    (agent, index) => (

                                        <tr
                                            key={agent.id}
                                        >

                                            {/* =========================================
                                                INDEX
                                            ========================================= */}

                                            <td className="text-center">

                                                <span className="
                                                    text-sm
                                                    text-base-content/60
                                                ">
                                                    {index + 1}
                                                </span>

                                            </td>


                                            {/* =========================================
                                                NAME
                                            ========================================= */}

                                            <td>

                                                <div>

                                                    <span className="
                                                        font-semibold
                                                    ">
                                                        {agent.name}
                                                    </span>


                                                    {agent.employeeId && (

                                                        <p className="
                                                            mt-0.5
                                                            text-xs
                                                            text-base-content/45
                                                        ">
                                                            Employee ID:{' '}
                                                            {agent.employeeId}
                                                        </p>

                                                    )}

                                                </div>

                                            </td>


                                            {/* =========================================
                                                CONTACT
                                            ========================================= */}

                                            <td>

                                                <div className="space-y-0.5">

                                                    <p className="text-sm">
                                                        {agent.phone || 'N/A'}
                                                    </p>


                                                    <p className="
                                                        text-xs
                                                        text-base-content/50
                                                    ">
                                                        {agent.email || 'N/A'}
                                                    </p>

                                                </div>

                                            </td>


                                            {/* =========================================
                                                STATUS
                                            ========================================= */}

                                            <td>

                                                <select
                                                    value={
                                                        agent.status ||
                                                        'Active'
                                                    }
                                                    onChange={(event) =>
                                                        onStatusChange?.(
                                                            agent,
                                                            event.target.value
                                                        )
                                                    }
                                                    className={`
                                                        select
                                                        select-sm
                                                        border
                                                        font-medium
                                                        ${getStatusClass(
                                                            agent.status
                                                        )}
                                                    `}
                                                >

                                                    <option value="Active">
                                                        Active
                                                    </option>

                                                    <option value="Absent">
                                                        Absent
                                                    </option>

                                                    <option value="Deactivated">
                                                        Deactivated
                                                    </option>

                                                </select>

                                            </td>


                                            {/* =========================================
                                                CREATED / UPDATED
                                            ========================================= */}

                                            <td>

                                                <div className="
                                                    space-y-1
                                                ">

                                                    <div>

                                                        <span className="
                                                            text-[10px]
                                                            uppercase
                                                            tracking-wide
                                                            text-base-content/40
                                                        ">
                                                            Created
                                                        </span>


                                                        <p className="
                                                            whitespace-nowrap
                                                            text-xs
                                                        ">
                                                            {agent.createdAt ||
                                                                'N/A'}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <span className="
                                                            text-[10px]
                                                            uppercase
                                                            tracking-wide
                                                            text-base-content/40
                                                        ">
                                                            Updated
                                                        </span>


                                                        <p className="
                                                            whitespace-nowrap
                                                            text-xs
                                                        ">
                                                            {agent.updatedAt ||
                                                                'N/A'}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* =========================================
                                                ACTIONS
                                            ========================================= */}

                                            <td>

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-1
                                                ">

                                                    {/* =====================================
                                                        ASSIGNED TEAM LEADS
                                                    ===================================== */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onViewTeamLeads?.(
                                                                agent
                                                            )
                                                        }
                                                        className="
                                                            btn
                                                            btn-ghost
                                                            btn-sm
                                                            btn-square
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#78B300]
                                                        "
                                                        title="Assigned team leads"
                                                    >

                                                        <UserGroupIcon className="
                                                            h-5
                                                            w-5
                                                        " />

                                                    </button>


                                                    {/* =====================================
                                                        PERMISSIONS
                                                    ===================================== */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onManagePermissions?.(
                                                                agent
                                                            )
                                                        }
                                                        className="
                                                            btn
                                                            btn-ghost
                                                            btn-sm
                                                            btn-square
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#78B300]
                                                        "
                                                        title="Manage permissions"
                                                    >

                                                        <ShieldCheckIcon className="
                                                            h-5
                                                            w-5
                                                        " />

                                                    </button>


                                                    {/* =====================================
                                                        DELETE
                                                    ===================================== */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDelete?.(
                                                                agent
                                                            )
                                                        }
                                                        className="
                                                            btn
                                                            btn-ghost
                                                            btn-sm
                                                            btn-square
                                                            text-error
                                                            hover:bg-error/10
                                                        "
                                                        title="Delete agent"
                                                    >

                                                        <TrashIcon className="
                                                            h-5
                                                            w-5
                                                        " />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    )

}


export default AgentTable