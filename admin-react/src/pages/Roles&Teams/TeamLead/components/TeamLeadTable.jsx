// admin-react/src/pages/Role-management/TeamLead/components/TeamLeadTable.jsx

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'


function TeamLeadTable({
    teamLeads = [],
    search,
    setSearch,
    onCreate,
    onDelete,
    onRefresh,
    onViewAgents,
    onManagePermissions,
    onStatusChange,
}) {

    // =========================================================
    // SEARCH FILTER
    // =========================================================

    const filteredTeamLeads = teamLeads.filter((teamLead) => {

        const searchValue =
            search?.toLowerCase().trim() || ''


        if (!searchValue) {
            return true
        }


        return (
            teamLead.name
                ?.toLowerCase()
                .includes(searchValue) ||

            teamLead.employeeId
                ?.toLowerCase()
                .includes(searchValue) ||

            teamLead.phone
                ?.toLowerCase()
                .includes(searchValue) ||

            teamLead.email
                ?.toLowerCase()
                .includes(searchValue) ||

            teamLead.status
                ?.toLowerCase()
                .includes(searchValue)
        )

    })


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {

        if (status === 'Active') {

            return `
                text-[#78B300]
                border-[#8BCF00]/50
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
            bg-error/5
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

                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <div className="flex-1">

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
                                    text-base-content/40
                                " />


                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="
                                        Search team leads by
                                        name, employee ID,
                                        phone or email...
                                    "
                                    className="grow"
                                />

                            </label>

                        </div>


                        {/* =========================================
                            SEARCH BUTTON
                        ========================================= */}

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

                            <SearchIcon className="h-5 w-5" />

                            Search

                        </button>


                        {/* =========================================
                            CLEAR
                        ========================================= */}

                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="btn btn-ghost"
                        >
                            Clear
                        </button>


                        <div className="
                            hidden
                            h-8
                            border-l
                            border-base-300
                            xl:block
                        " />


                        {/* =========================================
                            ADD TEAM LEAD
                        ========================================= */}

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

                            <PlusIcon className="h-5 w-5" />

                            Add Team Lead

                        </button>


                        {/* =========================================
                            REFRESH
                        ========================================= */}

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

                            <ArrowPathIcon className="h-5 w-5" />

                            Refresh

                        </button>

                    </div>

                </div>

            </div>


            {/* =====================================================
                TEAM LEAD TABLE
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
                                    Employee
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

                            {/* =====================================
                                EMPTY STATE
                            ===================================== */}

                            {filteredTeamLeads.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            py-12
                                            text-center
                                        "
                                    >

                                        <UserGroupIcon className="
                                            mx-auto
                                            h-8
                                            w-8
                                            text-base-content/30
                                        " />


                                        <p className="
                                            mt-3
                                            text-sm
                                            font-medium
                                        ">
                                            No team leads found
                                        </p>


                                        <p className="
                                            mt-1
                                            text-xs
                                            text-base-content/50
                                        ">
                                            Try changing your search
                                            or add a new team lead.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredTeamLeads.map(
                                    (teamLead, index) => (

                                        <tr key={teamLead.id}>

                                            {/* =====================
                                                INDEX
                                            ===================== */}

                                            <td className="text-center">

                                                <span className="
                                                    text-sm
                                                    text-base-content/60
                                                ">
                                                    {index + 1}
                                                </span>

                                            </td>


                                            {/* =====================
                                                EMPLOYEE
                                            ===================== */}

                                            <td>

                                                <div>

                                                    <p className="
                                                        font-semibold
                                                    ">
                                                        {teamLead.name}
                                                    </p>


                                                    <p className="
                                                        mt-0.5
                                                        text-xs
                                                        text-base-content/50
                                                    ">
                                                        Employee ID:{' '}
                                                        {teamLead.employeeId ||
                                                            teamLead.id ||
                                                            'N/A'
                                                        }
                                                    </p>

                                                </div>

                                            </td>


                                            {/* =====================
                                                CONTACT
                                            ===================== */}

                                            <td>

                                                <div className="space-y-0.5">

                                                    <p className="text-sm">
                                                        {teamLead.phone ||
                                                            'N/A'
                                                        }
                                                    </p>


                                                    <p className="
                                                        text-xs
                                                        text-base-content/50
                                                    ">
                                                        {teamLead.email ||
                                                            'N/A'
                                                        }
                                                    </p>

                                                </div>

                                            </td>


                                            {/* =====================
                                                STATUS
                                            ===================== */}

                                            <td>

                                                <select
                                                    value={
                                                        teamLead.status ||
                                                        'Active'
                                                    }
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
                                                        border
                                                        font-medium
                                                        ${getStatusClass(
                                                            teamLead.status
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


                                            {/* =====================
                                                CREATED
                                            ===================== */}

                                            <td>

                                                <span className="
                                                    whitespace-nowrap
                                                    text-sm
                                                ">
                                                    {teamLead.createdAt ||
                                                        'N/A'
                                                    }
                                                </span>

                                            </td>


                                            {/* =====================
                                                UPDATED
                                            ===================== */}

                                            <td>

                                                <span className="
                                                    whitespace-nowrap
                                                    text-sm
                                                ">
                                                    {teamLead.updatedAt ||
                                                        'N/A'
                                                    }
                                                </span>

                                            </td>


                                            {/* =====================
                                                ACTIONS
                                            ===================== */}

                                            <td>

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-1
                                                ">

                                                    {/* =================================
                                                        ASSIGNED AGENTS
                                                    ================================= */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onViewAgents?.(
                                                                teamLead
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
                                                        title="
                                                            Assigned Agents
                                                        "
                                                    >

                                                        <UserGroupIcon className="
                                                            h-5
                                                            w-5
                                                        " />

                                                    </button>


                                                    {/* =================================
                                                        PERMISSIONS
                                                    ================================= */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onManagePermissions?.(
                                                                teamLead
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
                                                        title="
                                                            Manage Permissions
                                                        "
                                                    >

                                                        <ShieldCheckIcon className="
                                                            h-5
                                                            w-5
                                                        " />

                                                    </button>


                                                    {/* =================================
                                                        DELETE
                                                    ================================= */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDelete?.(
                                                                teamLead
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
                                                        title="
                                                            Delete Team Lead
                                                        "
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


export default TeamLeadTable