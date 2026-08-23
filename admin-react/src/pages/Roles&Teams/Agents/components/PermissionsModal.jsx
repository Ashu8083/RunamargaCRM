// admin-react/src/pages/Roles&Teams/Agents/components/PermissionsModal.jsx

import { useEffect, useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'
import CheckIcon from '@heroicons/react/24/outline/CheckIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'


function PermissionsModal({
    open,
    agent,
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

        if (!open || !agent) {

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
         * Replace this section with backend API later.
         *
         * Example:
         *
         * GET /permissions
         *
         * Backend response can be:
         *
         * {
         *     rm: [],
         *     agent: [],
         *     common: []
         * }
         */

        const defaultPermissions = {

            rm: [
                {
                    id: 1,
                    name: 'View RM Applications',
                },
                {
                    id: 2,
                    name: 'Create RM Applications',
                },
                {
                    id: 3,
                    name: 'Edit RM Applications',
                },
                {
                    id: 4,
                    name: 'Assign RM Applications',
                },
                {
                    id: 5,
                    name: 'View RM Reports',
                },
            ],


            agent: [
                {
                    id: 6,
                    name: 'View Agent Applications',
                },
                {
                    id: 7,
                    name: 'Create Agent Applications',
                },
                {
                    id: 8,
                    name: 'Edit Agent Applications',
                },
                {
                    id: 9,
                    name: 'Assign Agent Applications',
                },
                {
                    id: 10,
                    name: 'View Agent Reports',
                },
            ],


            common: [
                {
                    id: 11,
                    name: 'View Dashboard',
                },
                {
                    id: 12,
                    name: 'View Profile',
                },
                {
                    id: 13,
                    name: 'View Notifications',
                },
                {
                    id: 14,
                    name: 'View Attendance',
                },
            ],

        }


        /*
         * Backend can eventually provide:
         *
         * agent.availablePermissionGroups
         *
         * instead of using the temporary data above.
         */

        setPermissionGroups(
            agent.availablePermissionGroups ||
            defaultPermissions
        )


        /*
         * Existing permissions assigned to this agent.
         *
         * Expected format:
         *
         * [
         *     {
         *         id: 1,
         *         name: 'View RM Applications',
         *         group: 'RM'
         *     }
         * ]
         */

        setAssignedPermissions(
            agent.permissions || []
        )


        setSearch('')

    }, [open, agent])


    // =========================================================
    // FILTER PERMISSIONS
    // =========================================================

    const filteredGroups = useMemo(() => {

        const searchValue = search
            .trim()
            .toLowerCase()


        const filterPermissions = (
            permissions
        ) => {

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

    }, [
        permissionGroups,
        search,
    ])


    // =========================================================
    // TOGGLE PERMISSION
    // =========================================================

    const togglePermission = (
        permission,
        group
    ) => {

        setAssignedPermissions(
            (previous) => {

                const alreadyAssigned =
                    previous.some(
                        (item) =>
                            String(item.id) ===
                            String(permission.id)
                    )


                if (alreadyAssigned) {

                    return previous.filter(
                        (item) =>
                            String(item.id) !==
                            String(permission.id)
                    )

                }


                return [
                    ...previous,

                    {
                        ...permission,
                        group,
                    },
                ]

            }
        )
    }


    // =========================================================
    // CHECK IF ASSIGNED
    // =========================================================

    const isPermissionAssigned = (
        permissionId
    ) => {

        return assignedPermissions.some(
            (permission) =>
                String(permission.id) ===
                String(permissionId)
        )

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
         * Later replace with API call:
         *
         * PUT /agents/{agent.id}/permissions
         *
         * Body:
         *
         * {
         *     permission_ids: [
         *         1,
         *         2,
         *         7
         *     ]
         * }
         */


        const permissionIds =
            assignedPermissions.map(
                (permission) =>
                    permission.id
            )


        console.log(
            'Agent:',
            agent.id
        )


        console.log(
            'Assigned permission IDs:',
            permissionIds
        )


        onClose?.()

    }


    // =========================================================
    // PERMISSION GROUP
    // =========================================================

    const renderPermissionGroup = (
        title,
        group,
        permissions
    ) => {

        if (permissions.length === 0) {
            return null
        }


        return (

            <div className="
                border
                border-base-300
                rounded-lg
                overflow-hidden
            ">

                {/* =================================================
                    GROUP HEADER
                ================================================= */}

                <div className="
                    px-4
                    py-3
                    bg-base-200/40
                    border-b
                    border-base-300
                ">

                    <h4 className="
                        text-sm
                        font-semibold
                    ">
                        {title}
                    </h4>


                    <p className="
                        text-xs
                        text-base-content/50
                        mt-0.5
                    ">

                        {permissions.length} permission
                        {permissions.length !== 1
                            ? 's'
                            : ''
                        }

                    </p>

                </div>


                {/* =================================================
                    PERMISSION LIST
                ================================================= */}

                <div>

                    {permissions.map(
                        (permission) => {

                            const isAssigned =
                                isPermissionAssigned(
                                    permission.id
                                )


                            return (

                                <button
                                    key={permission.id}
                                    type="button"
                                    onClick={() =>
                                        togglePermission(
                                            permission,
                                            group
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

                                    {/* =================================================
                                        PERMISSION INFORMATION
                                    ================================================= */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        min-w-0
                                    ">

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


                                        <div className="
                                            min-w-0
                                        ">

                                            <span
                                                className={`
                                                    block
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


                                            <span className="
                                                block
                                                text-[11px]
                                                text-base-content/40
                                                mt-0.5
                                            ">
                                                {title}
                                            </span>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        CHECKBOX
                                    ================================================= */}

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
                                                className="
                                                    w-3.5
                                                    h-3.5
                                                    text-white
                                                "
                                            />

                                        )}

                                    </div>

                                </button>

                            )

                        }
                    )}

                </div>

            </div>

        )

    }


    // =========================================================
    // MODAL
    // =========================================================

    if (!open || !agent) {
        return null
    }


    return (

        <dialog
            open
            className="
                modal
                modal-bottom
                sm:modal-middle
            "
        >

            <div className="
                modal-box
                w-11/12
                max-w-2xl
                p-0
                bg-base-100
                border
                border-base-300
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    p-5
                    border-b
                    border-base-300
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            w-9
                            h-9
                            rounded-lg
                            bg-[#8BCF00]/10
                            flex
                            items-center
                            justify-center
                        ">

                            <ShieldCheckIcon
                                className="
                                    w-5
                                    h-5
                                    text-[#78B300]
                                "
                            />

                        </div>


                        <div>

                            <h3 className="
                                text-lg
                                font-semibold
                            ">
                                Manage Permissions
                            </h3>


                            <p className="
                                text-xs
                                text-base-content/50
                                mt-1
                            ">
                                Manage permissions for {agent.name}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            btn
                            btn-sm
                            btn-ghost
                            btn-circle
                        "
                        aria-label="Close"
                    >

                        <XMarkIcon className="w-5 h-5" />

                    </button>

                </div>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div className="px-5 pt-5">

                    <div className="
                        grid
                        grid-cols-2
                        gap-3
                    ">

                        {/* Available */}

                        <div className="
                            rounded-lg
                            border
                            border-base-300
                            bg-base-200/30
                            px-4
                            py-3
                        ">

                            <p className="
                                text-xs
                                text-base-content/50
                            ">
                                Available Permissions
                            </p>


                            <p className="
                                text-lg
                                font-semibold
                                mt-1
                            ">
                                {totalPermissions}
                            </p>

                        </div>


                        {/* Assigned */}

                        <div className="
                            rounded-lg
                            border
                            border-[#8BCF00]/20
                            bg-[#8BCF00]/5
                            px-4
                            py-3
                        ">

                            <p className="
                                text-xs
                                text-base-content/50
                            ">
                                Assigned
                            </p>


                            <p className="
                                text-lg
                                font-semibold
                                text-[#78B300]
                                mt-1
                            ">
                                {assignedCount}
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="px-5 pt-4">

                    <label className="
                        input
                        input-bordered
                        flex
                        items-center
                        gap-3
                    ">

                        <MagnifyingGlassIcon
                            className="
                                w-4
                                h-4
                                text-base-content/40
                            "
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search permissions..."
                            className="grow"
                        />

                    </label>

                </div>


                {/* =================================================
                    PERMISSIONS
                ================================================= */}

                <div className="
                    p-5
                    space-y-4
                    max-h-[55vh]
                    overflow-y-auto
                ">

                    {renderPermissionGroup(
                        'RM Permissions',
                        'RM',
                        filteredGroups.rm
                    )}


                    {renderPermissionGroup(
                        'Agent Permissions',
                        'Agent',
                        filteredGroups.agent
                    )}


                    {renderPermissionGroup(
                        'Common Permissions',
                        'Common',
                        filteredGroups.common
                    )}


                    {/* No Results */}

                    {filteredGroups.rm.length === 0 &&
                        filteredGroups.agent.length === 0 &&
                        filteredGroups.common.length === 0 && (

                            <div className="
                                text-center
                                py-10
                            ">

                                <ShieldCheckIcon
                                    className="
                                        w-8
                                        h-8
                                        mx-auto
                                        text-base-content/30
                                    "
                                />


                                <p className="
                                    text-sm
                                    font-medium
                                    mt-3
                                ">
                                    No permissions found
                                </p>


                                <p className="
                                    text-xs
                                    text-base-content/50
                                    mt-1
                                ">
                                    Try changing your search.
                                </p>

                            </div>

                        )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    p-4
                    border-t
                    border-base-300
                ">

                    <p className="
                        text-xs
                        text-base-content/50
                    ">

                        {assignedCount} permission
                        {assignedCount !== 1
                            ? 's'
                            : ''
                        } selected

                    </p>


                    <div className="
                        flex
                        gap-2
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
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