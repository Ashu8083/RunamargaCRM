// admin-react/src/pages/Roles&Teams/Roles/components/RoleTable.jsx

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'


function RoleTable({
    roles = [],

    search = '',
    setSearch,

    showDeleted = false,
    setShowDeleted,

    loading = false,
    deletingId = null,

    onCreate,
    onEdit,
    onDelete,
    onRefresh,
}) {

    /*
    |--------------------------------------------------------------------------
    | Filter Roles
    |--------------------------------------------------------------------------
    */

    const searchValue = search.trim().toLowerCase()


    const filteredRoles = roles.filter((role) => {

        /*
         * Hide deleted roles unless "Show Deleted" is enabled.
         */

        if (!showDeleted && role.deleted) {
            return false
        }


        /*
         * Search by:
         *
         * - Name
         * - Code
         * - Description
         */

        if (!searchValue) {
            return true
        }


        return (
            role.name
                ?.toLowerCase()
                .includes(searchValue) ||

            role.code
                ?.toLowerCase()
                .includes(searchValue) ||

            role.description
                ?.toLowerCase()
                .includes(searchValue)
        )
    })


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (value) => {

        if (!value || value === 'N/A') {
            return 'N/A'
        }


        const date = new Date(value)


        if (Number.isNaN(date.getTime())) {
            return value
        }


        return date.toLocaleString(
            'en-IN',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
            }
        )
    }


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-5">

            {/* =====================================================
                FILTER / ACTION SECTION
            ===================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-sm">

                <div className="card-body p-4">

                    <div className="flex flex-col xl:flex-row xl:items-center gap-3">

                        {/* =================================================
                            Search Input
                        ================================================= */}

                        <div className="flex-1">

                            <label className="input input-bordered flex items-center gap-3 w-full">

                                <SearchIcon className="w-5 h-5 text-base-content/40" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch?.(event.target.value)
                                    }
                                    placeholder="Search roles by name, code..."
                                    className="grow"
                                    disabled={loading}
                                />

                            </label>

                        </div>


                        {/* =================================================
                            Search Button
                        ================================================= */}

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


                        {/* =================================================
                            Clear
                        ================================================= */}

                        <button
                            type="button"
                            onClick={() => setSearch?.('')}
                            className="btn btn-ghost"
                            disabled={!search || loading}
                        >
                            Clear
                        </button>


                        <div className="hidden xl:block h-8 border-l border-base-300" />


                        {/* =================================================
                            Create Role
                        ================================================= */}

                        <button
                            type="button"
                            onClick={onCreate}
                            disabled={loading}
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

                            Create Role

                        </button>


                        {/* =================================================
                            Refresh
                        ================================================= */}

                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={loading}
                            className="
                                btn
                                border-[#8BCF00]
                                text-[#78B300]
                                hover:bg-[#8BCF00]
                                hover:text-white
                            "
                        >

                            <ArrowPathIcon
                                className={`
                                    w-5 h-5
                                    ${loading ? 'animate-spin' : ''}
                                `}
                            />

                            Refresh

                        </button>


                      </div>

                </div>

            </div>


            {/* =====================================================
                ROLE TABLE
            ===================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-sm">

                <div className="overflow-x-auto">

                    <table className="table">

                        {/* =================================================
                            Table Header
                        ================================================= */}

                        <thead>

                            <tr>

                                <th className="w-16 text-center">
                                    #
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Code
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Created Date
                                </th>

                                <th>
                                    Updated Date
                                </th>

                                <th className="text-right">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        {/* =================================================
                            Table Body
                        ================================================= */}

                        <tbody>

                            {/* =================================================
                                Loading
                            ================================================= */}

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-14"
                                    >

                                        <div className="flex flex-col items-center justify-center gap-3">

                                            <span className="loading loading-spinner loading-md text-[#8BCF00]" />

                                            <p className="text-sm text-base-content/60">
                                                Loading roles...
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : filteredRoles.length === 0 ? (

                                /* =============================================
                                    Empty State
                                ============================================= */

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-14"
                                    >

                                        <p className="text-sm font-medium">
                                            No roles found
                                        </p>

                                        <p className="text-xs text-base-content/50 mt-1">
                                            {search
                                                ? 'Try changing your search.'
                                                : 'Create a new role to get started.'
                                            }
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                /* =============================================
                                    Roles
                                ============================================= */

                                filteredRoles.map((role, index) => (

                                    <tr
                                        key={role.id}
                                        className={
                                            role.deleted
                                                ? 'opacity-70'
                                                : ''
                                        }
                                    >

                                        {/* =================================
                                            Index
                                        ================================= */}

                                        <td className="text-center">

                                            <span className="text-sm text-base-content/60">
                                                {index + 1}
                                            </span>

                                        </td>


                                        {/* =================================
                                            Name
                                        ================================= */}

                                        <td>

                                            <span className="font-semibold whitespace-nowrap">
                                                {role.name || 'N/A'}
                                            </span>

                                        </td>


                                        {/* =================================
                                            Code
                                        ================================= */}

                                        <td>

                                            <code
                                                className="
                                                    inline-flex
                                                    items-center
                                                    rounded-md
                                                    border
                                                    border-base-300
                                                    bg-base-200
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    tracking-wide
                                                    whitespace-nowrap
                                                "
                                            >
                                                {role.code || 'N/A'}
                                            </code>

                                        </td>


                                        {/* =================================
                                            Description
                                        ================================= */}

                                        <td>

                                            <div
                                                className="
                                                    max-w-xs
                                                    truncate
                                                    text-sm
                                                    text-base-content/70
                                                "
                                                title={
                                                    role.description ||
                                                    ''
                                                }
                                            >
                                                {role.description || 'N/A'}
                                            </div>

                                        </td>


                                        {/* =================================
                                            Status
                                        ================================= */}

                                        <td>

                                            {role.deleted ? (

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        border
                                                        text-xs
                                                        font-medium
                                                        text-error
                                                        border-error/30
                                                        bg-error/5
                                                    "
                                                >
                                                    Deleted
                                                </span>

                                            ) : role.active ? (

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        border
                                                        text-xs
                                                        font-medium
                                                        text-[#78B300]
                                                        border-[#8BCF00]/50
                                                        bg-[#8BCF00]/10
                                                    "
                                                >
                                                    Active
                                                </span>

                                            ) : (

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        border
                                                        text-xs
                                                        font-medium
                                                        text-base-content/60
                                                        border-base-300
                                                        bg-base-200
                                                    "
                                                >
                                                    Inactive
                                                </span>

                                            )}

                                        </td>


                                        {/* =================================
                                            Created Date
                                        ================================= */}

                                        <td>

                                            <span className="whitespace-nowrap text-sm">
                                                {formatDate(
                                                    role.createdAt
                                                )}
                                            </span>

                                        </td>


                                        {/* =================================
                                            Updated Date
                                        ================================= */}

                                        <td>

                                            <span className="whitespace-nowrap text-sm">
                                                {formatDate(
                                                    role.updatedAt
                                                )}
                                            </span>

                                        </td>


                                        {/* =================================
                                            Actions
                                        ================================= */}

                                        <td>

                                            <div className="flex items-center justify-end gap-1">

                                                {/* =========================
                                                    Edit
                                                ========================= */}

                                                {!role.deleted && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onEdit?.(role)
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            role.id
                                                        }
                                                        className="
                                                            btn
                                                            btn-ghost
                                                            btn-sm
                                                            btn-square
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#78B300]
                                                        "
                                                        title="Edit role"
                                                    >

                                                        <PencilIcon className="w-5 h-5" />

                                                    </button>

                                                )}


                                                {/* =========================
                                                    Delete
                                                ========================= */}

                                                {!role.deleted && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDelete?.(role)
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            role.id
                                                        }
                                                        className="
                                                            btn
                                                            btn-ghost
                                                            btn-sm
                                                            btn-square
                                                            text-error
                                                            hover:bg-error/10
                                                        "
                                                        title="Delete role"
                                                    >

                                                        {deletingId ===
                                                        role.id ? (

                                                            <span className="loading loading-spinner loading-sm" />

                                                        ) : (

                                                            <TrashIcon className="w-5 h-5" />

                                                        )}

                                                    </button>

                                                )}

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


export default RoleTable
