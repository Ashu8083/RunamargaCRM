const DuplicateApprovalTable = ({
    applications = [],
    selectedApplications = [],
    onSelectApplication,
}) => {

    const getStatus = (application) => {
        return application?.status || 'pending'
    }

    const getApplicantName = (application) => {
        return (
            application?.applicantName ||
            application?.name ||
            '-'
        )
    }

    const getLoanType = (application) => {
        return (
            application?.loanType ||
            application?.loan_type ||
            '-'
        )
    }

    const getLoanAmount = (application) => {
        const amount =
            application?.loanAmount ??
            application?.loan_amount

        if (
            amount === null ||
            amount === undefined
        ) {
            return '-'
        }

        return `₹${Number(amount).toLocaleString('en-IN')}`
    }

    const getAppliedBy = (application) => {
        return (
            application?.appliedBy ||
            application?.applied_by ||
            '-'
        )
    }

    const getAppliedDate = (application) => {

        const value =
            application?.appliedDate ||
            application?.applied_date

        if (!value) {
            return '-'
        }

        const date = new Date(value)

        if (Number.isNaN(date.getTime())) {
            return value
        }

        return date.toLocaleDateString('en-IN')
    }

    const getRM = (application) => {
        return (
            application?.rmName ||
            application?.rm_name ||
            '-'
        )
    }

    const getLoanId = (application) => {
        return (
            application?.loanId ||
            application?.loan_id ||
            null
        )
    }

    const isSelected = (application) => {
        return selectedApplications.some(
            (item) => item.id === application.id
        )
    }

    const getStatusBadge = (status) => {

        if (status === 'approved') {
            return (
                <span className="badge badge-success badge-sm">
                    Approved
                </span>
            )
        }

        if (status === 'rejected') {
            return (
                <span className="badge badge-error badge-sm">
                    Rejected
                </span>
            )
        }

        return (
            <span className="badge badge-warning badge-sm">
                Pending
            </span>
        )
    }

    if (applications.length === 0) {

        return (
            <div className="w-full rounded-xl border border-base-200 bg-base-100">

                <div className="flex min-h-40 items-center justify-center px-4 py-10">

                    <p className="text-sm text-base-content/60">
                        No duplicate approval requests found.
                    </p>

                </div>

            </div>
        )
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border border-base-200 bg-base-100">

            <div className="overflow-x-auto">

                <table className="table table-zebra w-full">

                    <thead>

                        <tr className="border-b border-base-200">

                            <th className="w-12 text-xs font-semibold text-base-content/60">
                                #
                            </th>

                            <th className="text-xs font-semibold text-base-content/60">
                                Name
                            </th>

                            <th className="text-xs font-semibold text-base-content/60">
                                Phone
                            </th>

                            <th className="text-xs font-semibold text-base-content/60">
                                Loan Type
                            </th>

                            <th className="text-xs font-semibold text-base-content/60">
                                Loan Amount
                            </th>

                            <th className="text-xs font-semibold text-base-content/60">
                                Applied Date
                            </th>

                            <th className="text-xs font-semibold text-base-content/60">
                                Applied By
                            </th>

                            <th className="text-xs font-semibold text-base-content/60">
                                RM
                            </th>

                            <th className="text-xs font-semibold text-base-content/60">
                                Status
                            </th>

                            

                        </tr>

                    </thead>

                    <tbody>

                        {applications.map(
                            (application, index) => {

                                const status =
                                    getStatus(application)

                                const pending =
                                    status === 'pending'

                                const selected =
                                    isSelected(application)

                                const loanId =
                                    getLoanId(application)

                                return (
                                    <tr
                                        key={application.id}
                                        className="hover"
                                    >

                                        <td>

                                            {pending ? (

                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-sm"
                                                    checked={selected}
                                                    onChange={() =>
                                                        onSelectApplication(
                                                            application
                                                        )
                                                    }
                                                />

                                            ) : (

                                                <span className="text-sm text-base-content/60">
                                                    {index + 1}
                                                </span>

                                            )}

                                        </td>


                                        <td>

                                            <div className="font-medium text-sm">
                                                {getApplicantName(
                                                    application
                                                )}
                                            </div>

                                        </td>


                                        <td>

                                            <span className="text-sm">
                                                {application.phone ||
                                                    '-'}
                                            </span>

                                        </td>


                                        <td>

                                            <span className="text-sm">
                                                {getLoanType(
                                                    application
                                                )}
                                            </span>

                                        </td>


                                        <td>

                                            <span className="text-sm font-medium">
                                                {getLoanAmount(
                                                    application
                                                )}
                                            </span>

                                        </td>


                                        <td>

                                            <span className="text-sm">
                                                {getAppliedDate(
                                                    application
                                                )}
                                            </span>

                                        </td>


                                        <td>

                                            <span className="text-sm">
                                                {getAppliedBy(
                                                    application
                                                )}
                                            </span>

                                        </td>


                                        <td>

                                            <span className="text-sm">
                                                {getRM(
                                                    application
                                                )}
                                            </span>

                                        </td>


                                        <td>
                                            {getStatusBadge(
                                                status
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


export default DuplicateApprovalTable