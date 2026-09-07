import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'


function PhoneNumberTable({
    phoneNumbers = [],
    onEdit,
    onViewDetails,
}) {

    const getStatusClass = (
        status
    ) => {

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


    const getTrackableClass = (
        trackable
    ) => {

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


    if (
        phoneNumbers.length === 0
    ) {

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


            <div className="
                overflow-x-auto
            ">

                <table className="
                    table
                ">

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
                            (
                                phoneNumber,
                                index
                            ) => (

                                <tr
                                    key={
                                        phoneNumber.id
                                    }
                                >

                                    {/* INDEX */}

                                    <td className="
                                        text-center
                                    ">
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
                                                onViewDetails?.(
                                                    phoneNumber
                                                )
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
                                                    'Not Assigned'
                                                }
                                            </p>

                                            {phoneNumber.employeeId && (

                                                <p className="
                                                    mt-0.5
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    ID: {phoneNumber.employeeId}
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

                                            {phoneNumber.status ||
                                                'Inactive'
                                            }

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
                                            ${getTrackableClass(
                                                phoneNumber.trackable
                                            )}
                                        `}>

                                            {phoneNumber.trackable
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

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default PhoneNumberTable