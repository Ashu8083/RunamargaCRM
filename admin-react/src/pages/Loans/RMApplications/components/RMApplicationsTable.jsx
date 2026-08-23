// admin-react/src/pages/Loans/RMApplications/components/RMApplicationsTable.jsx
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import BellAlertIcon from '@heroicons/react/24/outline/BellAlertIcon'
import ChatBubbleLeftRightIcon from '@heroicons/react/24/outline/ChatBubbleLeftRightIcon'
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'


const PRIMARY_GREEN = '#8BCF00'


function RMApplicationsTable({
    applications = [],
    search,
    setSearch,
    onLoanTypeChange,
    onStatusChange,
    onReminder,
    onChat,
    onRefresh,
}) {

    const filteredApplications = applications.filter((application) => {

        const searchValue = search
            .trim()
            .toLowerCase()


        if (!searchValue) {
            return true
        }


        return (
            application.name
                ?.toLowerCase()
                .includes(searchValue) ||

            application.phone
                ?.toLowerCase()
                .includes(searchValue) ||

            application.email
                ?.toLowerCase()
                .includes(searchValue) ||

            application.loanType
                ?.toLowerCase()
                .includes(searchValue) ||

            application.status
                ?.toLowerCase()
                .includes(searchValue)
        )
    })


    const getStatusClass = (status) => {

        switch (status) {

            case 'Inprocess':
                return 'text-[#78B300] border-[#8BCF00]/40 bg-[#8BCF00]/10'

            case 'Docs Pending':
                return 'text-orange-600 border-orange-300 bg-orange-50'

            case 'Rejected':
                return 'text-error border-error/30 bg-error/5'

            default:
                return 'text-base-content/60 border-base-300 bg-base-200/50'
        }
    }


    return (
        <div className="space-y-5">


            {/* =====================================================
                FILTER / ACTION SECTION
            ===================================================== */}

            <div className="
                card
                bg-base-100
                border
                border-base-300
                shadow-sm
            ">

                <div className="card-body p-4">

                    <div className="
                        flex
                        flex-col
                        xl:flex-row
                        xl:items-center
                        gap-3
                    ">


                        {/* Search */}

                        <div className="flex-1">

                            <label className="
                                input
                                input-bordered
                                flex
                                items-center
                                gap-3
                                w-full
                            ">

                                <SearchIcon className="
                                    w-5
                                    h-5
                                    text-base-content/40
                                " />


                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search applications..."
                                    className="grow"
                                />

                            </label>

                        </div>


                        {/* Search */}

                        <button
                            type="button"
                            className="
                                btn
                                border-[#8BCF00]
                                text-[#78B300]
                                hover:bg-[#8BCF00]
                                hover:text-white
                            "
                        >

                            <SearchIcon className="w-5 h-5" />

                            Search

                        </button>


                        {/* Clear */}

                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="btn btn-ghost"
                        >
                            Clear
                        </button>


                        <div className="
                            hidden
                            xl:block
                            h-8
                            border-l
                            border-base-300
                        " />


                        {/* Filter */}

                        <button
                            type="button"
                            className="
                                btn
                                btn-outline
                                border-base-300
                                hover:border-[#8BCF00]
                                hover:text-[#78B300]
                            "
                        >

                            <FunnelIcon className="w-5 h-5" />

                            Filters

                        </button>


                        {/* Refresh */}

                        <button
                            type="button"
                            onClick={onRefresh}
                            className="
                                btn
                                border-[#8BCF00]
                                text-[#78B300]
                                hover:bg-[#8BCF00]
                                hover:text-white
                            "
                        >

                            <ArrowPathIcon className="w-5 h-5" />

                            Refresh

                        </button>

                    </div>

                </div>

            </div>


            {/* =====================================================
                APPLICATION TABLE
            ===================================================== */}

            <div className="
                card
                bg-base-100
                border
                border-base-300
                shadow-sm
            ">

                <div className="overflow-x-auto">

                    <table className="table">

                        <thead>

                            <tr>

                                <th className="w-14 text-center">
                                    #
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Contact Info
                                </th>

                                <th>
                                    Loan Type
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Created At
                                </th>

                                <th className="text-right">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredApplications.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-12"
                                    >

                                        <p className="
                                            text-sm
                                            font-medium
                                        ">
                                            No applications found
                                        </p>


                                        <p className="
                                            text-xs
                                            text-base-content/50
                                            mt-1
                                        ">
                                            Try changing your search or filters.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredApplications.map(
                                    (application, index) => (

                                        <tr key={application.id}>


                                            {/* Index */}

                                            <td className="text-center">

                                                <span className="
                                                    text-sm
                                                    text-base-content/60
                                                ">
                                                    {index + 1}
                                                </span>

                                            </td>


                                            {/* Customer */}

                                            <td>

                                                <div>

                                                    <p className="
                                                        text-sm
                                                        font-semibold
                                                    ">
                                                        {application.name || 'N/A'}
                                                    </p>


                                                    {application.loanId && (

                                                        <p className="
                                                            text-xs
                                                            text-base-content/50
                                                            mt-0.5
                                                        ">
                                                            {application.loanId}
                                                        </p>

                                                    )}

                                                </div>

                                            </td>


                                            {/* Contact */}

                                            <td>

                                                <div className="space-y-0.5">

                                                    <p className="text-sm">
                                                        {application.phone || 'N/A'}
                                                    </p>


                                                    <p className="
                                                        text-xs
                                                        text-base-content/50
                                                    ">
                                                        {application.email || 'N/A'}
                                                    </p>

                                                </div>

                                            </td>


                                            {/* Loan Type */}

                                            <td>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onLoanTypeChange?.(
                                                            application
                                                        )
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        px-2.5
                                                        py-1
                                                        rounded-full
                                                        border
                                                        border-[#8BCF00]/40
                                                        bg-[#8BCF00]/10
                                                        text-[#78B300]
                                                        text-xs
                                                        font-medium
                                                        hover:bg-[#8BCF00]/20
                                                    "
                                                >
                                                    {application.loanType || 'Not Assigned'}
                                                </button>

                                            </td>


                                            {/* Amount */}

                                            <td>

                                                <span className="
                                                    text-sm
                                                    font-medium
                                                    whitespace-nowrap
                                                ">
                                                    {application.amount
                                                        ? `₹${application.amount}`
                                                        : 'N/A'}
                                                </span>

                                            </td>


                                            {/* Status */}

                                            <td>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onStatusChange?.(
                                                            application
                                                        )
                                                    }
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        px-2.5
                                                        py-1
                                                        rounded-full
                                                        border
                                                        text-xs
                                                        font-medium
                                                        whitespace-nowrap
                                                        hover:opacity-80
                                                        ${getStatusClass(
                                                            application.status
                                                        )}
                                                    `}
                                                >
                                                    {application.status || 'N/A'}
                                                </button>

                                            </td>


                                            {/* Created */}

                                            <td>

                                                <span className="
                                                    text-sm
                                                    whitespace-nowrap
                                                ">
                                                    {application.createdAt || 'N/A'}
                                                </span>

                                            </td>


                                            {/* Actions */}

                                            <td>

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-1
                                                ">


                                                    {/* Loan Type */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onLoanTypeChange?.(
                                                                application
                                                            )
                                                        }
                                                        className="
                                                            btn
                                                            btn-ghost
                                                            btn-sm
                                                            btn-square
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#78B300]
                                                        "
                                                        title="Change loan type"
                                                    >

                                                        <PencilIcon className="w-4 h-4" />

                                                    </button>


                                                    {/* Reminder */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onReminder?.(
                                                                application
                                                            )
                                                        }
                                                        className="
                                                            btn
                                                            btn-ghost
                                                            btn-sm
                                                            btn-square
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#78B300]
                                                        "
                                                        title="Add reminder"
                                                    >

                                                        <BellAlertIcon className="w-4 h-4" />

                                                    </button>


                                                    {/* Chat */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onChat?.(
                                                                application
                                                            )
                                                        }
                                                        className="
                                                            btn
                                                            btn-ghost
                                                            btn-sm
                                                            btn-square
                                                            hover:bg-[#8BCF00]/10
                                                            hover:text-[#78B300]
                                                        "
                                                        title="Open chat"
                                                    >

                                                        <ChatBubbleLeftRightIcon className="w-4 h-4" />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}


export default RMApplicationsTable