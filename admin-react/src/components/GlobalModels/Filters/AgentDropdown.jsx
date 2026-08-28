// admin-react/src/components/Filters/AgentDropdown.jsx
import { useEffect, useRef, useState } from 'react'

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'


// =============================================================
// MOCK API
// =============================================================

const fetchAgents = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve([
                {
                    id: 101,
                    name: 'Rahul Sharma',
                },
                {
                    id: 102,
                    name: 'Anil Kumar',
                },
                {
                    id: 103,
                    name: 'Vikram Singh',
                },
                {
                    id: 104,
                    name: 'Arjun Rao',
                },
                {
                    id: 105,
                    name: 'Kiran Kumar',
                },
            ])

        }, 300)

    })

}


// =============================================================
// COMPONENT
// =============================================================

function AgentDropdown({
    value = '',
    onChange,
}) {

    const [agents, setAgents] = useState([])

    const [search, setSearch] = useState('')

    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const dropdownRef = useRef(null)


    // =========================================================
    // LOAD AGENTS
    // =========================================================

    useEffect(() => {

        const loadAgents = async () => {

            setLoading(true)

            try {

                const data = await fetchAgents()

                setAgents(
                    Array.isArray(data)
                        ? data
                        : []
                )

            } catch (error) {

                console.error(
                    'Failed to load agents:',
                    error
                )

            } finally {

                setLoading(false)

            }

        }

        loadAgents()

    }, [])


    // =========================================================
    // CLOSE ON OUTSIDE CLICK
    // =========================================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {

                setOpen(false)

                setSearch('')

            }

        }

        document.addEventListener(
            'mousedown',
            handleClickOutside
        )

        return () => {

            document.removeEventListener(
                'mousedown',
                handleClickOutside
            )

        }

    }, [])


    // =========================================================
    // SELECTED AGENT
    // =========================================================

    const selectedAgent = agents.find(
        (agent) =>
            String(agent.id) === String(value)
    )


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredAgents = agents.filter(
        (agent) =>
            agent.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
    )


    // =========================================================
    // SELECT AGENT
    // =========================================================

    const handleSelect = (agentId) => {

        onChange(agentId)

        setOpen(false)

        setSearch('')

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            ref={dropdownRef}
            className="relative min-w-[180px] flex-1"
        >

            {/* LABEL */}

            <label className="
                mb-1.5
                block
                text-xs
                font-medium
                text-base-content/60
            ">
                Agent
            </label>


            {/* SELECT BUTTON */}

            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="
                    flex
                    h-10
                    min-h-10
                    w-full
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-base-300
                    bg-base-100
                    px-3
                    text-left
                    text-sm
                    transition
                    hover:border-base-content/30
                "
            >

                <span className="truncate">

                    {selectedAgent
                        ? selectedAgent.name
                        : 'All Agents'}

                </span>


                <ChevronDownIcon className="
                    h-4
                    w-4
                    shrink-0
                    text-base-content/40
                " />

            </button>


            {/* DROPDOWN */}

            {open && (

                <div className="
                    absolute
                    left-0
                    right-0
                    z-50
                    mt-1
                    overflow-hidden
                    rounded-lg
                    border
                    border-base-300
                    bg-base-100
                    shadow-lg
                ">

                    {/* SEARCH */}

                    <div className="
                        border-b
                        border-base-300
                        p-2
                    ">

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search agent"
                            autoFocus
                            className="
                                input
                                input-bordered
                                h-9
                                min-h-9
                                w-full
                                text-sm
                            "
                        />

                    </div>


                    {/* OPTIONS */}

                    <div className="
                        max-h-56
                        overflow-y-auto
                        p-1
                    ">

                        {/* ALL AGENTS */}

                        <button
                            type="button"
                            onClick={() =>
                                handleSelect('')
                            }
                            className={
                                !value
                                    ? 'w-full rounded-md bg-base-200 px-3 py-2 text-left text-sm font-medium'
                                    : 'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-base-200'
                            }
                        >
                            All Agents
                        </button>


                        {/* LOADING */}

                        {loading && (

                            <div className="
                                px-3
                                py-3
                                text-center
                                text-xs
                                text-base-content/50
                            ">
                                Loading...
                            </div>

                        )}


                        {/* AGENTS */}

                        {!loading &&
                            filteredAgents.map(
                                (agent) => (

                                    <button
                                        key={agent.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelect(
                                                agent.id
                                            )
                                        }
                                        className={
                                            String(value) ===
                                            String(agent.id)
                                                ? 'w-full rounded-md bg-base-200 px-3 py-2 text-left text-sm font-medium'
                                                : 'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-base-200'
                                        }
                                    >
                                        {agent.name}
                                    </button>

                                )
                            )}


                        {/* NO RESULTS */}

                        {!loading &&
                            filteredAgents.length === 0 && (

                                <div className="
                                    px-3
                                    py-3
                                    text-center
                                    text-xs
                                    text-base-content/50
                                ">
                                    No agents found
                                </div>

                            )}

                    </div>

                </div>

            )}

        </div>

    )

}


export default AgentDropdown