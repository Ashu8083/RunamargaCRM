// admin-react/src/pages/Roles&Teams/Admins/components/AdminTable.jsx

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'

function AdminTable({
    admins = [],
    search,
    setSearch,
    onCreate,
    onEdit,
    onDelete,
    onRefresh,
    onManagePermissions,
    onStatusChange,
}) {

    const filteredAdmins = admins.filter((admin) => {

        const searchValue = search.trim().toLowerCase()

        if (!searchValue) {
            return true
        }

        return (
            admin.name?.toLowerCase().includes(searchValue) ||
            admin.phone?.toLowerCase().includes(searchValue) ||
            admin.email?.toLowerCase().includes(searchValue) ||
            admin.status?.toLowerCase().includes(searchValue)
        )
    })


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

        if (status === 'Deactivated') {
            return `
                text-error
                border-error/30
                bg-error/10
            `
        }

        return `
            text-base-content/60
            border-base-300
            bg-base-200
        `
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
                                    placeholder="Search admins..."
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
                            Create Admin
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
                ADMIN TABLE
            ===================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-sm">

                <div className="overflow-x-auto">

                    <table className="table">

                        <thead>

                            <tr>

                                <th className="w-14 text-center">
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

                            {filteredAdmins.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center py-12"
                                    >

                                        <p className="text-sm font-medium">
                                            No admins found
                                        </p>

                                        <p className="text-xs text-base-content/50 mt-1">
                                            Try changing your search or create a new admin.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredAdmins.map((admin, index) => (

                                    <tr key={admin.id}>

                                        {/* Index */}

                                        <td className="text-center">

                                            <span className="text-sm text-base-content/60">
                                                {index + 1}
                                            </span>

                                        </td>


                                        {/* Name */}

                                        <td>

                                            <span className="font-semibold">
                                                {admin.name}
                                            </span>

                                        </td>


                                        {/* Contact */}

                                        <td>

                                            <div className="space-y-0.5">

                                                <p className="text-sm">
                                                    {admin.phone || 'N/A'}
                                                </p>

                                                <p className="text-xs text-base-content/50">
                                                    {admin.email || 'N/A'}
                                                </p>

                                            </div>

                                        </td>


                                        {/* Status */}

                                        <td>

                                            <select
                                                value={admin.status || 'Active'}
                                                onChange={(event) =>
                                                    onStatusChange?.(
                                                        admin,
                                                        event.target.value
                                                    )
                                                }
                                                className={`
                                                    select
                                                    select-sm
                                                    min-w-[125px]
                                                    border
                                                    font-medium
                                                    ${getStatusClass(admin.status)}
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
                                                {admin.createdAt || 'N/A'}
                                            </span>

                                        </td>


                                        {/* Updated */}

                                        <td>

                                            <span className="whitespace-nowrap text-sm">
                                                {admin.updatedAt || 'N/A'}
                                            </span>

                                        </td>


                                        {/* Actions */}

                                        <td>

                                            <div className="flex items-center justify-end gap-1">

                                                {/* Permissions */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onManagePermissions?.(
                                                            admin
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

                                                    <ShieldCheckIcon className="w-5 h-5" />

                                                </button>


                                                {/* Edit */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onEdit?.(admin)
                                                    }
                                                    className="
                                                        btn
                                                        btn-ghost
                                                        btn-sm
                                                        btn-square
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#78B300]
                                                    "
                                                    title="Edit admin"
                                                >

                                                    <PencilIcon className="w-5 h-5" />

                                                </button>


                                                {/* Delete */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDelete?.(admin)
                                                    }
                                                    className="
                                                        btn
                                                        btn-ghost
                                                        btn-sm
                                                        btn-square
                                                        text-error
                                                        hover:bg-error/10
                                                    "
                                                    title="Delete admin"
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

export default AdminTable
