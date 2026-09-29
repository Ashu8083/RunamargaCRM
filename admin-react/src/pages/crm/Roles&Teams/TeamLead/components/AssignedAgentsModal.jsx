// admin-react/src/pages/Roles&Teams/TeamLead/components/AssignedAgentsModal.jsx

import { useEffect, useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

import { getAssignedAgents } from '../API'


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
    // LOAD TEAM MEMBERS
    // ========================================================================

    useEffect(() => {

        let mounted = true

        if (!open || !teamLead?.id) {
            setEmployees([])
            setSearch('')
            setError('')
            return
        }


        const loadMembers = async () => {

            setLoading(true)
            setError('')

            try {

                const data =
                    await getAssignedAgents(
                        teamLead.id
                    )


                if (!mounted) return


                const list =
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data?.employees)
                            ? data.employees
                            : Array.isArray(data?.assigned_agents)
                                ? data.assigned_agents
                                : []


                setEmployees(
                    list
                        .filter(
                            (employee) =>
                                employee?.id !== undefined &&
                                employee?.id !== null
                        )
                        .map((employee) => ({
                            ...employee,
                            id: Number(employee.id),
                            name: employee.name || 'N/A',
                            email: employee.email || 'N/A',
                            role: employee.role || 'Other',
                        }))
                )

            } catch (err) {

                if (!mounted) return

                console.error(
                    'Failed to load assigned team:',
                    err
                )

                setEmployees([])

                setError(
                    err?.response?.data?.detail ||
                    'Unable to load team members.'
                )

            } finally {

                if (mounted) {
                    setLoading(false)
                }

            }
        }


        loadMembers()


        return () => {
            mounted = false
        }

    }, [open, teamLead])


    // ========================================================================
    // SEARCH
    // ========================================================================

    const filteredEmployees = useMemo(() => {

        const value =
            search
                .trim()
                .toLowerCase()


        if (!value) {
            return employees
        }


        return employees.filter(
            (employee) => {

                const name =
                    String(
                        employee.name || ''
                    ).toLowerCase()


                const email =
                    String(
                        employee.email || ''
                    ).toLowerCase()


                const role =
                    String(
                        employee.role || ''
                    ).toLowerCase()


                return (
                    name.includes(value) ||
                    email.includes(value) ||
                    role.includes(value)
                )
            }
        )

    }, [employees, search])


    // ========================================================================
    // SPLIT BY ROLE
    // ========================================================================

    const rms = useMemo(
        () =>
            filteredEmployees.filter(
                (employee) =>
                    String(employee.role)
                        .toLowerCase()
                        .trim() ===
                    'relationship manager'
            ),
        [filteredEmployees]
    )


    const agents = useMemo(
        () =>
            filteredEmployees.filter(
                (employee) =>
                    String(employee.role)
                        .toLowerCase()
                        .trim() ===
                    'agent'
            ),
        [filteredEmployees]
    )


    // ========================================================================
    // MEMBER LIST
    // ========================================================================

    const MemberList = ({
        members,
        type,
    }) => {

        const isAgent =
            type === 'agent'


        const accent =
            isAgent
                ? 'blue'
                : 'emerald'


        if (!members.length) {

            return (

                <div
                    className="
                        flex
                        min-h-28
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-dashed
                        border-base-300
                        px-3
                        text-center
                    "
                >

                    <p
                        className="
                            text-xs
                            text-base-content/45
                        "
                    >
                        {search.trim()
                            ? 'No matching members'
                            : `No ${isAgent ? 'agents' : 'RMs'} found`
                        }
                    </p>

                </div>

            )
        }


        return (

            <div
                className="
                    overflow-hidden
                    rounded-lg
                    border
                    border-base-300
                    bg-base-100
                "
            >

                {members.map(
                    (member) => (

                        <div
                            key={member.id}
                            className="
                                flex
                                items-center
                                gap-2.5
                                border-b
                                border-base-300
                                px-3
                                py-2
                                last:border-b-0
                                hover:bg-base-200/50
                            "
                        >

                            {/* =================================================
                                AVATAR
                            ================================================= */}

                            <div
                                className={`
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-xs
                                    font-semibold
                                    ${
                                        accent === 'blue'
                                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    }
                                `}
                            >
                                {
                                    member.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || 'U'
                                }
                            </div>


                            {/* =================================================
                                DETAILS
                            ================================================= */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >

                                <p
                                    className="
                                        truncate
                                        text-sm
                                        font-medium
                                        text-base-content
                                    "
                                >
                                    {member.name}
                                </p>


                                <p
                                    className="
                                        truncate
                                        text-[11px]
                                        text-base-content/50
                                    "
                                    title={member.email}
                                >
                                    {member.email}
                                </p>

                            </div>

                        </div>

                    )
                )}

            </div>

        )
    }


    // ========================================================================
    // CLOSED
    // ========================================================================

    if (!open || !teamLead) {
        return null
    }


    // ========================================================================
    // RENDER
    // ========================================================================

    return (

        <dialog
            open
            className="
                modal
                modal-bottom
                sm:modal-middle
            "
        >

            <div
                className="
                    modal-box
                    w-11/12
                    max-w-3xl
                    overflow-hidden
                    border
                    border-base-300
                    bg-base-100
                    p-0
                "
            >

                {/* ============================================================
                    HEADER
                ============================================================ */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-base-300
                        px-4
                        py-3
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2.5
                        "
                    >

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#8BCF00]/10
                            "
                        >

                            <UserGroupIcon
                                className="
                                    h-4
                                    w-4
                                    text-[#78B300]
                                "
                            />

                        </div>


                        <div className="min-w-0">

                            <h2
                                className="
                                    truncate
                                    text-base
                                    font-semibold
                                "
                            >
                                Team Members
                            </h2>


                            <p
                                className="
                                    truncate
                                    text-xs
                                    text-base-content/50
                                "
                            >
                                {teamLead.name}
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
                        aria-label="Close"
                    >

                        <XMarkIcon
                            className="h-4 w-4"
                        />

                    </button>

                </div>


                {/* ============================================================
                    CONTENT
                ============================================================ */}

                <div className="p-4">

                    {/* ========================================================
                        SEARCH
                    ======================================================== */}

                    <div
                        className="
                            relative
                            mb-4
                        "
                    >

                        <MagnifyingGlassIcon
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-base-content/40
                            "
                        />


                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search team members..."
                            className="
                                input
                                input-bordered
                                input-sm
                                w-full
                                pl-9
                            "
                        />

                    </div>


                    {/* ========================================================
                        ERROR
                    ======================================================== */}

                    {error && (

                        <div
                            className="
                                mb-4
                                rounded-lg
                                border
                                border-error/20
                                bg-error/5
                                px-3
                                py-2
                            "
                        >

                            <p className="text-xs text-error">
                                {error}
                            </p>

                        </div>

                    )}


                    {/* ========================================================
                        LOADING
                    ======================================================== */}

                    {loading && (

                        <div
                            className="
                                flex
                                min-h-40
                                items-center
                                justify-center
                            "
                        >

                            <span
                                className="
                                    loading
                                    loading-spinner
                                    loading-sm
                                "
                            />

                        </div>

                    )}


                    {/* ========================================================
                        TWO COLUMNS
                    ======================================================== */}

                    {!loading && !error && (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            "
                        >

                            {/* =================================================
                                RELATIONSHIP MANAGERS
                            ================================================= */}

                            <section>

                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span
                                            className="
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-emerald-500
                                            "
                                        />

                                        <h3
                                            className="
                                                text-sm
                                                font-semibold
                                            "
                                        >
                                            Relationship Managers
                                        </h3>

                                    </div>


                                    <span
                                        className="
                                            rounded-full
                                            bg-emerald-500/10
                                            px-2
                                            py-0.5
                                            text-[10px]
                                            font-semibold
                                            text-emerald-600
                                            dark:text-emerald-400
                                        "
                                    >
                                        {rms.length}
                                    </span>

                                </div>


                                <MemberList
                                    members={rms}
                                    type="rm"
                                />

                            </section>


                            {/* =================================================
                                AGENTS
                            ================================================= */}

                            <section>

                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span
                                            className="
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-blue-500
                                            "
                                        />

                                        <h3
                                            className="
                                                text-sm
                                                font-semibold
                                            "
                                        >
                                            Agents
                                        </h3>

                                    </div>


                                    <span
                                        className="
                                            rounded-full
                                            bg-blue-500/10
                                            px-2
                                            py-0.5
                                            text-[10px]
                                            font-semibold
                                            text-blue-600
                                            dark:text-blue-400
                                        "
                                    >
                                        {agents.length}
                                    </span>

                                </div>


                                <MemberList
                                    members={agents}
                                    type="agent"
                                />

                            </section>

                        </div>

                    )}

                </div>


                {/* ============================================================
                    FOOTER
                ============================================================ */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-t
                        border-base-300
                        px-4
                        py-2.5
                    "
                >

                    <span
                        className="
                            text-xs
                            text-base-content/45
                        "
                    >
                        {rms.length + agents.length}{' '}
                        total members
                    </span>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            btn
                            btn-sm
                        "
                    >
                        Close
                    </button>

                </div>

            </div>


            {/* ================================================================
                BACKDROP
            ================================================================ */}

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