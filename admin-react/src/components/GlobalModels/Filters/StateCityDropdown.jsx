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
| GET CITY STATE ID
|--------------------------------------------------------------------------
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
| GENERIC SEARCHABLE DROPDOWN
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
    |--------------------------------------------------------------------------
    | NORMALIZE
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | SELECTED OPTION
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | POSITION
    |--------------------------------------------------------------------------
    */

    const updatePosition = () => {

        if (!triggerRef.current) {
            return
        }

        const rect =
            triggerRef.current
                .getBoundingClientRect()

        setPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
        })

    }


    /*
    |--------------------------------------------------------------------------
    | TOGGLE
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | POSITION ON SCROLL / RESIZE
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | CLICK OUTSIDE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!open) {
            return
        }

        const handleOutsideClick = (
            event
        ) => {

            const trigger =
                triggerRef.current

            const menu =
                menuRef.current

            if (
                trigger?.contains(
                    event.target
                ) ||
                menu?.contains(
                    event.target
                )
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
    |--------------------------------------------------------------------------
    | SELECT
    |--------------------------------------------------------------------------
    */

    const handleSelect = (
        selectedValue
    ) => {

        onChange?.(
            selectedValue
        )

        setOpen(false)
        setSearch('')

    }


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="relative w-full">

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

                <span
                    className="
                        min-w-0
                        truncate
                    "
                >
                    {
                        selectedOption?.label ||
                        placeholder
                    }
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

                        <div
                            className="
                                border-b
                                border-base-300
                                p-2
                            "
                        >

                            <div className="relative">

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
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event
                                                .target
                                                .value
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


                        <div
                            className="
                                max-h-56
                                overflow-y-auto
                                p-1
                            "
                        >

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


                            {filteredOptions.length === 0 && (

                                <div
                                    className="
                                        px-3
                                        py-3
                                        text-center
                                        text-xs
                                        text-base-content/50
                                    "
                                >
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
| STATE + CITY DROPDOWN
|--------------------------------------------------------------------------
*/

function StateCityDropdown({

    stateValue = '',
    cityValue = '',

    onStateChange,
    onCityChange,

    states,
    cities,

    stateLabel = 'State',
    cityLabel = 'City',

    allStatesLabel = 'All States',
    allCitiesLabel = 'All Cities',

    statePlaceholder = 'Select State',
    cityPlaceholder = 'Select City',

    stateSearchPlaceholder = 'Search State',
    citySearchPlaceholder = 'Search City',

    stateEmptyMessage = 'No states found',
    cityEmptyMessage = 'No cities found',

    disabled = false,

    className = '',

}) {

    /*
    |--------------------------------------------------------------------------
    | LOCAL VALUES
    |--------------------------------------------------------------------------
    */

    const [
        selectedState,
        setSelectedState,
    ] = useState(
        stateValue ?? ''
    )

    const [
        selectedCity,
        setSelectedCity,
    ] = useState(
        cityValue ?? ''
    )


    /*
    |--------------------------------------------------------------------------
    | API DATA
    |--------------------------------------------------------------------------
    */

    const [
        apiStates,
        setApiStates,
    ] = useState([])

    const [
        apiCities,
        setApiCities,
    ] = useState([])

    const [
        statesLoading,
        setStatesLoading,
    ] = useState(false)

    const [
        citiesLoading,
        setCitiesLoading,
    ] = useState(false)


    /*
    |--------------------------------------------------------------------------
    | SYNC STATE FROM PARENT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setSelectedState(
            stateValue ?? ''
        )

    }, [stateValue])


    /*
    |--------------------------------------------------------------------------
    | SYNC CITY FROM PARENT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setSelectedCity(
            cityValue ?? ''
        )

    }, [cityValue])


    /*
    |--------------------------------------------------------------------------
    | FETCH STATES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

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

                const response =
                    await fetch(
                        `${API_BASE_URL}/states`,
                        {
                            credentials:
                                'include',
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

                    const stateList =
                        Array.isArray(data)
                            ? data
                            : []

                    setApiStates(
                        stateList
                    )

                    /*
                    |--------------------------------------------------------------------------
                    | DEFAULT KARNATAKA
                    |--------------------------------------------------------------------------
                    */

                    if (!stateValue) {

                        const karnataka =
                            stateList.find(
                                (state) =>
                                    String(
                                        state?.name
                                    )
                                        .trim()
                                        .toLowerCase() ===
                                    'karnataka'
                            )

                        if (karnataka) {

                            setSelectedState(
                                karnataka.id
                            )

                            onStateChange?.(
                                karnataka.id
                            )

                        }

                    }

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [states])


    /*
    |--------------------------------------------------------------------------
    | FETCH CITIES FOR SELECTED STATE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!selectedState) {

            setApiCities([])
            setSelectedCity('')

            return
        }


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

                const response =
                    await fetch(
                        `${API_BASE_URL}/cities?state_id=${encodeURIComponent(
                            selectedState
                        )}`,
                        {
                            credentials:
                                'include',
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

                    const cityList =
                        Array.isArray(data)
                            ? data
                            : []

                    setApiCities(
                        cityList
                    )


                    /*
                    |--------------------------------------------------------------------------
                    | DEFAULT BENGALURU
                    |--------------------------------------------------------------------------
                    */

                    const selectedStateObject =
                        (
                            Array.isArray(states) &&
                            states.length > 0
                                ? states
                                : apiStates
                        ).find(
                            (state) =>
                                String(
                                    state?.id
                                ) ===
                                String(
                                    selectedState
                                )
                        )

                    const isKarnataka =
                        selectedStateObject
                            ?.name
                            ?.trim()
                            .toLowerCase() ===
                        'karnataka'


                    if (
                        isKarnataka &&
                        !cityValue
                    ) {

                        const bengaluru =
                            cityList.find(
                                (city) =>
                                    String(
                                        city?.name
                                    )
                                        .trim()
                                        .toLowerCase() ===
                                    'bengaluru'
                            )

                        if (bengaluru) {

                            setSelectedCity(
                                bengaluru.id
                            )

                            onCityChange?.(
                                bengaluru.id
                            )

                        }

                    }

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedState,
        cities,
    ])


    /*
    |--------------------------------------------------------------------------
    | STATE OPTIONS
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | CITY OPTIONS
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | FILTER CITIES BY STATE
    |--------------------------------------------------------------------------
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
                String(
                    selectedState
                )
        )

    }, [
        cityOptions,
        selectedState,
    ])


    /*
    |--------------------------------------------------------------------------
    | STATE CHANGE
    |--------------------------------------------------------------------------
    */

    const handleStateChange = (
        value
    ) => {

        setSelectedState(value)

        setSelectedCity('')

        setApiCities([])

        onStateChange?.(value)

        onCityChange?.('')

    }


    /*
    |--------------------------------------------------------------------------
    | CITY CHANGE
    |--------------------------------------------------------------------------
    */

    const handleCityChange = (
        value
    ) => {

        setSelectedCity(value)

        onCityChange?.(value)

    }


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
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

            {/* STATE */}
            <div>
                {stateLabel && (
                    <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                        {stateLabel}
                    </label>
                )}
                <LocationDropdown
                    value={selectedState}
                    options={stateOptions}
                    onChange={handleStateChange}
                    placeholder={
                        statesLoading
                            ? 'Loading States...'
                            : statePlaceholder
                    }
                    searchPlaceholder={stateSearchPlaceholder}
                    allLabel={allStatesLabel}
                    emptyMessage={
                        statesLoading
                            ? 'Loading states...'
                            : stateEmptyMessage
                    }
                    disabled={disabled || statesLoading}
                />
            </div>

            {/* CITY */}
            <div>
                {cityLabel && (
                    <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                        {cityLabel}
                    </label>
                )}
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
                    searchPlaceholder={citySearchPlaceholder}
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

        </div>
    )
}


export default StateCityDropdown