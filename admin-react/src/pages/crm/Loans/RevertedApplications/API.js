// admin-react/src/pages/Loans/RevertedApplications/API.js

import apiClient from '../../../../app/apiClient'


// =========================================================
// API ERROR
// =========================================================

export const getApiErrorMessage = (
    error,
    fallback = 'Something went wrong.'
) => {

    const data = error?.response?.data


    if (
        typeof data?.detail === 'string' &&
        data.detail.trim()
    ) {
        return data.detail.trim()
    }


    if (Array.isArray(data?.detail)) {

        const messages = data.detail
            .map((item) =>
                typeof item === 'string'
                    ? item
                    : item?.msg
            )
            .filter(Boolean)


        if (messages.length) {
            return messages.join(', ')
        }
    }


    if (
        typeof data?.message === 'string' &&
        data.message.trim()
    ) {
        return data.message.trim()
    }


    if (
        typeof error?.message === 'string' &&
        error.message.trim()
    ) {
        return error.message.trim()
    }


    return fallback
}


// =========================================================
// NORMALIZE REVERTED APPLICATION
// =========================================================

const normalizeRevertedApplication = (
    application
) => {

    if (!application) {
        return null
    }


    return {
        ...application,


        // =====================================================
        // IDs
        // =====================================================

        id:
            Number(application.id),

        loanId:
            application.loanId ??
            application.loan_id ??
            '',

        uniqueId:
            application.uniqueId ??
            application.unique_id ??
            '',


        // =====================================================
        // APPLICANT
        // =====================================================

        applicantName:
            application.applicantName ??
            application.applicant_name ??
            application.name ??
            'N/A',

        name:
            application.name ??
            application.applicantName ??
            application.applicant_name ??
            'N/A',

        phone:
            application.phone ??
            '',

        email:
            application.email ??
            '',


        // =====================================================
        // LOAN TYPE
        // =====================================================

        loanType:
            application.loanType ??
            application.loan_type ??
            '',

        loanTypeId:
            application.loanTypeId ??
            application.loan_type_id ??
            null,

        loan_type_id:
            application.loan_type_id ??
            application.loanTypeId ??
            null,


        // =====================================================
        // REVERT INFORMATION
        // =====================================================

        revertedDate:
            application.revertedDate ??
            application.reverted_date ??
            null,

        revertedBy:
            application.revertedBy ??
            application.reverted_by ??
            'N/A',

        revertedById:
            application.revertedById ??
            application.reverted_by_id ??
            null,

        revertedByRole:
            application.revertedByRole ??
            application.reverted_by_role ??
            '',

        rejectionType:
            application.rejectionType ??
            application.rejection_type ??
            '',

        remarks:
            application.remarks ??
            application.remark ??
            '',


        // =====================================================
        // HISTORY
        // =====================================================

        changeHistory:
            Array.isArray(
                application.changeHistory
            )
                ? application.changeHistory
                : Array.isArray(
                    application.change_history
                )
                    ? application.change_history
                    : [],
    }
}


// =========================================================
// GET REVERTED APPLICATIONS
// =========================================================
//
// Backend:
//
//     search
//       ↓
//     filters
//       ↓
//     latest revert per loan
//       ↓
//     count
//       ↓
//     pagination
//       ↓
//     response
//
// =========================================================

export const getRevertedApplications = async (
    {
        contextId,
        search = '',
        loanTypeId = '',
        revertedById = '',
        revertedDate = '',
        page = 1,
        limit = 10,
    } = {}
) => {
    const params = {
        page,
        page_size: limit,
    }
    
    if (
        contextId !== '' &&
        contextId !== null &&
        contextId !== undefined
    ) {
        params.context_id = Number(contextId)
    }


    // =====================================================
    // SEARCH
    // =====================================================

    if (
        search &&
        search.trim()
    ) {

        params.search =
            search.trim()
    }


    // =====================================================
    // LOAN TYPE
    // =====================================================

    if (
        loanTypeId !== '' &&
        loanTypeId !== null &&
        loanTypeId !== undefined
    ) {

        params.loan_type_id =
            Number(loanTypeId)
    }


    // =====================================================
    // REVERTED BY
    // =====================================================

    if (
        revertedById !== '' &&
        revertedById !== null &&
        revertedById !== undefined
    ) {

        params.reverted_by_id =
            Number(revertedById)
    }


    // =====================================================
    // REVERTED DATE
    // =====================================================

    if (
        revertedDate &&
        String(revertedDate).trim()
    ) {

        params.reverted_date =
            String(revertedDate).trim()
    }


    // =====================================================
    // REQUEST
    // =====================================================

    const response =
        await apiClient.get(
            '/reverted-applications',
            {
                params,
            }
        )


    // =====================================================
    // RESPONSE
    // =====================================================

    const responseData =
        response?.data


    // =====================================================
    // BACKEND RESPONSE
    // =====================================================

    const items =
        Array.isArray(
            responseData?.data
        )
            ? responseData.data
            : []


    const pagination =
        responseData?.pagination ?? {}


    return {

        items:
            items
                .map(
                    normalizeRevertedApplication
                )
                .filter(Boolean),

        total:
            Number(
                pagination.total ??
                0
            ),

        page:
            Number(
                pagination.page ??
                page
            ),

        limit:
            Number(
                pagination.page_size ??
                limit
            ),

        totalPages:
            Number(
                pagination.total_pages ??
                0
            ),
    }
}


// =========================================================
// GET REVERT HISTORY
// =========================================================

export const getRevertHistory = async (
    loanId,
    contextId
) => {

    if (
        loanId === '' ||
        loanId === null ||
        loanId === undefined
    ) {

        throw new Error(
            'Loan ID is required.'
        )
    }


    const response = await apiClient.get(
        `/reverted-applications/${Number(loanId)}/history`,
        {
            params: {
                context_id: Number(contextId),
            },
        }
    )

    const responseData =
        response?.data


    const history =
        Array.isArray(
            responseData?.history
        )
            ? responseData.history
            : []


    return history
}