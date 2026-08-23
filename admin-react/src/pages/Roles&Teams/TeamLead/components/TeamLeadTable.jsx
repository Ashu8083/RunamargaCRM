// admin-react/src/pages/Role-management/TeamLead/components/TeamLeadTable.jsx
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'


function TeamLeadTable({
    teamLeads = [],
    search,
    setSearch,
    onCreate,
    onEdit,
    onDelete,
    onRefresh,
    onViewAgents,
    onManagePermissions,
    onStatusChange,
}) {

    const filteredTeamLeads = teamLeads.filter((teamLead) => {

        const searchValue = search.toLowerCase()

        return (
            teamLead.name?.toLowerCase().includes(searchValue) ||
            teamLead.phone?.toLowerCase().includes(searchValue) ||
            teamLead.email?.toLowerCase().includes(searchValue)
        )
    })


    const getStatusClass = (status) => {

        if (status === 'Active') {
            return 'text-[#78B300] border-[#8BCF00]/50 bg-[#8BCF00]/10'
        }

        if (status === 'Absent') {
            return 'text-warning border-warning/30 bg-warning/10'
        }

        return 'text-error border-error/30 bg-error/5'
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
                                    placeholder="Search team leads by name, phone or email..."
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


                        {/* Add Team Lead */}

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
                            Add Team Lead
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
                TEAM LEAD TABLE
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
                                    Created At
                                </th>

                                <th>
                                    Updated At
                                </th>

                                <th className="text-right">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredTeamLeads.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center py-12"
                                    >

                                        <UserGroupIcon className="w-8 h-8 mx-auto text-base-content/30" />

                                        <p className="text-sm font-medium mt-3">
                                            No team leads found
                                        </p>

                                        <p className="text-xs text-base-content/50 mt-1">
                                            Try changing your search or add a new team lead.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredTeamLeads.map((teamLead, index) => (

                                    <tr key={teamLead.id}>

                                        {/* Index */}

                                        <td className="text-center">

                                            <span className="text-sm text-base-content/60">
                                                {index + 1}
                                            </span>

                                        </td>


                                        {/* Name */}

                                        <td>

                                            <span className="font-semibold">
                                                {teamLead.name}
                                            </span>

                                        </td>


                                        {/* Contact */}

                                        <td>

                                            <div className="space-y-0.5">

                                                <p className="text-sm">
                                                    {teamLead.phone || 'N/A'}
                                                </p>

                                                <p className="text-xs text-base-content/50">
                                                    {teamLead.email || 'N/A'}
                                                </p>

                                            </div>

                                        </td>


                                        {/* Status */}

                                        <td>

                                            <select
                                                value={teamLead.status}
                                                onChange={(event) =>
                                                    onStatusChange?.(
                                                        teamLead,
                                                        event.target.value
                                                    )
                                                }
                                                className={`
                                                    select
                                                    select-sm
                                                    min-w-[125px]
                                                    font-medium
                                                    border
                                                    ${getStatusClass(teamLead.status)}
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


                                        {/* Created */}

                                        <td>

                                            <span className="whitespace-nowrap text-sm">
                                                {teamLead.createdAt || 'N/A'}
                                            </span>

                                        </td>


                                        {/* Updated */}

                                        <td>

                                            <span className="whitespace-nowrap text-sm">
                                                {teamLead.updatedAt || 'N/A'}
                                            </span>

                                        </td>


                                        {/* Actions */}

                                        <td>

                                            <div className="flex items-center justify-end gap-1">

                                                {/* Assigned Agents */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onViewAgents?.(teamLead)
                                                    }
                                                    className="
                                                        btn
                                                        btn-ghost
                                                        btn-sm
                                                        btn-square
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#78B300]
                                                    "
                                                    title="Assigned Agents"
                                                >
                                                    <UserGroupIcon className="w-5 h-5" />
                                                </button>


                                                {/* Edit */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onEdit?.(teamLead)
                                                    }
                                                    className="
                                                        btn
                                                        btn-ghost
                                                        btn-sm
                                                        btn-square
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#78B300]
                                                    "
                                                    title="Edit Team Lead"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>


                                                {/* Permissions */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onManagePermissions?.(teamLead)
                                                    }
                                                    className="
                                                        btn
                                                        btn-ghost
                                                        btn-sm
                                                        btn-square
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#78B300]
                                                    "
                                                    title="Manage Permissions"
                                                >
                                                    <ShieldCheckIcon className="w-5 h-5" />
                                                </button>


                                                {/* Delete */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDelete?.(teamLead)
                                                    }
                                                    className="
                                                        btn
                                                        btn-ghost
                                                        btn-sm
                                                        btn-square
                                                        text-error
                                                        hover:bg-error/10
                                                    "
                                                    title="Delete Team Lead"
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

export default TeamLeadTable