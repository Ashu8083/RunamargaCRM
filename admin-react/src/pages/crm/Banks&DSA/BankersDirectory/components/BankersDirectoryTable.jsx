// admin-react/src/pages/Banks&DSA/BankersDirectory/components/BankersDirectoryTable.jsx

import { useEffect, useRef, useState } from "react";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";

import StateCityDropdown from "../../../../../components/GlobalModels/Filters/StateCityDropdown";
import LoanTypeDropdown from "../../../../../components/GlobalModels/Filters/LoanTypeDropdown";

import {
    PERMISSIONS,
    hasPermission,
} from "../../../../../app/permissions";
// =========================================================
// PERMISSIONS
// =========================================================
    const canAdd = hasPermission(PERMISSIONS.BANKERS_CREATE);
    const canEdit = hasPermission(PERMISSIONS.BANKERS_EDIT);
    const canDelete = hasPermission(PERMISSIONS.BANKERS_DELETE);
// =========================================================
// SEARCHABLE FILTER DROPDOWN
// =========================================================

function SearchableFilterDropdown({
    value,
    options = [],
    placeholder = "Select",
    searchPlaceholder = "Search...",
    onChange,
    disabled = false,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const selectedOption = options.find(
        (option) => String(option.id) === String(value)
    );

    const filteredOptions = options.filter((option) =>
        String(option.name || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div ref={dropdownRef} className="relative w-full min-w-0">
            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    setOpen((previous) => !previous);
                    setSearch("");
                }}
                className="
                    flex h-11 w-full min-w-0 items-center justify-between gap-2
                    rounded-lg border border-base-300 bg-base-100 px-3
                    text-left text-sm text-base-content transition
                    hover:border-base-content/30
                    focus:border-[#8BCF00] focus:outline-none
                    focus:ring-2 focus:ring-[#8BCF00]/15
                    disabled:cursor-not-allowed disabled:opacity-50
                "
            >
                <span className="truncate">
                    {selectedOption?.name || placeholder}
                </span>

                <span className="shrink-0 text-xs text-base-content/50">
                    {open ? "▲" : "▼"}
                </span>
            </button>

            {open && !disabled && (
                <div
                    className="
                        absolute left-0 top-full z-50 mt-1 w-full min-w-[190px]
                        overflow-hidden rounded-lg border border-base-300
                        bg-base-100 shadow-lg
                    "
                >
                    <div className="border-b border-base-300 p-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={searchPlaceholder}
                            autoFocus
                            className="
                                h-9 w-full rounded-md border border-base-300
                                bg-base-100 px-3 text-sm text-base-content
                                outline-none focus:border-[#8BCF00]
                            "
                        />
                    </div>

                    <div className="max-h-52 overflow-y-auto p-1">
                        <button
                            type="button"
                            onClick={() => {
                                onChange?.(null);
                                setOpen(false);
                                setSearch("");
                            }}
                            className="
                                w-full rounded-md px-3 py-2 text-left text-sm
                                text-base-content/70 hover:bg-base-200
                            "
                        >
                            {placeholder}
                        </button>

                        {filteredOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                    onChange?.(option);
                                    setOpen(false);
                                    setSearch("");
                                }}
                                className={[
                                    "w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-base-200",
                                    String(option.id) === String(value)
                                        ? "bg-base-200 font-semibold"
                                        : "text-base-content/80",
                                ].join(" ")}
                            >
                                {option.name}
                            </button>
                        ))}

                        {filteredOptions.length === 0 && (
                            <p className="px-3 py-4 text-center text-xs text-base-content/50">
                                No results found
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// =========================================================
// BANKERS DIRECTORY TABLE
// =========================================================

function BankersDirectoryTable({
    entries = [],
    banks = [],
    onView,
    onEdit,
    onDelete,
    onRefresh,
    onAdd,
    onFiltersChange,
    loading = false,
    page = 1,
    limit = 15,
    total = 0,
    onPageChange,
}) {


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState("");
    const [selectedStateId, setSelectedStateId] = useState(null);
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [selectedBankId, setSelectedBankId] = useState(null);
    const [selectedLoanTypeId, setSelectedLoanTypeId] = useState(null);

    // =========================================================
    // DEBOUNCED FILTER UPDATE
    // =========================================================

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onFiltersChange?.({
                search: search.trim(),
                state_id: selectedStateId,
                city_id: selectedCityId,
                bank_id: selectedBankId,
                loan_type_id: selectedLoanTypeId,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [
        search,
        selectedStateId,
        selectedCityId,
        selectedBankId,
        selectedLoanTypeId,
        onFiltersChange,
    ]);

    // =========================================================
    // FILTER HANDLERS
    // =========================================================

    const normalizeId = (value) => {
        if (value === null || value === undefined || value === "") {
            return null;
        }

        const id = Number(value?.id ?? value);

        return Number.isNaN(id) ? null : id;
    };

    const handleStateChange = (value) => {
        setSelectedStateId(normalizeId(value));
        setSelectedCityId(null);
    };

    const handleCityChange = (value) => {
        setSelectedCityId(normalizeId(value));
    };

    const handleBankChange = (value) => {
        setSelectedBankId(normalizeId(value));
    };

    const handleLoanTypeChange = (value) => {
        setSelectedLoanTypeId(normalizeId(value));
    };

    const handleClearFilters = () => {
        setSearch("");
        setSelectedStateId(null);
        setSelectedCityId(null);
        setSelectedBankId(null);
        setSelectedLoanTypeId(null);
    };

    const hasActiveFilters = Boolean(
        search.trim() ||
        selectedStateId !== null ||
        selectedCityId !== null ||
        selectedBankId !== null ||
        selectedLoanTypeId !== null
    );

    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages = Math.ceil(total / limit) || 1;

    const firstEntry = total === 0 ? 0 : (page - 1) * limit + 1;
    const lastEntry = Math.min(page * limit, total);

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">
            {/* =====================================================
                FILTER SECTION
                Title and subtitle removed.
            ===================================================== */}

            <div className="border-b border-base-300 p-4 sm:p-5">
                {/* SEARCH + ACTION BUTTONS */}

                <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end">
                    <div className="min-w-0 flex-1">
                        <label
                            htmlFor="bankers-directory-search"
                            className="mb-2 block text-xs font-semibold text-base-content/70"
                        >
                            Search
                        </label>

                        <input
                            id="bankers-directory-search"
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search banker, bank, city..."
                            className="
                                h-11 w-full rounded-lg border border-base-300
                                bg-base-100 px-3 text-sm text-base-content
                                outline-none transition
                                placeholder:text-base-content/40
                                focus:border-[#8BCF00]
                                focus:ring-2 focus:ring-[#8BCF00]/15
                            "
                        />
                    </div>

                    <div
                        className={[
                            "grid gap-2 sm:flex sm:shrink-0",
                            canAdd ? "grid-cols-2" : "grid-cols-1",
                        ].join(" ")}
                    >
                        <button
                            type="button"
                            onClick={() => onRefresh?.()}
                            disabled={loading}
                            className="
                                inline-flex h-11 items-center justify-center gap-2
                                rounded-lg border border-base-300 bg-base-100
                                px-4 text-xs font-medium text-base-content/70
                                transition hover:bg-base-200
                                disabled:cursor-not-allowed disabled:opacity-50
                                sm:min-w-[110px]
                            "
                        >
                            <ArrowPathIcon
                                className={[
                                    "h-4 w-4",
                                    loading ? "animate-spin" : "",
                                ].join(" ")}
                            />
                            Refresh
                        </button>

                        {canAdd && (
                            <button
                                type="button"
                                onClick={() => onAdd?.()}
                                className="
                                    inline-flex h-11 items-center justify-center
                                    gap-2 rounded-lg bg-[#8BCF00] px-4
                                    text-xs font-semibold text-white
                                    transition hover:bg-[#79B500]
                                    sm:min-w-[145px]
                                "
                            >
                                <span className="text-base">+</span>
                                Add Banker
                            </button>
                        )}
                    </div>
                </div>

                {/* FILTERS: FOUR COLUMNS ON DESKTOP */}

                <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(300px,1.2fr)_minmax(180px,1fr)_minmax(200px,1fr)_minmax(140px,0.7fr)]">
                    {/* STATE / CITY */}

                    <div className="min-w-0">
                 
                        <div className="w-full min-w-0">
                            <StateCityDropdown
                                stateValue={selectedStateId}
                                cityValue={selectedCityId}
                                onStateChange={handleStateChange}
                                onCityChange={handleCityChange}
                                stateLabel="State"
                                cityLabel="City"
                                allStatesLabel="All States"
                                allCitiesLabel="All Cities"
                                statePlaceholder="Select State"
                                cityPlaceholder="Select City"
                                stateSearchPlaceholder="Search State"
                                citySearchPlaceholder="Search City"
                            />
                        </div>
                    </div>

                    {/* BANK */}

                    <div className="min-w-0">
                        <SearchableFilterDropdown
                            value={selectedBankId}
                            options={banks}
                            placeholder="All Banks"
                            searchPlaceholder="Search banks..."
                            onChange={handleBankChange}
                        />
                    </div>

                    {/* LOAN TYPE */}

                    <div className="min-w-0">
                        <LoanTypeDropdown
                            value={selectedLoanTypeId}
                            onChange={handleLoanTypeChange}
                            label="Loan Type"
                            className="w-full"
                        />
                    </div>

                    {/* CLEAR FILTERS */}

                    <div className="min-w-0">
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            disabled={!hasActiveFilters}
                            className="
                                h-11 w-full rounded-lg border border-base-300
                                bg-base-100 px-3 text-xs font-medium
                                text-base-content/70 transition hover:bg-base-200
                                disabled:cursor-not-allowed disabled:opacity-40
                            "
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* =====================================================
                RESULT INFO
            ===================================================== */}

            <div className="flex min-h-[48px] flex-wrap items-center justify-between gap-2 border-b border-base-300 px-4 py-3 sm:px-5">
                <p className="text-xs text-base-content/60">
                    {loading ? (
                        "Loading banker entries..."
                    ) : (
                        <>
                            Showing{" "}
                            <span className="font-semibold text-base-content/85">
                                {firstEntry}-{lastEntry}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-base-content/85">
                                {total}
                            </span>{" "}
                            entries
                        </>
                    )}
                </p>
            </div>

            {/* =====================================================
                EMPTY STATE / TABLE
            ===================================================== */}

            {!entries.length && !loading ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-base-200">
                        <span className="text-lg font-semibold text-base-content/30">
                            —
                        </span>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-base-content/70">
                        No banker entries found
                    </p>

                    <p className="mt-1 text-xs text-base-content/45">
                        Try changing your filters or search.
                    </p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[1050px] border-collapse">
                        <thead>
                            <tr className="border-b border-base-300 bg-base-200/40">
                                <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold text-base-content/65">
                                    State
                                </th>

                                <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold text-base-content/65">
                                    City
                                </th>

                                <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold text-base-content/65">
                                    Bank
                                </th>

                                <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold text-base-content/65">
                                    Loan Type
                                </th>

                                <th className="w-[100px] whitespace-nowrap px-5 py-3.5 text-center text-xs font-semibold text-base-content/65">
                                    SM(s)
                                </th>

                                <th className="w-[100px] whitespace-nowrap px-5 py-3.5 text-center text-xs font-semibold text-base-content/65">
                                    ASM(s)
                                </th>

                                <th className="w-[120px] whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold text-base-content/65">
                                    Status
                                </th>

                                <th className="w-[200px] whitespace-nowrap px-5 py-3.5 text-center text-xs font-semibold text-base-content/65">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {entries.map((entry, index) => {
                                const sms = Array.isArray(entry.sms)
                                    ? entry.sms
                                    : [];

                                const asms = Array.isArray(entry.asms)
                                    ? entry.asms
                                    : [];

                                const isActive =
                                    entry.status === "active" ||
                                    entry.status === "1";

                                return (
                                    <tr
                                        key={entry.id ?? index}
                                        onClick={() => onView?.(entry)}
                                        className="
                                            cursor-pointer border-b
                                            border-base-300 last:border-b-0
                                            transition-colors hover:bg-base-200/40
                                        "
                                    >
                                        {/* STATE */}

                                        <td className="px-5 py-4">
                                            <span
                                                className="block max-w-[180px] truncate text-sm font-medium text-base-content"
                                                title={
                                                    entry.state ||
                                                    entry.state_name ||
                                                    ""
                                                }
                                            >
                                                {entry.state ||
                                                    entry.state_name ||
                                                    "—"}
                                            </span>
                                        </td>

                                        {/* CITY */}

                                        <td className="px-5 py-4">
                                            <span
                                                className="block max-w-[160px] truncate text-sm text-base-content/75"
                                                title={
                                                    entry.city ||
                                                    entry.city_name ||
                                                    ""
                                                }
                                            >
                                                {entry.city ||
                                                    entry.city_name ||
                                                    "—"}
                                            </span>
                                        </td>

                                        {/* BANK */}

                                        <td className="px-5 py-4">
                                            <span
                                                className="block max-w-[190px] truncate text-sm font-semibold text-base-content"
                                                title={
                                                    entry.bank ||
                                                    entry.bank_name ||
                                                    ""
                                                }
                                            >
                                                {entry.bank ||
                                                    entry.bank_name ||
                                                    "—"}
                                            </span>
                                        </td>

                                        {/* LOAN TYPE */}

                                        <td className="px-5 py-4">
                                            <span className="inline-flex max-w-[210px] items-center truncate rounded-full border border-[#8BCF00]/40 bg-[#8BCF00]/10 px-3 py-1.5 text-xs font-medium text-[#6FA800]">
                                                {entry.loanType ||
                                                    entry.loan_type_name ||
                                                    "—"}
                                            </span>
                                        </td>

                                        {/* SM COUNT */}

                                        <td className="px-5 py-4 text-center">
                                            <span className="inline-flex min-w-[32px] items-center justify-center rounded-full bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/70">
                                                {sms.length}
                                            </span>
                                        </td>

                                        {/* ASM COUNT */}

                                        <td className="px-5 py-4 text-center">
                                            <span className="inline-flex min-w-[32px] items-center justify-center rounded-full bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/70">
                                                {asms.length}
                                            </span>
                                        </td>

                                        {/* STATUS */}

                                        <td className="px-5 py-4">
                                            <span
                                                className={[
                                                    "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium",
                                                    isActive
                                                        ? "border-[#8BCF00]/40 bg-[#8BCF00]/10 text-[#6FA800]"
                                                        : "border-base-300 bg-base-200 text-base-content/55",
                                                ].join(" ")}
                                            >
                                                {isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        {/* ACTIONS */}

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        onView?.(entry);
                                                    }}
                                                    className="
                                                        inline-flex h-8 items-center
                                                        justify-center rounded-lg
                                                        border border-base-300
                                                        bg-base-100 px-3 text-xs
                                                        font-medium text-base-content/70
                                                        transition hover:border-[#8BCF00]/40
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#6FA800]
                                                    "
                                                >
                                                    View
                                                </button>

                                                {canEdit && (
                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            onEdit?.(entry);
                                                        }}
                                                        className="
                                                            inline-flex h-8 items-center
                                                            justify-center rounded-lg
                                                            border border-base-300
                                                            bg-base-100 px-3 text-xs
                                                            font-medium text-base-content/70
                                                            transition hover:border-[#8BCF00]/40
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#6FA800]
                                                        "
                                                    >
                                                        Edit
                                                    </button>
                                                )}

                                                {canDelete && onDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            onDelete(entry);
                                                        }}
                                                        className="
                                                            inline-flex h-8 items-center
                                                            justify-center rounded-lg
                                                            border border-error/30
                                                            bg-error/5 px-3 text-xs
                                                            font-medium text-error
                                                            transition hover:bg-error/15
                                                        "
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* =====================================================
                PAGINATION
            ===================================================== */}

            {total > 0 && (
                <div className="flex flex-col gap-3 border-t border-base-300 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <p className="text-xs text-base-content/60">
                        Page{" "}
                        <span className="font-semibold text-base-content/85">
                            {page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-base-content/85">
                            {totalPages}
                        </span>
                    </p>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() => onPageChange?.(page - 1)}
                            className="
                                h-9 rounded-lg border border-base-300
                                bg-base-100 px-4 text-xs font-medium
                                text-base-content/70 transition hover:bg-base-200
                                disabled:cursor-not-allowed disabled:opacity-40
                            "
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled={page >= totalPages || loading}
                            onClick={() => onPageChange?.(page + 1)}
                            className="
                                h-9 rounded-lg border border-base-300
                                bg-base-100 px-4 text-xs font-medium
                                text-base-content/70 transition hover:bg-base-200
                                disabled:cursor-not-allowed disabled:opacity-40
                            "
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BankersDirectoryTable;