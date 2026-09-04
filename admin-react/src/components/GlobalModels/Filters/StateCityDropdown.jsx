// admin-react/src/components/GlobalModels/Filters/StateCityDropdown.jsx

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

import { API_BASE_URL } from '../../../config/url'


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
     * ==============================================================
     * API DATA
     * ==============================================================
     */

    const [apiStates, setApiStates] = useState([])

    const [apiCities, setApiCities] = useState([])

    const [statesLoading, setStatesLoading] = useState(false)

    const [citiesLoading, setCitiesLoading] = useState(false)


    /*
     * ==============================================================
     * SYNC STATE FROM PARENT
     * ==============================================================
     */

    useEffect(() => {

        setSelectedState(
            stateValue ?? ''
        )

    }, [stateValue])


    /*
     * ==============================================================
     * SYNC CITY FROM PARENT
     * ==============================================================
     */

    useEffect(() => {

        setSelectedCity(
            cityValue ?? ''
        )

    }, [cityValue])


    /*
     * ==============================================================
     * FETCH STATES
     * ==============================================================
     *
     * Only used when states are not supplied through props.
     */

    useEffect(() => {

        /*
         * If parent already provides states,
         * don't make an unnecessary API request.
         */
        if (
            Array.isArray(states) &&
            states.length > 0
        ) {
            return
        }


        let cancelled = false


        const fetchStates = async () => {

            setStatesLoading(true)

            try {

                const response = await fetch(
                    `${API_BASE_URL}/states`,
                    {
                        credentials: 'include',
                    }
                )


                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch states: ${response.status}`
                    )
                }


                const data =
                    await response.json()


                if (!cancelled) {

                    setApiStates(
                        Array.isArray(data)
                            ? data
                            : []
                    )

                }

            } catch (error) {

                console.error(
                    'Failed to fetch states:',
                    error
                )

                if (!cancelled) {
                    setApiStates([])
                }

            } finally {

                if (!cancelled) {
                    setStatesLoading(false)
                }

            }

        }


        fetchStates()


        return () => {
            cancelled = true
        }

    }, [states])


    /*
     * ==============================================================
     * FETCH CITIES
     * ==============================================================
     *
     * If cities are supplied through props, the existing prop data
     * is used and no API request is made.
     *
     * Otherwise cities are fetched specifically for the selected
     * state.
     */

    useEffect(() => {

        /*
         * No state selected.
         *
         * City dropdown should remain empty.
         */
        if (!selectedState) {

            setApiCities([])

            setCitiesLoading(false)

            return
        }


        /*
         * Parent already supplies cities.
         *
         * Keep existing functionality and don't fetch again.
         */
        if (
            Array.isArray(cities) &&
            cities.length > 0
        ) {
            return
        }


        let cancelled = false


        const fetchCities = async () => {

            setCitiesLoading(true)

            try {

                const response = await fetch(
                    `${API_BASE_URL}/cities?state_id=${encodeURIComponent(selectedState)}`,
                    {
                        credentials: 'include',
                    }
                )


                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch cities: ${response.status}`
                    )
                }


                const data =
                    await response.json()


                if (!cancelled) {

                    setApiCities(
                        Array.isArray(data)
                            ? data
                            : []
                    )

                }

            } catch (error) {

                console.error(
                    'Failed to fetch cities:',
                    error
                )

                if (!cancelled) {
                    setApiCities([])
                }

            } finally {

                if (!cancelled) {
                    setCitiesLoading(false)
                }

            }

        }


        fetchCities()


        return () => {
            cancelled = true
        }

    }, [
        selectedState,
        cities,
    ])


    /*
     * ==============================================================
     * STATES
     * ==============================================================
     *
     * Priority:
     *
     * 1. Props
     * 2. Backend API
     */

    const stateOptions = useMemo(() => {

        if (
            Array.isArray(states) &&
            states.length > 0
        ) {
            return states
        }


        return apiStates

    }, [
        states,
        apiStates,
    ])


    /*
     * ==============================================================
     * CITIES
     * ==============================================================
     *
     * Priority:
     *
     * 1. Props
     * 2. Backend API
     */

    const cityOptions = useMemo(() => {

        if (
            Array.isArray(cities) &&
            cities.length > 0
        ) {
            return cities
        }


        return apiCities

    }, [
        cities,
        apiCities,
    ])


    /*
     * ==============================================================
     * FILTER CITIES BY SELECTED STATE
     * ==============================================================
     *
     * This is intentionally kept.
     *
     * It preserves the original functionality even when a parent
     * passes the complete cities array through props.
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
     * ==============================================================
     * STATE CHANGE
     * ==============================================================
     */

    const handleStateChange = (value) => {

        /*
         * Update local state FIRST.
         *
         * This keeps the dropdown immediately responsive.
         */
        setSelectedState(value)


        /*
         * Clear currently selected city.
         */
        setSelectedCity('')


        /*
         * Clear old API cities immediately.
         *
         * The new city's API request will happen from the
         * selectedState useEffect above.
         */
        setApiCities([])


        /*
         * Tell parent.
         */
        onStateChange?.(value)

        onCityChange?.('')

    }


    /*
     * ==============================================================
     * CITY CHANGE
     * ==============================================================
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
     * ==============================================================
     * RENDER
     * ==============================================================
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

                placeholder={
                    statesLoading
                        ? 'Loading States...'
                        : statePlaceholder
                }

                searchPlaceholder={
                    stateSearchPlaceholder
                }

                allLabel={allStatesLabel}

                emptyMessage={
                    statesLoading
                        ? 'Loading states...'
                        : stateEmptyMessage
                }

                disabled={
                    disabled ||
                    statesLoading
                }

            />


            {/* ======================================================
                CITY
            ====================================================== */}

            <LocationDropdown

                value={selectedCity}

                options={filteredCities}

                onChange={handleCityChange}

                placeholder={
                    !selectedState
                        ? 'Select State First'
                        : citiesLoading
                            ? 'Loading Cities...'
                            : cityPlaceholder
                }

                searchPlaceholder={
                    citySearchPlaceholder
                }

                allLabel={allCitiesLabel}

                emptyMessage={
                    !selectedState
                        ? 'Select State First'
                        : citiesLoading
                            ? 'Loading cities...'
                            : cityEmptyMessage
                }

                disabled={
                    disabled ||
                    !selectedState ||
                    citiesLoading
                }

            />

        </div>
    )
}


export default StateCityDropdown