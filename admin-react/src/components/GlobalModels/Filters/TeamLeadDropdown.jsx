import { useEffect, useRef, useState } from 'react'

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'


// =============================================================
// MOCK API
// =============================================================

const fetchTeamLeads = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve([
                {
                    id: 301,
                    name: 'Suresh Kumar',
                },
                {
                    id: 302,
                    name: 'Priya Nair',
                },
                {
                    id: 303,
                    name: 'Rajesh Rao',
                },
                {
                    id: 304,
                    name: 'Vikram Shetty',
                },
                {
                    id: 305,
                    name: 'Naveen Kumar',
                },
            ])

        }, 300)

    })

}


// =============================================================
// COMPONENT
// =============================================================

function TeamLeadDropdown({
    value = '',
    onChange,
}) {

    const [teamLeads, setTeamLeads] = useState([])

    const [search, setSearch] = useState('')

    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const dropdownRef = useRef(null)


    // =========================================================
    // LOAD TEAM LEADS
    // =========================================================

    useEffect(() => {

        const loadTeamLeads = async () => {

            setLoading(true)

            try {

                const data = await fetchTeamLeads()

                setTeamLeads(
                    Array.isArray(data)
                        ? data
                        : []
                )

            } catch (error) {

                console.error(
                    'Failed to load team leads:',
                    error
                )

            } finally {

                setLoading(false)

            }

        }

        loadTeamLeads()

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
    // SELECTED TEAM LEAD
    // =========================================================

    const selectedTeamLead = teamLeads.find(
        (teamLead) =>
            String(teamLead.id) === String(value)
    )


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredTeamLeads = teamLeads.filter(
        (teamLead) =>
            teamLead.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
    )


    // =========================================================
    // SELECT TEAM LEAD
    // =========================================================

    const handleSelect = (teamLeadId) => {

        onChange(teamLeadId)

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
                Team Lead
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

                    {selectedTeamLead
                        ? selectedTeamLead.name
                        : 'All Team Leads'}

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
                            placeholder="Search team lead"
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

                        {/* ALL TEAM LEADS */}

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
                            All Team Leads
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


                        {/* TEAM LEADS */}

                        {!loading &&
                            filteredTeamLeads.map(
                                (teamLead) => (

                                    <button
                                        key={teamLead.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelect(
                                                teamLead.id
                                            )
                                        }
                                        className={
                                            String(value) ===
                                            String(teamLead.id)
                                                ? 'w-full rounded-md bg-base-200 px-3 py-2 text-left text-sm font-medium'
                                                : 'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-base-200'
                                        }
                                    >
                                        {teamLead.name}
                                    </button>

                                )
                            )}


                        {/* NO RESULTS */}

                        {!loading &&
                            filteredTeamLeads.length === 0 && (

                                <div className="
                                    px-3
                                    py-3
                                    text-center
                                    text-xs
                                    text-base-content/50
                                ">
                                    No team leads found
                                </div>

                            )}

                    </div>

                </div>

            )}

        </div>

    )

}


export default TeamLeadDropdown