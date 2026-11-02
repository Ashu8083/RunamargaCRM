// admin-react\src\pages\crm\CallManagement\PhoneNumbers\components\PhoneNumberTable.jsx
import { useMemo, useState } from 'react'

import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import { PERMISSIONS, hasPermission } from '../../../../../app/permissions'

const canAddPhoneNumber = hasPermission(PERMISSIONS.PHONE_NUMBERS_ADD)
const canEditPhoneNumber = hasPermission(PERMISSIONS.PHONE_NUMBERS_EDIT)

function PhoneNumberTable({
phoneNumbers = [],
onEdit,
onViewDetails,
onAdd,
onRefresh,
EmployeeDropdown,
}) {
// =============================================================
// FILTER STATE
// =============================================================

const [search, setSearch] = useState('')
const [employeeId, setEmployeeId] = useState('')
const [status, setStatus] = useState('')
const [trackable, setTrackable] = useState('')

// =============================================================
// NORMALIZE STATUS
// =============================================================

const normalizeStatus = (value) => {
    if (
        value === 1 ||
        value === '1' ||
        value === 'active' ||
        value === 'Active'
    ) {
        return 'Active'
    }

    if (
        value === 0 ||
        value === '0' ||
        value === 'inactive' ||
        value === 'Inactive'
    ) {
        return 'Inactive'
    }

    return value || 'Inactive'
}

// =============================================================
// FILTER PHONE NUMBERS
// =============================================================

const filteredPhoneNumbers = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return phoneNumbers.filter((phoneNumber) => {
        // -----------------------------------------------------
        // SEARCH
        // -----------------------------------------------------

        if (searchValue) {
            const searchableValues = [
                phoneNumber.number,
                phoneNumber.phone,
                phoneNumber.employeeName,
                phoneNumber.employee_name,
                phoneNumber.teamName,
                phoneNumber.team_name,
            ]

            const matchesSearch = searchableValues.some(
                (value) =>
                    value !== null &&
                    value !== undefined &&
                    String(value)
                        .toLowerCase()
                        .includes(searchValue)
            )

            if (!matchesSearch) {
                return false
            }
        }

        // -----------------------------------------------------
        // EMPLOYEE
        // -----------------------------------------------------

        if (employeeId) {
            if (
                String(phoneNumber.employeeId ?? phoneNumber.employee_id ?? '') !==
                String(employeeId)
            ) {
                return false
            }
        }

        // -----------------------------------------------------
        // STATUS
        // -----------------------------------------------------

        if (status) {
            if (normalizeStatus(phoneNumber.status) !== status) {
                return false
            }
        }

        // -----------------------------------------------------
        // TRACKABLE
        // -----------------------------------------------------

        if (trackable) {
            const isTrackable =
                phoneNumber.trackable === true ||
                phoneNumber.trackable === 'true' ||
                phoneNumber.trackable === '1' ||
                phoneNumber.trackable === 1 ||
                phoneNumber.trackable === 'Yes'

            if (trackable === 'Yes' && !isTrackable) {
                return false
            }

            if (trackable === 'No' && isTrackable) {
                return false
            }
        }

        return true
    })
}, [
    phoneNumbers,
    search,
    employeeId,
    status,
    trackable,
])

// =============================================================
// RESET FILTERS
// =============================================================

const handleReset = () => {
    setSearch('')
    setEmployeeId('')
    setStatus('')
    setTrackable('')
}

// =============================================================
// STATUS STYLE
// =============================================================

const getStatusClass = (value) => {
    if (normalizeStatus(value) === 'Active') {
        return `
            text-[#78B300]
            border-[#8BCF00]/40
            bg-[#8BCF00]/10
        `
    }

    return `
        text-error
        border-error/30
        bg-error/10
    `
}

// =============================================================
// TRACKABLE STYLE
// =============================================================

const getTrackableClass = (value) => {
    const isTrackable =
        value === true ||
        value === 'true' ||
        value === '1' ||
        value === 1 ||
        value === 'Yes'

    if (isTrackable) {
        return `
            text-[#78B300]
            border-[#8BCF00]/40
            bg-[#8BCF00]/10
        `
    }

    return `
        text-base-content/60
        border-base-300
        bg-base-200/50
    `
}

// =============================================================
// RENDER
// =============================================================

return (
    <div className="space-y-4">

        {/* =====================================================
            FILTERS + ACTIONS
        ===================================================== */}

        <div className="
            card
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">
            <div className="card-body p-4">

                <div className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-12
                ">

                    {/* SEARCH */}

                    <div className="lg:col-span-3">
                        <label className="
                            input
                            input-bordered
                            flex
                            w-full
                            min-w-0
                            items-center
                            gap-2
                        ">
                            <MagnifyingGlassIcon className="
                                h-4
                                w-4
                                shrink-0
                                text-base-content/40
                            " />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Number or employee..."
                                className="min-w-0 grow"
                            />
                        </label>
                    </div>

                    {/* EMPLOYEE */}

                    <div className="lg:col-span-2">
                        {EmployeeDropdown ? (
                            <EmployeeDropdown
                                value={employeeId}
                                onChange={setEmployeeId}
                            />
                        ) : (
                            <select
                                value={employeeId}
                                onChange={(event) =>
                                    setEmployeeId(event.target.value)
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                "
                            >
                                <option value="">All Employees</option>

                                {[
                                    ...new Map(
                                        phoneNumbers
                                            .filter(
                                                (item) =>
                                                    item.employeeId ??
                                                    item.employee_id
                                            )
                                            .map((item) => [
                                                String(
                                                    item.employeeId ??
                                                    item.employee_id
                                                ),
                                                {
                                                    id:
                                                        item.employeeId ??
                                                        item.employee_id,
                                                    name:
                                                        item.employeeName ??
                                                        item.employee_name ??
                                                        'Employee',
                                                },
                                            ])
                                    ).values(),
                                ].map((employee) => (
                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* STATUS */}

                    <div className="lg:col-span-2">
                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                            className="
                                select
                                select-bordered
                                w-full
                            "
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* TRACKABLE */}

                    <div className="lg:col-span-2">
                        <select
                            value={trackable}
                            onChange={(event) =>
                                setTrackable(event.target.value)
                            }
                            className="
                                select
                                select-bordered
                                w-full
                            "
                        >
                            <option value="">All Trackable</option>
                            <option value="Yes">Trackable</option>
                            <option value="No">Not Trackable</option>
                        </select>
                    </div>

                    {/* RESET */}

                    <div className="lg:col-span-1">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-ghost w-full"
                        >
                            Reset
                        </button>
                    </div>

                    {/* ADD PHONE NUMBER */}

                    <div className="lg:col-span-2">
                        <button
                            type="button"
                            onClick={() => onAdd?.()}
                            disabled={!canAddPhoneNumber}
                            className="
                                btn
                                w-full
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:border-[#6FA800]
                                hover:bg-[#6FA800]
                            "
                        >
                            <span className="text-lg leading-none">
                                +
                            </span>

                            Add Phone Number
                        </button>
                    </div>
                </div>

                {/* FILTER RESULT COUNT */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-2
                    border-t
                    border-base-300
                    pt-3
                ">
                    <p className="
                        text-xs
                        text-base-content/50
                    ">
                        Showing {filteredPhoneNumbers.length} of {phoneNumbers.length} phone numbers
                    </p>

                    {onRefresh && (
                        <button
                            type="button"
                            onClick={onRefresh}
                            className="
                                btn
                                btn-ghost
                                btn-xs
                                gap-1.5
                            "
                        >
                            <ArrowPathIcon className="h-3.5 w-3.5" />
                            Refresh
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {filteredPhoneNumbers.length === 0 ? (
            <div className="
                card
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">
                <div className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    py-16
                    text-center
                ">
                    <PhoneIcon className="
                        h-9
                        w-9
                        text-base-content/30
                    " />

                    <p className="
                        mt-3
                        text-sm
                        font-medium
                    ">
                        {phoneNumbers.length === 0
                            ? 'No phone numbers found'
                            : 'No matching phone numbers'
                        }
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-base-content/50
                    ">
                        {phoneNumbers.length === 0
                            ? 'Add a phone number to get started.'
                            : 'Try changing your filters or reset them.'
                        }
                    </p>

                    {phoneNumbers.length > 0 && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-ghost btn-sm mt-3"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>
        ) : (

            /* =================================================
               PHONE NUMBERS TABLE
            ================================================= */

            <div className="
                card
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    border-b
                    border-base-300
                    p-4
                ">
                    <h2 className="
                        text-base
                        font-semibold
                    ">
                        Phone Numbers
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-base-content/50
                    ">
                        Manage assigned phone numbers and calling status.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="table">

                        <thead>
                            <tr>
                                <th className="w-14 text-center">#</th>
                                <th>Phone Number</th>
                                <th>Employee</th>
                                <th>Status</th>
                                <th>Trackable</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredPhoneNumbers.map(
                                (phoneNumber, index) => (
                                    <tr key={phoneNumber.id}>

                                        {/* INDEX */}

                                        <td className="text-center">
                                            <span className="
                                                text-sm
                                                text-base-content/60
                                            ">
                                                {index + 1}
                                            </span>
                                        </td>

                                        {/* PHONE */}

                                        <td>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onViewDetails?.(phoneNumber)
                                                }
                                                className="
                                                    font-semibold
                                                    hover:text-[#78B300]
                                                    hover:underline
                                                "
                                            >
                                                {phoneNumber.number ||
                                                    phoneNumber.phone ||
                                                    '—'
                                                }
                                            </button>
                                        </td>

                                        {/* EMPLOYEE */}

                                        <td>
                                            <div>
                                                <p className="
                                                    text-sm
                                                    font-medium
                                                ">
                                                    {phoneNumber.employeeName ||
                                                        phoneNumber.employee_name ||
                                                        'Not Assigned'
                                                    }
                                                </p>

                                                {(phoneNumber.employeeId ||
                                                    phoneNumber.employee_id) && (
                                                    <p className="
                                                        mt-0.5
                                                        text-xs
                                                        text-base-content/50
                                                    ">
                                                        ID: {phoneNumber.employeeId ||
                                                            phoneNumber.employee_id
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* STATUS */}

                                        <td>
                                            <span className={`
                                                inline-flex
                                                items-center
                                                rounded-full
                                                border
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                ${getStatusClass(phoneNumber.status)}
                                            `}>
                                                <span className="
                                                    mr-1.5
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-current
                                                " />

                                                {normalizeStatus(phoneNumber.status)}
                                            </span>
                                        </td>

                                        {/* TRACKABLE */}

                                        <td>
                                            <span className={`
                                                inline-flex
                                                items-center
                                                rounded-full
                                                border
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                ${getTrackableClass(phoneNumber.trackable)}
                                            `}>
                                                {(
                                                    phoneNumber.trackable === true ||
                                                    phoneNumber.trackable === 'true' ||
                                                    phoneNumber.trackable === '1' ||
                                                    phoneNumber.trackable === 1 ||
                                                    phoneNumber.trackable === 'Yes'
                                                )
                                                    ? 'Yes'
                                                    : 'No'
                                                }
                                            </span>
                                        </td>

                                        {/* ACTION */}

                                        <td>
                                            <div className="
                                                flex
                                                justify-end
                                            ">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onEdit?.(phoneNumber)
                                                    }
                                                    disabled={!canEditPhoneNumber}
                                                    className="
                                                        btn
                                                        btn-sm
                                                        btn-ghost
                                                        gap-2
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#78B300]
                                                    "
                                                >
                                                    <PencilIcon className="
                                                        h-4
                                                        w-4
                                                    " />

                                                    Edit
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
)

}

export default PhoneNumberTable