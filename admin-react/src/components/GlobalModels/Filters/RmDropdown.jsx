// src/components/Filters/RmDropdown.jsx
import { useEffect, useRef, useState } from 'react'

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'


// =============================================================
// MOCK API
// =============================================================

const fetchRms = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve([
                {
                    id: 201,
                    name: 'Priya Nair',
                },
                {
                    id: 202,
                    name: 'Rajesh Rao',
                },
                {
                    id: 203,
                    name: 'Sneha Reddy',
                },
                {
                    id: 204,
                    name: 'Manoj Kumar',
                },
                {
                    id: 205,
                    name: 'Deepa Sharma',
                },
            ])

        }, 300)

    })

}


// =============================================================
// COMPONENT
// =============================================================

function RmDropdown({
    value = '',
    onChange,
}) {

    const [rms, setRms] = useState([])

    const [search, setSearch] = useState('')

    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const dropdownRef = useRef(null)


    // =========================================================
    // LOAD RMS
    // =========================================================

    useEffect(() => {

        const loadRms = async () => {

            setLoading(true)

            try {

                const data = await fetchRms()

                setRms(
                    Array.isArray(data)
                        ? data
                        : []
                )

            } catch (error) {

                console.error(
                    'Failed to load RMs:',
                    error
                )

            } finally {

                setLoading(false)

            }

        }

        loadRms()

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
    // SELECTED RM
    // =========================================================

    const selectedRm = rms.find(
        (rm) =>
            String(rm.id) === String(value)
    )


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredRms = rms.filter(
        (rm) =>
            rm.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
    )


    // =========================================================
    // SELECT RM
    // =========================================================

    const handleSelect = (rmId) => {

        onChange(rmId)

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
                RM
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

                    {selectedRm
                        ? selectedRm.name
                        : 'All RMs'}

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
                            placeholder="Search RM"
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

                        {/* ALL RMS */}

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
                            All RMs
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


                        {/* RMS */}

                        {!loading &&
                            filteredRms.map(
                                (rm) => (

                                    <button
                                        key={rm.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelect(
                                                rm.id
                                            )
                                        }
                                        className={
                                            String(value) ===
                                            String(rm.id)
                                                ? 'w-full rounded-md bg-base-200 px-3 py-2 text-left text-sm font-medium'
                                                : 'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-base-200'
                                        }
                                    >
                                        {rm.name}
                                    </button>

                                )
                            )}


                        {/* NO RESULTS */}

                        {!loading &&
                            filteredRms.length === 0 && (

                                <div className="
                                    px-3
                                    py-3
                                    text-center
                                    text-xs
                                    text-base-content/50
                                ">
                                    No RMs found
                                </div>

                            )}

                    </div>

                </div>

            )}

        </div>

    )

}


export default RmDropdown