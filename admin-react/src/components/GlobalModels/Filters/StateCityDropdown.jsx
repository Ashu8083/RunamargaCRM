// admin-react/src/components/GlobalModels/Filters/StateCityDropdown.jsx

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'


/*
|--------------------------------------------------------------------------
| DEFAULT STATES
|--------------------------------------------------------------------------
*/

const DEFAULT_STATES = [
    { id: 1, name: 'Andhra Pradesh' },
    { id: 2, name: 'Arunachal Pradesh' },
    { id: 3, name: 'Assam' },
    { id: 4, name: 'Bihar' },
    { id: 5, name: 'Chhattisgarh' },
    { id: 6, name: 'Goa' },
    { id: 7, name: 'Gujarat' },
    { id: 8, name: 'Haryana' },
    { id: 9, name: 'Himachal Pradesh' },
    { id: 10, name: 'Jharkhand' },
    { id: 11, name: 'Karnataka' },
    { id: 12, name: 'Kerala' },
    { id: 13, name: 'Madhya Pradesh' },
    { id: 14, name: 'Maharashtra' },
    { id: 15, name: 'Manipur' },
    { id: 16, name: 'Meghalaya' },
    { id: 17, name: 'Mizoram' },
    { id: 18, name: 'Nagaland' },
    { id: 19, name: 'Odisha' },
    { id: 20, name: 'Punjab' },
    { id: 21, name: 'Rajasthan' },
    { id: 22, name: 'Sikkim' },
    { id: 23, name: 'Tamil Nadu' },
    { id: 24, name: 'Telangana' },
    { id: 25, name: 'Tripura' },
    { id: 26, name: 'Uttar Pradesh' },
    { id: 27, name: 'Uttarakhand' },
    { id: 28, name: 'West Bengal' },
]


/*
|--------------------------------------------------------------------------
| DEFAULT CITIES
|--------------------------------------------------------------------------
*/

const DEFAULT_CITIES = [
    // Karnataka
    { id: 101, stateId: 11, name: 'Bengaluru' },
    { id: 102, stateId: 11, name: 'Mysuru' },
    { id: 103, stateId: 11, name: 'Mangaluru' },
    { id: 104, stateId: 11, name: 'Hubballi' },
    { id: 105, stateId: 11, name: 'Belagavi' },

    // Maharashtra
    { id: 201, stateId: 14, name: 'Mumbai' },
    { id: 202, stateId: 14, name: 'Pune' },
    { id: 203, stateId: 14, name: 'Nagpur' },
    { id: 204, stateId: 14, name: 'Nashik' },

    // Tamil Nadu
    { id: 301, stateId: 23, name: 'Chennai' },
    { id: 302, stateId: 23, name: 'Coimbatore' },
    { id: 303, stateId: 23, name: 'Madurai' },

    // Telangana
    { id: 401, stateId: 24, name: 'Hyderabad' },
    { id: 402, stateId: 24, name: 'Warangal' },

    // Kerala
    { id: 501, stateId: 12, name: 'Kochi' },
    { id: 502, stateId: 12, name: 'Thiruvananthapuram' },
    { id: 503, stateId: 12, name: 'Kozhikode' },

    // Uttar Pradesh
    { id: 601, stateId: 26, name: 'Lucknow' },
    { id: 602, stateId: 26, name: 'Noida' },
    { id: 603, stateId: 26, name: 'Kanpur' },
]


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const getOptionValue = (option) => {

    if (
        typeof option === 'string' ||
        typeof option === 'number'
    ) {
        return option
    }

    return (
        option?.value ??
        option?.id ??
        option?._id ??
        option?.stateId ??
        option?.state_id ??
        ''
    )
}


const getOptionLabel = (option) => {

    if (
        typeof option === 'string' ||
        typeof option === 'number'
    ) {
        return String(option)
    }

    return String(
        option?.label ??
        option?.name ??
        option?.fullName ??
        option?.title ??
        getOptionValue(option) ??
        ''
    )
}


const normalizeOption = (option) => {

    return {
        value: getOptionValue(option),
        label: getOptionLabel(option),
    }
}


/*
|--------------------------------------------------------------------------
| GET CITY'S STATE ID
|--------------------------------------------------------------------------
|
| Supports:
|
| stateId
| state_id
| state.id
| state.value
|
*/

const getCityStateId = (city) => {

    return (
        city?.stateId ??
        city?.state_id ??
        city?.state?.id ??
        city?.state?.value ??
        ''
    )
}


/*
|--------------------------------------------------------------------------
| INDEPENDENT SEARCHABLE DROPDOWN
|--------------------------------------------------------------------------
*/

function LocationDropdown({
    value,
    options = [],

    onChange,

    placeholder = 'Select',
    searchPlaceholder = 'Search',
    allLabel = 'All',
    emptyMessage = 'No options found',

    disabled = false,
}) {

    /*
     * --------------------------------------------------------------
     * EACH DROPDOWN HAS ITS OWN STATE
     * --------------------------------------------------------------
     */

    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const triggerRef = useRef(null)
    const menuRef = useRef(null)

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    })


    /*
     * --------------------------------------------------------------
     * NORMALIZE OPTIONS
     * --------------------------------------------------------------
     */

    const normalizedOptions = useMemo(() => {

        return options
            .map(normalizeOption)
            .filter(
                (option) =>
                    option.label &&
                    option.value !== ''
            )

    }, [options])


    /*
     * --------------------------------------------------------------
     * SELECTED OPTION
     * --------------------------------------------------------------
     */

    const selectedOption = useMemo(() => {

        return normalizedOptions.find(
            (option) =>
                String(option.value) ===
                String(value)
        )

    }, [
        normalizedOptions,
        value,
    ])


    /*
     * --------------------------------------------------------------
     * SEARCH FILTER
     * --------------------------------------------------------------
     */

    const filteredOptions = useMemo(() => {

        const query =
            search
                .trim()
                .toLowerCase()


        if (!query) {
            return normalizedOptions
        }


        return normalizedOptions.filter(
            (option) =>
                option.label
                    .toLowerCase()
                    .includes(query)
        )

    }, [
        normalizedOptions,
        search,
    ])


    /*
     * --------------------------------------------------------------
     * UPDATE POSITION
     * --------------------------------------------------------------
     */

    const updatePosition = () => {

        if (!triggerRef.current) {
            return
        }


        const rect =
            triggerRef.current.getBoundingClientRect()


        setPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
        })

    }


    /*
     * --------------------------------------------------------------
     * OPEN / CLOSE
     * --------------------------------------------------------------
     */

    const handleToggle = () => {

        if (disabled) {
            return
        }


        if (!open) {

            updatePosition()

            setSearch('')

            setOpen(true)

            return
        }


        setOpen(false)
        setSearch('')

    }


    /*
     * --------------------------------------------------------------
     * POSITION WHILE SCROLLING
     * --------------------------------------------------------------
     */

    useEffect(() => {

        if (!open) {
            return
        }


        const handlePosition = () => {
            updatePosition()
        }


        window.addEventListener(
            'resize',
            handlePosition
        )

        window.addEventListener(
            'scroll',
            handlePosition,
            true
        )


        return () => {

            window.removeEventListener(
                'resize',
                handlePosition
            )

            window.removeEventListener(
                'scroll',
                handlePosition,
                true
            )

        }

    }, [open])


    /*
     * --------------------------------------------------------------
     * CLICK OUTSIDE
     * --------------------------------------------------------------
     */

    useEffect(() => {

        if (!open) {
            return
        }


        const handleOutsideClick = (event) => {

            const trigger =
                triggerRef.current

            const menu =
                menuRef.current


            if (
                trigger?.contains(event.target) ||
                menu?.contains(event.target)
            ) {
                return
            }


            setOpen(false)
            setSearch('')

        }


        document.addEventListener(
            'mousedown',
            handleOutsideClick
        )


        return () => {

            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            )

        }

    }, [open])


    /*
     * --------------------------------------------------------------
     * SELECT OPTION
     * --------------------------------------------------------------
     */

    const handleSelect = (selectedValue) => {

        /*
         * Update parent
         */
        onChange?.(selectedValue)


        /*
         * Close THIS dropdown only
         */
        setOpen(false)

        setSearch('')

    }


    /*
     * --------------------------------------------------------------
     * RENDER
     * --------------------------------------------------------------
     */

    return (
        <div className="relative w-full">

            {/* ======================================================
                BUTTON
            ====================================================== */}

            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                onClick={handleToggle}
                className="
                    flex
                    h-10
                    min-h-10
                    w-full
                    items-center
                    justify-between
                    gap-2
                    rounded-lg
                    border
                    border-base-300
                    bg-base-100
                    px-3
                    text-left
                    text-sm
                    text-base-content
                    transition
                    hover:border-base-content/30
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >

                <span className="
                    min-w-0
                    truncate
                ">
                    {selectedOption?.label || placeholder}
                </span>


                <ChevronDownIcon
                    className="
                        h-4
                        w-4
                        shrink-0
                        text-base-content/40
                    "
                />

            </button>


            {/* ======================================================
                PORTAL
            ====================================================== */}

            {open &&
                typeof document !== 'undefined' &&
                createPortal(

                    <div
                        ref={menuRef}
                        style={{
                            position: 'fixed',
                            top: position.top,
                            left: position.left,
                            width: position.width,
                        }}
                        className="
                            z-[99999]
                            overflow-hidden
                            rounded-lg
                            border
                            border-base-300
                            bg-base-100
                            shadow-xl
                        "
                    >

                        {/* ==================================================
                            SEARCH
                        ================================================== */}

                        <div className="
                            border-b
                            border-base-300
                            p-2
                        ">

                            <div className="
                                relative
                            ">

                                <MagnifyingGlassIcon
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-2.5
                                        top-1/2
                                        h-4
                                        w-4
                                        -translate-y-1/2
                                        text-base-content/35
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
                                    placeholder={
                                        searchPlaceholder
                                    }
                                    autoFocus
                                    className="
                                        input
                                        input-bordered
                                        h-9
                                        min-h-9
                                        w-full
                                        pl-8
                                        text-sm
                                    "
                                />

                            </div>

                        </div>


                        {/* ==================================================
                            OPTIONS
                        ================================================== */}

                        <div className="
                            max-h-56
                            overflow-y-auto
                            p-1
                        ">

                            {/* ALL */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleSelect('')
                                }
                                className={`
                                    w-full
                                    rounded-md
                                    px-3
                                    py-2
                                    text-left
                                    text-sm
                                    ${
                                        !value
                                            ? 'bg-[#8BCF00]/10 font-medium text-[#78B300]'
                                            : 'hover:bg-base-200'
                                    }
                                `}
                            >
                                {allLabel}
                            </button>


                            {/* OPTIONS */}

                            {filteredOptions.map(
                                (option) => (

                                    <button
                                        key={`${String(option.value)}-${option.label}`}
                                        type="button"
                                        onClick={() =>
                                            handleSelect(
                                                option.value
                                            )
                                        }
                                        className={`
                                            w-full
                                            rounded-md
                                            px-3
                                            py-2
                                            text-left
                                            text-sm
                                            ${
                                                String(value) ===
                                                String(option.value)
                                                    ? 'bg-[#8BCF00]/10 font-medium text-[#78B300]'
                                                    : 'hover:bg-base-200'
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </button>

                                )
                            )}


                            {/* EMPTY */}

                            {filteredOptions.length === 0 && (

                                <div className="
                                    px-3
                                    py-3
                                    text-center
                                    text-xs
                                    text-base-content/50
                                ">
                                    {emptyMessage}
                                </div>

                            )}

                        </div>

                    </div>,

                    document.body
                )}

        </div>
    )
}


/*
|--------------------------------------------------------------------------
| STATE + CITY
|--------------------------------------------------------------------------
*/

function StateCityDropdown({

    stateValue = '',
    cityValue = '',

    onStateChange,
    onCityChange,

    states,
    cities,

    allStatesLabel = 'All States',
    allCitiesLabel = 'All Cities',

    statePlaceholder = 'Search State',
    cityPlaceholder = 'Search City',

    stateSearchPlaceholder = 'Search State',
    citySearchPlaceholder = 'Search City',

    stateEmptyMessage = 'No states found',
    cityEmptyMessage = 'No cities found',

    disabled = false,

    className = '',

}) {

    /*
     * ==============================================================
     * LOCAL VALUES
     * ==============================================================
     *
     * These make the dropdown immediately responsive.
     *
     * The parent values are still synchronized whenever they change.
     */

    const [selectedState, setSelectedState] = useState(
        stateValue ?? ''
    )

    const [selectedCity, setSelectedCity] = useState(
        cityValue ?? ''
    )


    /*
     * --------------------------------------------------------------
     * SYNC STATE FROM PARENT
     * --------------------------------------------------------------
     */

    useEffect(() => {

        setSelectedState(
            stateValue ?? ''
        )

    }, [stateValue])


    /*
     * --------------------------------------------------------------
     * SYNC CITY FROM PARENT
     * --------------------------------------------------------------
     */

    useEffect(() => {

        setSelectedCity(
            cityValue ?? ''
        )

    }, [cityValue])


    /*
     * --------------------------------------------------------------
     * STATES
     * --------------------------------------------------------------
     */

    const stateOptions = useMemo(() => {

        if (
            Array.isArray(states) &&
            states.length > 0
        ) {
            return states
        }

        return DEFAULT_STATES

    }, [states])


    /*
     * --------------------------------------------------------------
     * CITIES
     * --------------------------------------------------------------
     */

    const cityOptions = useMemo(() => {

        if (
            Array.isArray(cities) &&
            cities.length > 0
        ) {
            return cities
        }

        return DEFAULT_CITIES

    }, [cities])


    /*
     * --------------------------------------------------------------
     * FILTER CITIES BY SELECTED STATE
     * --------------------------------------------------------------
     */

    const filteredCities = useMemo(() => {

        if (!selectedState) {
            return []
        }


        return cityOptions.filter(
            (city) =>
                String(
                    getCityStateId(city)
                ) ===
                String(selectedState)
        )

    }, [
        cityOptions,
        selectedState,
    ])


    /*
     * --------------------------------------------------------------
     * STATE CHANGE
     * --------------------------------------------------------------
     */

    const handleStateChange = (value) => {

        /*
         * Update local state FIRST.
         *
         * This is the important fix.
         */
        setSelectedState(value)


        /*
         * State changed,
         * so city must be cleared.
         */
        setSelectedCity('')


        /*
         * Tell parent.
         */
        onStateChange?.(value)

        onCityChange?.('')

    }


    /*
     * --------------------------------------------------------------
     * CITY CHANGE
     * --------------------------------------------------------------
     */

    const handleCityChange = (value) => {

        /*
         * Update local city immediately.
         */
        setSelectedCity(value)


        /*
         * Tell parent.
         */
        onCityChange?.(value)

    }


    /*
     * --------------------------------------------------------------
     * RENDER
     * --------------------------------------------------------------
     */

    return (

        <div
            className={`
                grid
                w-full
                grid-cols-1
                gap-3
                md:grid-cols-2
                ${className}
            `}
        >

            {/* ======================================================
                STATE
            ====================================================== */}

            <LocationDropdown

                value={selectedState}

                options={stateOptions}

                onChange={handleStateChange}

                placeholder={statePlaceholder}

                searchPlaceholder={
                    stateSearchPlaceholder
                }

                allLabel={allStatesLabel}

                emptyMessage={
                    stateEmptyMessage
                }

                disabled={disabled}

            />


            {/* ======================================================
                CITY
            ====================================================== */}

            <LocationDropdown

                value={selectedCity}

                options={filteredCities}

                onChange={handleCityChange}

                placeholder={
                    selectedState
                        ? cityPlaceholder
                        : 'Select State First'
                }

                searchPlaceholder={
                    citySearchPlaceholder
                }

                allLabel={allCitiesLabel}

                emptyMessage={
                    selectedState
                        ? cityEmptyMessage
                        : 'Select State First'
                }

                disabled={
                    disabled ||
                    !selectedState
                }

            />

        </div>
    )
}


export default StateCityDropdown