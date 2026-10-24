 // admin-react/src/pages/Banks&DSA/Banks/components/BanksTable.jsx

import { useMemo, useState } from 'react'

import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { PERMISSIONS,hasPermission } from '../../../../../app/permissions'

const canAdd=hasPermission(PERMISSIONS.BANKS_CREATE)
const canEdit=hasPermission(PERMISSIONS.BANKS_EDIT)
const canDelete = hasPermission(PERMISSIONS.BANKS_DELETE)

function BanksTable({
    banks = [],
    onEdit,
    onDelete,
    onAdd,
}) {

    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    // =========================================================
    // FILTERED BANKS
    // =========================================================

    const filteredBanks = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase()

        return banks.filter((bank) => {

            // -------------------------------------------------
            // SEARCH BY BANK NAME
            // -------------------------------------------------

            if (searchValue) {

                const bankName =
                    String(bank.name || '').toLowerCase()

                if (!bankName.includes(searchValue)) {
                    return false
                }
            }

            // -------------------------------------------------
            // STATUS FILTER
            // -------------------------------------------------

            if (selectedStatus) {

                const status =
                    bank.is_active ? 'active' : 'inactive'

                if (status !== selectedStatus) {
                    return false
                }
            }

            return true
        })

    }, [
        banks,
        search,
        selectedStatus,
    ])

    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {
        setSearch('')
        setSelectedStatus('')
    }

    // =========================================================
    // EMPTY STATE
    // =========================================================

    const renderEmptyState = () => (

        <div className="
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            <div className="
                flex
                min-h-[260px]
                flex-col
                items-center
                justify-center
                px-6
                py-12
                text-center
            ">

                <div className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-base-200
                ">

                    <ArrowPathIcon className="
                        h-6
                        w-6
                        text-base-content/30
                    " />

                </div>

                <p className="
                    mt-4
                    text-sm
                    font-semibold
                    text-base-content/70
                ">
                    {banks.length === 0
                        ? 'No banks found'
                        : 'No matching banks found'
                    }
                </p>

                <p className="
                    mt-1
                    text-xs
                    text-base-content/45
                ">
                    {banks.length === 0
                        ? 'Add a bank to get started.'
                        : 'Try changing your filters.'
                    }
                </p>

                {banks.length > 0 && (

                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="
                            btn
                            btn-ghost
                            btn-sm
                            mt-3
                        "
                    >
                        Clear Filters
                    </button>

                )}

            </div>

        </div>

    )

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="space-y-4">

            {/* =====================================================
                FILTER SECTION + ADD BANK
            ===================================================== */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    flex
                    flex-col
                    gap-3
                    px-4
                    py-4
                    lg:flex-row
                    lg:items-center
                    lg:gap-3
                    lg:px-5
                ">

                    {/* FILTER LABEL */}

                    <p className="
                        shrink-0
                        text-sm
                        font-medium
                        text-base-content/70
                    ">
                        Filter Options
                    </p>

                    {/* SEARCH */}

                    <div className="
                        relative
                        w-full
                        lg:w-[320px]
                    ">

                        <MagnifyingGlassIcon className="
                            pointer-events-none
                            absolute
                            left-3
                            top-1/2
                            h-5
                            w-5
                            -translate-y-1/2
                            text-base-content/40
                        " />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search bank..."
                            className="
                                input
                                input-bordered
                                h-10
                                w-full
                                pl-10
                            "
                        />

                    </div>

                    {/* STATUS FILTER */}

                    <select
                        value={selectedStatus}
                        onChange={(event) =>
                            setSelectedStatus(event.target.value)
                        }
                        className="
                            select
                            select-bordered
                            h-10
                            min-h-10
                            w-full
                            lg:w-[170px]
                        "
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                    </select>

                    {/* RESULT COUNT */}

                    <p className="
                        shrink-0
                        text-xs
                        font-medium
                        text-base-content/55
                    ">

                        {filteredBanks.length}{' '}

                        {filteredBanks.length === 1
                            ? 'bank'
                            : 'banks'}{' '}

                        found

                    </p>

                    {/* SPACER */}

                    <div className="
                        hidden
                        flex-1
                        lg:block
                    " />

                    {/* CLEAR FILTERS */}

                    {(search || selectedStatus) && (

                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="
                                flex
                                h-10
                                shrink-0
                                items-center
                                justify-center
                                gap-1.5
                                rounded-lg
                                px-3
                                text-xs
                                font-medium
                                text-[#78B300]
                                transition
                                hover:bg-[#8BCF00]/10
                                hover:text-[#5f9000]
                            "
                        >

                            <XMarkIcon className="
                                h-4
                                w-4
                            " />

                            Clear

                        </button>

                    )}

                    {/* ADD BANK */}

                    <button
                        type="button"
                        onClick={() => onAdd?.()}
                        disabled={!canAdd}
                        className="
                            flex
                            h-10
                            shrink-0
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            bg-[#8BCF00]
                            px-4
                            text-sm
                            font-medium
                            text-white
                            shadow-none
                            transition
                            hover:bg-[#6FA800]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#8BCF00]/30
                        "
                    >

                        <PlusIcon className="
                            h-4
                            w-4
                        " />

                        Add Bank

                    </button>

                </div>

            </div>

            {/* =====================================================
                BANK TABLE OR EMPTY STATE
            ===================================================== */}

            {filteredBanks.length === 0 ? (

                renderEmptyState()

            ) : (

                <div className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-sm
                ">

                    <div className="
                        w-full
                        overflow-x-auto
                    ">

                        <table className="
                            w-full
                            min-w-[600px]
                            border-collapse
                        ">

                            {/* TABLE HEADER */}

                            <thead>

                                <tr className="
                                    border-b
                                    border-base-300
                                    bg-base-200/40
                                ">

                                    {/* BANK */}

                                    <th className="
                                        px-5
                                        py-3.5
                                        text-left
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    ">
                                        Bank
                                    </th>

                                    {/* STATUS */}

                                    <th className="
                                        w-[180px]
                                        px-5
                                        py-3.5
                                        text-left
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    ">
                                        Status
                                    </th>

                                    {/* ACTIONS */}

                                    <th className="
                                        w-[120px]
                                        px-5
                                        py-3.5
                                        text-right
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-base-content/60
                                    ">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            {/* TABLE BODY */}

                            <tbody>

                                {filteredBanks.map((bank, index) => {

                                    const isActive = bank.is_active

                                    return (

                                        <tr
                                            key={bank.id ?? index}
                                            className="
                                                border-b
                                                border-base-300
                                                last:border-b-0
                                                transition-colors
                                                hover:bg-base-200/30
                                            "
                                        >

                                            {/* BANK */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    {/* BANK AVATAR */}

                                                    <div className="
                                                        flex
                                                        h-10
                                                        w-10
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-[#8BCF00]/10
                                                    ">

                                                        <span className="
                                                            text-sm
                                                            font-semibold
                                                            text-[#6FA800]
                                                        ">

                                                            {String(
                                                                bank.name || 'B'
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}

                                                        </span>

                                                    </div>

                                                    {/* BANK NAME */}

                                                    <div className="min-w-0">

                                                        <p
                                                            className="
                                                                truncate
                                                                text-sm
                                                                font-semibold
                                                                text-base-content
                                                            "
                                                            title={bank.name}
                                                        >
                                                            {bank.name || 'Unnamed Bank'}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* STATUS */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                {isActive ? (

                                                    <span className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        border
                                                        border-[#2F8132]/20
                                                        bg-[#2F8132]/10
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        text-[#2F8132]
                                                    ">

                                                        <span className="
                                                            h-1.5
                                                            w-1.5
                                                            rounded-full
                                                            bg-[#2F8132]
                                                        " />

                                                        Active

                                                    </span>

                                                ) : (

                                                    <span className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        border
                                                        border-base-300
                                                        bg-base-200
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        text-base-content/55
                                                    ">

                                                        <span className="
                                                            h-1.5
                                                            w-1.5
                                                            rounded-full
                                                            bg-base-content/40
                                                        " />

                                                        Inactive

                                                    </span>

                                                )}

                                            </td>

                                            {/* ACTIONS */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-1
                                                ">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onEdit?.(bank)
                                                        }
                                                        title="Edit bank"
                                                        disabled={!canEdit}
                                                        aria-label={`Edit ${bank.name}`}
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            text-base-content/45
                                                            transition
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#6FA800]
                                                            focus:outline-none
                                                            focus:ring-2
                                                            focus:ring-[#8BCF00]/20
                                                        "
                                                    >

                                                        <PencilSquareIcon className="
                                                            h-5
                                                            w-5
                                                        " />

                                                    </button>

                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDelete?.(bank)
                                                        }
                                                        title="Delete bank"
                                                        disabled={!canDelete}
                                                        aria-label={`Delete ${bank.name}`}
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            text-base-content/45
                                                            transition
                                                            hover:bg-error/10
                                                            hover:text-error
                                                            focus:outline-none
                                                            focus:ring-2
                                                            focus:ring-error/20
                                                        "
                                                    >

                                                        <TrashIcon className="
                                                            h-5
                                                            w-5
                                                        " />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )

                                })}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>

    )
}

export default BanksTable