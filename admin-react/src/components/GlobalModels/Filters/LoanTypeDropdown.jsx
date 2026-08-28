// src/components/Filters/LoanTypeDropdown.jsx
import { useEffect, useRef, useState } from 'react'

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'


// =============================================================
// MOCK API
// Replace this with your actual API call later.
// =============================================================

const fetchLoanTypes = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve([
                {
                    id: 401,
                    name: 'Personal Loan',
                },
                {
                    id: 402,
                    name: 'Home Loan',
                },
                {
                    id: 403,
                    name: 'Business Loan',
                },
                {
                    id: 404,
                    name: 'Vehicle Loan',
                },
                {
                    id: 405,
                    name: 'Education Loan',
                },
                {
                    id: 406,
                    name: 'Gold Loan',
                },
            ])

        }, 300)

    })

}


// =============================================================
// COMPONENT
// =============================================================

function LoanTypeDropdown({
    value = '',
    onChange,
}) {

    const [loanTypes, setLoanTypes] = useState([])

    const [search, setSearch] = useState('')

    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const dropdownRef = useRef(null)


    // =========================================================
    // LOAD LOAN TYPES
    // =========================================================

    useEffect(() => {

        const loadLoanTypes = async () => {

            setLoading(true)

            try {

                const data = await fetchLoanTypes()

                setLoanTypes(
                    Array.isArray(data)
                        ? data
                        : []
                )

            } catch (error) {

                console.error(
                    'Failed to load loan types:',
                    error
                )

            } finally {

                setLoading(false)

            }

        }

        loadLoanTypes()

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
    // SELECTED LOAN TYPE
    // =========================================================

    const selectedLoanType = loanTypes.find(
        (loanType) =>
            String(loanType.id) === String(value)
    )


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredLoanTypes = loanTypes.filter(
        (loanType) =>
            loanType.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
    )


    // =========================================================
    // SELECT LOAN TYPE
    // =========================================================

    const handleSelect = (loanTypeId) => {

        onChange(loanTypeId)

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
                Loan Type
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

                    {selectedLoanType
                        ? selectedLoanType.name
                        : 'All Loan Types'}

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
                            placeholder="Search loan type"
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

                        {/* ALL LOAN TYPES */}

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
                            All Loan Types
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


                        {/* LOAN TYPES */}

                        {!loading &&
                            filteredLoanTypes.map(
                                (loanType) => (

                                    <button
                                        key={loanType.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelect(
                                                loanType.id
                                            )
                                        }
                                        className={
                                            String(value) ===
                                            String(loanType.id)
                                                ? 'w-full rounded-md bg-base-200 px-3 py-2 text-left text-sm font-medium'
                                                : 'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-base-200'
                                        }
                                    >
                                        {loanType.name}
                                    </button>

                                )
                            )}


                        {/* NO RESULTS */}

                        {!loading &&
                            filteredLoanTypes.length === 0 && (

                                <div className="
                                    px-3
                                    py-3
                                    text-center
                                    text-xs
                                    text-base-content/50
                                ">
                                    No loan types found
                                </div>

                            )}

                    </div>

                </div>

            )}

        </div>

    )

}


export default LoanTypeDropdown