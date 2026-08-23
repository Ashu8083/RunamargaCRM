// admin-react/src/pages/Roles&Teams/Agents/components/AgentTable.jsx
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'


function AgentTable({
    agents = [],
    search,
    setSearch,
    onCreate,
    onEdit,
    onDelete,
    onRefresh,
    onViewTeamLeads,
    onManagePermissions,
    onStatusChange,
}) {

    const filteredAgents = agents.filter((agent) => {

        const searchValue = search.toLowerCase().trim()

        if (!searchValue) {
            return true
        }

        return (
            agent.name?.toLowerCase().includes(searchValue) ||
            agent.phone?.toLowerCase().includes(searchValue) ||
            agent.email?.toLowerCase().includes(searchValue) ||
            agent.status?.toLowerCase().includes(searchValue)
        )
    })


    const getStatusClass = (status) => {

        if (status === 'Active') {
            return 'text-[#78B300] border-[#8BCF00]/40 bg-[#8BCF00]/10'
        }

        if (status === 'Absent') {
            return 'text-warning border-warning/30 bg-warning/10'
        }

        return 'text-error border-error/30 bg-error/10'
    }


    return (
        <div className="space-y-5">

            {/* =====================================================
                FILTER / ACTION SECTION
            ===================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-sm">

                <div className="card-body p-4">

                    <div className="flex flex-col xl:flex-row xl:items-center gap-3">

                        {/* Search */}

                        <div className="flex-1">

                            <label className="input input-bordered flex items-center gap-3 w-full">

                                <SearchIcon className="w-5 h-5 text-base-content/40" />

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


                        {/* Search */}

                        <button
                            type="button"
                            className="
                                btn
                                border-[#8BCF00]
                                text-[#78B300]
                                hover:bg-[#8BCF00]
                                hover:text-white
                            "
                        >

                            <SearchIcon className="w-5 h-5" />

                            Search

                        </button>


                        {/* Clear */}

                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="btn btn-ghost"
                        >
                            Clear
                        </button>


                        <div className="hidden xl:block h-8 border-l border-base-300" />


                        {/* Create */}

                        <button
                            type="button"
                            onClick={onCreate}
                            className="
                                btn
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:bg-[#6FA800]
                                hover:border-[#6FA800]
                            "
                        >

                            <PlusIcon className="w-5 h-5" />

                            Add Agent

                        </button>


                        {/* Refresh */}

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

                            <ArrowPathIcon className="w-5 h-5" />

                            Refresh

                        </button>

                    </div>

                </div>

            </div>


            {/* =====================================================
                AGENT TABLE
            ===================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-sm">

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

                            {filteredAgents.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center py-12"
                                    >

                                        <p className="text-sm font-medium">
                                            No agents found
                                        </p>

                                        <p className="text-xs text-base-content/50 mt-1">
                                            Try changing your search or add a new agent.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredAgents.map((agent, index) => (

                                    <tr key={agent.id}>

                                        {/* =================================================
                                            INDEX
                                        ================================================= */}

                                        <td className="text-center">

                                            <span className="text-sm text-base-content/60">
                                                {index + 1}
                                            </span>

                                        </td>


                                        {/* =================================================
                                            NAME
                                        ================================================= */}

                                        <td>

                                            <span className="font-semibold">
                                                {agent.name}
                                            </span>

                                        </td>


                                        {/* =================================================
                                            CONTACT
                                        ================================================= */}

                                        <td>

                                            <div className="space-y-0.5">

                                                <p className="text-sm">
                                                    {agent.phone || 'N/A'}
                                                </p>

                                                <p className="text-xs text-base-content/50">
                                                    {agent.email || 'N/A'}
                                                </p>

                                            </div>

                                        </td>


                                        {/* =================================================
                                            STATUS
                                        ================================================= */}

                                        <td>

                                            <select
                                                value={agent.status}
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
                                                    ${getStatusClass(agent.status)}
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


                                        {/* =================================================
                                            CREATED / UPDATED
                                        ================================================= */}

                                        <td>

                                            <div className="space-y-1">

                                                <div>

                                                    <span className="text-[10px] uppercase tracking-wide text-base-content/40">
                                                        Created
                                                    </span>

                                                    <p className="text-xs whitespace-nowrap">
                                                        {agent.createdAt || 'N/A'}
                                                    </p>

                                                </div>


                                                <div>

                                                    <span className="text-[10px] uppercase tracking-wide text-base-content/40">
                                                        Updated
                                                    </span>

                                                    <p className="text-xs whitespace-nowrap">
                                                        {agent.updatedAt || 'N/A'}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* =================================================
                                            ACTIONS
                                        ================================================= */}

                                        <td>

                                            <div className="flex items-center justify-end gap-1">

                                                {/* Assigned Team Leads */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onViewTeamLeads?.(agent)
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

                                                    <UserGroupIcon className="w-5 h-5" />

                                                </button>


                                                {/* Permissions */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onManagePermissions?.(agent)
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

                                                    <ShieldCheckIcon className="w-5 h-5" />

                                                </button>


                                                {/* Edit */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onEdit?.(agent)
                                                    }
                                                    className="
                                                        btn
                                                        btn-ghost
                                                        btn-sm
                                                        btn-square
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#78B300]
                                                    "
                                                    title="Edit agent"
                                                >

                                                    <PencilIcon className="w-5 h-5" />

                                                </button>


                                                {/* Delete */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDelete?.(agent)
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

                                                    <TrashIcon className="w-5 h-5" />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}


export default AgentTable