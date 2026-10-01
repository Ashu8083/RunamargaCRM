// admin-react/src/pages/Role-management/TeamLead/components/TeamLeadTable.jsx

import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import ShieldCheckIcon from "@heroicons/react/24/outline/ShieldCheckIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

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
    // ========================================================================
    // FILTER
    // ========================================================================

    const filteredTeamLeads = teamLeads.filter((teamLead) => {
        const searchValue =
            String(search || "")
                .toLowerCase()
                .trim();

        if (!searchValue) {
            return true;
        }

        return (
            String(teamLead?.name || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(
                teamLead?.employeeId ??
                    teamLead?.employee_id ??
                    ""
            )
                .toLowerCase()
                .includes(searchValue) ||

            String(teamLead?.phone || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(teamLead?.email || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(teamLead?.role || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(teamLead?.contextName || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(teamLead?.context_name || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(teamLead?.status || "")
                .toLowerCase()
                .includes(searchValue)
        );
    });

    // ========================================================================
    // STATUS CLASS
    // ========================================================================

    const getStatusClass = (status) => {
        if (status === "Active") {
            return `
                text-[#78B300]
                border-[#8BCF00]/50
                bg-[#8BCF00]/10
                focus:border-[#8BCF00]
                focus:ring-[#8BCF00]/20
            `;
        }

        return `
            text-error
            border-error/30
            bg-error/5
            focus:border-error
            focus:ring-error/20
        `;
    };

    // ========================================================================
    // ROLE DISPLAY
    // ========================================================================

    const getRoleDisplay = (teamLead) => {
        return (
            teamLead?.role ||
            teamLead?.contextName ||
            teamLead?.context_name ||
            "N/A"
        );
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div className="w-full space-y-5">

            {/* ==================================================================
                SEARCH / ACTION BAR
            ================================================================== */}

            <div
                className="
                    w-full
                    overflow-hidden
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-sm
                "
            >
                <div className="p-4">

                    <div
                        className="
                            flex
                            w-full
                            flex-col
                            gap-3
                            lg:flex-row
                            lg:items-center
                        "
                    >

                        {/* ======================================================
                            SEARCH INPUT
                        ======================================================= */}

                        <div className="min-w-0 flex-1">

                            <label
                                className="
                                    input
                                    input-bordered
                                    flex
                                    h-11
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    border-base-300
                                    bg-base-100
                                    transition-all
                                    focus-within:border-[#8BCF00]
                                    focus-within:ring-2
                                    focus-within:ring-[#8BCF00]/10
                                "
                            >

                                <SearchIcon
                                    className="
                                        h-5
                                        w-5
                                        shrink-0
                                        text-base-content/40
                                    "
                                />

                                <input
                                    type="text"
                                    value={search || ""}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search team leads by name, employee ID, phone, email or role..."
                                    className="
                                        min-w-0
                                        grow
                                        bg-transparent
                                        text-sm
                                        outline-none
                                    "
                                />

                            </label>

                        </div>

                        {/* ======================================================
                            SEARCH BUTTON
                        ======================================================= */}

                        <button
                            type="button"
                            className="
                                btn
                                h-11
                                min-h-11
                                shrink-0
                                rounded-lg
                                border
                                border-[#8BCF00]
                                bg-transparent
                                px-4
                                text-[#78B300]
                                hover:border-[#8BCF00]
                                hover:bg-[#8BCF00]
                                hover:text-white
                            "
                        >

                            <SearchIcon className="h-5 w-5" />

                            <span>
                                Search
                            </span>

                        </button>

                        {/* ======================================================
                            CLEAR
                        ======================================================= */}

                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="
                                btn
                                btn-ghost
                                h-11
                                min-h-11
                                shrink-0
                                rounded-lg
                                px-4
                                text-base-content/70
                                hover:bg-base-200
                            "
                        >
                            Clear
                        </button>

                        {/* ======================================================
                            DIVIDER
                        ======================================================= */}

                        <div
                            className="
                                hidden
                                h-8
                                w-px
                                bg-base-300
                                lg:block
                            "
                        />

                        {/* ======================================================
                            ADD TEAM LEAD
                        ======================================================= */}

                        <button
                            type="button"
                            onClick={onCreate}
                            className="
                                btn
                                h-11
                                min-h-11
                                shrink-0
                                rounded-lg
                                border
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                px-4
                                text-white
                                hover:border-[#6FA800]
                                hover:bg-[#6FA800]
                            "
                        >

                            <PlusIcon className="h-5 w-5" />

                            <span>
                                Add Team Lead
                            </span>

                        </button>

                        {/* ======================================================
                            REFRESH
                        ======================================================= */}

                        <button
                            type="button"
                            onClick={onRefresh}
                            className="
                                btn
                                h-11
                                min-h-11
                                shrink-0
                                rounded-lg
                                border
                                border-[#8BCF00]
                                bg-transparent
                                px-4
                                text-[#78B300]
                                hover:border-[#8BCF00]
                                hover:bg-[#8BCF00]
                                hover:text-white
                            "
                        >

                            <ArrowPathIcon className="h-5 w-5" />

                            <span>
                                Refresh
                            </span>

                        </button>

                    </div>

                </div>
            </div>

            {/* ==================================================================
                TABLE
            ================================================================== */}

            <div
                className="
                    w-full
                    overflow-hidden
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-sm
                "
            >

                <div className="w-full overflow-x-auto">

                    <table className="table w-full">

                        {/* ======================================================
                            TABLE HEADER
                        ======================================================= */}

                        <thead>

                            <tr className="border-base-300 bg-base-200/50">

                                <th
                                    className="
                                        w-16
                                        whitespace-nowrap
                                        text-center
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    "
                                >
                                    #
                                </th>

                                <th
                                    className="
                                        min-w-[190px]
                                        whitespace-nowrap
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    "
                                >
                                    Employee
                                </th>

                                <th
                                    className="
                                        min-w-[130px]
                                        whitespace-nowrap
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    "
                                >
                                    Role
                                </th>

                                <th
                                    className="
                                        min-w-[210px]
                                        whitespace-nowrap
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    "
                                >
                                    Contact Info
                                </th>

                                <th
                                    className="
                                        min-w-[135px]
                                        whitespace-nowrap
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    "
                                >
                                    Status
                                </th>

                                <th
                                    className="
                                        min-w-[160px]
                                        whitespace-nowrap
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    "
                                >
                                    Created At
                                </th>

                                <th
                                    className="
                                        min-w-[160px]
                                        whitespace-nowrap
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    "
                                >
                                    Updated At
                                </th>

                                <th
                                    className="
                                        min-w-[180px]
                                        whitespace-nowrap
                                        text-right
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    "
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        {/* ======================================================
                            TABLE BODY
                        ======================================================= */}

                        <tbody>

                            {filteredTeamLeads.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="
                                            border-0
                                            py-16
                                            text-center
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    h-12
                                                    w-12
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-base-200
                                                "
                                            >

                                                <UserGroupIcon
                                                    className="
                                                        h-6
                                                        w-6
                                                        text-base-content/30
                                                    "
                                                />

                                            </div>

                                            <p
                                                className="
                                                    mt-4
                                                    text-sm
                                                    font-semibold
                                                    text-base-content
                                                "
                                            >
                                                No team leads found
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    text-base-content/50
                                                "
                                            >
                                                Try changing your search
                                                or add a new team lead.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredTeamLeads.map(
                                    (teamLead, index) => (

                                        <tr
                                            key={
                                                teamLead?.id ??
                                                teamLead?.employeeId ??
                                                teamLead?.employee_id ??
                                                index
                                            }
                                            className="
                                                border-base-200
                                                transition-colors
                                                hover:bg-base-200/40
                                            "
                                        >

                                            {/* ==================================================
                                                #
                                            ================================================== */}

                                            <td
                                                className="
                                                    text-center
                                                    align-middle
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-base-content/50
                                                    "
                                                >
                                                    {index + 1}
                                                </span>

                                            </td>

                                            {/* ==================================================
                                                EMPLOYEE
                                            ================================================== */}

                                            <td className="align-middle">

                                                <div className="min-w-0">

                                                    <p
                                                        className="
                                                            truncate
                                                            text-sm
                                                            font-semibold
                                                            text-base-content
                                                        "
                                                    >
                                                        {teamLead?.name ||
                                                            "N/A"}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            text-base-content/50
                                                        "
                                                    >

                                                        <span>
                                                            Employee ID:
                                                        </span>

                                                        {" "}

                                                        <span className="font-medium">

                                                            {teamLead?.employeeId ??
                                                                teamLead?.employee_id ??
                                                                "N/A"}

                                                        </span>

                                                    </p>

                                                </div>

                                            </td>

                                            {/* ==================================================
                                                ROLE
                                            ================================================== */}

                                            <td className="align-middle">

                                                <span
                                                    className="
                                                        inline-flex
                                                        max-w-[180px]
                                                        items-center
                                                        rounded-md
                                                        border
                                                        border-base-300
                                                        bg-base-200/50
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        text-base-content/80
                                                    "
                                                    title={getRoleDisplay(
                                                        teamLead
                                                    )}
                                                >

                                                    <span className="truncate">

                                                        {getRoleDisplay(
                                                            teamLead
                                                        )}

                                                    </span>

                                                </span>

                                            </td>

                                            {/* ==================================================
                                                CONTACT INFO
                                            ================================================== */}

                                            <td className="align-middle">

                                                <div className="min-w-[180px]">

                                                    <p
                                                        className="
                                                            truncate
                                                            text-sm
                                                            font-medium
                                                            text-base-content
                                                        "
                                                    >
                                                        {teamLead?.phone ||
                                                            "N/A"}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            truncate
                                                            text-xs
                                                            text-base-content/50
                                                        "
                                                        title={
                                                            teamLead?.email ||
                                                            "N/A"
                                                        }
                                                    >
                                                        {teamLead?.email ||
                                                            "N/A"}
                                                    </p>

                                                </div>

                                            </td>

                                            {/* ==================================================
                                                STATUS
                                            ================================================== */}

                                            <td className="align-middle">

                                                <select
                                                    value={
                                                        teamLead?.status ===
                                                        "Inactive"
                                                            ? "Inactive"
                                                            : "Active"
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
                                                        h-9
                                                        min-h-9
                                                        min-w-[125px]
                                                        rounded-md
                                                        border
                                                        px-3
                                                        text-xs
                                                        font-medium
                                                        outline-none
                                                        ${getStatusClass(
                                                            teamLead?.status
                                                        )}
                                                    `}
                                                >

                                                    <option value="Active">
                                                        Active
                                                    </option>

                                                    <option value="Inactive">
                                                        Inactive
                                                    </option>

                                                </select>

                                            </td>

                                            {/* ==================================================
                                                CREATED
                                            ================================================== */}

                                            <td className="align-middle">

                                                <span
                                                    className="
                                                        whitespace-nowrap
                                                        text-sm
                                                        text-base-content/70
                                                    "
                                                >
                                                    {teamLead?.createdAt ||
                                                        "N/A"}
                                                </span>

                                            </td>

                                            {/* ==================================================
                                                UPDATED
                                            ================================================== */}

                                            <td className="align-middle">

                                                <span
                                                    className="
                                                        whitespace-nowrap
                                                        text-sm
                                                        text-base-content/70
                                                    "
                                                >
                                                    {teamLead?.updatedAt ||
                                                        "N/A"}
                                                </span>

                                            </td>

                                            {/* ==================================================
                                                ACTIONS
                                            ================================================== */}

                                            <td className="align-middle">

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-end
                                                        gap-1
                                                    "
                                                >

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onEdit?.(
                                                                teamLead
                                                            )
                                                        }
                                                        className="
                                                            btn
                                                            btn-ghost
                                                            btn-sm
                                                            btn-square
                                                            h-9
                                                            min-h-9
                                                            w-9
                                                            rounded-md
                                                            text-base-content/60
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#78B300]
                                                        "
                                                        title="Edit Team Lead"
                                                        aria-label="Edit Team Lead"
                                                    >

                                                        <PencilIcon
                                                            className="
                                                                h-5
                                                                w-5
                                                            "
                                                        />

                                                    </button>

                                                    {/* ASSIGNED AGENTS */}

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
                                                            h-9
                                                            min-h-9
                                                            w-9
                                                            rounded-md
                                                            text-base-content/60
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#78B300]
                                                        "
                                                        title="View Assigned Agents"
                                                        aria-label="View Assigned Agents"
                                                    >

                                                        <UserGroupIcon
                                                            className="
                                                                h-5
                                                                w-5
                                                            "
                                                        />

                                                    </button>

                                                    {/* PERMISSIONS */}

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
                                                            h-9
                                                            min-h-9
                                                            w-9
                                                            rounded-md
                                                            text-base-content/60
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#78B300]
                                                        "
                                                        title="Manage Permissions"
                                                        aria-label="Manage Permissions"
                                                    >

                                                        <ShieldCheckIcon
                                                            className="
                                                                h-5
                                                                w-5
                                                            "
                                                        />

                                                    </button>

                                                    {/* DELETE */}

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
                                                            h-9
                                                            min-h-9
                                                            w-9
                                                            rounded-md
                                                            text-error/70
                                                            hover:bg-error/10
                                                            hover:text-error
                                                        "
                                                        title="Delete Team Lead"
                                                        aria-label="Delete Team Lead"
                                                    >

                                                        <TrashIcon
                                                            className="
                                                                h-5
                                                                w-5
                                                            "
                                                        />

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
    );
}

export default TeamLeadTable;