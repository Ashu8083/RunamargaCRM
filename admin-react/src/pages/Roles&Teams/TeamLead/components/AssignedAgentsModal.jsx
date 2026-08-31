// admin-react/src/pages/Role-management/TeamLead/components/AssignedAgentsModal.jsx

import { useEffect, useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'


function AssignedAgentsModal({
    open,
    teamLead,
    employees = [],
    onClose,
}) {

    const [search, setSearch] = useState('')


    // =========================================================
    // RESET SEARCH
    // =========================================================

    useEffect(() => {

        if (!open || !teamLead) {
            setSearch('')
            return
        }

        setSearch('')

    }, [open, teamLead])


    // =========================================================
    // GET ASSIGNED EMPLOYEES
    // =========================================================

    const assignedEmployees = useMemo(() => {

        if (!teamLead) {
            return []
        }


        /*
         * Team Lead stores assigned employee IDs.
         *
         * Example:
         *
         * assignedAgentIds: [101, 102]
         *
         * Resolve those IDs against the employee list.
         */


        if (
            Array.isArray(
                teamLead.assignedAgentIds
            )
        ) {

            return employees.filter(
                (employee) =>
                    teamLead.assignedAgentIds.some(
                        (id) =>
                            String(id) ===
                            String(employee.id)
                    )
            )

        }


        /*
         * Backward compatibility if assignedAgents
         * objects are already present.
         */

        return teamLead.assignedAgents || []

    }, [employees, teamLead])


    // =========================================================
    // FILTER ASSIGNED EMPLOYEES
    // =========================================================

    const filteredEmployees = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase()


        if (!searchValue) {
            return assignedEmployees
        }


        return assignedEmployees.filter(
            (employee) => {

                return (

                    employee.name
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    employee.employeeId
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    employee.phone
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    employee.email
                        ?.toLowerCase()
                        .includes(searchValue)

                )

            }
        )

    }, [
        assignedEmployees,
        search,
    ])


    // =========================================================
    // CLOSED
    // =========================================================

    if (!open || !teamLead) {
        return null
    }


    // =========================================================
    // MODAL
    // =========================================================

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
                max-w-3xl
                border
                border-base-300
                bg-base-100
                p-0
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#8BCF00]/10
                        ">

                            <UserGroupIcon className="
                                h-5
                                w-5
                                text-[#78B300]
                            " />

                        </div>


                        <div>

                            <h3 className="
                                text-lg
                                font-semibold
                            ">
                                Assigned Agents
                            </h3>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">
                                Agents assigned to{' '}
                                {teamLead.name}
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

                        <XMarkIcon className="
                            h-5
                            w-5
                        " />

                    </button>

                </div>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div className="px-5 pt-5">

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
                            Assigned Agents
                        </p>


                        <p className="
                            mt-1
                            text-lg
                            font-semibold
                        ">
                            {assignedEmployees.length}
                        </p>

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

                        <MagnifyingGlassIcon className="
                            h-4
                            w-4
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
                            placeholder="Search assigned agents..."
                            className="grow"
                        />

                    </label>

                </div>


                {/* =================================================
                    ASSIGNED AGENTS
                ================================================= */}

                <div className="
                    max-h-[55vh]
                    overflow-y-auto
                    p-5
                ">

                    {filteredEmployees.length === 0 ? (

                        <div className="
                            py-12
                            text-center
                        ">

                            <UserGroupIcon className="
                                mx-auto
                                h-9
                                w-9
                                text-base-content/30
                            " />


                            <p className="
                                mt-3
                                text-sm
                                font-medium
                            ">

                                {assignedEmployees.length === 0
                                    ? 'No agents assigned'
                                    : 'No agents found'
                                }

                            </p>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">

                                {assignedEmployees.length === 0
                                    ? 'Agents assigned to this team lead will appear here.'
                                    : 'Try changing your search.'
                                }

                            </p>

                        </div>

                    ) : (

                        <div className="
                            overflow-hidden
                            rounded-lg
                            border
                            border-base-300
                        ">

                            {filteredEmployees.map(
                                (employee, index) => (

                                    <div
                                        key={
                                            employee.id ||
                                            employee.employeeId ||
                                            index
                                        }
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            border-b
                                            border-base-300
                                            px-4
                                            py-3
                                            last:border-b-0
                                        "
                                    >

                                        {/* =================================
                                            EMPLOYEE INFORMATION
                                        ================================= */}

                                        <div className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-3
                                        ">

                                            {/* Employee Icon */}

                                            <div className="
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-[#8BCF00]/10
                                            ">

                                                <UserGroupIcon className="
                                                    h-4
                                                    w-4
                                                    text-[#78B300]
                                                " />

                                            </div>


                                            {/* Employee */}

                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                ">
                                                    {employee.name ||
                                                        'N/A'
                                                    }
                                                </p>


                                                <div className="
                                                    mt-0.5
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-x-3
                                                    gap-y-1
                                                ">

                                                    <span className="
                                                        text-xs
                                                        text-base-content/50
                                                    ">
                                                        ID:{' '}
                                                        {employee.employeeId ||
                                                            employee.id ||
                                                            'N/A'
                                                        }
                                                    </span>


                                                    {employee.phone && (

                                                        <span className="
                                                            text-xs
                                                            text-base-content/50
                                                        ">
                                                            {employee.phone}
                                                        </span>

                                                    )}

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================
                                            EMAIL
                                        ================================= */}

                                        <div className="
                                            hidden
                                            max-w-[240px]
                                            shrink-0
                                            truncate
                                            text-xs
                                            text-base-content/50
                                            sm:block
                                        ">

                                            {employee.email ||
                                                'N/A'
                                            }

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    justify-end
                    border-t
                    border-base-300
                    p-4
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
                        Close
                    </button>

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


export default AssignedAgentsModal