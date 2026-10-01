// admin-react/src/pages/Roles&Teams/Admins/components/AdminTable.jsx

import { useMemo } from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'


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

    const filteredAdmins = useMemo(() => {

        const value = search?.trim().toLowerCase()

        if (!value) {
            return admins
        }

        return admins.filter((admin) => {

            const fields = [
                admin.name,
                admin.email,
                admin.phone,
                admin.role,
                admin.role_code,
                admin.status,
            ]

            return fields.some((field) =>
                String(field || '')
                    .toLowerCase()
                    .includes(value)
            )
        })

    }, [admins, search])


    const getDateTime = (admin) => ({
        created:
            admin.createdAt ||
            admin.created_at ||
            'N/A',

        updated:
            admin.updatedAt ||
            admin.updated_at ||
            'N/A',
    })


    return (
        <div className="
            card
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="
                flex
                flex-col
                gap-3
                border-b
                border-base-300
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                {/* SEARCH */}

                <div className="
                    relative
                    w-full
                    sm:w-64
                ">

                    <MagnifyingGlassIcon
                        className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-base-content/50
                        "
                    />

                    <input
                        type="text"
                        value={search || ''}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search admins..."
                        className="
                            input
                            input-bordered
                            w-full
                            pl-9
                            pr-9
                        "
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="
                                absolute
                                right-2
                                top-1/2
                                -translate-y-1/2
                                rounded
                                p-1
                                hover:bg-base-200
                            "
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    )}

                </div>


                {/* ACTIONS */}

                <div className="
                    flex
                    w-full
                    gap-2
                    sm:w-auto
                ">

                    <button
                        type="button"
                        onClick={onRefresh}
                        className="
                            btn
                            btn-outline
                            flex-1
                            sm:flex-none
                        "
                    >
                        <ArrowPathIcon className="h-4 w-4" />
                        Refresh
                    </button>


                    <button
                        type="button"
                        onClick={onCreate}
                        className="
                            btn
                            btn-primary
                            flex-1
                            sm:flex-none
                        "
                    >
                        <PlusIcon className="h-4 w-4" />
                        Add Admin
                    </button>

                </div>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

            <div className="overflow-x-auto">

                <table className="table">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Admin</th>
                            <th>Contact Info</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Date & Time</th>
                            <th className="text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>


                    <tbody>

                        {filteredAdmins.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={7}
                                    className="
                                        py-12
                                        text-center
                                        text-base-content/60
                                    "
                                >
                                    {search
                                        ? 'No admins found matching your search.'
                                        : 'No admins found.'
                                    }
                                </td>

                            </tr>

                        ) : (

                            filteredAdmins.map(
                                (admin, index) => {

                                    const dateTime =
                                        getDateTime(admin)

                                    const isActive =
                                        admin.status === 'Active' ||
                                        admin.is_active === true

                                    return (
                                        <tr
                                            key={
                                                admin.id ??
                                                admin.employee_id ??
                                                index
                                            }
                                            className="
                                                hover:bg-base-200/50
                                            "
                                        >

                                            {/* # */}

                                            <td className="font-medium">
                                                {index + 1}
                                            </td>


                                            {/* ADMIN */}

                                            <td>

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <div className="
                                                        flex
                                                        h-10
                                                        w-10
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-primary/10
                                                        font-semibold
                                                        text-primary
                                                    ">
                                                        {admin.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() || 'A'}
                                                    </div>

                                                    <div>

                                                        <div className="
                                                            font-semibold
                                                        ">
                                                            {admin.name || 'N/A'}
                                                        </div>

                                                        <div className="
                                                            text-xs
                                                            text-base-content/50
                                                        ">
                                                            Employee ID:{' '}
                                                            {admin.employee_id ||
                                                                admin.employeeId ||
                                                                'N/A'}
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CONTACT */}

                                            <td>

                                                <div className="text-sm">
                                                    {admin.email || 'N/A'}
                                                </div>

                                                <div className="
                                                    text-xs
                                                    text-base-content/60
                                                ">
                                                    {admin.phone || 'N/A'}
                                                </div>

                                            </td>


                                            {/* ROLE */}

                                            <td>

                                                <div className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-lg
                                                    bg-primary/10
                                                    px-3
                                                    py-1.5
                                                    text-sm
                                                    font-medium
                                                    text-primary
                                                ">

                                                    <ShieldCheckIcon
                                                        className="h-4 w-4"
                                                    />

                                                    {admin.role ||
                                                        admin.role_code ||
                                                        'Admin'}

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <select
                                                    value={
                                                        isActive
                                                            ? 'Active'
                                                            : 'Inactive'
                                                    }
                                                    onChange={(e) =>
                                                        onStatusChange?.(
                                                            admin,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`
                                                        select
                                                        select-sm
                                                        select-bordered
                                                        ${
                                                            isActive
                                                                ? 'text-success'
                                                                : 'text-error'
                                                        }
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


                                            {/* DATE & TIME */}

                                            <td>

                                                <div className="
                                                    space-y-1
                                                    text-xs
                                                ">

                                                    <div>
                                                        <span className="
                                                            font-medium
                                                            text-base-content/70
                                                        ">
                                                            Created:
                                                        </span>{' '}
                                                        {dateTime.created}
                                                    </div>

                                                    <div>
                                                        <span className="
                                                            font-medium
                                                            text-base-content/70
                                                        ">
                                                            Updated:
                                                        </span>{' '}
                                                        {dateTime.updated}
                                                    </div>

                                                </div>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="
                                                    flex
                                                    justify-end
                                                    gap-1
                                                ">

                                                    {/* PERMISSIONS */}

                                                    <button
                                                        type="button"
                                                        disabled={!isActive}
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
                                                        "
                                                    >
                                                        <ShieldCheckIcon
                                                            className="h-5 w-5"
                                                        />
                                                    </button>


                                                    {/* EDIT */}

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
                                                        "
                                                    >
                                                        <PencilSquareIcon
                                                            className="h-5 w-5"
                                                        />
                                                    </button>


                                                    {/* DELETE */}

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
                                                        "
                                                    >
                                                        <TrashIcon
                                                            className="h-5 w-5"
                                                        />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                }
                            )

                        )}

                    </tbody>

                </table>

            </div>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div className="
                border-t
                border-base-300
                px-4
                py-3
                text-sm
                text-base-content/60
            ">
                Showing {filteredAdmins.length} of {admins.length} admins
            </div>

        </div>
    )
}


export default AdminTable