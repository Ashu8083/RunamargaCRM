// admin-react/src/pages/CallManagement/PhoneNumbers/components/PhoneNumberTable.jsx
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import CheckIcon from '@heroicons/react/24/outline/CheckIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'


function PhoneNumberTable({
    phoneNumbers = [],
    employees = [],
    editingId,
    editData,
    onEdit,
    onEditChange,
    onSave,
    onCancel,
    onViewDetails,
    EmployeeDropdown,
}) {

    // =========================================================
    // GET EMPLOYEE
    // =========================================================

    const getEmployee = (employeeId) => {

        return employees.find(
            (employee) =>
                String(employee.id) ===
                String(employeeId)
        )

    }


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {

        if (status === 'Active') {

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


    // =========================================================
    // TRACKABLE CLASS
    // =========================================================

    const getTrackableClass = (trackable) => {

        if (
            trackable === true ||
            trackable === 'Yes'
        ) {

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


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (phoneNumbers.length === 0) {

        return (

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
                        No phone numbers found
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/50
                    ">
                        Try changing your filters or add a new phone number.
                    </p>

                </div>

            </div>

        )

    }


    return (

        <div className="
            card
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-base-300
                p-4
            ">

                <div>

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

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">

                <table className="table">

                    <thead>

                        <tr>

                            <th className="w-14 text-center">
                                #
                            </th>

                            <th>
                                Phone Number
                            </th>

                            <th>
                                Employee
                            </th>

                            <th>
                                Team
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Trackable
                            </th>

                            <th className="text-right">
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {phoneNumbers.map(
                            (phoneNumber, index) => {

                                const isEditing =
                                    editingId !== null &&
                                    String(editingId) ===
                                    String(phoneNumber.id)


                                const employee =
                                    getEmployee(
                                        phoneNumber.employeeId
                                    )


                                const selectedEmployee =
                                    getEmployee(
                                        editData?.employeeId
                                    )


                                return (

                                    <tr
                                        key={phoneNumber.id}
                                        className={
                                            isEditing
                                                ? 'bg-base-200/30'
                                                : ''
                                        }
                                    >

                                        {/* =================================
                                            INDEX
                                        ================================= */}

                                        <td className="text-center">

                                            <span className="
                                                text-sm
                                                text-base-content/60
                                            ">
                                                {index + 1}
                                            </span>

                                        </td>


                                        {/* =================================
                                            PHONE NUMBER
                                        ================================= */}

                                        <td>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onViewDetails?.(
                                                        phoneNumber
                                                    )
                                                }
                                                className="
                                                    font-semibold
                                                    transition
                                                    hover:text-[#78B300]
                                                    hover:underline
                                                "
                                            >
                                                {phoneNumber.number}
                                            </button>

                                        </td>


                                        {/* =================================
                                            EMPLOYEE
                                        ================================= */}

                                        <td>

                                            {isEditing ? (

                                                <div className="
                                                    min-w-[190px]
                                                ">

                                                    {EmployeeDropdown && (

                                                        <EmployeeDropdown
                                                            value={
                                                                editData?.employeeId ||
                                                                ''
                                                            }
                                                            onChange={(
                                                                value
                                                            ) =>
                                                                onEditChange?.({
                                                                    employeeId:
                                                                        value,
                                                                })
                                                            }
                                                            employees={
                                                                employees
                                                            }
                                                        />

                                                    )}

                                                </div>

                                            ) : (

                                                <div>

                                                    {employee ? (

                                                        <>

                                                            <p className="
                                                                text-sm
                                                                font-medium
                                                            ">
                                                                {employee.name}
                                                            </p>


                                                            <p className="
                                                                mt-0.5
                                                                text-xs
                                                                text-base-content/50
                                                            ">
                                                                {employee.employeeId ||
                                                                    employee.id
                                                                }
                                                            </p>

                                                        </>

                                                    ) : (

                                                        <span className="
                                                            text-sm
                                                            text-base-content/40
                                                        ">
                                                            —
                                                        </span>

                                                    )}

                                                </div>

                                            )}

                                        </td>


                                        {/* =================================
                                            TEAM
                                        ================================= */}

                                        <td>

                                            {isEditing ? (

                                                <span className="
                                                    text-sm
                                                    font-medium
                                                ">
                                                    {selectedEmployee?.teamName ||
                                                        '—'
                                                    }
                                                </span>

                                            ) : (

                                                <span className="
                                                    text-sm
                                                    text-base-content/70
                                                ">
                                                    {phoneNumber.teamName ||
                                                        employee?.teamName ||
                                                        '—'
                                                    }
                                                </span>

                                            )}

                                        </td>


                                        {/* =================================
                                            STATUS
                                        ================================= */}

                                        <td>

                                            {isEditing ? (

                                                <select
                                                    value={
                                                        editData?.status ||
                                                        'Active'
                                                    }
                                                    onChange={(event) =>
                                                        onEditChange?.({
                                                            status:
                                                                event.target.value,
                                                        })
                                                    }
                                                    className="
                                                        select
                                                        select-sm
                                                        min-w-[115px]
                                                        border
                                                        border-base-300
                                                    "
                                                >

                                                    <option value="Active">
                                                        Active
                                                    </option>

                                                    <option value="Inactive">
                                                        Inactive
                                                    </option>

                                                </select>

                                            ) : (

                                                <span className={`
                                                    inline-flex
                                                    items-center
                                                    rounded-full
                                                    border
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    ${getStatusClass(
                                                        phoneNumber.status
                                                    )}
                                                `}>

                                                    <span className="
                                                        mr-1.5
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full
                                                        bg-current
                                                    " />

                                                    {phoneNumber.status}

                                                </span>

                                            )}

                                        </td>


                                        {/* =================================
                                            TRACKABLE
                                        ================================= */}

                                        <td>

                                            {isEditing ? (

                                                <select
                                                    value={
                                                        editData?.trackable
                                                            ? 'Yes'
                                                            : 'No'
                                                    }
                                                    onChange={(event) =>
                                                        onEditChange?.({
                                                            trackable:
                                                                event.target.value ===
                                                                'Yes',
                                                        })
                                                    }
                                                    className="
                                                        select
                                                        select-sm
                                                        min-w-[95px]
                                                        border
                                                        border-base-300
                                                    "
                                                >

                                                    <option value="Yes">
                                                        Yes
                                                    </option>

                                                    <option value="No">
                                                        No
                                                    </option>

                                                </select>

                                            ) : (

                                                <span className={`
                                                    inline-flex
                                                    items-center
                                                    rounded-full
                                                    border
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    ${getTrackableClass(
                                                        phoneNumber.trackable
                                                    )}
                                                `}>

                                                    {phoneNumber.trackable
                                                        ? 'Yes'
                                                        : 'No'
                                                    }

                                                </span>

                                            )}

                                        </td>


                                        {/* =================================
                                            ACTION
                                        ================================= */}

                                        <td>

                                            {isEditing ? (

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-1
                                                ">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onSave?.(
                                                                phoneNumber
                                                            )
                                                        }
                                                        className="
                                                            btn
                                                            btn-sm
                                                            btn-square
                                                            text-[#78B300]
                                                            hover:bg-[#8BCF00]/10
                                                        "
                                                        title="Save changes"
                                                    >

                                                        <CheckIcon className="
                                                            h-5
                                                            w-5
                                                        " />

                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={onCancel}
                                                        className="
                                                            btn
                                                            btn-sm
                                                            btn-square
                                                            text-base-content/60
                                                            hover:bg-base-200
                                                        "
                                                        title="Cancel"
                                                    >

                                                        <XMarkIcon className="
                                                            h-5
                                                            w-5
                                                        " />

                                                    </button>

                                                </div>

                                            ) : (

                                                <div className="
                                                    flex
                                                    justify-end
                                                ">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onEdit?.(
                                                                phoneNumber
                                                            )
                                                        }
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

                                            )}

                                        </td>

                                    </tr>

                                )

                            }
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default PhoneNumberTable