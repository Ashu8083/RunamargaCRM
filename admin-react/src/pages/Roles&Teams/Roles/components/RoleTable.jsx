// admin-react/src/pages/Roles/components/RoleTable.jsx

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'


function RoleTable({
    roles = [],
    search,
    setSearch,
    showDeleted,
    setShowDeleted,
    onCreate,
    onEdit,
    onDelete,
    onRefresh,
}) {

    const filteredRoles = roles.filter((role) => {

        if (!showDeleted && role.deleted) {
            return false
        }

        const searchValue = search.toLowerCase()

        return role.name?.toLowerCase().includes(searchValue)
    })


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
                                    placeholder="Search roles by name..."
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
                            Create Role
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


                        {/* Show Deleted */}

                        <label className="flex items-center gap-2 cursor-pointer px-2">

                            <input
                                type="checkbox"
                                checked={showDeleted}
                                onChange={(event) =>
                                    setShowDeleted(event.target.checked)
                                }
                                className="
                                    toggle
                                    toggle-sm
                                    border-base-300
                                    [--tglbg:theme(colors.base-300)]
                                    checked:border-[#8BCF00]
                                    checked:bg-[#8BCF00]
                                "
                            />

                            <span className="text-sm whitespace-nowrap">
                                Show Deleted
                            </span>

                        </label>

                    </div>

                </div>

            </div>


            {/* =====================================================
                ROLE TABLE
            ===================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-sm">

                <div className="overflow-x-auto">

                    <table className="table">

                        <thead>

                            <tr>

                                {/* Index */}

                                <th className="w-16 text-center">
                                    #
                                </th>


                                <th>
                                    Name
                                </th>


                                <th>
                                    Status
                                </th>


                                <th>
                                    Created
                                </th>


                                <th>
                                    Last Updated
                                </th>


                                <th className="text-right">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredRoles.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center py-12"
                                    >

                                        <p className="text-sm font-medium">
                                            No roles found
                                        </p>

                                        <p className="text-xs text-base-content/50 mt-1">
                                            Try changing your search or create a new role.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredRoles.map((role, index) => (

                                    <tr key={role.id}>

                                        {/* Index */}

                                        <td className="text-center">

                                            <span className="text-sm text-base-content/60">
                                                {index + 1}
                                            </span>

                                        </td>


                                        {/* Name */}

                                        <td>

                                            <span className="font-semibold">
                                                {role.name}
                                            </span>

                                        </td>


                                        {/* Status */}

                                        <td>

                                            <span
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    border
                                                    text-xs
                                                    font-medium
                                                    ${
                                                        role.deleted
                                                            ? 'text-error border-error/30 bg-error/5'
                                                            : 'text-[#78B300] border-[#8BCF00]/50 bg-[#8BCF00]/10'
                                                    }
                                                `}
                                            >

                                                {role.deleted
                                                    ? 'Deleted'
                                                    : 'Active'
                                                }

                                            </span>

                                        </td>


                                        {/* Created */}

                                        <td>

                                            <span className="whitespace-nowrap">
                                                {role.createdAt || 'N/A'}
                                            </span>

                                        </td>


                                        {/* Updated */}

                                        <td>

                                            <span className="whitespace-nowrap">
                                                {role.updatedAt || 'N/A'}
                                            </span>

                                        </td>


                                        {/* Actions */}

                                        <td>

                                            <div className="flex items-center justify-end gap-1">

                                                {!role.deleted && (

                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit?.(role)}
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


                                                {!role.deleted && (

                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete?.(role)}
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

                                                        <TrashIcon className="w-5 h-5" />

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