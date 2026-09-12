// admin-react/src/pages/Loans/ShuffleLoans/API.js

import apiClient from '../../../app/apiClient'


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

const normalizeApplication = (application) => {

    if (!application) {
        return null
    }

    return {
        ...application,

        id: Number(application.id),

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
            application.loan_type_id ?? null,

        loan_type_id:
            application.loan_type_id ?? null,

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
            application.created_at ??
            null,

        updatedAt:
            application.updated_at ??
            null,
    }
}


// =========================================================
// GET SHUFFLE LOANS
// =========================================================

export const getShuffleLoans = async (filters = {}) => {

    const params = {}

    if (filters.search?.trim()) {
        params.search = filters.search.trim()
    }

    if (filters.agentId) {
        params.agent_id = Number(filters.agentId)
    }

    if (filters.rmId) {
        params.rm_id = Number(filters.rmId)
    }

    if (filters.loanTypeId) {
        params.loan_type_id = Number(filters.loanTypeId)
    }

    if (filters.status) {
        params.status = filters.status
    }

    const response = await apiClient.get(
        '/shuffle-loans',
        { params }
    )

    const data = Array.isArray(response.data)
        ? response.data
        : []

    return data
        .map(normalizeApplication)
        .filter(Boolean)
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

    if (!applicationIds?.length) {
        throw new Error(
            'Select at least one application.'
        )
    }

    const payload = {
        application_ids: applicationIds.map(Number),
    }

    /*
     * Only selected fields are added to the request.
     *
     * An omitted field means:
     * DO NOT CHANGE that existing assignment.
     */

    if (agentId) {
        payload.agent_id = Number(agentId)
    }

    if (rmId) {
        payload.rm_id = Number(rmId)
    }

    if (loanTypeId) {
        payload.loan_type_id = Number(loanTypeId)
    }

    if (
        payload.agent_id === undefined &&
        payload.rm_id === undefined &&
        payload.loan_type_id === undefined
    ) {
        throw new Error(
            'Select an Agent, RM or Loan Type to update.'
        )
    }

    const response = await apiClient.patch(
        '/shuffle-loans/assign',
        payload
    )

    const data = Array.isArray(response.data)
        ? response.data
        : []

    return data
        .map(normalizeApplication)
        .filter(Boolean)
}