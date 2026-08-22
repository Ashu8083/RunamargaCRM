import React, { useState } from 'react'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'

function Roles() {

    const [search, setSearch] = useState('')
    const [showDeleted, setShowDeleted] = useState(false)

    // Temporary data.
    // Later this will come from FastAPI.
    const roles = [
        {
            id: 1,
            name: 'team_lead',
            description: 'team_lead',
            status: 'Active',
            created: 'Apr 7, 2026, 3:13:50 PM',
            updated: 'N/A',
            deleted: false,
        },
        {
            id: 2,
            name: 'agent',
            description: 'agent',
            status: 'Active',
            created: 'Apr 8, 2026, 10:20:15 AM',
            updated: 'Apr 10, 2026, 2:30:10 PM',
            deleted: false,
        },
    ]

    const filteredRoles = roles.filter((role) => {

        if (!showDeleted && role.deleted) {
            return false
        }

        const searchText = search.toLowerCase()

        return (
            role.name.toLowerCase().includes(searchText) ||
            role.description.toLowerCase().includes(searchText)
        )
    })


    return (
        <div className="p-4 md:p-6 space-y-6">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div>

                <h1 className="text-3xl md:text-4xl font-normal text-base-content">
                    Roles Management
                </h1>

                <p className="mt-3 text-base text-base-content/60">
                    Manage user roles and permissions
                </p>

            </div>


            {/* =====================================================
                    TABLE TOOLBAR
                ===================================================== */}

            <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-4">

                <div className="flex flex-col xl:flex-row xl:items-center gap-3">

                    {/* SEARCH */}

                    <div className="relative flex-1">

                        <MagnifyingGlassIcon
                            className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    w-5
                    h-5
                    text-base-content/40
                "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search roles by name or description..."
                            className="input input-bordered w-full pl-12 h-11"
                        />

                    </div>


                    {/* SEARCH BUTTON */}

                    <button
                        type="button"
                        className="btn btn-outline"
                        style={{
                            color: 'rgb(143, 212, 0)',
                            borderColor: 'rgb(143, 212, 0)',
                        }}
                    >
                        <MagnifyingGlassIcon className="w-5 h-5" />

                        Search
                    </button>


                    {/* CLEAR */}

                    <button
                        type="button"
                        className="btn btn-ghost text-base-content/40"
                        onClick={() => setSearch('')}
                    >
                        Clear
                    </button>


                    {/* DIVIDER */}

                    <div className="hidden xl:block h-8 w-px bg-base-300"></div>


                    {/* CREATE ROLE */}

                    <button
                        type="button"
                        className="btn text-white border-0 shadow-sm whitespace-nowrap"
                        style={{
                            backgroundColor: 'rgb(143, 212, 0)',
                        }}
                    >
                        <PlusIcon className="w-5 h-5" />

                        Create Role
                    </button>


                    {/* REFRESH */}

                    <button
                        type="button"
                        className="btn btn-outline whitespace-nowrap"
                        style={{
                            color: 'rgb(143, 212, 0)',
                            borderColor: 'rgb(143, 212, 0)',
                        }}
                    >
                        <ArrowPathIcon className="w-5 h-5" />

                        Refresh
                    </button>


                    {/* SHOW DELETED */}

                    <label className="flex items-center gap-2 whitespace-nowrap cursor-pointer">

                        <input
                            type="checkbox"
                            className="toggle"
                            checked={showDeleted}
                            onChange={(e) => setShowDeleted(e.target.checked)}
                        />

                        <span className="text-sm">
                            Show Deleted
                        </span>

                    </label>

                </div>

            </div>

            {/* =====================================================
                TABLE
            ===================================================== */}

            <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-x-auto">

                <table className="table w-full">

                    {/* TABLE HEADER */}

                    <thead>

                        <tr>

                            <th className="w-12">

                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm"
                                />

                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Description
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


                    {/* TABLE BODY */}

                    <tbody>

                        {filteredRoles.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-12 text-base-content/50"
                                >
                                    No roles found
                                </td>

                            </tr>

                        ) : (

                            filteredRoles.map((role) => (

                                <tr key={role.id}>

                                    {/* CHECKBOX */}

                                    <td>

                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm"
                                        />

                                    </td>


                                    {/* NAME */}

                                    <td>

                                        <span className="font-semibold">
                                            {role.name}
                                        </span>

                                    </td>


                                    {/* DESCRIPTION */}

                                    <td>

                                        <span className="text-base-content/60">
                                            {role.description}
                                        </span>

                                    </td>


                                    {/* STATUS */}

                                    <td>

                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                px-3
                                                py-1
                                                rounded-full
                                                text-sm
                                                border
                                            "
                                            style={{
                                                color: 'rgb(70, 150, 0)',
                                                borderColor: 'rgb(143, 212, 0)',
                                            }}
                                        >
                                            {role.status}
                                        </span>

                                    </td>


                                    {/* CREATED */}

                                    <td className="whitespace-nowrap">

                                        {role.created}

                                    </td>


                                    {/* UPDATED */}

                                    <td className="whitespace-nowrap">

                                        {role.updated}

                                    </td>


                                    {/* ACTIONS */}

                                    <td>

                                        <div className="flex justify-end gap-2">

                                            <button
                                                type="button"
                                                className="btn btn-circle btn-sm btn-ghost"
                                                title="Edit role"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>


                                            <button
                                                type="button"
                                                className="btn btn-circle btn-sm btn-ghost text-error"
                                                title="Delete role"
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
    )
}

export default Roles