// admin-react/src/pages/Loans/ShuffleLoans/API.js

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
// NORMALIZE APPLICATION
// =========================================================

const normalizeApplication = (
    application
) => {

    if (!application) {
        return null
    }

    return {
        ...application,

        id:
            Number(application.id),

        loanId:
            application.loanId ??
            application.unique_id ??
            '',

        name:
            application.name ??
            'N/A',

        email:
            application.email ??
            '',

        phone:
            application.phone ??
            '',

        amount:
            application.amount ??
            application.loan_amt ??
            null,

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

        // =================================================
        // IMPORTANT:
        // agentId / agent_id = EmployeeContext.id
        // NOT employees.id
        // =================================================

        agentId:
            application.agentId ??
            application.agent_id ??
            null,

        agent_id:
            application.agentId ??
            application.agent_id ??
            null,

        agentName:
            application.agentName ??
            application.agent_name ??
            '',

        // =================================================
        // IMPORTANT:
        // rmId / rm_id = EmployeeContext.id
        // NOT employees.id
        // =================================================

        rmId:
            application.rmId ??
            application.rm_id ??
            null,

        rm_id:
            application.rmId ??
            application.rm_id ??
            null,

        rmName:
            application.rmName ??
            application.rm_name ??
            '',

        status:
            application.status ??
            'N/A',

        appliedDate:
            application.appliedDate ??
            application.applied_date ??
            null,

        createdAt:
            application.createdAt ??
            application.created_at ??
            null,

        updatedAt:
            application.updatedAt ??
            application.updated_at ??
            null,
    }
}


// =========================================================
// GET SHUFFLE LOANS
// =========================================================
//
// Backend performs:
//
//     search entire database
//             ↓
//         apply filters
//             ↓
//           count
//             ↓
//          paginate
//             ↓
//       return current page
//
// IMPORTANT:
//
// agent_id = EmployeeContext.id
// rm_id    = EmployeeContext.id
//
// Frontend sends these IDs directly.
// No employee_id -> context_id conversion here.
//
// =========================================================

export const getShuffleLoans = async (
    {
        search = '',
        agentId = '',
        rmId = '',
        loanTypeId = '',
        status = '',
        page = 1,
        limit = 30,
    } = {}
) => {

    const params = {
        page,
        limit,
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
    // AGENT
    // =====================================================
    //
    // agentId is EmployeeContext.id.
    //
    // =====================================================

    if (
        agentId !== '' &&
        agentId !== null &&
        agentId !== undefined
    ) {

        params.agent_id =
            Number(agentId)
    }


    // =====================================================
    // RM
    // =====================================================
    //
    // rmId is EmployeeContext.id.
    //
    // =====================================================

    if (
        rmId !== '' &&
        rmId !== null &&
        rmId !== undefined
    ) {

        params.rm_id =
            Number(rmId)
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
    // STATUS
    // =====================================================

    if (
        status &&
        String(status).trim()
    ) {

        params.status =
            String(status).trim()
    }


    // =====================================================
    // REQUEST
    // =====================================================

    const response =
        await apiClient.get(
            '/shuffle-loans',
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
    // BACKEND PAGINATED RESPONSE
    // =====================================================

    const items =
        Array.isArray(
            responseData?.items
        )
            ? responseData.items
            : []


    return {
        items:
            items
                .map(
                    normalizeApplication
                )
                .filter(Boolean),

        total:
            Number(
                responseData?.total ??
                0
            ),

        page:
            Number(
                responseData?.page ??
                page
            ),

        limit:
            Number(
                responseData?.limit ??
                limit
            ),

        totalPages:
            Number(
                responseData?.totalPages ??
                0
            ),
    }
}


// =========================================================
// ASSIGN / SHUFFLE LOANS
// =========================================================

export const assignShuffleLoans = async ({
    applicationIds,
    agentId,
    rmId,
    loanTypeId,
}) => {

    if (
        !applicationIds?.length
    ) {
        throw new Error(
            'Select at least one application.'
        )
    }


    const payload = {
        application_ids:
            applicationIds.map(Number),
    }


    // =====================================================
    // AGENT
    // =====================================================
    //
    // agentId = EmployeeContext.id
    //
    // Only include the field when the user selected it.
    //
    // =====================================================

    if (
        agentId !== '' &&
        agentId !== null &&
        agentId !== undefined
    ) {

        payload.agent_id =
            Number(agentId)
    }


    // =====================================================
    // RM
    // =====================================================
    //
    // rmId = EmployeeContext.id
    //
    // =====================================================

    if (
        rmId !== '' &&
        rmId !== null &&
        rmId !== undefined
    ) {

        payload.rm_id =
            Number(rmId)
    }


    // =====================================================
    // LOAN TYPE
    // =====================================================

    if (
        loanTypeId !== '' &&
        loanTypeId !== null &&
        loanTypeId !== undefined
    ) {

        payload.loan_type_id =
            Number(loanTypeId)
    }


    // =====================================================
    // VALIDATION
    // =====================================================

    if (
        payload.agent_id === undefined &&
        payload.rm_id === undefined &&
        payload.loan_type_id === undefined
    ) {

        throw new Error(
            'Select an Agent, RM or Loan Type to update.'
        )
    }


    // =====================================================
    // REQUEST
    // =====================================================

    const response =
        await apiClient.patch(
            '/shuffle-loans/assign',
            payload
        )


    // =====================================================
    // RESPONSE
    // =====================================================

    const data =
        Array.isArray(
            response?.data
        )
            ? response.data
            : []


    return data
        .map(
            normalizeApplication
        )
        .filter(Boolean)
}