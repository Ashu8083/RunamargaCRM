// admin-react\src\pages\Roles&Teams\TeamLead\components\AssignedAgentsModal.jsx
import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

import {
    getAssignedAgents,
} from '../API'


function AssignedAgentsModal({
    open,
    teamLead,
    onClose,
}) {

    const [employees, setEmployees] = useState([])

    const [search, setSearch] = useState('')

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('')


    // ========================================================================
    // LOAD ASSIGNED AGENTS
    // ========================================================================

    useEffect(() => {

        let isMounted = true

        if (!open || !teamLead) {

            setEmployees([])
            setSearch('')
            setError('')
            setLoading(false)

            return () => {
                isMounted = false
            }
        }


        const loadAssignedAgents = async () => {

            setLoading(true)
            setError('')

            try {

                const data =
                    await getAssignedAgents(
                        teamLead.id
                    )


                if (!isMounted) {
                    return
                }


                const assignedData =
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data?.employees)
                            ? data.employees
                            : Array.isArray(data?.assigned_agents)
                                ? data.assigned_agents
                                : []


                const formattedEmployees =
                    assignedData
                        .filter(
                            (employee) =>
                                employee &&
                                employee.id !== undefined &&
                                employee.id !== null
                        )
                        .map((employee) => ({
                            ...employee,

                            id:
                                Number(employee.id),

                            employeeId:
                                employee.employeeId ??
                                employee.employee_id ??
                                employee.id,

                            name:
                                employee.name ||
                                'N/A',

                            phone:
                                employee.phone ||
                                employee.mobile ||
                                employee.phone_number ||
                                'N/A',

                            email:
                                employee.email ||
                                'N/A',
                        }))


                setEmployees(
                    formattedEmployees
                )

            } catch (error) {

                if (!isMounted) {
                    return
                }

                console.error(
                    'Failed to load assigned agents:',
                    error
                )

                setEmployees([])

                setError(
                    error?.response?.data?.detail ||
                    'Unable to load assigned agents.'
                )

            } finally {

                if (isMounted) {
                    setLoading(false)
                }

            }

        }


        loadAssignedAgents()


        return () => {
            isMounted = false
        }

    }, [open, teamLead])


    // ========================================================================
    // RESET SEARCH
    // ========================================================================

    useEffect(() => {

        if (open) {
            setSearch('')
        }

    }, [open, teamLead])


    // ========================================================================
    // FILTER
    // ========================================================================

    const filteredEmployees =
        useMemo(() => {

            const searchValue =
                search.trim().toLowerCase()

            if (!searchValue) {
                return employees
            }

            return employees.filter(
                (employee) => {

                    const name =
                        String(
                            employee.name || ''
                        ).toLowerCase()

                    const employeeId =
                        String(
                            employee.employeeId || ''
                        ).toLowerCase()

                    const phone =
                        String(
                            employee.phone || ''
                        ).toLowerCase()

                    const email =
                        String(
                            employee.email || ''
                        ).toLowerCase()

                    return (
                        name.includes(searchValue) ||
                        employeeId.includes(searchValue) ||
                        phone.includes(searchValue) ||
                        email.includes(searchValue)
                    )
                }
            )

        }, [employees, search])


    if (!open || !teamLead) {
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
                max-w-3xl
                border
                border-base-300
                bg-base-100
                p-0
            ">

                {/* HEADER */}

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

                            <h2 className="
                                text-lg
                                font-semibold
                            ">
                                Assigned Agents
                            </h2>

                            <p className="
                                text-sm
                                text-base-content/60
                            ">
                                {teamLead.name || 'Team Lead'}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            btn
                            btn-ghost
                            btn-sm
                            btn-square
                        "
                        title="Close"
                    >

                        <XMarkIcon className="
                            h-5
                            w-5
                        " />

                    </button>

                </div>


                {/* CONTENT */}

                <div className="p-5">

                    {/* SEARCH */}

                    <div className="
                        relative
                        mb-4
                    ">

                        <MagnifyingGlassIcon
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-5
                                w-5
                                -translate-y-1/2
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
                            placeholder="Search assigned agents..."
                            className="
                                input
                                input-bordered
                                w-full
                                pl-10
                            "
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="
                            mb-4
                            rounded-lg
                            border
                            border-error/20
                            bg-error/5
                            px-4
                            py-3
                        ">

                            <p className="
                                text-sm
                                text-error
                            ">
                                {error}
                            </p>

                        </div>

                    )}


                    {/* LOADING */}

                    {loading && (

                        <div className="
                            flex
                            min-h-32
                            items-center
                            justify-center
                        ">

                            <span className="
                                loading
                                loading-spinner
                                loading-md
                            " />

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        filteredEmployees.length === 0 && (

                            <div className="
                                flex
                                min-h-32
                                flex-col
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-dashed
                                border-base-300
                                px-4
                                text-center
                            ">

                                <UserGroupIcon className="
                                    mb-2
                                    h-8
                                    w-8
                                    text-base-content/30
                                " />

                                <p className="
                                    text-sm
                                    font-medium
                                    text-base-content/70
                                ">
                                    {search.trim()
                                        ? 'No assigned agents found.'
                                        : 'No agents are currently assigned.'
                                    }
                                </p>

                            </div>

                        )}


                    {/* AGENTS */}

                    {!loading &&
                        filteredEmployees.length > 0 && (

                            <div className="
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
                            ">

                                <div className="
                                    max-h-96
                                    overflow-y-auto
                                ">

                                    {filteredEmployees.map(
                                        (employee) => (

                                            <div
                                                key={employee.id}
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

                                                <div className="
                                                    min-w-0
                                                    flex-1
                                                ">

                                                    <p className="
                                                        truncate
                                                        text-sm
                                                        font-medium
                                                    ">
                                                        {employee.name}
                                                    </p>


                                                    <div className="
                                                        mt-1
                                                        flex
                                                        flex-wrap
                                                        gap-x-4
                                                        gap-y-1
                                                        text-xs
                                                        text-base-content/60
                                                    ">

                                                        {employee.employeeId && (

                                                            <span>
                                                                ID: {
                                                                    employee.employeeId
                                                                }
                                                            </span>

                                                        )}


                                                        {employee.phone &&
                                                            employee.phone !== 'N/A' && (

                                                                <span>
                                                                    {employee.phone}
                                                                </span>

                                                            )}


                                                        {employee.email &&
                                                            employee.email !== 'N/A' && (

                                                                <span className="
                                                                    max-w-xs
                                                                    truncate
                                                                ">
                                                                    {employee.email}
                                                                </span>

                                                            )}

                                                    </div>

                                                </div>


                                                <span className="
                                                    shrink-0
                                                    rounded-full
                                                    bg-[#8BCF00]/10
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    text-[#78B300]
                                                ">
                                                    Assigned
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                </div>


                {/* FOOTER */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-base-300
                    px-5
                    py-4
                ">

                    <p className="
                        text-sm
                        text-base-content/60
                    ">
                        {employees.length}{' '}
                        {employees.length === 1
                            ? 'agent'
                            : 'agents'}{' '}
                        assigned
                    </p>


                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm"
                    >
                        Close
                    </button>

                </div>

            </div>


            <form
                method="dialog"
                className="modal-backdrop"
            >

                <button
                    type="button"
                    onClick={onClose}
                >
                    close
                </button>

            </form>

        </dialog>

    )
}


export default AssignedAgentsModal