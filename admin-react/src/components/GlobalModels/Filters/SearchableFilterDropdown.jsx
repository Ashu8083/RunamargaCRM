import { useEffect, useMemo, useRef, useState } from 'react'

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'


const getDefaultOptionValue = (option) =>
    option?.value ??
    option?.id ??
    option?._id ??
    option?.name ??
    option?.label ??
    ''


const getDefaultOptionLabel = (option) =>
    option?.label ??
    option?.name ??
    option?.fullName ??
    option?.title ??
    String(getDefaultOptionValue(option) || '')


function normalizeOption(
    option,
    index,
    getOptionValue,
    getOptionLabel
) {

    if (
        typeof option === 'string' ||
        typeof option === 'number'
    ) {

        return {
            key: `${String(option)}-${index}`,
            value: option,
            label: String(option),
        }

    }


    const value =
        getOptionValue
            ? getOptionValue(option)
            : getDefaultOptionValue(option)


    const label =
        getOptionLabel
            ? getOptionLabel(option)
            : getDefaultOptionLabel(option)


    return {
        key: `${String(value || label)}-${index}`,
        value,
        label: String(label || value || ''),
    }

}


function SearchableFilterDropdown({
    label,
    value = '',
    onChange,
    options,
    defaultOptions = [],
    allLabel = 'All',
    placeholder,
    searchPlaceholder,
    emptyMessage = 'No options found',
    loading = false,
    showLabel = true,
    includeAllOption = true,
    className = 'min-w-[180px] flex-1',
    buttonClassName = '',
    menuClassName = '',
    disabled = false,
    getOptionValue,
    getOptionLabel,
}) {

    const [search, setSearch] = useState('')

    const [open, setOpen] = useState(false)

    const dropdownRef = useRef(null)


    const normalizedOptions = useMemo(() => {

        const sourceOptions =
            Array.isArray(options)
                ? options
                : defaultOptions


        return sourceOptions
            .map((option, index) =>
                normalizeOption(
                    option,
                    index,
                    getOptionValue,
                    getOptionLabel
                )
            )
            .filter((option) => {

                if (!option.label) {
                    return false
                }


                if (
                    includeAllOption &&
                    String(option.value) === ''
                ) {
                    return false
                }


                return true

            })

    }, [
        defaultOptions,
        getOptionLabel,
        getOptionValue,
        includeAllOption,
        options,
    ])


    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
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


    const selectedOption = normalizedOptions.find(
        (option) =>
            String(option.value) === String(value)
    )


    const displayValue =
        selectedOption?.label ||
        (
            value
                ? String(value)
                : placeholder || allLabel
        )


    const filteredOptions = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase()


        if (!searchValue) {
            return normalizedOptions
        }


        return normalizedOptions.filter(
            (option) =>
                option.label
                    .toLowerCase()
                    .includes(searchValue)
        )

    }, [
        normalizedOptions,
        search,
    ])


    const handleSelect = (selectedValue) => {

        onChange?.(selectedValue)

        setOpen(false)
        setSearch('')

    }


    return (

        <div
            ref={dropdownRef}
            className={`relative ${className}`}
        >

            {showLabel && (

                <label className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-base-content/60
                ">
                    {label}
                </label>

            )}


            <button
                type="button"
                disabled={disabled}
                onClick={() => {

                    if (disabled) {
                        return
                    }


                    setOpen((previous) => !previous)
                    setSearch('')

                }}
                className={`
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
                    ${buttonClassName}
                `}
            >

                <span className="min-w-0 truncate">
                    {displayValue}
                </span>


                <ChevronDownIcon className="
                    h-4
                    w-4
                    shrink-0
                    text-base-content/40
                " />

            </button>


            {open && (

                <div className={`
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
                    ${menuClassName}
                `}>

                    <div className="
                        border-b
                        border-base-300
                        p-2
                    ">

                        <div className="relative">

                            <MagnifyingGlassIcon className="
                                pointer-events-none
                                absolute
                                left-2.5
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-base-content/35
                            " />


                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder={
                                    searchPlaceholder ||
                                    `Search ${String(label).toLowerCase()}`
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


                    <div className="
                        max-h-56
                        overflow-y-auto
                        p-1
                    ">

                        {includeAllOption && (

                            <button
                                type="button"
                                onClick={() => handleSelect('')}
                                className={
                                    !value
                                        ? 'w-full rounded-md bg-[#8BCF00]/10 px-3 py-2 text-left text-sm font-medium text-[#78B300]'
                                        : 'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-base-200'
                                }
                            >
                                {allLabel}
                            </button>

                        )}


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


                        {!loading &&
                            filteredOptions.map((option) => (

                                <button
                                    key={option.key}
                                    type="button"
                                    onClick={() =>
                                        handleSelect(option.value)
                                    }
                                    className={
                                        String(value) === String(option.value)
                                            ? 'w-full rounded-md bg-[#8BCF00]/10 px-3 py-2 text-left text-sm font-medium text-[#78B300]'
                                            : 'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-base-200'
                                    }
                                >
                                    {option.label}
                                </button>

                            ))}


                        {!loading &&
                            filteredOptions.length === 0 && (

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

                </div>

            )}

        </div>

    )

}


export default SearchableFilterDropdown
