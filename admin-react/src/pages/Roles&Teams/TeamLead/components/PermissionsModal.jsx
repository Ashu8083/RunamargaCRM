// admin-react/src/pages/Roles&Teams/TeamLead/components/PermissionsModal.jsx

import { useEffect, useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'
import CheckIcon from '@heroicons/react/24/outline/CheckIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'


function PermissionsModal({
    open,
    teamLead,
    onClose,
}) {

    const [permissionGroups, setPermissionGroups] = useState({
        rm: [],
        agent: [],
        common: [],
    })


    const [assignedPermissions, setAssignedPermissions] = useState([])

    const [search, setSearch] = useState('')


    // =========================================================
    // LOAD PERMISSIONS
    // =========================================================

    useEffect(() => {

        if (!open || !teamLead) {

            setPermissionGroups({
                rm: [],
                agent: [],
                common: [],
            })

            setAssignedPermissions([])

            setSearch('')

            return
        }


        /*
         * TEMPORARY DATA
         *
         * Replace this section with the backend API later.
         *
         * Example:
         *
         * GET /team-leads/{teamLead.id}/permissions
         */

        setPermissionGroups({

            rm: [
                {
                    id: 1,
                    name: 'View Applications',
                },
                {
                    id: 2,
                    name: 'Create Applications',
                },
                {
                    id: 3,
                    name: 'Edit Applications',
                },
                {
                    id: 4,
                    name: 'Assign Applications',
                },
            ],

            agent: [
                {
                    id: 5,
                    name: 'View Assigned Applications',
                },
                {
                    id: 6,
                    name: 'Update Application Status',
                },
                {
                    id: 7,
                    name: 'View Customer Details',
                },
            ],

            common: [
                {
                    id: 8,
                    name: 'View Dashboard',
                },
                {
                    id: 9,
                    name: 'View Profile',
                },
                {
                    id: 10,
                    name: 'View Attendance',
                },
            ],

        })


        /*
         * Existing permissions assigned to this team lead.
         *
         * Backend will eventually provide this.
         */

        setAssignedPermissions(
            teamLead.permissions?.map(
                (permission) => permission.id
            ) || []
        )

        setSearch('')

    }, [open, teamLead])


    // =========================================================
    // FILTER PERMISSIONS
    // =========================================================

    const filteredGroups = useMemo(() => {

        const searchValue = search
            .trim()
            .toLowerCase()


        const filterPermissions = (permissions) => {

            if (!searchValue) {
                return permissions
            }


            return permissions.filter(
                (permission) =>
                    permission.name
                        ?.toLowerCase()
                        .includes(searchValue)
            )
        }


        return {

            rm: filterPermissions(
                permissionGroups.rm
            ),

            agent: filterPermissions(
                permissionGroups.agent
            ),

            common: filterPermissions(
                permissionGroups.common
            ),

        }

    }, [permissionGroups, search])


    // =========================================================
    // TOGGLE PERMISSION
    // =========================================================

    const togglePermission = (permissionId) => {

        setAssignedPermissions((previous) => {

            if (previous.includes(permissionId)) {

                return previous.filter(
                    (id) => id !== permissionId
                )

            }


            return [
                ...previous,
                permissionId,
            ]

        })
    }


    // =========================================================
    // COUNTS
    // =========================================================

    const totalPermissions =
        permissionGroups.rm.length +
        permissionGroups.agent.length +
        permissionGroups.common.length


    const assignedCount =
        assignedPermissions.length


    // =========================================================
    // SAVE
    // =========================================================

    const handleSave = () => {

        /*
         * Replace with API call later.
         *
         * PUT /team-leads/{teamLead.id}/permissions
         *
         * Body:
         *
         * {
         *     permission_ids: assignedPermissions
         * }
         */

        console.log(
            'Team Lead:',
            teamLead.id
        )

        console.log(
            'Assigned permission IDs:',
            assignedPermissions
        )

        onClose?.()
    }


    // =========================================================
    // PERMISSION GROUP
    // =========================================================

    const renderPermissionGroup = (
        title,
        permissions
    ) => {

        if (permissions.length === 0) {
            return null
        }


        return (

            <div className="border border-base-300 rounded-lg overflow-hidden">

                {/* Group Header */}

                <div className="px-4 py-3 bg-base-200/40 border-b border-base-300">

                    <h4 className="text-sm font-semibold">
                        {title}
                    </h4>

                    <p className="text-xs text-base-content/50 mt-0.5">
                        {permissions.length} permission
                        {permissions.length !== 1 ? 's' : ''}
                    </p>

                </div>


                {/* Permission List */}

                <div>

                    {permissions.map((permission) => {

                        const isAssigned =
                            assignedPermissions.includes(
                                permission.id
                            )


                        return (

                            <button
                                key={permission.id}
                                type="button"
                                onClick={() =>
                                    togglePermission(
                                        permission.id
                                    )
                                }
                                className={`
                                    w-full
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    px-4
                                    py-3
                                    text-left
                                    transition-colors
                                    border-b
                                    last:border-b-0
                                    border-base-300
                                    ${
                                        isAssigned
                                            ? 'bg-[#8BCF00]/10'
                                            : 'hover:bg-base-200/50'
                                    }
                                `}
                            >

                                {/* Permission Information */}

                                <div className="flex items-center gap-3 min-w-0">

                                    <div
                                        className={`
                                            w-8
                                            h-8
                                            rounded-lg
                                            flex
                                            items-center
                                            justify-center
                                            shrink-0
                                            ${
                                                isAssigned
                                                    ? 'bg-[#8BCF00]/15'
                                                    : 'bg-base-200'
                                            }
                                        `}
                                    >

                                        <ShieldCheckIcon
                                            className={`
                                                w-4
                                                h-4
                                                ${
                                                    isAssigned
                                                        ? 'text-[#78B300]'
                                                        : 'text-base-content/50'
                                                }
                                            `}
                                        />

                                    </div>


                                    <span
                                        className={`
                                            text-sm
                                            truncate
                                            ${
                                                isAssigned
                                                    ? 'font-semibold'
                                                    : 'font-medium'
                                            }
                                        `}
                                    >
                                        {permission.name}
                                    </span>

                                </div>


                                {/* Checkbox */}

                                <div
                                    className={`
                                        w-5
                                        h-5
                                        rounded
                                        border
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                        ${
                                            isAssigned
                                                ? 'bg-[#8BCF00] border-[#8BCF00]'
                                                : 'border-base-300'
                                        }
                                    `}
                                >

                                    {isAssigned && (

                                        <CheckIcon
                                            className="w-3.5 h-3.5 text-white"
                                        />

                                    )}

                                </div>

                            </button>

                        )

                    })}

                </div>

            </div>

        )

    }


    // =========================================================
    // MODAL
    // =========================================================

    if (!open || !teamLead) {
        return null
    }


    return (

        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
        >

            <div className="modal-box w-11/12 max-w-2xl p-0 bg-base-100 border border-base-300">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-center justify-between p-5 border-b border-base-300">

                    <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-[#8BCF00]/10 flex items-center justify-center">

                            <ShieldCheckIcon
                                className="w-5 h-5 text-[#78B300]"
                            />

                        </div>


                        <div>

                            <h3 className="text-lg font-semibold">
                                Manage Permissions
                            </h3>

                            <p className="text-xs text-base-content/50 mt-1">
                                Manage permissions for {teamLead.name}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-ghost btn-circle"
                        aria-label="Close"
                    >

                        <XMarkIcon className="w-5 h-5" />

                    </button>

                </div>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div className="px-5 pt-5">

                    <div className="grid grid-cols-2 gap-3">

                        <div className="rounded-lg border border-base-300 bg-base-200/30 px-4 py-3">

                            <p className="text-xs text-base-content/50">
                                Available Permissions
                            </p>

                            <p className="text-lg font-semibold mt-1">
                                {totalPermissions}
                            </p>

                        </div>


                        <div className="rounded-lg border border-[#8BCF00]/20 bg-[#8BCF00]/5 px-4 py-3">

                            <p className="text-xs text-base-content/50">
                                Assigned
                            </p>

                            <p className="text-lg font-semibold text-[#78B300] mt-1">
                                {assignedCount}
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="px-5 pt-4">

                    <label className="input input-bordered flex items-center gap-3">

                        <MagnifyingGlassIcon
                            className="w-4 h-4 text-base-content/40"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search permissions..."
                            className="grow"
                        />

                    </label>

                </div>


                {/* =================================================
                    PERMISSIONS
                ================================================= */}

                <div className="p-5 space-y-4 max-h-[55vh] overflow-y-auto">

                    {renderPermissionGroup(
                        'RM Permissions',
                        filteredGroups.rm
                    )}


                    {renderPermissionGroup(
                        'Agent Permissions',
                        filteredGroups.agent
                    )}


                    {renderPermissionGroup(
                        'Common Permissions',
                        filteredGroups.common
                    )}


                    {filteredGroups.rm.length === 0 &&
                        filteredGroups.agent.length === 0 &&
                        filteredGroups.common.length === 0 && (

                            <div className="text-center py-10">

                                <ShieldCheckIcon
                                    className="w-8 h-8 mx-auto text-base-content/30"
                                />

                                <p className="text-sm font-medium mt-3">
                                    No permissions found
                                </p>

                                <p className="text-xs text-base-content/50 mt-1">
                                    Try changing your search.
                                </p>

                            </div>

                        )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="flex items-center justify-between gap-3 p-4 border-t border-base-300">

                    <p className="text-xs text-base-content/50">

                        {assignedCount} permission
                        {assignedCount !== 1 ? 's' : ''} selected

                    </p>


                    <div className="flex gap-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-sm btn-ghost"
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            onClick={handleSave}
                            className="
                                btn
                                btn-sm
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:bg-[#6FA800]
                                hover:border-[#6FA800]
                            "
                        >
                            Save Permissions
                        </button>

                    </div>

                </div>

            </div>


            {/* =================================================
                BACKDROP
            ================================================= */}

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={onClose}
            >

                <button type="button">
                    close
                </button>

            </form>

        </dialog>
    )
}


export default PermissionsModal