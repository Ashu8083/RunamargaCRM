// admin-react\src\components\GlobalModels\Filters\SearchableFilterDropdown.jsx

import { useEffect, useMemo, useRef, useState } from 'react'

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'


// =============================================================
// DEFAULT OPTION VALUE
// =============================================================

const getDefaultOptionValue = (option) =>
    option?.value ??
    option?.id ??
    option?._id ??
    option?.name ??
    option?.label ??
    ''


// =============================================================
// DEFAULT OPTION LABEL
// =============================================================

const getDefaultOptionLabel = (option) =>
    option?.label ??
    option?.name ??
    option?.fullName ??
    option?.title ??
    String(getDefaultOptionValue(option) || '')


// =============================================================
// NORMALIZE OPTION
// =============================================================

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
            originalOption: option,
        }
    }

    const value = getOptionValue
        ? getOptionValue(option)
        : getDefaultOptionValue(option)

    const label = getOptionLabel
        ? getOptionLabel(option)
        : getDefaultOptionLabel(option)

    return {
        key: `${String(value || label)}-${index}`,
        value,
        label: String(label || value || ''),
        originalOption: option,
    }
}


// =============================================================
// COMPONENT
// =============================================================

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
    className = 'w-full min-w-0',
    buttonClassName = '',
    menuClassName = '',
    disabled = false,
    getOptionValue,
    getOptionLabel,
}) {
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false)

    const dropdownRef = useRef(null)
    const buttonRef = useRef(null)
    const searchInputRef = useRef(null)

    // =========================================================
    // NORMALIZED OPTIONS
    // =========================================================

    const normalizedOptions = useMemo(() => {
        const sourceOptions = Array.isArray(options)
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

    // =========================================================
    // CLOSE ON OUTSIDE CLICK
    // =========================================================

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

    // =========================================================
    // CLOSE ON ESCAPE
    // =========================================================

    useEffect(() => {
        if (!open) return

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setOpen(false)
                setSearch('')
                buttonRef.current?.focus()
            }
        }

        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener(
                'keydown',
                handleEscape
            )
        }
    }, [open])

    // =========================================================
    // SELECTED OPTION
    // =========================================================

    const selectedOption = normalizedOptions.find(
        (option) =>
            String(option.value) === String(value)
    )

    // =========================================================
    // DISPLAY VALUE
    // =========================================================

    const displayValue =
        selectedOption?.label ||
        (value ? String(value) : placeholder || allLabel)

    // =========================================================
    // FILTER OPTIONS
    // =========================================================

    const filteredOptions = useMemo(() => {
        const searchValue = search.trim().toLowerCase()

        if (!searchValue) {
            return normalizedOptions
        }

        return normalizedOptions.filter((option) =>
            option.label.toLowerCase().includes(searchValue)
        )
    }, [normalizedOptions, search])

    // =========================================================
    // HANDLE SELECT
    // =========================================================

    const handleSelect = (option) => {
        if (!option) {
            onChange?.('', null)
        } else {
            onChange?.(
                option.value,
                option.originalOption
            )
        }

        setOpen(false)
        setSearch('')
    }

    // =========================================================
    // COMPONENT UI
    // =========================================================

    return (
            <div
                ref={dropdownRef}
                className={`relative box-border w-full min-w-0 ${className}`}
            >
            {/* LABEL */}

            {showLabel && (
                <label
                    className="
                        mb-1.5
                        block
                        text-xs
                        font-medium
                        text-base-content/60
                    "
                >
                    {label}
                </label>
            )}

            {/* BUTTON */}

            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => {
                    if (disabled) return

                    setOpen((previous) => !previous)
                    setSearch('')
                }}
                className={`
                    box-border
                    flex
                    h-10
                    min-h-10
                    w-full
                    min-w-0
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
                    outline-none
                    transition-colors
                    hover:border-base-content/30
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500/30
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${buttonClassName}
                `}
            >
                <span className="min-w-0 flex-1 truncate">
                    {displayValue}
                </span>

                <ChevronDownIcon
                    className={`
                        h-4
                        w-4
                        shrink-0
                        text-base-content/40
                        transition-transform
                        duration-150
                        ${open ? 'rotate-180' : ''}
                    `}
                />
            </button>

            {/* DROPDOWN MENU
                No top margin: positioned directly below the button.
            */}

            {open && (
                <div
                    className={`
                        absolute
                        left-0
                        right-0
                        top-full
                        z-50
                        box-border
                        overflow-hidden
                        rounded-lg
                        border
                        border-base-300
                        bg-base-100
                        shadow-lg
                        ${menuClassName}
                    `}
                >
                    {/* SEARCH */}

                    <div className="border-b border-base-300 p-2">
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
                                ref={searchInputRef}
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder={
                                    searchPlaceholder ||
                                    `Search ${String(label || 'options').toLowerCase()}`
                                }
                                autoFocus
                                className="
                                    input
                                    input-bordered
                                    box-border
                                    h-9
                                    min-h-9
                                    w-full
                                    pl-8
                                    text-sm
                                "
                            />
                        </div>
                    </div>

                    {/* OPTIONS */}

                    <div
                        className="
                            max-h-56
                            overflow-y-auto
                            p-1
                        "
                        role="listbox"
                    >
                        {/* ALL */}

                        {includeAllOption && (
                            <button
                                type="button"
                                onClick={() => handleSelect(null)}
                                className={
                                    !value
                                        ? 'w-full rounded-md bg-[#8BCF00]/10 px-3 py-2 text-left text-sm font-medium text-[#78B300]'
                                        : 'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-base-200'
                                }
                            >
                                {allLabel}
                            </button>
                        )}

                        {/* LOADING */}

                        {loading && (
                            <div
                                className="
                                    px-3
                                    py-3
                                    text-center
                                    text-xs
                                    text-base-content/50
                                "
                            >
                                Loading...
                            </div>
                        )}

                        {/* FILTERED OPTIONS */}

                        {!loading &&
                            filteredOptions.map((option) => (
                                <button
                                    key={option.key}
                                    type="button"
                                    role="option"
                                    aria-selected={
                                        String(value) ===
                                        String(option.value)
                                    }
                                    onClick={() =>
                                        handleSelect(option)
                                    }
                                    className={
                                        String(value) ===
                                        String(option.value)
                                            ? 'w-full rounded-md bg-[#8BCF00]/10 px-3 py-2 text-left text-sm font-medium text-[#78B300]'
                                            : 'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-base-200'
                                    }
                                >
                                    {option.label}
                                </button>
                            ))}

                        {/* EMPTY STATE */}

                        {!loading &&
                            filteredOptions.length === 0 && (
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
                </div>
            )}
        </div>
    )
}

export default SearchableFilterDropdown
